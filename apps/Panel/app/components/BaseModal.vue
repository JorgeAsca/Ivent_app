<template>
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-content">
            <header class="modal-header">
                <h2>{{ title }}</h2>
                <button class="close-btn" @click="$emit('update:modelValue', false)">&times;</button>
            </header>
            <div class="modal-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['modelValue', 'title'])
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #a0aec0;
}
</style>