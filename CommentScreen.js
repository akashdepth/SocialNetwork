import React, { Component } from 'react';
import { Text, View, TouchableOpacity,FlatList, StyleSheet,Keyboard, Image, ActivityIndicator, TextInput} from 'react-native';
import ContentSection from './ContentSection.js'
import { createStackNavigator } from 'react-navigation';
import * as consts from './Constants.js';
IP_ADDRESS = consts.IP_ADDRESS;


export default class CommentScreen extends Component {
  
  _keyExtractor = (item, index) => {
    return ''+index;
  };


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

   _renderItem = ({item}) => {
    return (<View style={styles.messageContainer}>
              <Text style={styles.userNameStyle}>{item.userName}</Text>
              <Text style={styles.textStyle}> {item.text}</Text>
              <Text style={styles.timeStyle}>{this.timeConverter(item.timestamp)}</Text>
          </View>);
    };


  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
  }


postData(url = ``, data = {}) {
    return fetch(url, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(data), 
    })
    .then(response => response.json())
    .then((responseJson => {
      console.log(responseJson);
    }))
    .catch((error)=>{
      console.log(error);
    })
    ;
}

  addComment(){
    const { navigation } = this.props;
    const contentId = navigation.getParam('contentId', '0');
    const userId = navigation.getParam('userId', '0');

    data = {
        "userId" : userId,
        "text" : this.state.text,
        "contentSectionId": contentId
    };
   console.log(data);
   this.postData(IP_ADDRESS+'/api/add_comments', data);
  }


  getApiData(){

    const { navigation } = this.props;
    const contentId = navigation.getParam('contentId', '0');
    console.log(contentId);
    return fetch(IP_ADDRESS+'/api/get_comments/'+contentId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
           array: responseJson.comments,
        });
      })
      .catch((error) =>{
        console.log("Got Network Error.");
        console.error(error);
      });
  }


  constructor(props){
    super(props);
    this.state = { text: '', bottomHeight: 5};

  }

 componentDidMount () {
    console.log("mounting component");
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    this.interval = setInterval(() => this.getApiData(), 1000);
    console.log(this.interval);
    var data = this.getApiData();
    console.log(data);
    return data;
  }

  componentWillUnmount () {
    console.log("Unmounting element");
    console.log(this.interval);
    clearInterval(this.interval);
    console.log(this.interval);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow (e) {
    this.setState((previousState)=>{
      previousState.bottomHeight = e.endCoordinates.height;
      previousState.text = "";
      return previousState;
    });
  }

  _keyboardDidHide () {
    this.setState((previousState)=>{
      previousState.bottomHeight = 5;
      return previousState;
    });
  }

 _handlePressRequest(){
  if(this.state.text==''){
    return;
  }
   this.addComment();
    this.setState(
        {
          text: '', 
        }
    );
 }

 _renderFotter(){
  return (
     <View style={styles.footerStyle}>
      <View style={{
                  marginRight: 20,
                  marginLeft: 20,
                  backgroundColor: 'white',
                  justifyContent: 'flex-start',
                  width: 250,
                  height: 50,
                  borderRadius: 10,
                }}
          >
        <TextInput
                underlineColorAndroid = "transparent"
                placeholder = "Type Comment Here"
                placeholderTextColor = "#9a73ef"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />
        </View>
        <TouchableOpacity
               style = {styles.submitButton}
               onPress = {this._handlePressRequest.bind(this)}>
               <Image source={require('./assets/images/send.png')}/>
          </TouchableOpacity>
      </View>
    );
 }

  render() {


     return (
      <View style={[styles.scrolStyle,{
        marginBottom: this.state.bottomHeight,
      }]}>
      <FlatList
            onViewableItemsChanged={this.onViewableItemsChanged }
            data={this.state.array}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            inverted
      />
      {this._renderFotter()}
      </View>
    );
    }
  }


const styles = StyleSheet.create({

  scrolStyle: {
      backgroundColor: '#b6bdc6',
      flex: 1,
  },
  messageContainer:{
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
  },
  submitButton: {
      justifyContent: 'flex-end',
      width: 30,
      height: 30,
      marginTop: 10,
      marginBottom: 10,
   },
  userNameStyle:{
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    fontSize: 10,
    color: 'green',
    fontWeight: 'bold'      
  },
  contentContainer: {
    paddingVertical: 10
  },
  timeStyle:{
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'right',
    fontSize: 10,
    color: 'gray',
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  footerStyle: {
    marginBottom: 80,
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
  }
});