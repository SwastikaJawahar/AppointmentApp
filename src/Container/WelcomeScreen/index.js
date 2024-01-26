import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LoginScreen from '../LoginScreen';

const WelcomeScreen = props => {
  function handleButton() {
    props.navigation.navigate('LoginScreen');
  }
  return (
    <View style={styles.container}>
      <Image source={require('../../Assets/logo.png')} style={styles.image} />
      <Text style={styles.text}>There is no greater wealth than wisdom,</Text>
      <Text style={styles.text}>No greater poverty than ignorance;</Text>
      <Text style={styles.text}>No greater heritage than culture</Text>
      <Text style={styles.text}>and no greater support than consultation.</Text>
      <Image source={require('../../Assets/image.png')} style={styles.images} />
      <TouchableOpacity
        testID="login_button"
        style={styles.button}
        onPress={handleButton}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f1f1',
  },
  button: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    width: '60%',
    paddingHorizontal: 70,
    borderRadius: 12,
    marginLeft: 80,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 140,
    height: 100,
    marginTop: 10,
    marginLeft: '30%',
    marginBottom: 20,
  },
  images: {
    width: 370,
    height: 310,
    marginLeft: 20,
  },
  text: {
    marginTop: 1,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
