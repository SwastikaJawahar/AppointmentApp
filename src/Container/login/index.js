import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const Login = () => {
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={{marginLeft: 290, fontSize: 20, color: '#AD40AF'}}>
          Guest
        </Text>

        <Image
          style={{transform: [{rotate: '-5deg'}], marginTop: 10}}
          source={loginImage}
        />
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 10,
          }}>
          Login
        </Text>
        <InputField
          name="email"
          control={control}
          label={'Email ID'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          autoCapitalize="none"
          errors={errors?.email}
          testID="emailInput"
        />

        <InputField
          control={control}
          name="password"
          label={'Password'}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          secureTextEntry
          errors={errors?.password}
          testID="passwordInput"
        />
        <CustomButton
          label={'Login'}
          onPress={handleSubmit(loginSubmit)}
          testID="loginButton"
        />
        <Text style={{textAlign: 'center', color: '#666', marginBottom: 10}}>
          Or, login with ...
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  const facebookCredential =
                    auth.FacebookAuthProvider.credential(data.accessToken);

                  // Sign-in the user with the credential
                  auth()
                    .signInWithCredential(facebookCredential)
                    .then(success => {
                      console.log(success);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
              }
            }}
            onLogoutFinished={() => console.log('logout.')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // marginBottom: 20,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity
            testID="signupButton"
            onPress={() => navigation.navigate('SignUpPage')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  text: {
    marginTop: 90,
  },
  person: {
    marginLeft: 300,
  },
});
