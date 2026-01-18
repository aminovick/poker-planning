<template>
  <Header />
  <UCard class="login">
    <UInput
        v-model="name"
        placeholder="Votre pseudo"
        autofocus
    />

    <UButton
        class="m-3"
        :disabled="!name.trim()"
        @click="joinRoom"
    >
      Entrer
    </UButton>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const roomId = route.params.roomId as string
const name = ref(user.name)

function joinRoom() {
  if (!name.value.trim()) return

  user.setName(name.value.trim())

  router.push(`/poker/${roomId}`)
}
</script>

<style scoped>
.login {
  max-width: 420px;
  margin: 3rem auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;

}
</style>
