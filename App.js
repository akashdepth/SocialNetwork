import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Image} from 'react-native';
import ContentSection from './ContentSection.js'

export default class App extends Component {

  constructor(props){
    super(props);


     var input_temp = {
              username: "Harry Porter",
              userImage: "https://facebook.github.io/react-native/docs/assets/favicon.png",
              earth_about: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other sources of evidence, Earth formed over 4.5 billion years ago.",
              time: "3 hours ago",
              uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              contentType: "video",
              like: "2.3k",
              comment: "500",
              share: "200",
              isPlaying: true,
              content_id: 123
          };  

      var other_input = {
              username: "Akash Chaudhary",
              userImage: "https://facebook.github.io/react-native/docs/assets/favicon.png",
              earth_about: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other sources of evidence, Earth formed over 4.5 billion years ago.",
              time: "3 hours ago",
              uri: "http://mirrors.standaloneinstaller.com/video-sample/jellyfish-25-mbps-hd-hevc.mp4",
              contentType: "video",
              like: "2.3k",
              comment: "500",
              share: "200",
              isPlaying: false,
              content_id: 13
      };
    
    this.state = {
        array : [input_temp, other_input],
        playingIndex: 0
    };

  }

  getResponse(key_value, response){
            this.setState((previousState)=>{

            var array = previousState.array;
            if(!response){
                 array[key_value].isPlaying = false;
            }
            else{
              for(index=0;index<array.length;index++){
                  array[index].isPlaying = false;
              }
              array[key_value].isPlaying = true;

            }
            return {
              array: array,
              playingIndex: key_value
            };
          });
  }


  getMovement(key_value){

    if(Math.abs(this.state.playingIndex-key_value)>=2){
        this.getResponse(key_value, true);
      }
    console.log("hhh");

    if(Math.abs(key_value-this.state.array.length)<=4){
      
      this.setState((previousState)=>{

      var _input = {
              username: "Akah Chaudhary",
              userImage: "https://facebook.github.io/react-native/docs/assets/favicon.png",
              earth_about: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other sources of evidence, Earth formed over 4.5 billion years ago.",
              time: "3 hours ago",
              uri: "http://mirrors.standaloneinstaller.com/video-sample/jellyfish-25-mbps-hd-hevc.mp4",
              contentType: "video",
              like: "2.3k",
              comment: "500",
              share: "200",
              isPlaying: false,
              content_id: 1
      };

         var array = previousState.array;
         array.push(_input);
         return {
          array: array,
          playingIndex: previousState.playingIndex 
         };

      });
    }
    
  }
  
  render() {

    return (
      <ScrollView contentContainerStyle={[styles.contentContainer, styles.scrolStyle]}>
      {
        this.state.array.map((data, key)=>{
            return (<ContentSection input={data} key={key} key_value={key} movement={this.getMovement.bind(this)} callback={this.getResponse.bind(this)}> </ContentSection>);
        })
      }
      </ScrollView>);
    }
  }


const styles = StyleSheet.create({

  scrolStyle: {
      backgroundColor: '#b6bdc6'
  },
  contentContainer: {
    paddingVertical: 10
  },
});