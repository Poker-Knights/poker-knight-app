import { Game } from "../../src/types/Game";

export const dealRiverCards = (game: Game, caseNumber: number) => {
  // Function to deal river cards; case 1 deals 3, case 2 deals 1
  const riverCards: string[] = [];

  riverCards.sort((a, b) => a.localeCompare(b));

  if (caseNumber == 1) {
    while (riverCards.length < 3) {
      const randomIndex = Math.floor(Math.random() * game.deckCards.length);
      const randomCard = game.deckCards.splice(randomIndex, 1)[0];
      if (!game.riverCards.includes(randomCard)) {
        riverCards.push(randomCard);
      }
    }
    while (riverCards.length < 5) {
      riverCards.push("back");
    }
    game.riverCards = riverCards;
  } else if (caseNumber == 2) {
    // Case to deal 1 card
    let cardIndex = 0,
      dealt = 0;
    while (dealt == 0) {
      if (game.riverCards[cardIndex] === "back" && dealt === 0) {
        const randomIndex = Math.floor(Math.random() * game.deckCards.length);
        const randomCard = game.deckCards.splice(randomIndex, 1)[0];
        game.riverCards[cardIndex] = randomCard;
        dealt = 1;
      }
      // game.riverCards.push("back");
      cardIndex++;
    }
  }
};


export const dealPlayerCards = (game: Game) => {
  // Function to deal player cards, removing them from deck
  game.players.forEach((player) => {
    player.playerCards = [];
    while (player.playerCards.length < 2) {
      const randomIndex = Math.floor(Math.random() * game.deckCards.length);
      const randomCard = game.deckCards.splice(randomIndex, 1)[0];
      player.playerCards.push(randomCard);
    }
    player.playerCards.sort((a, b) => a.localeCompare(b));
  });
};

export const resetCards = (game: Game) => {
  // Remove all cards from river and players, return to deck
  game.riverCards = Array(5).fill("back");
  game.players.forEach((player) => {
    player.playerCards = ["back", "back"];
  });
  game.deckCards = [
    "spades_2",
    "spades_3",
    "spades_4",
    "spades_5",
    "spades_6",
    "spades_7",
    "spades_8",
    "spades_9",
    "spades_T",
    "spades_J",
    "spades_Q",
    "spades_K",
    "spades_A",
    "hearts_2",
    "hearts_3",
    "hearts_4",
    "hearts_5",
    "hearts_6",
    "hearts_7",
    "hearts_8",
    "hearts_9",
    "hearts_T",
    "hearts_J",
    "hearts_Q",
    "hearts_K",
    "hearts_A",
    "clubs_2",
    "clubs_3",
    "clubs_4",
    "clubs_5",
    "clubs_6",
    "clubs_7",
    "clubs_8",
    "clubs_9",
    "clubs_T",
    "clubs_J",
    "clubs_Q",
    "clubs_K",
    "clubs_A",
    "diamonds_2",
    "diamonds_3",
    "diamonds_4",
    "diamonds_5",
    "diamonds_6",
    "diamonds_7",
    "diamonds_8",
    "diamonds_9",
    "diamonds_T",
    "diamonds_J",
    "diamonds_Q",
    "diamonds_K",
    "diamonds_A",
  ];
};

export const parseCardNames = (cardNames: string[]): string[] => {
  const parsedCardNames: string[] = [];
  cardNames.forEach((cardName) => {
    const [suit, number] = cardName.split("_");
    let parsedNumber: string;
    const parsedCardName = number + suit.charAt(0);
    parsedCardNames.push(parsedCardName);
  });
  return parsedCardNames;
};

const returnWinners = (game: Game) => {
  var Hand = require("pokersolver").Hand;
  var playerRanks: { username: string; rank: number; cardArray: string[]; descr: string}[] = [];
  game.players.forEach((player) => {
    var concatArray: string[] = player.playerCards.concat(game.riverCards);
    var parsedArray: string[] = parseCardNames(concatArray);
    // console.log(player.name + " cards: " + parsedArray);
    var rank = Hand.solve(parsedArray).rank;
    var descr = Hand.solve(parsedArray).descr;
    // console.log(player.name + " rank: " + rank, "descr: " + Hand.solve(parsedArray).descr);
    playerRanks.push({ username: player.name, rank: rank, cardArray: parsedArray, descr: descr});
  });

  // Accessing the cardArray field of the first player
  // console.log("Card Array of the first player: " + playerRanks[0].cardArray);
  // console.log("Player Ranks: " + playerRanks);
  // playerRanks.sort((a, b) => a.rank - b.rank);
  playerRanks.sort((a, b) => {
    const handA = Hand.solve(a.cardArray);
    const handB = Hand.solve(b.cardArray);
    return Hand.winners([handA, handB])[0] === handA ? -1 : 1;
  });
  // var winners = playerRanks.map((player) => player.username);
  return playerRanks;
};
