import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleInitializePlayersforGame = (Socket: Socket, games: { [key: string]: Game }) =>
(inputGameID: string) => {

    // Find the game with the given ID
    const game = games[inputGameID];
    
    game.gameStarted = true;
    // Assign the first player as little blind and second player as big blind
    let players = game.players;

    //players[0].isLittleBlind = true;
    //players[1].isBigBlind = true; // update UI here

    // call function to 'give' players their cards here

    // every players current bet is -1
    players.forEach((player) => {
        player.lastBet = -1;
    });

    // give default starting amount of money
    players.forEach((player) => {
        player.money = 200;
    });

    // all players have not folded
    players.forEach((player) => {
        player.fold = false;
    });

    // no players have gone all in
    players.forEach((player) => {
        player.allInFg = false;
    });

    // make the player after the big blind the current player
    //game.currentPlayer = 2;

    game.currentPlayer = 1;

    game.players[game.currentPlayer - 1].currentTurn = true; 

    // set players equal to game players
    game.players = players;

    // print player info for the current player
    console.log("Current player: " + game.players[game.currentPlayer - 1].name + " with money: " + game.players[game.currentPlayer - 1].money + " and last bet: " + game.players[game.currentPlayer - 1].lastBet);   
    
    // emit the updated game
    Socket.emit("playersForGameInitialized",{gameState: game });

    return;

}