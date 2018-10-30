import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import ContentSection from './ContentSection.js'
import { createStackNavigator } from 'react-navigation';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

//https://www.npmjs.com/package/react-native-swipe-gestures

export default class HomeScreen extends Component {
  
  _keyExtractor = (item, index) => {
    return ''+index;
  };


  onSwipeDown(gestureState) {
    this.setState(
      {
        isVisible: true,
      }
      );
    }
  


  onSwipeUp(gestureState) {
    this.setState(
      {
        isVisible: false,
      }
      );
    }
  

   _renderItem = ({item}) => {
    return (<ContentSection navigation={this.props.navigation} input={item}> </ContentSection>);
  };


  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
  }


  getApiData(){
  	return fetch('http://192.168.0.53:8080/api/get_content_section/1')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
           isFetching: false,
           array: responseJson.contentList
        });
      })
      .catch((error) =>{
      	console.log("Got Network Error.");
        console.error(error);
      });
  }

  componentDidMount(){
  	 this.getApiData();
  }

  constructor(props){
    super(props);
      this.state = {
      	isFetching: true,
        isVisible: true, 
      };

  }

  onRefresh() {
     this.setState({ isFetching: true}, function() { this.getApiData() });
  }

  _renderAdd(){
       const { navigate } = this.props.navigation;

      if(this.state.isVisible){
        return (
          <TouchableOpacity
                    onPress={() => {
                      navigate('UPloadHandler', { userId: 1});
                    }
                  }

                  style={{
                        position: "absolute",
                        marginLeft: 300,
                        marginTop: 620,
                  }}
                  >
                  <Image source={require('./assets/images/plusButton.png')} 
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginBottom: 10
                  }}
                />
        </TouchableOpacity>
          );
      }
  }


  render() {
    

  	 return (
      <GestureRecognizer 
            onSwipeLeft={(state) => this.onSwipeDown(state)}
            onSwipeRight={(state) => this.onSwipeUp(state)}
            style={{
              flex: 1,

      }}>
      <FlatList
            onViewableItemsChanged={this.onViewableItemsChanged }
            data={this.state.array}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            inverted
            style={styles.scrolStyle}

      />
      {this._renderAdd()}
      </GestureRecognizer>

    );
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

