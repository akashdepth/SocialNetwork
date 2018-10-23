import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Video } from 'expo';

export default class App extends React.Component {
  render() {
    const { width } = Dimensions.get('window');
    
    return (
      <View style={styles.container}>
  <Text style={{ textAlign: 'center' }}> React Native Video </Text>
  <Video
    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          shouldPlay
    resizeMode="cover"
    style={{ width, height: 300 }}
  />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
