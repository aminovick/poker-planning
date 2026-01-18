<template>
  <div class="cards">
    <div v-for="u in users" :key="u.id" class="card">
      <div class="name">
        {{ u.name }}
        <span v-if="u.id === meId"> (vous)</span>
      </div>
      <div >
        <div class="card-container" :class="{ flipped: revealed && votes[u.id] != null }">
          <div class="card-face card-back" :class="{ selected: votes[u.id] != null }">
            <UIcon name="game-icons:card-pickup" class="size-15" />
          </div>
          <div class="card-face card-front">
            {{ votes[u.id] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  users: { id: string; name: string }[];
  votes: Record<string, number>;
  revealed: boolean;
  meId: string;
}>();
</script>

<style scoped>
.cards {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.card {
  text-align: center;
}

.name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-container {
  width: 80px;
  height: 110px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-container.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

/* base : carte front tournée dans le bon sens après le flip container */
.card-front {
  transform: rotateY(180deg);
}

.selected {
  box-shadow:
      0 0 0 3px rgba(75, 179, 115, 0.5),  /* halo vert autour */
      0 8px 20px rgba(0, 0, 0, 0.15);
}

</style>
