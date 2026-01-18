<template>
  <div class="logs">
    <div v-for="(m,i) in messages" :key="i">[{{ m.type }}] {{ pretty(m.payload) }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ messages: any[] }>();


function pretty(p: any) {
  try { return JSON.stringify(p); } catch { return String(p); }
}
</script>


<style scoped>
.logs {
  max-height: 200px;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 8px;
}
</style>