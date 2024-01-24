import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import ProfileScreen from '../Container/ProfileScreen';
import CreateAppointmentScreen from '../Container/CreateAppointmentScreen';
import ManageAppointmentScreen from '../Container/ManageAppointmentScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DashboardScreen from '../Container/DashboardScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  const [userType, setUserType] = useState(null);
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const uid = auth().currentUser.uid;
        const userSnapshot = await firestore()
          .collection('UserProfile')
          .doc(uid)
          .get();

        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setUserType(userData.userType);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    if (auth().currentUser) {
      fetchUserType();
    }
  }, []);
  return (
    <Tab.Navigator>
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="DashboardScreen" component={DashboardScreen} />
      {userType === 'doctor' && (
        <Tab.Screen
          name="ManageAppointment"
          component={ManageAppointmentScreen}
        />
      )}
      {userType === 'patient' && (
        <Tab.Screen
          name="CreateAppointment"
          component={CreateAppointmentScreen}
        />
      )}
    </Tab.Navigator>
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
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="HomeStackScreen"
        component={MyTabs}
        options={{headerShown: false}}
      />
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
