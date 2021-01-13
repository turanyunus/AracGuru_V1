import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
  } from 'react-native';
import { MasterReg } from '../components';

export default class MasterRegistrationPage extends Component {
    constructor(props){
        super(props);
    }

  render() {
    return (
        <View style={styles.containerView}>
            <MasterReg complexity={'complex'} onPressRegister={(fname, lname, mobile, email, password)=>this.clickRegister(fname, lname, mobile, email, password)}></MasterReg>
        </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
   
});