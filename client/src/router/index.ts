// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import RoomLogin from '../views/RoomLogin.vue'
import Poker from '../views/Poker.vue'
import { useUserStore } from '../stores/userStore'
import Login from "../views/Login.vue";

const routes = [
    {
        path: '/',
        component: RoomLogin,
    },
    {
        path: '/room/:roomId',
        component: Login,
    },
    {
        path: '/poker/:roomId',
        component: Poker,
        meta: { requiresName: true },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const user = useUserStore()

    if (to.meta.requiresName && !user.name) {
        return {
            path: `/room/${to.params.roomId}`,
        }
    }
})
