import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const BookAppointmentScreen = props => {
  const [date_time, setDate_time] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const selectedDoctor = props.route.params.setSelectedDoctor;
  console.log(selectedDoctor, 'doctor');
  const [customMessage, setCustomMessage] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const formatDate = date => moment(date).format('MM/DD/YYYY');
  const formatTime = time => moment(time).format('HH:mm');

  const toggleModal = selectedDate => {
    setModalVisible(!isModalVisible);
    setAppointmentDate(selectedDate);
  };

  const toggleTimeModal = selectedTime => {
    setTimeModalVisible(!isTimeModalVisible);
    setAppointmentTime(selectedTime);
  };
  const handleDateChange = selectedDate => {
    setModalVisible(false);
    setDate_time(selectedDate);
  };
  const handleTimeChange = selectedTime => {
    setTimeModalVisible(false);
    // Handle the selected time as needed
  };
  function handleClose() {
    props.navigation.pop();
  }
  console.log(appointmentDate, appointmentTime);
  const requestAppointment = async () => {
    try {
      const userId = auth().currentUser.uid;
      const userName = auth().currentUser.displayName;
      console.log(userName, 'name');
      console.log(formatDate, 'date');
      console.log(formatTime, 'time');
      const appointmentRef = firestore().collection('Appointment');

      // Add the appointment record
      await appointmentRef.add({
        doctorId: selectedDoctor.id,
        patientId: userId,
        patientName: userName,
        doctorName: selectedDoctor.name,
        appointmentDate: formatDate(appointmentDate),
        appointmentTime: formatTime(appointmentTime),
        customMessage,
        status: 'pending',
      });
      Alert.alert('Appointment Booked Successfully.!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error requesting appointment:', error);
    }
  };
  return (
    <SafeAreaView styles={styles.container}>
      <View style={styles.View}>
        <Icon
          style={styles.icon}
          name="close"
          onPress={handleClose}
          size={40}
          color={'#046665'}
        />
        <TouchableOpacity onPress={() => toggleModal(date_time)}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Appointment Date</Text>
            <TextInput
              style={styles.input}
              value={formatDate(date_time)}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        <Modal
          style={styles.modal}
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode={'date'}
              date={date_time}
              onDateChange={handleDateChange}
              minimumDate={new Date()}
              minuteInterval={5}
            />
          </View>
        </Modal>
        <TouchableOpacity onPress={() => toggleTimeModal(date_time)}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Appointment Time</Text>
            <TextInput
              style={styles.input}
              value={formatTime(date_time)}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        <Modal
          style={styles.modal}
          visible={isTimeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setTimeModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setTimeModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode={'time'}
              date={date_time}
              onDateChange={handleTimeChange}
              minuteInterval={5}
            />
          </View>
        </Modal>
        <Text style={styles.messageTitle}>Custom Message</Text>
        <TextInput
          style={styles.messageInput}
          onChangeText={text => setCustomMessage(text)}
          placeholder="Enter Custom Message"
          value={customMessage}
        />
        <TouchableOpacity
          style={styles.modalButton}
          onPress={requestAppointment}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default BookAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '30%',
    marginTop: 40,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: '30%',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#046665',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  messageInput: {
    height: 40,
    width: '80%',
    borderColor: '#046665',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 40,
  },
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 1,
  },
  icon: {
    marginLeft: '89%',
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
