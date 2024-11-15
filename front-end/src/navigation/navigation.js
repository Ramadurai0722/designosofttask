import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Auth
import LoginScreen from '../components/Auth/LoginScreen';
import RegisterScreen from '../components/Auth/RegisterScreen';
import AddEmployeeScreen from '../components/screens/Addemployee';
import HomeScreen from '../components/screens/Home';
import EditEmployeeScreen from '../components/screens/EditEmployee';


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">

                {/* Login */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

                {/* Register */}
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Addemployee"
                    component={AddEmployeeScreen}
                    options={{ headerShown: false }}
                />
                
                <Stack.Screen
                    name="Editemployee"
                    component={EditEmployeeScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
