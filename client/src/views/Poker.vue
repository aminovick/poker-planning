<template>
  <Header :name="user.name" @leave-room="leaveRoom"/>
  <div class="poker-container">
    <div class="mt-5">

      <!-- TABLE -->
      <div class="table">
        <span class="table-text">
          <template v-if="!hasVotes">
            En attente des votes...
          </template>
          <template v-else-if="revealed">
            Cartes révélées!
          </template>
        </span>

        <Controls
            v-if="hasVotes"
            :revealed="revealed"
            @reveal="send('reveal_votes', {})"
            @reset="resetVote"
        />
      </div>

      <!-- CARTES JOUEURS -->
      <section class="players">
        <VoteCards
            :users="state.users"
            :votes="state.votes"
            :revealed="state.revealed"
            :meId="state.me.id"
        />
      </section>

      <!-- BOUTONS DE VOTE -->
      <VoteButtons
          :values="votes"
          :selected="state.myVote"
          :disabled="state.revealed"
          @vote="vote"
          class="mt-8"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, onBeforeUnmount} from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import { useWSInstance } from '../composables/useWSInstance.ts';

import Header from '../components/Header.vue';
import Controls from '../components/Controls.vue';
import VoteCards from '../components/VoteCards.vue';
import VoteButtons from '../components/VoteButtons.vue';

const route = useRoute();
const router = useRouter();
const user = useUserStore();
const roomId = ref(route.params.roomId || 'demo');

const votes = ['0','1','2','3','5','8','13','21','34','55','89','?','☕'];

const { state, connect, send, disconnect } = useWSInstance();

// Connexion WS au montage
onMounted(() => connect('ws://localhost:8080', user.name, roomId.value));

// Watch pour conserver myVote après refresh / reveal
watch(
    () => state.votes,
    (votes) => {
      if (state.me.id && votes[state.me.id] !== undefined) {
        state.myVote = votes[state.me.id];
      } else {
        state.myVote = null;
      }
    },
    { deep: true, immediate: true }
);

// Fonction pour voter
function vote(val: number) {
  if (state.revealed) return;
  state.myVote = val;       // garde la sélection
  send('vote', { estimate: val });
}

// Reset manuel
function resetVote() {
  state.myVote = null;
  send('reset_votes', {});
}

// Computed
const revealed = computed(() => state.revealed === true);
const hasVotes = computed(() => Object.keys(state.votes || {}).length > 0);

// Quitter la room
const leaveRoom = () => {
  send('leave_room', {});
  disconnect();
  router.push(`/room/${roomId.value}`);
};

onBeforeUnmount(() => disconnect());
window.addEventListener('beforeunload', disconnect);

</script>

<style scoped>
.poker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.players {
  display: flex;
  width: 510px;
  justify-content: center;
  flex-wrap: wrap;
  margin: auto;
}

.table {
  width: 340px;
  height: 180px;
  background: #12964c;
  border-radius: 48px;
  margin: 45px auto 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.table-text {
  color: #fff;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
