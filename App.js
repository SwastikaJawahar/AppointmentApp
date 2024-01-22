import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStackNavigation} from './src/Navigation/MainStackNavigation';

function App() {
  return (
    <NavigationContainer>
      <MainStackNavigation />
    </NavigationContainer>
  );
}

export default App;
