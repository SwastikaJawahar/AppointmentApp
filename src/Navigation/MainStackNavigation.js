import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import LoginScreen from '../Container/LoginScreen';
import SignUpScreen from '../Container/SignUpScreen';
import ProfileScreen from '../Container/ProfileScreen';
import HistoryScreen from '../Container/HistoryScreen';
import CreateAppointmentScreen from '../Container/CreateAppointmentScreen';
import ManageAppointmentScreen from '../Container/ManageAppointmentScreen';
import DashboardScreen from '../Container/DashboardScreen';
import BookAppointmentScreen from '../Container/BookAppointmentScreen';
import WelcomeScreen from '../Container/WelcomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({userType}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        initialParams={{user: userType}}
        options={{
          tabBarIcon: () => <MIcons name="dashboard" size={30} />,
        }}
      />
      <Tab.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        initialParams={{user: userType}}
        options={{
          tabBarIcon: () => <MIcons name="history" size={30} />,
        }}
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

function HomeStackScreen({userType}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TabStack" options={{headerShown: false}}>
        {() => <MyTabs userType={userType} />}
      </Stack.Screen>
      <Stack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen
        options={{headerShown: false}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function MainStackNavigation() {
  const [user, setUser] = useState(undefined);
  const [userType, setUserType] = useState(null);

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return () => subscriber(); // Cleanup function
  // }, []);

  function onAuthStateChanged(user) {
    const fetchUserType = async () => {
      try {
        if (auth().currentUser) {
          const userProfileRef = firestore().collection('UserProfile');
          const userSnapshot = await userProfileRef
            .where('uid', '==', auth().currentUser.uid)
            .get();

          if (!userSnapshot.empty) {
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
  }

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
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={
          user ? () => <HomeStackScreen userType={userType} /> : AuthStackScreen
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export {MainStackNavigation, AuthStackScreen};
