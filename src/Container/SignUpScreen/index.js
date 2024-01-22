import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
const SignUpScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSignup = async () => {
    try {
      console.log('Signup pressed');
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User Account Created!');
      await userCredential.user.updateProfile({
        displayName: name + '=' + selectedUserType,
      });
    } catch {}
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const renderDoctorFields = () => {
    if (selectedUserType === 'doctor') {
      return (
        <>
          <TextInput
            testID="signup_location_input"
            autoCapitalize="none"
            style={styles.input}
            placeholder="Enter your Location"
            onChangeText={text => setLocation(text)}
            value={location}
          />
          <TextInput
            testID="signup_specialty_input"
            autoCapitalize="none"
            style={styles.input}
            placeholder="Enter your Specialty"
            onChangeText={text => setSpecialty(text)}
            value={specialty}
          />
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Image
        style={styles.image}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvr6ZoGWDgvsKxdnJgrQtwZmvYHAwgGsyvpMJR3TvT-SOHhfpqIkgWCk__4hodu3k4stA&usqp=CAU',
        }}
      />
      <TouchableOpacity
        testID="toggle_modal_button"
        style={styles.button}
        onPress={toggleModal}>
        <Text style={styles.buttonText}>Select User Type</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => {
              setSelectedUserType('patient');
              toggleModal();
            }}>
            <Text style={styles.buttonText}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => {
              setSelectedUserType('doctor');
              toggleModal();
            }}>
            <Text style={styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TextInput
        testID="user_type_input"
        style={styles.input}
        value={selectedUserType}
        editable={false}
      />
      <TextInput
        testID="signup_username_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Name"
        onChangeText={text => setName(text)}
        value={name}
      />

      <TextInput
        testID="signup_email_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        testID="signup_password_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TextInput
        testID="signup_contact_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your Contact (Mobile Number)"
        onChangeText={text => setContact(text)}
        value={contact}
      />

      {renderDoctorFields()}
      <View style={styles.row}>
        <TouchableOpacity
          testID="signup_submit_button"
          style={styles.button}
          onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          testID="goto_login"
          style={styles.button}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e3f1f1',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 1,
  },
  image: {
    width: 400,
    height: 150,
    marginTop: -130,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  userTypeButton: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
});

export default SignUpScreen;
