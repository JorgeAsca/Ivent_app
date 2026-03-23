<template>
    <aside class="sidebar">
        <div class="logo">
            <h2>IventApp</h2>
        </div>
        <nav class="menu">
            <NuxtLink to="/" exact-active-class="active">📦 Vista General</NuxtLink>
            <NuxtLink to="/productos" active-class="active">🛍️ Productos</NuxtLink>
            <NuxtLink to="/categorias" active-class="active">📁 Categorías</NuxtLink>
            <NuxtLink to="/reportes" active-class="active">📊 Reportes</NuxtLink>
            <NuxtLink to="/configuracion" active-class="active">⚙️ Configuración</NuxtLink>
        </nav>
    </aside>
</template>