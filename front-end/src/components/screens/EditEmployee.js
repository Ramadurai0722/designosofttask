import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RadioButton, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../config';

const EditEmployeeScreen = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${config}/employees/get/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching employee data: ${errorText}`);
        }

        const responseData = await response.json();
        if (responseData) {
          setEmployee(responseData);
        } else {
          console.error('No employee data received');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setSnackbarMessage('Error fetching employee data');
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleUpdate = async () => {
    if (
      !employee.name ||
      !employee.email ||
      !employee.gender ||
      !employee.age ||
      !employee.role ||
      !employee.phoneNumber ||
      !employee.joiningDate
    ) {
      setSnackbarMessage('All fields are required!');
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${config}/employees/update/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employee),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        setSnackbarMessage('Employee updated successfully!');
        setSnackbarSuccess(true);
        setSnackbarVisible(true);
        navigation.goBack();
      } else {
        setSnackbarMessage(`Error: ${responseData.message || 'An unknown error occurred'}`);
        setSnackbarSuccess(false);
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setSnackbarMessage(`Error: ${error.message || 'An error occurred'}`);
      setSnackbarSuccess(false);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />;
  }

  if (!employee) {
    return <Text>No employee data found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Employee</Text>

      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={employee.name}
          onChangeText={(text) => setEmployee({ ...employee, name: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={employee.email}
          onChangeText={(text) => setEmployee({ ...employee, email: text })}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="phone" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={employee.phoneNumber}
          onChangeText={(text) => setEmployee({ ...employee, phoneNumber: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="calendar-today" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Joining Date (MM/DD/YYYY)"
          value={employee.joiningDate}
          onChangeText={(text) => setEmployee({ ...employee, joiningDate: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="date-range" size={24} color="#6200EE" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={employee.age}
          onChangeText={(text) => setEmployee({ ...employee, age: text })}
          keyboardType="numeric"
        />
      </View>

      {/* Gender Radio Buttons */}
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Gender:</Text>
        <View style={styles.radioOptions}>
          <View style={styles.radioButton}>
            <RadioButton
              value="Male"
              status={employee.gender === 'Male' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, gender: 'Male' })}
            />
            <Text style={styles.radioOptionText}>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Female"
              status={employee.gender === 'Female' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, gender: 'Female' })}
            />
            <Text style={styles.radioOptionText}>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Other"
              status={employee.gender === 'Other' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, gender: 'Other' })}
            />
            <Text style={styles.radioOptionText}>Other</Text>
          </View>
        </View>
      </View>

      {/* Role Radio Buttons */}
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Role:</Text>
        <View style={styles.radioOptions}>
          <View style={styles.radioButton}>
            <RadioButton
              value="Developer"
              status={employee.role === 'Developer' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, role: 'Developer' })}
            />
            <Text style={styles.radioOptionText}>Developer</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Designer"
              status={employee.role === 'Designer' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, role: 'Designer' })}
            />
            <Text style={styles.radioOptionText}>Designer</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="Tester"
              status={employee.role === 'Tester' ? 'checked' : 'unchecked'}
              onPress={() => setEmployee({ ...employee, role: 'Tester' })}
            />
            <Text style={styles.radioOptionText}>Tester</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>Update Employee</Text>
      </TouchableOpacity>

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
    width: '100%',
  },
  snackbarSuccess: {
    backgroundColor: 'green',
  },
  snackbarError: {
    backgroundColor: 'red',
  },
  loader: {
    marginBottom: 20,
  },
});

export default EditEmployeeScreen;
