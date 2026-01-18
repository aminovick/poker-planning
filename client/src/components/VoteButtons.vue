<template>
  <div class="votes">
    <button
        v-for="v in values"
        :key="v"
        @click="selectVote(v)"
        class="card"
        :class="{ selected: v === selected }"
        :disabled="disabled"
    >
      {{ v }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  values: string[]
  selected: string | number | null
  disabled?: boolean
}>()

const emit=defineEmits(['vote']);
function selectVote(v: string | number) {
  if (props.disabled) return
  emit('vote', v)
}

</script>

<style scoped lang="scss">
.votes {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  background: #fff;
  border: 2px solid #4bb373;
  border-radius: 8px;
  width: 50px;
  height: 70px;
  font-size: 1.32rem;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.card.selected {
  background: #c0ffe1;
  transform: rotateX(15deg) translateY(-6px);
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.25);
}

.card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
