import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
const Stack = createNativeStackNavigator();

const MainStackNavigation = () => {
  const authNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    );
  };

  return authNav();
};

export default MainStackNavigation;
