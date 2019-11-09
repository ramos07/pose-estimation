import React from 'react'
import{
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  Alert,
} from 'react-native'

import bgImage from '../images/daytime.jpg'

export default class SettingsScreen extends React.Component{

    constructor(props){
        super(props);
    }

    onClickListener = () => {
    Alert.alert('Log Out','Log out?',
    [ 
      { text: 'YES', onPress: () => this.props.navigation.navigate('Login') },
      { text: 'NO', onPress: () => this.props.navigation.navigate('Settings')}
    ],)
  }

    render(){
        return(
            <ImageBackground source={bgImage} style={{flex: 1}}>
              <View style={styles.container}>
                <Text> Settings Screen </Text>
                <TouchableHighlight 
                  style={[styles.buttonContainer, styles.logoutButton]} 
                  onPress={() => this.onClickListener()}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableHighlight>
              </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    alignItems:'center',
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
  logoutButton: {
    backgroundColor: "#e7daf5",
  },
  logoutText: {
    color: '#786985',
  }
})
