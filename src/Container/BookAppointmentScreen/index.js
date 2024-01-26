import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

const BookAppointmentScreen = () => {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [date_time, setDate_time] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const date = date => {
    return moment(date).format('MMMM Do YYYY');
  };
  //   const time = time => {
  //     return moment(time).format('hh:mm');
  //   };

  return (
    <SafeAreaView styles={styles.container}>
      <View styles={styles.View}>
        <TouchableWithoutFeedback
          onPress={() => {
            setStartOpen(true);
          }}>
          <View style={styles.textContainer}>
            <Text>Appointment Date</Text>
            {/* <Text>{date(date_time)}</Text> */}
          </View>
        </TouchableWithoutFeedback>
        {startOpen && (
          <DateTimePicker
            mode={'date'}
            date={date_time}
            onDateChange={setDate_time}
            isVisible={startOpen}
            onCancel={() => {
              setStartOpen(false);
            }}
            onConfirm={selectedDate => {
              setStartOpen(false);
              setDate_time(selectedDate);
            }}
            minimumDate={new Date()} // Optional: Set a minimum date if needed
            minuteInterval={5}
          />
        )}
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
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
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
