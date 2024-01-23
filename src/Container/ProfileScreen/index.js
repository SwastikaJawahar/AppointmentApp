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
import {Dropdown} from 'react-native-element-dropdown';

const data = [
  {label: 'Patient', value: 'Patient'},
  {label: 'Doctor', value: 'Doctor'},
];

function ProfileScreen() {
  const currentUser = auth().currentUser;
  const [dropVal, setDropVal] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    userType: '',
    speciality: '',
    location: '',
  });

  const renderLabel = () => {
    if (dropVal || isFocus) {
      const selectedLabel = data.find(item => item.value === dropVal)?.label;
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          {selectedLabel || 'Select User Type'}
        </Text>
      );
    }
    return null;
  };

  useEffect(() => {
    // Logic to handle immediate rendering when dropVal changes
    if (dropVal === 'Doctor') {
      setFormData({
        ...formData,
        userType: 'Doctor', // Ensure userType is updated immediately
      });
    } else {
      setFormData({
        ...formData,
        userType: dropVal,
        speciality: '', // Reset speciality when userType changes
        location: '', // Reset location when userType changes
      });
    }
  }, [dropVal]);

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
              speciality: userData.speciality || '',
              location: userData.location || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);
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
        speciality: formData.speciality,
        location: formData.location,
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
        <View>
          {renderLabel()}
          <Dropdown
            style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select User Type' : '...'}
            value={dropVal}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setDropVal(item.value);
              setIsFocus(false);
            }}
          />
        </View>
        {formData.userType === 'Doctor' && (
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Speciality"
              value={formData.speciality}
              onChangeText={text => handleInputChange('speciality', text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="location"
              value={formData.location}
              onChangeText={text => handleInputChange('location', text)}
            />
          </View>
        )}
        <TouchableOpacity style={styles.action} onPress={submitData}>
          <Text style={styles.buttonText}>Save</Text>
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
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
  },
  dropdown: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginLeft: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  action: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    width: '50%',
    paddingHorizontal: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});
