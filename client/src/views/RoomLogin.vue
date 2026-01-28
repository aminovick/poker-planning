<template>
  <Header />

  <UCard class="create-room">
    <div class="card-content">
      <div class="left">
        <h3 class="mb-3">Commencez un nouveau Poker Planning</h3>

        <p class="subtitle mb-4">
          Créez une room et partagez le lien avec votre équipe.
        </p>

        <UButton
            @click="createRoom"
            color="neutral"
            size="lg"
            :disabled="!!roomUrl"
        >
           Créer la room
        </UButton>
        
        <Transition name="fade-slide">
          <div
              v-if="roomUrl"
              class="room-link mt-6 card-detail"
          >
            <p>Invitez des participants avec le lien :</p>

            <strong class="room-url mt-2">
              {{ roomUrl }}
            </strong>

            <UButton
                size="sm"
                class="mt-4"
                @click="copyLink"
                color="neutral"
                aria-label="Copier le lien de la room"
            >
              Copier le lien
            </UButton>

            <Transition name="fade">
              <UBadge
                  v-if="copied"
                  class="mt-3"
                  role="status"
                  aria-live="polite"
              >
                ✅ Copié !
              </UBadge>
            </Transition>
          </div>
        </Transition>
      </div>

      <div class="right">
        <img
            :src="pokerImg"
            alt="Illustration d'une session de poker planning en équipe"
            class="poker-image"
        />
      </div>
    </div>
  </UCard>
</template>
<script setup lang="ts">
import { ref, } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import pokerImg from '../assets/poker.png'

const roomUrl = ref('')
const copied = ref(false)

async function createRoom() {

  const roomId = uuidv4()
  roomUrl.value = `${window.location.origin}/room/${roomId}`

}

function copyLink() {
  navigator.clipboard.writeText(roomUrl.value)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
<style scoped>
.create-room {
  max-width: 820px;
  margin: 3rem auto;
  padding: 2.5rem;
}

.card-content {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.left {
  flex: 1;
  max-width: 380px;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.right {
  flex: 1;
  text-align: center;
}

.poker-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  opacity: 0.95;
}

.card-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.room-url {
  background: #f5f5f5;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  word-break: break-all;
}

  .left {
    max-width: none;
  }

  .poker-image {
    max-height: 220px;
  }

</style>
