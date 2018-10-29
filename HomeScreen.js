import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator} from 'react-native';
import ContentSection from './ContentSection.js'
import { createStackNavigator } from 'react-navigation';

export default class HomeScreen extends Component {
  
  _keyExtractor = (item, index) => {
    return ''+index;
  };


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
      };

  }

  onRefresh() {
     this.setState({ isFetching: true}, function() { this.getApiData() });
  }

  render() {
  	 return (
      <View style={{
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
      <Image source={require('./assets/images/plusButton.png')} 
          style={{
              width: 50,
              height: 50,
              position: "absolute",
              marginLeft: 300,
              marginTop: 620,
              borderRadius: 25,
              marginBottom: 10
          }}
        />
      </View>

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

