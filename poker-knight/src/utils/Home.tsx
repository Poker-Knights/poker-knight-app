import { Alert } from 'react-native';
import { Game } from '../types/Game';


// Event emitters, helper functions, button presses
export const createGame = (hostUsername: string, socketRef: React.RefObject<any>, setGameId: (id: string) => void) => {
  const newGameID = Math.floor(100000 + Math.random() * 900000).toString();
  setGameId(newGameID);

  if (socketRef.current) {
    socketRef.current.emit('createGame', newGameID, hostUsername);
    console.log("socket createGame emitted to server with ID: " + newGameID);
  }
};

export const handleHostGamePress = (username: string, createGameFunction: Function) => {
  console.log("Host Game");

  if (username.length <= 8 && username.length > 0) {
    console.log("Username is valid");
    createGameFunction(username);
  } else {
    Alert.alert("Invalid Username", "Username must be between 1 and 8 characters");
  }
};

// Assuming `navigation` is from `useNavigation` in react-navigation
export const handleJoinGamePress = (username: string, navigation: any) => {
  console.log("Join Game");
  navigation.navigate("Join", { username });
};

export const handleSettingsPress = (setMenuVisible: (visible: boolean) => void) => {
  console.log("Settings");
  setMenuVisible(true);
};


// Event listeners and their helper functions
export const handleGameCreated = (setGame: (game: Game) => void, navigation: any, socketRef: React.RefObject<any>) => (data: any) => {
    const newGame: Game = data.gameState;
    console.log(`Game ${newGame.id} has been created with username ${newGame.players[0].name}!`);
    setGame(newGame); // Update the game state with the new game information
  
    // Navigate to loading screen until enough players
    // navigation.navigate("Loading", { Game: newGame });
  };