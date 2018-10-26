import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

import Video from "react-native-video";
import LightVideo from "./lights.mp4";



export default class VideoPlayer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>vyvhv</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
