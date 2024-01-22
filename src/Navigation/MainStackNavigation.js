import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import {useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../Components/CustomDrawer';
import firestore from '@react-native-firebase/firestore';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {}

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
