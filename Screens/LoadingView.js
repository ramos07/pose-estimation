import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from 'react-native'
import load from './images/yogaGIF.gif'

export default class LoadingView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={{fontSize:22, color: "#e6daeb"}}>Loading...</Text>
          <ImageBackground source={load} style={styles.loading}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    backgroundColor:"#7667a0",
  },
  container: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#7667a0"
  },
  loading:{
    flex:1,
    width: 420,
    height:420,
  }
});
