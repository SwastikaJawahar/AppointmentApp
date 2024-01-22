import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import SignUpScreen from '../SignUpScreen';
import DashboardScreen from '../DashboardScreen';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async data => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('HomeStackScreen', {screen: 'DashboardScreen'});
      console.log('User Logged in successfully!', response?.user);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        console.error('email', {
          type: 'manual',
          message: 'Invalid email address',
        });
      }
      console.error(error);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate(SignUpScreen);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/36432/doctor-patient-women-clipart-xl.png',
        }}
      />
      <Text testID="initial_login_title" style={styles.title}>
        Login
      </Text>

      <TextInput
        testID="email_input"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        testID="password_input"
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <View style={styles.row}>
        <Text style={styles.text}>Don't have any account? </Text>
        <TouchableOpacity testID="signup_button" onPress={navigateToSignup}>
          <Text style={styles.signupText}>Register</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="login_button"
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 400,
    height: 350,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
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
  signupText: {
    color: '#046665',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});
