import React, { Component,PureComponent} from 'react';
import { Text, View, TouchableOpacity,ImageBackground, StyleSheet, Image,ActivityIndicator} from 'react-native';
import VideoPlayer from './VideoPlayer.js';
import Icon from "react-native-vector-icons/Ionicons";
import BottomBar from './BottomBar.js';
import {IP_ADDRESS} from './Constants.js';

export default class ContentSection extends PureComponent {
  
  constructor(props){
    super(props);
    this.state={
      isLoading: true,
    };
  }


 timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var time = date + ' ' + month + ' ' + hour + ':' + min;
  return time;
}
  getResponse(response){
    this.props.callback(this.props.key_value,response);
  }


  componentDidMount(){
    return fetch(IP_ADDRESS+'/api/get_user/'+this.props.input.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
           isLoading: false,
           user_data: responseJson,
           isFetching: false,
        });
      })
      .catch((error) =>{
        console.log("Got Network Error.");
        console.error(error);
      });
  }

  renderItem(){
   const { navigate } = this.props.navigation;

		if(this.props.input.contentType=="video"){
    return (
          <TouchableOpacity
            navigation={this.props.navigation}
            onPress={() => {
                navigate('VideoViewer', { url: IP_ADDRESS+'/api/downloadFile/'+this.props.input.url});
              }
            }
          >
          <Image
             style={[styles.container,{height: 150, marginLeft: 10, marginRight: 10}]}
                         source={{uri: IP_ADDRESS+'/api/downloadFile/'+this.props.input.lightWeightUrl}}
          />
            <Image source={require('./assets/images/playicon.png')} style={{
              width: 70,
              height: 50,
              position: "absolute",
              marginLeft: 130,
              borderRadius: 10,
              marginTop: 50
            }}/>
          </TouchableOpacity>);
		}else if(this.props.input.contentType=="image"){
			return (
      <TouchableOpacity
        navigation={this.props.navigation}
        onPress={() => {
            navigate('ImageViewer', { url: IP_ADDRESS+'/api/downloadFile/'+this.props.input.url});
          }
        }
      >
      <Image
				 style={{height: 150, marginLeft: 10, marginRight: 10}}
		                 source={{uri: IP_ADDRESS+'/api/downloadFile/'+this.props.input.lightWeightUrl}}
			/>
      </TouchableOpacity>);
		}
 }

 _renderHeader(){

     if(this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
          </View>
        )
      }

   return(<View style={styles.header}>
      <Image style={{width: 40, height: 40, borderRadius: 18}} source={{uri: this.state.user_data.lightWeightImage}}/>
      <View style={styles.small_head}>
          <Text style={styles.usernameStyle}>{this.state.user_data.name}</Text>
          <Text style={styles.timeStyle}>{this.timeConverter(this.props.input.timestamp)}</Text>
      </View>
      </View>);

 }

  render() {
    return (
      <View style={styles.topContainer}>
      {this._renderHeader()}
      <Text style={styles.headTextStyle}>{this.props.input.about}</Text>
        <View>
          {this.renderItem()}
          <BottomBar navigation={this.props.navigation} input={this.props.input} userId={this.props.userId }> </BottomBar>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  timeStyle: {
    color: '#A4A4A4',
    fontSize: 10
  },
  container: {
        flex: 1,
        alignItems: 'center',
            justifyContent: 'center',
        backgroundColor: 'black',
        justifyContent: 'center',
        opacity: 0.5,
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

  contentContainer: {
    paddingVertical: 10
  },
  
  actionContainerFonts: {
    fontSize: 10,
    color: 'gray',
  }
});
