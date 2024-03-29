import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Icons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import PubNubScreen from '../PubNubScreen';
import {useNavigation} from '@react-navigation/native';

const DashboardScreen = props => {
  const [appointments, setAppointments] = useState([]);
  const [userType, setUserType] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user type
        const uid = auth().currentUser.uid;
        const userSnapshot = await firestore()
          .collection('UserProfile')
          .doc(uid)
          .get();

        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setUserType(userData.userType);

          const userId = auth().currentUser.uid;
          const appointmentRef = firestore().collection('Appointment');

          let query;
          if (userData.userType === 'doctor') {
            query = appointmentRef
              .where('doctorId', '==', userId)
              .where('status', '==', 'approved');
          } else if (userData.userType === 'patient') {
            query = appointmentRef
              .where('patientId', '==', userId)
              .where('status', 'in', ['approved', 'pending']);
          }

          const unsubscribe = query.onSnapshot(querySnapshot => {
            const appointmentsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setAppointments(appointmentsData);
          });

          // Unsubscribe when component unmounts
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching user type or appointments:', error);
      }
    };

    if (auth().currentUser) {
      fetchData();
    }
  }, []);

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity style={styles.appointmentItem}>
      <Text
        style={styles.appointmentText}>{`Patient: ${item.patientName}`}</Text>
      <Text style={styles.appointmentText}>{`Doctor: ${item.doctorName}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Date: ${item.appointmentDate}, Time: ${item.appointmentTime}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Custom Message: ${item.customMessage}`}</Text>
      <Text style={styles.appointmentText}>{`Status: ${item.status}`}</Text>
      {item.status === 'approved' && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => handleChat(item, userType)}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User Logged Out Successfully');
      props.navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleChat = (user, userType) => {
    navigation.navigate('ChatScreen', {user, userType});
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.logout}>
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleLogout}>
          <Icons name="logout" size={40} />
        </TouchableOpacity>
      </View> */}
      <View style={styles.container}>
        <FlatList
          style={styles.FlatList}
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={<Text>No upcoming appointments</Text>}
        />
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  chatButton: {
    width: '50%',
    backgroundColor: '#046665',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  FlatList: {
    width: '100%',
    marginHorizontal: 16,
    marginLeft: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  appointmentItem: {
    width: '150%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  appointmentName: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 8,
    // fontWeight: 'bold',
  },
  TouchableOpacity: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    width: '80%',
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logout: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: '80%',
    paddingBottom: 600,
  },
});
