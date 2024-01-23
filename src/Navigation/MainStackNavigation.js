import React from 'react';
// import {StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import ProfileScreen from '../Container/ProfileScreen';
import firestore from '@react-native-firebase/firestore';
import DashboardScreen from '../Container/DashboardScreen';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="DashboardScreen" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

// function HomeStackScreen() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="TabScreen" component={MyTabs} />
//       <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
//     </Stack.Navigator>
//   );
// }
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
        component={MyTabs}
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
        component={AuthStackScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export {MainStackNavigation, AuthStackScreen};
