<template>
  <div class="controls">

    <UButton
        v-if="!revealed"
        @click="$emit('reveal')"
    >
      🔓 Reveal
    </UButton>

    <UButton
        v-else
        @click="$emit('reset')"
    >
      🔄 Nouveau vote
    </UButton>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  revealed: boolean

}>()

defineEmits(['reveal', 'reset'])
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
}

</style>
