import WebSocket, {WebSocketServer} from 'ws'
import {v4 as uuidv4} from 'uuid'

interface User {
    id: string
    name: string
    roomId: string
    ws: WebSocket
}

interface Room {
    id: string
    users: User[]
    votes: Record<string, number>
    revealed: boolean
}

const rooms = new Map<string, Room>()

const wss = new WebSocketServer({port: 8080})
console.log('WS server started on ws://localhost:8080')

wss.on('connection', (ws) => {
    let currentUser: User | null = null

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString())

            // =========================
            // JOIN ROOM
            // =========================
            if (data.type === 'join_room') {
                const {name, roomId} = data.payload
                const id = uuidv4()

                currentUser = {id, name, roomId, ws}

                if (!rooms.has(roomId)) {
                    rooms.set(roomId, {
                        id: roomId,
                        users: [],
                        votes: {},
                        revealed: false,
                    })
                }

                const room = rooms.get(roomId)!
                room.users.push(currentUser)

                ws.send(JSON.stringify({
                    type: 'welcome',
                    payload: {id, name, roomId}
                }))

                sendRoomState(room)
            }

            // =========================
            // VOTE
            // =========================
            if (data.type === 'vote' && currentUser) {
                const room = rooms.get(currentUser.roomId)!
                room.votes[currentUser.id] = data.payload.estimate

                sendRoomState(room)
            }

            // =========================
            // REVEAL
            // =========================
            if (data.type === 'reveal_votes' && currentUser) {
                const room = rooms.get(currentUser.roomId)!
                room.revealed = true

                sendRoomState(room)
            }

            // =========================
            // RESET (manuel)
            // =========================
            if (data.type === 'reset_votes' && currentUser) {
                const room = rooms.get(currentUser.roomId)!
                room.votes = {}
                room.revealed = false

                sendRoomState(room)
            }

            // =========================
            // RENAME
            // =========================
            if (data.type === 'set_name' && currentUser) {
                currentUser.name = data.payload.name
                sendRoomState(rooms.get(currentUser.roomId)!)
            }
            // Dans ws.on('message')
            if (data.type === 'leave_room' && currentUser) {
                // Fermer la connexion WS côté serveur
                ws.close()
            }


        } catch (e) {
            console.error('Invalid message', e)
        }
    })

    ws.on('close', () => {
        if (!currentUser) return
        const room = rooms.get(currentUser.roomId)
        if (!room) return

        room.users = room.users.filter(u => u.id !== currentUser!.id)
        delete room.votes[currentUser.id]
        sendRoomState(room)
        if (room.users.length === 0) {
            rooms.delete(room.id)
        }
    })
})


// =========================
// HELPERS
// =========================

function sendRoomState(room: Room) {
    broadcastRoom(room.id, {
        type: 'room_state',
        payload: {
            users: getUsers(room),
            votes: room.votes,
            revealed: room.revealed,
        },
    })
}

function broadcastRoom(roomId: string, message: any) {
    const room = rooms.get(roomId)
    if (!room) return

    room.users.forEach(u => {
        u.ws.send(JSON.stringify(message))
    })
}

function getUsers(room: Room) {
    return room.users.map(u => ({id: u.id, name: u.name}))
}
