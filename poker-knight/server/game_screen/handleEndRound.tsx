import { Server } from "socket.io";
import { Game, Player } from "../../src/types/Game";
import { returnWinners, resetCards } from "./cardUtils";

export const handleEndRound = (io: Server, gameID: string, game: Game) => {
  // Perform Hand Analysis
  let winners: { username: string; rank: number; cardArray: string[]; descr: string}[] = [];
  let players = game.players;
  let winPlayer: Player[] = [];

  // Find the winners
  winners = returnWinners(game);

  let winningHandDescription = winners[0].descr;
  let winningUsername = winners[0].username;
  
  // Round winner chips += potSize
  let payouts = game.potSize;
  let paidout = 0;
  
  players.forEach((player, index) => {
    winPlayer[index] = game.players.find((p) => p.name === winners[index].username)!;
  });
  
  winPlayer.forEach((player, index) => {
    // If the player has been eliminated or they folded, make sure they don't get any winnings and move on to the next player
    if (player.eliminated || player.foldFG)
      return;

    if (player.name === winners[0].username) {
      winPlayer[index].money += winPlayer[index].splitPotVal;
      payouts -= winPlayer[index].splitPotVal;
      paidout += winPlayer[index].splitPotVal;

      // Set the winner's isWinner flag to true
      winPlayer[index].isRoundWinner = true;
      console.log("Player: " + player.name + " Winnings " + winPlayer[index].splitPotVal);
    }

    if ((payouts != 0) && (player.name !== winners[0].username)) {
      let winnings = winPlayer[index].splitPotVal - paidout;
      if (winnings > 0) {
        winPlayer[index].money += winnings;
        payouts -= winnings;
        paidout += winnings;

      }
    }
  });

  // // Find the winning player if they are not already eliminated
  // let winPlayer1: Player = game.players.find((p) => p.name === winners[0].username)!;
  // let winPlayer2: Player = game.players.find((p) => p.name === winners[1].username)!;
  // let winPlayer3: Player = game.players.find((p) => p.name === winners[2].username)!;
  // let winPlayer4: Player = game.players.find((p) => p.name === winners[3].username)!;

  // // First place
  // winPlayer1.money += winPlayer1.splitPotVal; // Pay them their winnings
  // payouts -= winPlayer1.splitPotVal; // Subtract from winnings
  // paidout += winPlayer1.splitPotVal;

  // // Second place if needed
  // if (payouts != 0) {
  //   let winnings = winPlayer2.splitPotVal - paidout;
  //   if (winnings > 0) {
  //     winPlayer2.money += winnings; // Pay them their winnings
  //     payouts -= winnings; // Subtract from winnings
  //     paidout += winnings;
  //   }
  // }

  // // Third place if needed
  // if (payouts != 0) {
  //   let winnings = winPlayer3.splitPotVal - paidout;
  //   if (winnings > 0) {
  //     winPlayer3.money += winnings; // Pay them their winnings
  //     payouts -= winnings; // Subtract from winnings
  //     paidout += winnings;
  //   }
  // }

  // // Foruth place if needed
  // if (payouts != 0) {
  //   let winnings = winPlayer4.splitPotVal - paidout;
  //   if (winnings > 0) {
  //     winPlayer4.money += winnings; // Pay them their winnings
  //     payouts -= winnings; // Subtract from winnings
  //     paidout += winnings;
  //   }
  // }

  // Undeal/remove Cards
  resetCards(game);

  game.potSize = 0;
  game.currentBet = 0;

  // Emit the winner to the client
  io.to(gameID).emit("handledWinner", game, winningUsername, winningHandDescription);

  // add delay before returning the game
  for (let i = 0; i < 5000000000; i++) {
    // do nothing
  }

  game.roundCount++;

  // Return the updated game
  return game;
};
