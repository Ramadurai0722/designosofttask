import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setSnackbarMessage('Both fields are required!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setSnackbarMessage('Please enter a valid email address!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }
    setLoading(true);
  
    try {
      const response = await fetch(`${config}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

    //   console.log("Login result: ", result);
  
      if (response.ok) {
        if (result.userId && result.token && result.username) {
          await AsyncStorage.setItem('userId', result.userId);
          await AsyncStorage.setItem('token', result.token);
          await AsyncStorage.setItem('username', result.username);
  
          setSnackbarMessage('Login Successful!');
          setSnackbarSuccess(true);
          setSnackbarVisible(true);
          navigation.navigate('Home');
        } else {

          setSnackbarMessage('Missing data in response. Please try again.');
          setSnackbarSuccess(false);
          setSnackbarVisible(true);
        }
      } else {
        setSnackbarMessage(result.message || 'Invalid email or password!');
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Login error: ", error);
      setSnackbarMessage('Network error. Please try again later.');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} 
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon 
            name={passwordVisible ? "visibility" : "visibility-off"} 
            size={24} 
            color="#6200EE" 
            style={styles.eyeIcon} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Register</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={[
          styles.snackbar,
          snackbarSuccess ? styles.snackbarSuccess : styles.snackbarError,
        ]}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', 
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200EE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6200EE',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    borderColor: '#6200EE',
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10, 
  },
  loader: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
  },
  footerLink: {
    fontSize: 16,
    color: '#6200EE',
  },
  snackbar: {
    position: 'absolute',
    bottom: 10,
    borderRadius: 4,
    padding: 2,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
  snackbarSuccess: {
    backgroundColor: '#4caf50', 
  },
  snackbarError: {
    backgroundColor: '#f44336', 
  },
});

export default LoginScreen;
