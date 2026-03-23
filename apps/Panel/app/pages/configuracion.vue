<template>
    <div>
        <div class="header-actions">
            <h2>Configuración del Sistema</h2>
            <button class="btn-primary" disabled>Guardar Cambios</button>
        </div>

        <div class="tables-grid" style="margin-top: 20px;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3>Preferencias Generales</h3>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">

                <div class="form-grid">
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#555;">Nombre de la Empresa</label>
                        <input type="text" class="input-field" placeholder="Mi Tienda S.A." disabled>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#555;">Moneda Base</label>
                        <select class="input-field" disabled>
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>