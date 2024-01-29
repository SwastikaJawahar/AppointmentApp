import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';

const CreateAppointmentScreen = props => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [viewProfileModalVisible, setViewProfileModalVisible] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    // Load all doctors initially
    loadAllDoctors();
  }, []);

  const getDoctorDataById = async (doctorId, collectionName) => {
    try {
      const doctorDataRef = firestore().collection(collectionName);
      const querySnapshot = await doctorDataRef
        .where('uid', '==', doctorId)
        .get();

      const doctorData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return doctorData;
    } catch (error) {
      console.log(
        `Error fetching ${collectionName} for doctor ID ${doctorId}:`,
        error,
      );
    }
  };
  const loadAllDoctors = async () => {
    try {
      const doctorsRef = firestore().collection('UserProfile');
      const query = doctorsRef.where('userType', '==', 'doctor');
      const results = await query.get();

      const doctors = results.docs.map(doc => {
        return {id: doc.id, ...doc.data()};
      });

      setAllDoctors(doctors);
      setSearchResults(doctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };
  useEffect(() => {
    searchDoctors();
  }, [searchText]);

  const searchDoctors = () => {
    const filteredDoctors = allDoctors.filter(doctor =>
      doctor.specialty.toLowerCase().includes(searchText.toLowerCase()),
    );
    setSearchResults(filteredDoctors);
  };
  const viewDoctorProfile = async doctor => {
    try {
      const userProfile = await getDoctorDataById(doctor.uid, 'UserProfile');
      const qualifications = await getDoctorDataById(
        doctor.uid,
        'Qualification',
      );
      const experiences = await getDoctorDataById(doctor.uid, 'Experience');

      const doctorProfile = {
        userProfile,
        qualifications,
        experiences,
      };

      console.log(doctorProfile.userProfile);
      console.log(doctorProfile.qualifications);
      console.log(doctorProfile.experiences);

      setDoctorProfile(doctorProfile);
      setViewProfileModalVisible(true);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };
  const renderDoctorItem = ({item}) => (
    <View style={styles.renderDoctorItem}>
      <TouchableOpacity
        style={styles.doctorItem}
        onPress={() => setSelectedDoctor(item)}>
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={styles.doctorDetails}>{item.specialty}</Text>
            <Text style={styles.doctorDetails}>{item.location}</Text>
            <Text style={styles.doctorDetails}>{item.contact}</Text>
          </View>
          <View style={styles.rightContent}>
            <TouchableOpacity onPress={() => viewDoctorProfile(item)}>
              <MIcons
                style={styles.Icon}
                name="person-search"
                size={50}
                color={'#046665'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.appointmentButton}
          onPress={() => {
            setSelectedDoctor(item);
            props.navigation.navigate('BookAppointmentScreen', {
              setSelectedDoctor: selectedDoctor,
            });
            // setModalVisible(true);
          }}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Speciality"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
      <FlatList
        style={styles.FlatList}
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderDoctorItem}
        ListEmptyComponent={<Text>No doctors found</Text>}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewProfileModalVisible}
        onRequestClose={() => setViewProfileModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Icons
            style={styles.icon}
            name="close"
            onPress={() => setViewProfileModalVisible(false)}
            color={'#046665'}
            size={40}
          />
          <Text style={styles.modalHeading}>Doctor's Profile</Text>
          {doctorProfile && (
            <View>
              <Text style={styles.doctorDetails}>
                Name: {doctorProfile.userProfile[0]?.name}
              </Text>
              <Text style={styles.doctorDetails}>
                Speciality: {doctorProfile.userProfile[0]?.specialty}
              </Text>
              <Text style={styles.doctorDetails}>
                Contact: {doctorProfile.userProfile[0]?.contact}
              </Text>
              <Text style={styles.modalSubHeading}>Qualifications:</Text>
              {doctorProfile.qualifications.map((qualification, index) => (
                <Text style={styles.doctorDetails} key={index}>
                  {qualification?.degreeName}
                </Text>
              ))}
              <Text style={styles.modalSubHeading}>Experiences:</Text>
              {doctorProfile.experiences.map((experience, index) => (
                <View>
                  <Text style={styles.doctorDetails} key={index}>
                    {experience?.clinic}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  FlatList: {
    width: '100%',
    marginLeft: 70,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    // marginLeft: 30,
    flex: 1,
  },
  searchInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  renderDoctorItem: {
    flexDirection: 'row',
  },
  doctorItem: {
    width: '80%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  doctorDetails: {
    fontSize: 20,
    marginBottom: 8,
  },
  appointmentButton: {
    backgroundColor: '#046665',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  icon: {
    marginLeft: '80%',
    marginBottom: 10,
  },
  modalHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalSubHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateAppointmentScreen;
