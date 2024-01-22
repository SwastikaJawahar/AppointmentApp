import React from 'react';
// import {StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import ProfileScreen from '../Container/ProfileScreen';
import firestore from '@react-native-firebase/firestore';
import DashboardScreen from '../Container/DashboardScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerScreen"
        component={AppDrawer}
        options={{headerShown: true}}
      />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
function AuthStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
const MainStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={true ? HomeStackScreen : AuthStackScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export {MainStackNavigation, AuthStackScreen, AppDrawer};
