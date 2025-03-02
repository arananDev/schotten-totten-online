import io from 'socket.io-client';

const socket = io("https://schotten-totten-online-production.up.railway.app", {
    transports: ["websocket"],
});// Replace with your server URL

export default socket;