import React, { Component } from 'react';
import { Registration } from '../components';
import { 
    StyleSheet,
    View
  } from 'react-native';

export default class RegistrationPage extends Component {
    constructor(props){
        super(props);
    }


  render() {
    return (
        <View style={styles.containerView}>
            <Registration complexity={'complex'} ></Registration>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
});