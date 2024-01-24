import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Platform,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CreateAppointmentScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      console.log('Calling Search Doctors');
      searchDoctors();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const searchDoctors = async () => {
    try {
      const doctorsRef = firestore().collection('UserProfile');
      const query = doctorsRef
        .where('userType', '==', 'doctor')
        .where('specialty', '==', searchText);
      console.log('Search Query:', searchText);
      const results = await query.get();

      const doctors = results.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });
      console.log('Doctors Found:', doctors);
      setSearchResults(doctors);
    } catch (error) {
      console.error('Error searching for doctors:', error);
    }
  };

  const requestAppointment = async () => {
    try {
      const userId = auth().currentUser.uid;
      const appointmentRef = firestore().collection('Appointment');

      // Add the appointment record
      await appointmentRef.add({
        doctorId: selectedDoctor.id,
        patientId: userId,
        appointmentDate,
        appointmentTime,
        customMessage,
        status: 'pending',
      });

      setModalVisible(false);
    } catch (error) {
      console.error('Error requesting appointment:', error);
    }
  };

  const renderDoctorItem = ({item}) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => setSelectedDoctor(item)}>
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorDetails}>{item.speciality}</Text>
      <Text style={styles.doctorDetails}>{item.location}</Text>
      <Text style={styles.doctorDetails}>{item.contact}</Text>
      <TouchableOpacity
        style={styles.appointmentButton}
        onPress={() => {
          setSelectedDoctor(item);
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Speciality"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderDoctorItem}
        ListEmptyComponent={<Text>No doctors found</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Request Appointment</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Appointment Time"
            value={appointmentTime}
            onChangeText={text => setAppointmentTime(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Custom Message"
            value={customMessage}
            onChangeText={text => setCustomMessage(text)}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={requestAppointment}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  DatePicker: {
    elevation: 2,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  doctorItem: {
    width: '80%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doctorDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  appointmentButton: {
    backgroundColor: '#046665',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  modalButton: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
});

export default CreateAppointmentScreen;
