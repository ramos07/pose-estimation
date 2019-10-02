import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export default class loadingscreen extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#588fb6" />
      </View>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    justifyContent: 'center',
  }
})
