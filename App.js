import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './SignUp';
import App2 from './app2';
import Login from './Login'
import UserModificationPage from './UserModificationPage' ;

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="App2" component={App2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserModificationPage" component={UserModificationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
