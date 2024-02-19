// App.js
import React, { useState } from "react";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/components/pages/HomeScreen";
import JoinScreen from "./src/components/pages/JoinGameScreen";
import GameScreen from "./src/components/pages/GameScreen";
import AppLoading from "expo-app-loading";

export type StackParamList = {
  Home: undefined;
  Create: undefined;
  Join: undefined;
  Game: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      PixeloidMono: require("./assets/fonts/PixeloidMono.ttf"), // Replace with the correct path to your font file
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
