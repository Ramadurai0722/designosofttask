import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RadioButton, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import config from '../../config';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return phone.length === 10;
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !phoneNumber) {
      setSnackbarMessage('All fields are required!');
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

    if (password.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters long!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setSnackbarMessage('Phone number must be 10 digits long!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }

    const userData = { name, email, password, phoneNumber, gender };
    setLoading(true);

    try {
      const response = await fetch(`${config}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbarMessage('Registration Successful!');
        setSnackbarSuccess(true);
        setSnackbarVisible(true);
        navigation.navigate('Login');
      } else {
        setSnackbarMessage(result.message || 'Something went wrong. Please try again.');
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Network error. Please try again later.');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Register</Text>

      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

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

      <View style={styles.inputContainer}>
        <Icon name="phone" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Gender:</Text>
        <View style={styles.radioOptions}>
          <View style={styles.radioButton}>
            <RadioButton
              value="Male"
              status={gender === 'Male' ? 'checked' : 'unchecked'}
              onPress={() => setGender('Male')}
            />
            <Text style={styles.radioOptionText}>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Female"
              status={gender === 'Female' ? 'checked' : 'unchecked'}
              onPress={() => setGender('Female')}
            />
            <Text style={styles.radioOptionText}>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Other"
              status={gender === 'Other' ? 'checked' : 'unchecked'}
              onPress={() => setGender('Other')}
            />
            <Text style={styles.radioOptionText}>Other</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Register</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login</Text>
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
  radioGroup: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  radioOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOptionText: {
    marginLeft: 5,
    fontSize: 16,
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
  eyeIcon: {
    marginLeft: 10, 
  },
  snackbar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
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

export default RegisterScreen;
