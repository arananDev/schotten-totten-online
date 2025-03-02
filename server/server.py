import socketio
import string
import random
import asyncio
from game_objects import State
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

fastapi_app = FastAPI()

fastapi_app.mount("/", StaticFiles(directory="build", html=True), name="frontend")

# Initialize Socket.IO ASGI app
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*', reconnection=True)
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

games = {}  # Dictionary to store game state
player_to_sid = {}  # Maps playerID to a dict with 'sid' and 'name'

def generate_game_id():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

def generate_player_id():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

async def check_game_and_player(game_id, player_id):
    # Check if the game exists
    if game_id not in games:
        return True, "Game does not exist."
    
    game_info = games[game_id]

    # Check if the player is part of this game
    if player_id not in game_info["players"]:
        return True, "Player is not part of the game."

    # Assuming State object has a method to return game state in a serializable format
    state = game_info.get("state")
    if not state:
        return True, "Game state not initialized."

    # Prepare the game state to be sent to the client
    player_name = player_to_sid[player_id]["name"]
    
    # Instead of emitting the game state here, we return it with no error
    return False, state

@sio.event
async def connect(sid, environ):
    print('connect ', sid)

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)
    # Consider finding the playerID from sid to handle disconnection properly

@sio.event
async def createGame(sid, data):
    player_id = data.get('playerID', generate_player_id())
    player_name = data.get('playerName', 'player1')  # Assume player sends a 'playerName'
    game_id = generate_game_id()
    await sio.enter_room(sid, game_id)
    games[game_id] = {
        "players": [player_id],
    }
    player_to_sid[player_id] = {'sid': sid, 'name': player_name}
    await sio.emit('gameCreated', {"gameID": game_id, "playerID": player_id, "playerName": player_name}, to=sid)

@sio.event
async def joinGame(sid, data):
    player_id = data.get('playerID', generate_player_id())
    player_name = data.get('playerName', 'player2')  # Assume player sends a 'playerName'
    game_id = data.get('gameID')
    if game_id in games:
        if len(games[game_id]["players"]) >= 2:
            await sio.emit("gameFull", to=sid)
        else:
            games[game_id]["players"].append(player_id)
            player_to_sid[player_id] = {'sid': sid, 'name': player_name}
            await sio.enter_room(sid, game_id)
            player1 = games[game_id]["players"][0]
            player1_name = player_to_sid[player1]["name"]
            state = State(player1=player1_name, player2=player_name)
            games[game_id]["state"] = state
            
            await sio.emit('joinedGame', {"gameID": game_id, "playerID": player_id, "playerName": player_name}, room=game_id)
    else:
       await sio.emit('gameNotExists', to=sid)

@sio.event
async def reconnect(sid, data):
    player_id = data.get('playerID')
    for game_id, game_info in games.items():
        if player_id in game_info["players"]:
            player_to_sid[player_id]["sid"] = sid
            await sio.enter_room(sid, game_id)
            await sio.emit('reconnected', {"gameID": game_id, "playerID": player_id,}, to=sid)
            break
        
@sio.event
async def initializeGame(sid, data):
    game_id = data.get('gameId')
    player_id = data.get('playerID')
    
    error, result = await check_game_and_player(game_id, player_id)
    
    if error:
        await sio.emit('error', {'message': result}, to=sid)
    else:
        returned_state = result.returnState(player_to_sid[player_id]["name"])
        await sio.emit('gameState', returned_state , to=sid)
        
@sio.event
async def playTurn(sid, data):
    game_id = data.get('gameId')
    player_id = data.get('playerID')
    rock_index = data.get('rockIndex')
    card_index = data.get('cardIndex')
    error, state = await check_game_and_player(game_id, player_id)
    if error:
        await sio.emit('error', {'message': state}, to=sid)
    else:
        turn_played = state.playTurn(rock_index, card_index)
        if turn_played.error:
            await sio.emit('error', {'message': turn_played.message}, to=sid)
        else:
            games[game_id]["state"] = state
            for player in games[game_id]["players"]:
                name = player_to_sid[player]["name"]
                new_state = state.returnState(name)
                await sio.emit('gameState',new_state , to=player_to_sid[player]["sid"])
            is_rock_claimed = state.checkIfRockClaimed(rock_index)
            if is_rock_claimed.shouldSend == True:
                await sio.emit('message', {'message': is_rock_claimed.message}, room=game_id)
            if state.hasSomeoneWon():
                winner = state.hasSomeoneWon()
                await sio.emit('gameFinished',{"winner": winner},room=game_id)
                
        
@sio.event
async def revealCard(sid, data):
    game_id = data.get('gameId')
    player_id = data.get('playerID')
    card_index = data.get('cardIndex')
    error, state = await check_game_and_player(game_id, player_id)
    
    if error:
        await sio.emit('error', {'message': state}, to=sid)
    else:
        for player in games[game_id]["players"]:
            if player != player_id:
                opp_sid = player_to_sid[player]["sid"]
                await sio.emit("revealOppCard", card_index, to=opp_sid)
            else:
                await sio.emit("message",{"message": f'card {str(card_index)} has been revealed'}, to=sid)
                
@sio.event
async def proveRock(sid, data):
    game_id = data.get('gameId')
    player_id = data.get('playerID')
    rock_index = data.get('rockIndex')
    error, state = await check_game_and_player(game_id, player_id)
    
    if error:
        await sio.emit('error', {'message': state}, to=sid)
    else:
        for player in games[game_id]["players"]:
            if player != player_id:
                opp_sid = player_to_sid[player]["sid"]
                await sio.emit("validateProveRock", rock_index, to=opp_sid)
            else:
                await sio.emit("message",{"message": f'card {str(rock_index)} approval request submitted'}, to=sid)
        
        
@sio.event
async def rockApprovalValidated(sid, data):
    game_id = data.get('gameId')
    player_id = data.get('playerID')
    rock_index = data.get('rockIndex')
    error, state = await check_game_and_player(game_id, player_id)
    if error:
        await sio.emit('error', {'message': state}, to=sid)
    else:
        for player in games[game_id]["players"]:
            if player != player_id:
                opp_player = player_to_sid[player]["name"]
                state.rocks[rock_index].preemptive_finish(opp_player)
                games[game_id]["state"] = state
        state = games[game_id]["state"]
        for player in games[game_id]["players"]:
            name = player_to_sid[player]["name"]
            new_state = state.returnState(name)
            await sio.emit('gameState',new_state , to=player_to_sid[player]["sid"])
            await sio.emit('message', {'message': f"rock {str(rock_index)} has been claimed"}, room=game_id)
        if state.hasSomeoneWon():
            winner = state.hasSomeoneWon()
            await sio.emit('gameFinished',{"winner": winner},room=game_id)
        
        
            
            
        
        
        