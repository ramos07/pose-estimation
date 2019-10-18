import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  ImageBackground,
  Alert
} from 'react-native'
import bgImage from './images/daytime.jpg'

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground source={bgImage} style={{flex:1}}>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
