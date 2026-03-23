<template>
    <section class="data-section">
        <div class="section-header">
            <h2>{{ title }}</h2>
            <button class="btn-primary" @click="$emit('add')">+ Nuevo</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <slot />
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup>
defineProps(['title', 'headers'])
defineEmits(['add'])
</script>