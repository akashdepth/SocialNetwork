import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator} from 'react-native';
import ContentSection from './ContentSection.js'

export default class App extends Component {


  
  _keyExtractor = (item, index) => {
    return ''+index;
  };


   _renderItem = ({item}) => {
    return (<ContentSection input={item}> </ContentSection>);
  };


  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
  }


  getApiData(){
  	return fetch('http://192.168.0.53:8080/api/get_content_section/1')
      .then((response) => response.json())
      .then((responseJson) => {
      	console.log(responseJson);
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
  	return this.getApiData();
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
      <FlatList
            onViewableItemsChanged={this.onViewableItemsChanged }
            data={this.state.array}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            inverted

      />
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
