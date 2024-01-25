import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import ProfileScreen from '../Container/ProfileScreen';
import HistoryScreen from '../Container/HistoryScreen';
import CreateAppointmentScreen from '../Container/CreateAppointmentScreen';
import ManageAppointmentScreen from '../Container/ManageAppointmentScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DashboardScreen from '../Container/DashboardScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcons from 'react-native-vector-icons/MaterialIcons';
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  const [user, setUser] = useState(undefined);
  const [userType, setUserType] = useState(null);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  function onAuthStateChanged(user) {
    // console.log(auth().currentUser.uid);
    const fetchUserType = async () => {
      try {
        if (auth().currentUser) {
          const userProfileRef = firestore().collection('UserProfile');
          const userSnapshot = await userProfileRef
            .where('uid', '==', auth().currentUser.uid)
            .get();
          console.log('Test this');

          if (!userSnapshot.empty) {
            // User profile exists, update state with existing data
            const userData = userSnapshot.docs[0].data();
            setUserType(userData.userType);
            setUser(user);
          }
        } else {
          setUser(user);
        }
      } catch (error) {
        console.log('Error ? ', error);
      }
    };

    fetchUserType();
    // setUser(user);
  }

  const isLoggedIn = !!user;

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
      <Tab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        initialParams={{user: userType}}
        options={{
          tabBarIcon: () => <MIcons name="dashboard" size={40} />,
        }}
      />
      <Tab.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        initialParams={{user: userType}}
      />
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
