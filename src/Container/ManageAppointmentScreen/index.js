import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icons from 'react-native-vector-icons/Ionicons';

const ManageAppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch appointments with status "pending" for the logged-in doctor
    const doctorId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection('Appointment')
      .where('doctorId', '==', doctorId)
      .where('status', '==', 'pending')
      .onSnapshot(querySnapshot => {
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsData);
      });

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, [auth().currentUser]);

  const handleAction = async status => {
    try {
      if (selectedAppointment) {
        // Update appointment status and remove from the list
        await firestore()
          .collection('Appointment')
          .doc(selectedAppointment.id)
          .update({
            status: status,
          });
        if (status === 'approved') {
          Alert.alert('Appointment is Approved Successfully.!');
        } else {
          Alert.alert('Appointment is Rejected Successfully.!');
        }
        // Close the modal
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const renderAppointmentItem = ({item}) => (
    <TouchableOpacity
      style={styles.appointmentItem}
      onPress={() => {
        setSelectedAppointment(item);
        setModalVisible(true);
      }}>
      <Text
        style={styles.appointmentName}>{`Patient: ${item.patientName}`}</Text>
      <Text
        style={
          styles.appointmentText
        }>{`Date: ${item.appointmentDate}, Time: ${item.appointmentTime}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.FlatList}
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointmentItem}
        ListEmptyComponent={<Text>No pending appointments</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Icons
            style={styles.icon}
            name="close"
            onPress={() => setModalVisible(false)}
            color={'#046665'}
            size={40}
          />
          <Text style={styles.modalHeading}>Appointment Details</Text>
          <Text
            style={
              styles.modalText
            }>{`Patient: ${selectedAppointment?.patientName}`}</Text>
          <Text
            style={
              styles.modalText
            }>{`Date: ${selectedAppointment?.appointmentDate}, Time: ${selectedAppointment?.appointmentTime}`}</Text>
          <Text
            style={
              styles.appointmentName
            }>{`Message: ${selectedAppointment?.customMessage}`}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleAction('approved')}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonReject}
              onPress={() => handleAction('rejected')}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  icon: {
    marginLeft: '80%',
    marginBottom: 10,
  },
  FlatList: {
    width: '100%',
    marginHorizontal: 16,
    marginLeft: 70,
    marginTop: 16,
    marginBottom: 16,
  },
  appointmentItem: {
    width: '80%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#046665',
  },
  modalButtonReject: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
