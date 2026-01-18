<template>
  <ul>
    <li v-for="u in users" :key="u.id">
      <strong v-if="u.id === meId">(Vous) </strong>{{ getName(u) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import {storeToRefs} from "pinia";

const props = defineProps<{
  users: Array<{ id: string; name: string }>;
  meId: string;
}>();

const {name} = storeToRefs(useUserStore());

function getName(u: { id: string; name: string }) {
  if (!u.id) return '';
  return u.id === props.meId ? name.value : u.name;
}

</script>

<style scoped>
ul { list-style: none; padding: 0; }
strong { color: green; }
</style>
