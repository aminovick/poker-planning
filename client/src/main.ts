import './assets/main.css'
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import {router} from './router';
import ui from '@nuxt/ui/vue-plugin'
import {createPersistedState} from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(
    createPersistedState({
        storage: localStorage,
        key: (id: string) => `poker-app-${id}`,
    })
);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ui);
app.mount('#app');
