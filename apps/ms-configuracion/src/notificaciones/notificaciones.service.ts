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
  ) {
    this.initTransporter();
  }

  private async initTransporter() {
    // Configuramos el transportador para producción usando variables de entorno
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || true, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.logger.log(`Nodemailer configurado con el host SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  }

  async procesarAlertaStockBajo(data: any) {
    if (data.proveedorId) {
      // Caso 1: Orden de Compra Automática
      try {
        const proveedor = await firstValueFrom(
          this.natsClient.send({ cmd: 'find_one_proveedor' }, data.proveedorId)
        );

        if (proveedor && proveedor.email) {
          await this.enviarOrdenCompra(proveedor, data);
        } else {
          this.logger.warn(`El proveedor ${data.proveedorId} no tiene email o no existe. Enviando alerta interna.`);
          await this.enviarAlertaInterna(data);
        }
      } catch (error) {
        this.logger.error(`Error consultando proveedor: ${error.message}`);
        await this.enviarAlertaInterna(data);
      }
    } else {
      // Caso 2: Alerta Interna
      await this.enviarAlertaInterna(data);
    }
  }

  private async enviarOrdenCompra(proveedor: any, data: any) {
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

    const info = await this.transporter.sendMail({
      from: process.env.SMTP_USER || '"Sistema de Inventario" <pedidos@iventapp.com>',
      to: proveedor.email,
      subject: `Nueva Orden de Compra - ${data.nombre}`,
      html,
    });

    this.logger.log(`Orden de compra enviada a ${proveedor.email}`);
  }

  private async enviarAlertaInterna(data: any) {
    // Buscar configuración de correos de alerta
    let correos = 'admin@empresa.com'; // Default
    const config = await this.configRepo.findOneBy({ clave: 'CORREOS_ALERTAS' });
    
    if (config && config.valor) {
      correos = config.valor;
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

    const info = await this.transporter.sendMail({
      from: process.env.SMTP_USER || '"Sistema de Alertas" <alertas@iventapp.com>',
      to: correos,
      subject: `ALERTA: Stock Bajo - ${data.nombre}`,
      html,
    });

    this.logger.log(`Alerta interna enviada a ${correos}`);
  }
}
