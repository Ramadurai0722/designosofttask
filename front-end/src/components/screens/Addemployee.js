import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RadioButton, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import config from '../../config';

const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('Developer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          navigation.navigate('Login');
        } else {
          setAdminId(userId);
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    checkUser();
  }, [navigation]);

  const handleSubmit = async () => {
    if (
      !name ||
      !email ||
      !gender ||
      !age ||
      !role ||
      !phoneNumber ||
      !joiningDate ||
      !adminId
    ) {
      setSnackbarMessage('All fields are required!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(joiningDate)) {
      setSnackbarMessage('Invalid date format. Please use MM/DD/YYYY.');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('You must be logged in to add an employee.');
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
        return;
      }
  
      console.log("Sending data to API:", {
        name,
        email,
        gender,
        age,
        role,
        phoneNumber,
        joiningDate,
        adminId
      });
  
      const response = await fetch(`${config}/employees/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({
          name,
          email,
          gender,
          age,
          role,
          phoneNumber,
          joiningDate,
          adminId,
        }),
      });
  
      const responseData = await response.json();  

      if (response.status === 201) {
        setSnackbarMessage('Employee added successfully!');
        setSnackbarSuccess(true);
        setSnackbarVisible(true);

        setName('');
        setEmail('');
        setGender('Male');
        setAge('');
        setRole('Developer');
        setPhoneNumber('');
        setJoiningDate('');
        
        navigation.navigate('Addemployee');  
      } else {
        setSnackbarMessage(`Error: ${responseData.message || 'An unknown error occurred'}`);
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error adding employee:', error); 
      setSnackbarMessage(`Error: ${error.message || 'An error occurred'}`);
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Employee</Text>

      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
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
        <Icon name="phone" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="calendar-today" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Joining Date (MM/DD/YYYY)"
          value={joiningDate}
          onChangeText={setJoiningDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="date-range" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Role:</Text>
        <View style={styles.radioOptions}>
          <View style={styles.radioButton}>
            <RadioButton
              value="Developer"
              status={role === 'Developer' ? 'checked' : 'unchecked'}
              onPress={() => setRole('Developer')}
            />
            <Text style={styles.radioOptionText}>Developer</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Designer"
              status={role === 'Designer' ? 'checked' : 'unchecked'}
              onPress={() => setRole('Designer')}
            />
            <Text style={styles.radioOptionText}>Designer</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Tester"
              status={role === 'Tester' ? 'checked' : 'unchecked'}
              onPress={() => setRole('Tester')}
            />
            <Text style={styles.radioOptionText}>Tester</Text>
          </View>
        </View>
      </View>

      {/* Gender Radio Buttons */}
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
          <Text style={styles.submitButtonText}>Add Employee</Text>
        </TouchableOpacity>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={[styles.snackbar, snackbarSuccess ? styles.snackbarSuccess : styles.snackbarError]}
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
    marginBottom: 10,
  },
  radioOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOptionText: {
    fontSize: 16,
    marginLeft: 5,
  },
  loader: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width:'100%',
  },
  snackbarSuccess: {
    backgroundColor: 'green',
  },
  snackbarError: {
    backgroundColor: 'red',
  },
});

export default AddEmployeeScreen;
