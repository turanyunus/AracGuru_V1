import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity, Alert
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import {Actions} from "react-native-router-flux";
import {services} from "./MasterProfileScreen";
import {apiUrlCommon} from "../apiUrlCommon";
import {formatPhoneNumber, GetOnWhichScreenCommon} from "../common/functionCommon"
import {GeneralFailedMessage} from "../common/ExceptionMessage";

export let selectedService = '';

export default class MasterAutoServicesList extends Component {
    constructor(props){
        super(props);
        this.state = {
            branchDetail: [],
            masterName: '',
            surName: '',
            city: '',
            district: ''
        }
    }

    async getAutoServiceBranch(){
        try {
            let response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster/"+services);
            let json = await response.json();
            this.setState({ branchDetail: json.result });
            this.setState({ masterName: json.result.auto_Service_Masters[0].master_Name,
                surName: json.result.auto_Service_Masters[0].master_Surname,
                city: json.result.cities.city_Name, district: json.result.districts.district_Name});
            selectedService = this.state.branchDetail.autoservice_ID; // selected auto service
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    }

    componentWillMount(){
        this.getAutoServiceBranch().then();

    }

//go to ride details page
    goDetails(){
        //this.props.navigation.push('RideDetails');
    }

    render() {
        return (
            <View style={styles.mainView}>
                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>Şubelerim</Text>}
                    rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.NotifScreen() } }}
                    outerContainerStyles={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
                <View style={styles.textView3}>
                    <TouchableOpacity style={styles.iconClickStyle}
                                      key={this.state.branchDetail.autoservice_ID}
                                      onPress={()=> {
                                          Actions.AutoServiceBranchDetail({
                                              selectedService: this.state.branchDetail
                                          })
                                      }}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='car-sports'
                                type='material-community'
                                color={colors.DARK}
                                size={35}
                            />
                        </View>
                        <View style={styles.flexViewStyle}>
                            <View style={styles.textView1}>

                                <Text style={[styles.textTitleStyle,styles.dateStyle]}
                                      numberOfLines={2}>{this.state.branchDetail.autoservice_Name}</Text>
                                <Text style={[styles.textStyle,styles.carNoStyle]}>{this.state.masterName} {this.state.surName}</Text>
                                <View style={[styles.picupStyle,styles.position]}>
                                    <View style={styles.greenDot}/>
                                    <Text style={[styles.picPlaceStyle,styles.placeStyle]}>{this.state.city} / {this.state.district}</Text>
                                </View>
                                <View style={[styles.dropStyle,styles.textViewStyle]}>
                                    <View style={[styles.redDot,styles.textPosition]}/>
                                    <Text style={[styles.dropPlaceStyle,styles.placeStyle]}>{formatPhoneNumber(this.state.branchDetail.autoservice_Phone)}</Text>
                                </View>

                            </View>
                            <View style={styles.textView2}>
                                {this.state.branchDetail.autoservice_Support24hours === true ?
                                <Text style={[styles.fareStyle,styles.dateStyle]}>7/24</Text> : null }
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
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
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
    mainView:{
        flex:1,
        backgroundColor: colors.WHITE
    },
    textView3:{
        flexDirection: 'column'
    },
    iconClickStyle:{
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 20
    },
    iconViewStyle:{
        flex: 1,
        marginTop:10,
        alignSelf: 'center',
    },
    flexViewStyle:{
        flex: 7,
        flexDirection: 'row',
        borderBottomColor:colors.GREY.secondary,
        borderBottomWidth:1,
        marginTop:10,
        marginLeft:5,
        marginRight:10
    },
    textView1:{
        flex: 5.5
    },
    textStyle:{
        fontSize:18,
    },
    textTitleStyle:{
        fontSize:20,
        fontWeight: 'bold'
    },
    dateStyle:{
        color:colors.GREY.default
    },
    carNoStyle:{
        fontSize:13,
        marginTop:10,
        color:colors.GREY.default
    },
    picupStyle:{
        flexDirection:'row',
    },
    position:{
        marginTop:20
    },
    greenDot:{
        alignSelf:'center',
        borderRadius:10,
        width:10,
        height: 10,
        backgroundColor: colors.GREEN.default
    },
    picPlaceStyle:{
        color: colors.GREY.secondary
    },
    placeStyle:{
        marginLeft:10,
        fontSize:16,
        alignSelf:'center'
    },
    dropStyle:{
        flexDirection:'row',
    },
    textViewStyle:{
        marginTop:10,
        marginBottom:10
    },
    redDot:{
        borderRadius:10,
        width:10,
        height: 10,
        backgroundColor: 'orange'
    },
    textPosition:{
        alignSelf:'center'
    },
    dropPlaceStyle:{
        color: colors.GREY.secondary
    },
    textView2:{
        flex: 1.5
    },
    fareStyle:{
        fontSize:18,
    },
});
