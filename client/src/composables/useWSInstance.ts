import {reactive, type UnwrapRef} from 'vue';
import type {RouteParamValue} from "vue-router";

interface ServerMessage {
    type: string;
    payload: any
}

const state = reactive({
    connected: false,
    me: {id: '', roomId: '', name: ''},

    users: [] as Array<{ id: string; name: string }>,

    votes: {} as Record<string, number>,
    revealed: false,
    myVote: null as number | null,
    messages: [] as ServerMessage[],
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'wss://poker-planning-bsd3.onrender.com';
export const useWSInstance =
    () => {

        let ws: WebSocket ;

        function connect(url =VITE_BACKEND_URL, name: string, roomId: UnwrapRef<string | RouteParamValue[]>) {
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

            ws = new WebSocket(url);

            ws.onopen = () => {
                state.connected = true;
                ws!.send(JSON.stringify({type: 'join_room', payload: {name, roomId}}));
            };

            ws.onmessage = (ev) => {
                try {
                    const msg: ServerMessage = JSON.parse(ev.data);
                    handleServerMessage(msg);
                } catch (e) {
                    console.error(e);
                }
            };

            ws.onclose = () => {
                state.connected = false;
            };
            ws.onerror = () => {
                state.connected = false;
            };
        }

        function send(type: string, payload: any) {
            if (!ws || ws.readyState !== WebSocket.OPEN) return;
            ws.send(JSON.stringify({type, payload}));
        }

        function disconnect() {
            if (!ws) return

            ws.close()

            // reset state propre
            state.connected = false
            state.me = {id: '', name: '', roomId: ''}
            state.users = []
            state.votes = {}
            state.revealed = false
            state.messages= []
        }


        function handleServerMessage(msg: ServerMessage) {
            state.messages.push(msg);

            switch (msg.type) {

                // =====================
                // CONNEXION
                // =====================
                case 'welcome':
                    state.me.id = msg.payload.id;
                    state.me.roomId = msg.payload.roomId;

                    break;

                // =====================
                // ÉTAT COMPLET ROOM
                // =====================
                case 'room_state':
                    state.users = msg.payload.users;
                    state.votes = msg.payload.votes;
                    state.revealed = msg.payload.revealed;
                    state.myVote = state.me.id ? state.votes[state.me.id] ?? null : null;
                    break;

                // =====================
                // MISE À JOUR VOTES
                // =====================
                case 'votes_update':
                    state.votes = msg.payload.votes;
                    state.revealed = msg.payload.revealed;
                    state.myVote = state.me.id ? state.votes[state.me.id] ?? null : null;
                    break;

                // =====================
                // REVEAL
                // =====================
                case 'votes_revealed':
                    state.votes = msg.payload;
                    state.revealed = true;
                    break;

                // =====================
                // RESET
                // =====================
                case 'votes_reset':
                    state.votes = {};
                    state.revealed = false;
                    state.myVote=null
                    break;

                // =====================
                // USERS
                // =====================
                case 'users_list':
                    state.users = msg.payload;
                    break;

                default:
                    break;
            }
        }

        return {state, connect, send, disconnect}
    }

