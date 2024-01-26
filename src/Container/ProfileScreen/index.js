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
  const [userProfile, setUserProfile] = useState({
    contact: '',
    email: '',
    location: '',
    name: '',
    specialty: '',
    qualification: '',
    experience: '',
    userType: '',
  });

  const [qualifications, setQualifications] = useState(
    userProfile.qualification || [],
  );
  const [experience, setExperience] = useState(userProfile.experience || []);
  const [newQualification, setNewQualification] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const renderLabel = () => {
    if (dropVal || isFocus) {
      // const selectedLabel = data.find(item => item.value === dropVal)?.label;
      // return <Text style={[styles.label, isFocus && {color: 'blue'}]}></Text>;
    }
    return null;
  };
  const addQualification = () => {
    if (newQualification.trim() !== '') {
      setQualifications([...qualifications, newQualification]);
      setNewQualification('');
    }
  };

  const deleteQualification = index => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };
  useEffect(() => {
    // Fetch user profile information from Firestore
    const fetchUserProfile = async () => {
      try {
        const uid = auth().currentUser.uid;
        const userProfileRef = firestore().collection('UserProfile');
        const userSnapshot = await userProfileRef.where('uid', '==', uid).get();

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);
  const handleSaveProfile = async () => {
    // Save the updated profile back to Firestore
    try {
      const uid = auth().currentUser.uid;
      const userProfileRef = firestore().collection('UserProfile');
      const userSnapshot = await userProfileRef.where('uid', '==', uid).get();

      if (userProfile.userType === 'patient') {
        // Update only patient-specific fields
        await userProfileRef.doc(userSnapshot.docs[0].id).update({
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.contact,
        });
      } else if (userProfile.userType === 'doctor') {
        // Update only doctor-specific fields
        await userProfileRef.doc(userSnapshot.docs[0].id).update({
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.contact,
          location: userProfile.location,
          specialty: userProfile.specialty,
          qualification: userProfile.qualification,
          experience: userProfile.experience,
        });
      }

      console.log('User profile updated successfully!');
      Alert.alert('User Updated Successfully.!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Name"
          value={userProfile.name}
          onChangeText={text => setUserProfile({...userProfile, name: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter email"
          value={userProfile.email}
          onChangeText={text => setUserProfile({...userProfile, email: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contact No"
          value={userProfile.contact}
          onChangeText={text => setUserProfile({...userProfile, contact: text})}
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
        {userProfile.userType === 'doctor' && (
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="specialty"
              value={userProfile.specialty}
              onChangeText={text =>
                setUserProfile({...userProfile, specialty: text})
              }
            />
            <TextInput
              style={styles.textInput}
              placeholder="location"
              value={userProfile.location}
              onChangeText={text =>
                setUserProfile({...userProfile, location: text})
              }
            />
            <Text style={styles.label}>Qualifications:</Text>
            {qualifications.map((qualification, index) => (
              <View key={index}>
                <Text>{qualification}</Text>
                <TouchableOpacity onPress={() => deleteQualification(index)}>
                  <Text style={styles.button}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            {/* Text input for adding new qualification */}
            <TextInput
              style={styles.textInput}
              placeholder="Add Qualification"
              value={newQualification}
              onChangeText={text => setNewQualification(text)}
            />
            <TouchableOpacity onPress={addQualification}>
              <Text style={styles.button}>Add Qualification</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Experience"
              value={userProfile.experience}
              onChangeText={text =>
                setUserProfile({...userProfile, experience: text})
              }
            />
          </View>
        )}
        <TouchableOpacity style={styles.action} onPress={handleSaveProfile}>
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
    paddingVertical: 12,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});
