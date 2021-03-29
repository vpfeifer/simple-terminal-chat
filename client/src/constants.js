export const constants = {
    events: {
        app: {
            MESSAGE_SENT: 'message:sent',
            MESSAGE_RECEIVED: 'message:received',
            USER_JOINED: 'user:joined',
            USER_LEFT: 'user:left',
            USER_STATUS_UPDATED: 'user:updated'
        },
        socket: {
            JOIN_ROOM: 'joinRoom',
            MESSAGE: 'message'
        }
    },
    SERVER_URL: 'https://simple-terminal-chat.herokuapp.com'
}