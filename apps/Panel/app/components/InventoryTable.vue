<template>
    <div class="inventory-section">
        <div class="section-header">
            <h2>{{ title }}</h2>
            <button v-if="!hideAdd" class="btn-primary" @click="$emit('add')">
                + Añadir Nuevo
            </button>
        </div>
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <slot></slot>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    headers: {
        type: Array,
        required: true
    },

    hideAdd: {
        type: Boolean,
        default: false 
    }
})

defineEmits(['add'])
</script>