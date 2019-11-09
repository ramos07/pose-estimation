import React from 'react'
import{
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native'

import bgImage from '../images/daytime.jpg'

export default class DataScreen extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <ImageBackground source={bgImage} style={{flex: 1}}>
              <View style={styles.container}>
                <Text> Data Screen </Text>
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
  }
})
