import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import { Header} from 'react-native-elements';
import {colors} from '../common/theme';
import { Actions } from 'react-native-router-flux';
const {width, height} = Dimensions.get('window');
import {GetMyCar} from "../components";

export default class GetMyCarsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        centerComponent={<Text style={styles.headerTitleStyle}> Araçlarım </Text>}
                        rightComponent={{icon:'plus', type:'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.MyCarsAddedScreen() } }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <GetMyCar />
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontSize: 20
    },
    mainView:{
        flex:1,
        backgroundColor: colors.WHITE
    },
    scrollStyle:{
        flex: 1,
        height: height,
        backgroundColor:colors.WHITE
    },
    scrollViewStyle:{
        width: width,
        height: 50,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

});