import React from 'react';
import {ActivityIndicator, View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import {colors} from "./theme";
const {width} = Dimensions.get('window');

export default class SpinnerPage extends React.Component {
    render() {
      return (
        <View style={styles.spinner}>
            <TouchableOpacity style={styles.button}>
                <ActivityIndicator/>
            </TouchableOpacity>
        </View>

      );
    }
  }
  
  const styles = StyleSheet.create({
    spinner:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: width
    },
      button:{
          marginBottom: 20,
          alignItems: 'center',
          justifyContent:'center',
          borderRadius:10,
          height:50,
          width:'70%'
      },
      textStyle:{
          fontSize: 16,
          color: colors.WHITE,
          textAlign: "center",
          fontWeight: 'bold'
      }
  });