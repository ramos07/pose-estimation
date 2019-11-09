import React from 'react'
import {View, Text, StyleSheet } from 'react-native'

import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import HomeScreen from './screens/Home'
import CamScreen from './screens/Cam'
import UploadScreen from './screens/Upload'
import DataScreen from './screens/Data'
import SettingsScreen from './screens/Settings'

import LoginScreen from './screens/Login'
import SignUpScreen from './screens/SignUp'
import GalleryScreen from './screens/Gallery'

const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Cam: CamScreen,
  Upload: UploadScreen,
  Gallery: GalleryScreen,
  Data: DataScreen,
  Settings: SettingsScreen,
})

const StackNavigator = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
},
{
  headerMode: 'none',
  navigationOptions:{
    headerVisible: false,
  }
})

const SwitchNavigator = createSwitchNavigator({
  Auth: StackNavigator,
  Main: TabNavigator,
})

const App = createAppContainer(SwitchNavigator)

export default App
