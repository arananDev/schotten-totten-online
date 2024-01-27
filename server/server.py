import socketio
import string
import random

games = {}  # Dictionary to store game state

def generate_game_id():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='http://localhost:5173') 
app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    print('connect ', sid)

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)

@sio.event
async def createGame(sid, data):
    game_id = generate_game_id()
    await sio.enter_room(sid, game_id)
    games[game_id] = {
        "players": [sid],
    }
    await sio.emit('gameCreated', game_id, to=sid)  # Notify the creator

@sio.event
async def joinGame(sid, data):
    game_id = data.get('gameID')
    if game_id in games:
        if len(games[game_id]["players"]) >= 2:
            await sio.emit("gameFull")
        else:
            games[game_id]["players"].append(sid)
            await sio.enter_room(sid, game_id)
            await sio.emit('joinedGame', room=game_id)  # Notify all players in the game
    else:
       await sio.emit('gameNotExists')
# More event handlers here...
