import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { createAndAddPlayer } from "../../src/utils/Game";

export const handleCreateGame =
  (socket: Socket, games: { [key: string]: Game }) =>
  (gameID: string, username: string) => {
    // Create a new game object
    const newGame: Game = {
      hostPlayer: username,
      id: gameID,
      players: [],
      curLittleBlind: 1,
      curBigBlind: 2,
      littleBlindBet: 10,
      bigBlindBet: 20,
      potSize: 0,
      playerCount: 0, // Will be updated when adding a player
      currentBet: 0,
      currentPlayer: 1,
      gameStarted: false,
      riverCards: ["back", "back", "back", "back", "back"],
    };

    // Use the utility function to create and add the new player to the game
    createAndAddPlayer(username, socket.id, newGame);

    // Store the new game in the games object
    games[gameID] = newGame;

    // Join the creator to the game room
    socket.join(gameID);

    // Notify the creator that the game has been created successfully
    socket.emit("gameCreated", { gameState: newGame });
    // test river card hook
    // game.riverCards = ["spades_2", "hearts_A", "clubs_3", "diamonds_4", "spades_5"];
    socket.emit("updateRiverCards", ["spades_2", "hearts_A", "clubs_3", "diamonds_4", "spades_5"]);
  };
