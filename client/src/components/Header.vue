<template>
  <div class="header">
  <UHeader title="Poker Planning" :toggle="false">
    <template #right v-if="name">
      <div>👤 {{ name }}</div>
      <UIcon name="oi:account-logout" class="size-5 ml-5"  @click="emit('leaveRoom')"/>
    </template>

  </UHeader>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name?: string }>();
const emit = defineEmits<{
  (e: 'leaveRoom'): void
}>();
</script>
<style scoped lang="scss">
.header{
  background-color: #B1C7E5;
}

</style>
