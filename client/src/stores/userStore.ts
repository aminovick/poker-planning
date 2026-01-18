import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useUserStore = defineStore('user', () => {
        const name = ref('');

        function setName(n: string) {
            name.value = n;

        }

        return {name, setName};
    },
    {persist: true}
);
