import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionGlobal } from '../configuracion-global/entities/configuracion-global.entity';
import { ClientProxy } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(ConfiguracionGlobal)
    private readonly configRepo: Repository<ConfiguracionGlobal>,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  private async getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    return { transporter, user };
  }

  async procesarAlertaStockBajo(data: any) {
    const configEmail = await this.configRepo.findOneBy({ clave: 'NOTIFICACIONES_EMAIL' });
    const configStock = await this.configRepo.findOneBy({ clave: 'NOTIFICACIONES_ALERTAS_STOCK' });
    
    // If not explicitly set to true, assume disabled (or if you want opt-out, change logic)
    // We'll require it to be true to send emails
    if (configEmail?.valor !== 'true' || configStock?.valor !== 'true') {
      this.logger.log(`Notificaciones de email o stock deshabilitadas. Saltando envío de alerta para ${data.nombre}.`);
      return;
    }

    const { transporter, user } = await this.getTransporter();

    if (data.proveedorId) {
      try {
        const proveedor = await firstValueFrom(
          this.natsClient.send({ cmd: 'find_one_proveedor' }, data.proveedorId)
        );

        if (proveedor && proveedor.email) {
          await this.enviarOrdenCompra(transporter, user, proveedor, data);
        } else {
          this.logger.warn(`El proveedor ${data.proveedorId} no tiene email. Enviando alerta interna.`);
          await this.enviarAlertaInterna(transporter, user, data);
        }
      } catch (error) {
        this.logger.error(`Error consultando proveedor: ${error.message}`);
        await this.enviarAlertaInterna(transporter, user, data);
      }
    } else {
      await this.enviarAlertaInterna(transporter, user, data);
    }
  }

  private async enviarOrdenCompra(transporter: any, fromUser: string, proveedor: any, data: any) {
    const html = `
      <h2>Orden de Compra Automática</h2>
      <p>Estimado/a ${proveedor.contacto_nombre || proveedor.razon_social},</p>
      <p>Por medio de la presente, solicitamos un reabastecimiento del siguiente producto:</p>
      <ul>
        <li><strong>Producto:</strong> ${data.nombre}</li>
        <li><strong>Cantidad Sugerida:</strong> ${data.stock_minimo * 2} ${data.unidadMedida}</li>
      </ul>
      <p>Favor de confirmar la recepción de este pedido. Gracias.</p>
    `;

    await transporter.sendMail({
      from: fromUser || '"Sistema de Inventario" <pedidos@iventapp.com>',
      to: proveedor.email,
      subject: `Nueva Orden de Compra - ${data.nombre}`,
      html,
    });

    this.logger.log(`Orden de compra enviada a ${proveedor.email}`);
  }

  private async enviarAlertaInterna(transporter: any, fromUser: string, data: any) {
    let emails = [];
    const config = await this.configRepo.findOneBy({ clave: 'USUARIOS_ALERTAS_STOCK' });
    
    if (config && config.valor) {
      const ids = config.valor.split(',').map(id => id.trim()).filter(id => id);
      try {
        const usuarios = await firstValueFrom(
          this.natsClient.send({ cmd: 'get_usuarios_by_ids' }, ids)
        );
        if (usuarios && usuarios.length > 0) {
          emails = usuarios.map((u: any) => u.email).filter((e: string) => e);
        }
      } catch (error) {
        this.logger.error(`Error obteniendo usuarios para alertas: ${error.message}`);
      }
    }

    if (emails.length === 0) {
      emails = ['admin@empresa.com']; // Fallback
    }

    const html = `
      <h2>Alerta de Stock Bajo</h2>
      <p>El siguiente producto ha llegado a su nivel de stock mínimo y requiere atención:</p>
      <ul>
        <li><strong>Producto:</strong> ${data.nombre}</li>
        <li><strong>Stock Actual:</strong> <span style="color:red">${data.stock_actual}</span> ${data.unidadMedida}</li>
        <li><strong>Nivel Mínimo:</strong> ${data.stock_minimo} ${data.unidadMedida}</li>
      </ul>
      <p>Por favor, revisa el inventario o contacta a un proveedor.</p>
    `;

    await transporter.sendMail({
      from: fromUser || '"Sistema de Alertas" <alertas@iventapp.com>',
      to: emails.join(', '),
      subject: `ALERTA: Stock Bajo - ${data.nombre}`,
      html,
    });

    this.logger.log(`Alerta interna enviada a ${emails.join(', ')}`);
  }
}
