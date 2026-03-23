<template>
    <div class="stat-card">
        <h3>{{ title }}</h3>
        <p class="number">{{ value }}</p>
    </div>
</template>

<script setup>
defineProps(['title', 'value'])
</script>