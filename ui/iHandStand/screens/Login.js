import React, {Component} from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Input } from 'react-native-elements';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password: '',
        }
    }

    handleSignIn = async() => {
        const { email, password } = this.state;
        global.username = email;
        this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <View style = {styles.View}>
                <Input
                    label = 'Email'
                    leftIcon={{ type: 'ionicon', name: 'md-mail', color: 'grey' }}
                    placeholder = 'Enter Email'
                    onChangeText = {
                        (email) => this.setState({email})
                    }
                    
                />
                <Input
                    label = 'Password'
                    leftIcon={{ type: 'ionicon', name: 'md-lock', color: 'grey' }}
                    placeholder = 'Enter Password'
                    secureTextEntry = {true}
                    onChangeText = {
                        (password) => this.setState({password})
                    }
                />
                <Button 
                    title="Login"
                    onPress={this.handleSignIn}
                />
                <Button 
                    style = {styles.Button}
                    title="Need Account?"
                    onPress={()=>this.props.navigation.navigate('SignUp')}
                />
                <Button 
                    style = {styles.Button}
                    title="Need To Confirm A Code?"
                    onPress={()=>this.props.navigation.navigate('Confirm')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    View: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    Button: {
    }
})