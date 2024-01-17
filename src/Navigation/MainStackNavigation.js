import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../Container/LoginScreen';
const Stack = createNativeStackNavigator();

const MainStackNavigation = () => {
  const authNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    );
  };

  return authNav();
};

export default MainStackNavigation;
