import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Image} from 'react-native';
import VideoPlayer from './VideoPlayer.js';
import Icon from "react-native-vector-icons/Ionicons";

export default class ContentSection extends Component {
  
  constructor(props){
    super(props);
  }

  getResponse(response){
    this.props.callback(this.props.key_value,response);
  }

  _movementresponse = ()=>{
    this.props.movement(this.props.key_value);
  };


  render() {

    return (
         <VideoPlayer uri={this.props.input.uri} isVideo="false" isPlaying={this.props.input.isPlaying} callback={this.getResponse.bind(this)}></VideoPlayer>

      );

    // return (
      // <View style={styles.topContainer} onMoveShouldSetResponder={this._movementresponse}>
      // <View style={styles.header}>
      // <Image style={{width: 40, height: 40, borderRadius: 18}} source={{uri: this.props.input.userImage}}/>
      // <View style={styles.small_head}>
      //     <Text style={styles.usernameStyle}>{this.props.input.username}</Text>
      //     <Text style={styles.timeStyle}>{this.props.input.time}</Text>
      // </View>
      // </View>

      // <Text style={styles.headTextStyle}>{this.props.input.earth_about}</Text>
      // <View>
        //  <VideoPlayer uri={this.props.input.uri} isVideo="false" isPlaying={this.props.input.isPlaying} callback={this.getResponse.bind(this)}></VideoPlayer>
        // //  <View style={styles.actionbar}>
        //     <View style={styles.shareContainer}>
        //       <View style={styles.infobar}>
        //         <Image style={{width: 15, height: 15}} source={require('./assets/images/whatsapp.png')}/> 
        //         <Text style={[styles.infoContainerFonts]}>{this.props.input.share}</Text>
        //       </View>              
        //       <Text style={[styles.actionContainerFonts]}>Share</Text>
        //     </View>
        //     <View style={styles.likeContainer}>
        //       <View style={styles.infobar}>
        //         <Image style={{width: 15, height: 15}} source={require('./assets/images/likeicon.png')}/> 
        //         <Text style={[styles.infoContainerFonts]}>{this.props.input.like}</Text>
        //       </View>
        //         <Text style={[styles.actionContainerFonts]}>Like</Text>
        //     </View>
        //   <View style={styles.commentsContainer}>
        //     <View style={styles.infobar}>
        //        <Image style={{width: 15, height: 15, marginLeft: 5}} source={require('./assets/images/comment.png')}/> 
        //        <Text style={[styles.infoContainerFonts]}>{this.props.input.comment}</Text>
        //       </View>
        //        <Text style={[styles.actionContainerFonts]}>Comment</Text>
        //      </View>
        //  </View>
        // </View>
      // </View>   
    // );
  }
}


const styles = StyleSheet.create({
  timeStyle: {
    color: '#A4A4A4',
    fontSize: 10
  },
  header: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,  
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
  small_head: {
    marginLeft: 4
  },
  usernameStyle: {
    fontWeight: 'bold',
  },
  headTextStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10
  },
  scrolStyle: {
      backgroundColor: '#b6bdc6'
  },
  topContainer: {
    alignContent: "space-between",
    marginTop: 20,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10
  },
  
  infobar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
  },

 infoIcons: {
  marginTop: 3,
  marginLeft: 3,
  width: 8,
  height: 8
 },

 actionbar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-end",
        marginTop: 5,
        marginBottom: 5

  },


  contentContainer: {
    paddingVertical: 10
  },
  likeContainer: {
    flex: 1,
    width: 50,
    marginLeft: 19
  },
  shareContainer: {
    width: 100, 
    marginLeft: 10,
  },
  commentsContainer: {
    flex: 1,
    width: 50,
    marginRight: 10,
  },
   likeInfoContainer: {
    width: 100, 
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
  },
  shareInfoContainer: {
    width: 100, 
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
  },
  commentsInfoContainer: {
    width: 100, 
    marginLeft: 20,
    flex: 1,
    flexDirection: "row",
  },
  infoContainerFonts: {
    fontSize: 10,
    color: '#A4A4A4',
    fontWeight: 'bold',
    flexWrap: "nowrap",
    marginLeft: 3
  },
  actionContainerFonts: {
    fontSize: 10,
    color: 'gray',
  }
});