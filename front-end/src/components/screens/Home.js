import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import config from '../../config';

const HomeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserNameAndEmployees = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        const username = await AsyncStorage.getItem('username');

        if (userId && token && username) {
          setUserName(username);

          const employeeData = await fetch(`${config}/employees/getAll`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!employeeData.ok) {
            throw new Error(`Error fetching employee data: ${employeeData.statusText}`);
          }

          const employeeJson = await employeeData.json();
          setEmployees(employeeJson);
        } else {
          throw new Error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNameAndEmployees();
  }, [employees]);

  const handleDelete = (employeeId) => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const token = await AsyncStorage.getItem('token');
            try {
              const response = await fetch(`${config}/employees/delete/${employeeId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              const responseData = await response.json();
              if (response.status === 200) {
                Alert.alert('Success', responseData.message);
                setEmployees(employees.filter(emp => emp._id !== employeeId));
              } else {
                Alert.alert('Error', responseData.message || 'Unable to delete employee.');
              }
            } catch (error) {
              console.error('Error deleting employee:', error);
            }
          },
        },
      ],
    );
  };

  const handleEdit = (employeeId) => {
    navigation.navigate('Editemployee', { employeeId });
  };

  const handleAddEmployee = () => {
    navigation.navigate('Addemployee'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Welcome  {userName}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.spinner} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DataTable style={styles.table}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Gender</DataTable.Title>
              <DataTable.Title>Age</DataTable.Title>
              <DataTable.Title>Role</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>Joining Date</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>

            {employees.map((employee) => (
              <DataTable.Row key={employee._id} style={styles.tableRow}>
                <DataTable.Cell>{employee.name}</DataTable.Cell>
                <DataTable.Cell>{employee.email}</DataTable.Cell>
                <DataTable.Cell>{employee.gender}</DataTable.Cell>
                <DataTable.Cell>{employee.age}</DataTable.Cell>
                <DataTable.Cell>{employee.role}</DataTable.Cell>
                <DataTable.Cell>{employee.phoneNumber}</DataTable.Cell>
                <DataTable.Cell>{employee.joiningDate}</DataTable.Cell>
                <DataTable.Cell style={styles.actionCell}>
                  <TouchableOpacity style={styles.button} onPress={() => handleEdit(employee._id)}>
                    <Icon name="edit" size={24} color="#6200EE" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(employee._id)}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
        <Text style={styles.addButtonText}>+ Add Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',  
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  spinner: {
    marginTop: 50,
  },
  table: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#6200EE',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 4,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },

  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
