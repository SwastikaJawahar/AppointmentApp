import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
const DashboardScreen = props => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User Logged Out Successfully');
      props.navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logout}>
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={handleLogout}>
          <Text style={styles.buttonText}>LogOut</Text>
        </TouchableOpacity>
      </View>
      <Text>Dashboard </Text>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f1f1',
  },
  TouchableOpacity: {
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
  logout: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 100,
  },
});
