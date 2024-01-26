import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
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

  const [customMessage, setCustomMessage] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDateChange = selectedDate => {
    setModalVisible(false);
    setDate_time(selectedDate);
  };
  const date = date => {
    return moment(date).format('MMMM Do YYYY');
  };
  const time = time => {
    return moment(time).format('hh:mm');
  };

  function handleClose() {
    props.navigation.pop();
  }
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
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Appointment Date</Text>
            <TextInput
              style={styles.input}
              value={moment(date_time).format('MMMM Do YYYY')}
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
  input: {
    height: 40,
    width: '80%',
    borderColor: '#046665',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
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
