import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function ProfileScreen() {
  const currentUser = auth().currentUser;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    userType: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const userRef = firestore()
            .collection('UserProfile')
            .doc(currentUser.uid);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setFormData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              contact: userData.contact || '',
              userType: userData.userType || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitData = async () => {
    try {
      const userObject = {
        userId: currentUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact: formData.contact,
        userType: formData.userType,
        author: 'Swastika',
      };

      const userRef = firestore()
        .collection('UserProfile')
        .doc(currentUser.uid);

      const userDoc = await userRef.get();

      if (userDoc.exists) {
        await userRef.update(userObject);
      } else {
        await userRef.set(userObject);
      }

      Alert.alert('Success', 'User data saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save user data. Please try again.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={text => handleInputChange('firstName', text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={text => handleInputChange('lastName', text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contact No"
          value={formData.contact}
          onChangeText={text => handleInputChange('contact', text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="User Type"
          value={formData.userType}
          onChangeText={text => handleInputChange('userType', text)}
        />
        <TouchableOpacity style={styles.action} onPress={submitData}>
          <Text style={styles.button}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {color: '#046665', fontSize: 16, fontWeight: 'bold'},
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorText: {
    color: 'red',
  },
});
