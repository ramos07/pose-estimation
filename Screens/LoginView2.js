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
import bgImage from './images/mountains.png'
import logo from './images/handstandlogo.png'

export default class LoginView2 extends Component {
  constructor(props) {
    super(props);
    state = {
      email   : '',
      password: '',
    }
  }

  onClickListener = (viewId) => {
  }

  render() {
    return (
      <ImageBackground source={bgImage} style={{flex:1}}>
        <View style={styles.container}>
          <Image style={{width:200, height:200, marginBottom: 50}} source={logo}/>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://icon-library.net/images/mail-icon-white-png/mail-icon-white-png-12.jpg'}}/>
            <TextInput style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
          </View>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://icon-library.net/images/key-6-xxl.png'}}/>
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
          </View>

          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
              <Text>Sign Up</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
      opacity: .8,
      backgroundColor: '#786985',
      borderRadius:30,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      color: "white",
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width:250,
    borderRadius:30,
  },

  loginButton: {
    backgroundColor: "#e7daf5",
  },
  loginText: {
    color: '#786985',
  }
});
