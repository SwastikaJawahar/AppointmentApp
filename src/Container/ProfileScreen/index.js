import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';

const data = [
  {label: 'Patient', value: 'Patient'},
  {label: 'Doctor', value: 'Doctor'},
];

function ProfileScreen() {
  const currentUser = auth().currentUser;
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

  const [qualificationModalVisible, setQualificationModalVisible] =
    useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [degreeName, setDegreeName] = useState('');
  const [institute, setInstitute] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [clinic, setClinic] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);

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
    const fetchQualifications = async () => {
      try {
        const uid = auth().currentUser.uid;
        const qualificationRef = firestore()
          .collection('Qualification')
          .where('uid', '==', uid);

        qualificationRef.onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push({id: doc.id, ...doc.data()});
          });
          setQualifications(data);
        });
      } catch (error) {
        console.error('Error fetching qualifications:', error);
      }
    };

    const fetchExperiences = async () => {
      try {
        const uid = auth().currentUser.uid;
        const experienceRef = firestore()
          .collection('Experience')
          .where('uid', '==', uid);

        experienceRef.onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push({id: doc.id, ...doc.data()});
          });
          setExperiences(data);
        });
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchUserProfile();
    fetchQualifications();
    fetchExperiences();
  }, []);

  const renderDoctorFields = () => {
    if (userProfile.userType === 'doctor') {
      return (
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
        </View>
      );
    }
    return null;
  };

  const renderQualificationsAndExperiences = () => {
    if (userProfile.userType === 'doctor') {
      return (
        <View>
          <View style={styles.inputContainer}>
            <FlatList
              style={styles.FlatList}
              contentContainerStyle={{flexGrow: 1}}
              data={qualifications}
              keyExtractor={item => item.id}
              ListHeaderComponent={() => (
                <View style={styles.listView}>
                  <View style={styles.listItem}>
                    <Text style={styles.subHeading}>Degree</Text>
                    <Text style={styles.subHeading}>Institute</Text>
                    <Text style={styles.subHeading}>Year</Text>
                  </View>
                  {qualifications.map(item => (
                    <View style={styles.listItem} key={item.id}>
                      <Text>{item.degreeName}</Text>
                      <Text>{item.institute}</Text>
                      <Text>{item.passingYear}</Text>
                    </View>
                  ))}
                </View>
              )}
            />
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity
                onPress={() => setQualificationModalVisible(true)}>
                <Icon
                  style={styles.Icon}
                  name="addfile"
                  size={30}
                  color={'#046665'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteQualification(item.id)}>
                <Icon
                  style={styles.Icon}
                  name="delete"
                  size={30}
                  color={'#046665'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <FlatList
              style={styles.FlatList}
              contentContainerStyle={{flexGrow: 1}}
              data={experiences}
              keyExtractor={item => item.id}
              ListHeaderComponent={() => (
                <View style={styles.listView}>
                  <View style={styles.listItem}>
                    <Text style={styles.subHeading}>Clinic</Text>
                    <Text style={styles.subHeading}>StartYear</Text>
                    <Text style={styles.subHeading}>EndYear</Text>
                  </View>
                  {experiences.map(item => (
                    <View style={styles.listItem} key={`header_${item.id}`}>
                      <Text>{item.clinic}</Text>
                      <Text>{item.startYear}</Text>
                      <Text>{item.endYear}</Text>
                      <Text>{item.description}</Text>
                    </View>
                  ))}
                </View>
              )}
            />
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity onPress={() => setExperienceModalVisible(true)}>
                <Icon
                  style={styles.Icon}
                  name="addfile"
                  size={30}
                  color={'#046665'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setExperienceModalVisible(true)}>
                <Icon
                  style={styles.Icon}
                  name="delete"
                  size={30}
                  color={'#046665'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };
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
          // qualification: userProfile.qualification,
          // experience: userProfile.experience,
        });
      }

      console.log('User profile updated successfully!');
      Alert.alert('User Updated Successfully.!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  const handleAddQualification = async () => {
    try {
      const uid = auth().currentUser.uid;
      await firestore().collection('Qualification').add({
        uid,
        degreeName,
        institute,
        passingYear,
      });
      setQualificationModalVisible(false);
    } catch (error) {
      console.error('Error adding qualification:', error);
    }
  };

  const handleAddExperience = async () => {
    try {
      const uid = auth().currentUser.uid;
      await firestore().collection('Experience').add({
        uid,
        clinic,
        startYear,
        endYear,
        description,
      });
      setExperienceModalVisible(false);
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleDeleteQualification = async qualificationId => {
    try {
      console.log('Delete Qualification triggered', qualificationId);
      await firestore()
        .collection('Qualification')
        .doc(qualificationId)
        .delete();
    } catch (error) {
      console.error('Error deleting qualification:', error);
    }
  };

  const handleDeleteExperience = async experienceId => {
    try {
      console.log('Delete Experience triggered', experienceId);
      await firestore().collection('Experience').doc(experienceId).delete();
    } catch (error) {
      console.error('Error deleting experience:', error);
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
          autoCapitalize="none"
          onChangeText={text => setUserProfile({...userProfile, email: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contact No"
          value={userProfile.contact}
          onChangeText={text => setUserProfile({...userProfile, contact: text})}
        />

        {renderDoctorFields()}

        {renderQualificationsAndExperiences()}

        <TouchableOpacity style={styles.action} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={qualificationModalVisible}
          onRequestClose={() => setQualificationModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.subHeading}>Add Qualification</Text>
                <TouchableOpacity
                  onPress={() => setQualificationModalVisible(false)}>
                  <Icon
                    style={styles.closeIcon}
                    name="close"
                    size={30}
                    color={'#046665'}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Degree Name"
                value={degreeName}
                onChangeText={text => setDegreeName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Institute"
                value={institute}
                onChangeText={text => setInstitute(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Passing Year"
                value={passingYear}
                onChangeText={text => setPassingYear(text)}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddQualification}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Experience Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={experienceModalVisible}
          onRequestClose={() => setExperienceModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.subHeading}>Add Experience</Text>
                <TouchableOpacity
                  onPress={() => setQualificationModalVisible(false)}>
                  <Icon
                    style={styles.closeIcon}
                    name="close"
                    size={30}
                    color={'#046665'}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Clinic"
                value={clinic}
                onChangeText={text => setClinic(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Start Year"
                value={startYear}
                onChangeText={text => setStartYear(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="End Year"
                value={endYear}
                onChangeText={text => setEndYear(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={text => setDescription(text)}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddExperience}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setExperienceModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  FlatList: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  Icon: {
    marginRight: 15,
    marginTop: 5,
  },
  closeIcon: {
    marginLeft: 110,
    marginBottom: 20,
  },
  addButton: {color: '#046665', fontSize: 16, fontWeight: 'bold'},
  subHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#046665',
    paddingVertical: 12,
    width: '50%',
    paddingHorizontal: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listView: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Adjust as needed
    justifyContent: 'flex-start',
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
