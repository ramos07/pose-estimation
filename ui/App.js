/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
} from 'react-native';

import LoginScreen from './screens/Login'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
import CamScreen from './screens/Cam'
import ConfirmScreen from './screens/Confirm'

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Cam: CamScreen,
});



const StackNavigator = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
  Confirm: ConfirmScreen,
},
{
  headerMode: 'none',
  navigationOption: {
    headerVisible: false
  }
});

const SwitchNavigator = createSwitchNavigator({
  Auth: StackNavigator,
  Main: TabNavigator,
})



const App = createAppContainer(SwitchNavigator);

export default App;