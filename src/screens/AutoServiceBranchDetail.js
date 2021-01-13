import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback, FlatList, Alert
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import { colors } from '../common/theme';
import {Actions} from "react-native-router-flux";
import {DefaultTabBar, ScrollableTabView} from "@valdio/react-native-scrollable-tabview";
import {apiUrlCommon} from "../apiUrlCommon";
import { selectedService } from "./MasterAutoServicesList";
import {formatPhoneNumber} from "../common/functionCommon"
import {GeneralFailedMessage} from "../common/ExceptionMessage";

class ServiceType extends Component {
    state = {
        services: [],
        vehicles: []
    };

    serviceAndVehicle = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetServiceAndVehicleTypeForASById"+"/"+selectedService);
            const json = await response.json();
            this.setState({ services: json.result.services,
                vehicles: json.result.vehicle_Type, isLoading:false});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    componentWillMount(){
        return this.serviceAndVehicle();
    };

    renderItem = ({ item }) => (
        <View style={styles.serviceTypeDetail}
              key={item.service_ID}>
            <View style={ styles.bullet }>
                <Text>{'\u2022' + " "}</Text>
            </View>
            <Text style={{lineHeight: 20, flexShrink: 1}}>{item.service_Name}</Text>
        </View>
    );
    renderItemVehicle = ({ item }) => (
        <View style={styles.serviceTypeDetail}
              key={item.type_ID}>
            <View style={ styles.bullet }>
                <Text>{'\u2022' + " "}</Text>
            </View>
            <Text style={{lineHeight: 20, flexShrink: 1}}>{item.type_Name}</Text>
        </View>
    );

    render() {
        const { services } = this.state;
        const { vehicles } = this.state;
        return (
            <View style={styles.inCardDetail}>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Servis Tipleri</Text>
                </View>
                <View style={styles.serviceType}>
                    <FlatList data={services}
                              keyExtractor={(item) => item.service_Name}
                              renderItem={this.renderItem}
                    />
                </View>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Araç Tipleri</Text>
                </View>
                <View style={[styles.serviceType, styles.serviceSubDetailLast]}>
                    <FlatList data={vehicles}
                              keyExtractor={(item) => item.type_Name}
                              renderItem={this.renderItemVehicle}
                    />
                </View>
            </View>
        )
    }
}

class Detail extends Component {
    state = {
        insurances: [],
        brands: []
    };

    insuranceAndBrands = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetBrandAndInsuranceForASById"+"/"+selectedService);
            const json = await response.json();
            this.setState({ insurances: json.result.insurances,
                brands: json.result.brands, isLoading:false});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    componentWillMount(){
        return this.insuranceAndBrands();
    };

    renderItem = ({ item }) => (
        <View style={styles.serviceTypeDetail}
              key={item.insurance_ID}>
            <View style={ styles.bullet }>
                <Text>{'\u2022' + " "}</Text>
            </View>
            <Text style={{lineHeight: 20, flexShrink: 1}}>{item.insurance_Name}</Text>
        </View>
    );

    renderItemBrands = ({ item }) => (
        <View style={styles.serviceTypeDetail}
              key={item.brand_ID}>
            <View style={ styles.bullet }>
                <Text>{'\u2022' + " "}</Text>
            </View>
            <Text style={{lineHeight: 20, flexShrink: 1}}>{item.brand_Name}</Text>
        </View>
    );

    render() {
        const { insurances } = this.state;
        const { brands } = this.state;
        return (
            <View style={styles.inCardDetail}>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Kasko Firmaları</Text>
                </View>
                <View style={styles.serviceType}>
                    <FlatList data={insurances}
                              keyExtractor={(item) => item.insurance_Name}
                              renderItem={this.renderItem}
                    />
                </View>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Araç Markaları</Text>
                </View>
                <View style={[styles.serviceType, styles.serviceSubDetailLast]}>
                    <FlatList data={brands}
                              keyExtractor={(item) => item.brand_Name}
                              renderItem={this.renderItemBrands}
                    />
                </View>
            </View>
        )
    }
}

class OtoService extends Component {
    state = {
        subDetail: [],
    };

    masterInfoDetail = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster"+"/"+selectedService);
            const json = await response.json();
            this.setState({ subDetail: json.result ,isLoading:false});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    componentWillMount(){
        return this.masterInfoDetail();
    };

    renderElement(){
        if(this.state.subDetail.autoservice_Support24hours === true)
            return <View style={[styles.serviceSubDetail,styles.serviceSubHour]}>
                <View style={styles.serviceSubIcon}>
                    <Icon
                        name='ambulance'
                        type='font-awesome'
                        color={colors.GREY.btnPrimary}
                        size={20}
                    />
                </View>
                <Text>7 Gün 24 Saat Yol Yardım</Text>
            </View>;
        return null;
    }

    renderElementDate(){
        if(this.state.subDetail.autoservice_Working_Weekdays === 'E' &&
            this.state.subDetail.autoservice_Working_Saturday === 'E' &&
            this.state.subDetail.autoservice_Working_Sunday === 'E')
            return  <Text style={{lineHeight: 20, flexShrink: 1}}>Pazartesi, Salı Çarşamba, Perşembe, Cuma, Cumartesi, Pazar</Text>;
        else if(this.state.subDetail.autoservice_Working_Weekdays === 'E' &&
            this.state.subDetail.autoservice_Working_Saturday === 'E')
            return  <Text style={{lineHeight: 20, flexShrink: 1}}>Pazartesi, Salı Çarşamba, Perşembe, Cuma, Cumartesi</Text>;
        else if(this.state.subDetail.autoservice_Working_Weekdays === 'E')
            return  <Text style={{lineHeight: 20, flexShrink: 1}}>Pazartesi, Salı Çarşamba, Perşembe, Cuma</Text>;
        return null;
    }

    renderElementPayment(){
        if(this.state.subDetail.autoservice_Payment_Type === 0)
            return <Text>Nakit</Text>;
        else if (this.state.subDetail.autoservice_Payment_Type === 1)
            return <Text>Nakit, Kredi Kartı</Text>;
        return null;
    }

    render() {
        return (
            <View style={styles.inCardDetail}>
                { this.renderElement() }
                <View style={styles.serviceSubDetail}>
                    <View style={styles.serviceSubIcon}>
                        <Icon
                            name='calendar'
                            type='font-awesome'
                            color={colors.GREY.btnPrimary}
                            size={20}
                        />
                    </View>
                    { this.renderElementDate() }
                </View>
                <View style={[styles.serviceSubDetail, styles.serviceSubDetailLast]}>
                    <View style={styles.serviceSubIcon}>
                        <Icon
                            name='credit-card'
                            type='font-awesome'
                            color={colors.GREY.btnPrimary}
                            size={20}
                        />
                    </View>
                    { this.renderElementPayment() }
                </View>
            </View>
        )
    }
}

export default class AutoServiceBranchDetail extends Component {
    state = {
        data: [],
        dataMaster: [],
        cityName: '',
        district: '',
        isLoading:true
    };

    getMasterDetail = async (auto_service) => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster"+"/"+auto_service);
            const json = await response.json();
            this.setState({ data: json.result ,isLoading:false});
            this.setState({ dataMaster: json.result.auto_Service_Masters[0],
                cityName: json.result.cities.city_Name,
                district: json.result.districts.district_Name,
                isLoading:false });
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };
    componentWillMount(){
        //auto_service  = this.props.otoService.autoservice_ID;
        return this.getMasterDetail(selectedService);
    }

    render() {
        const topInfo = (
            <View style={styles.mainView}>
                <Header
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>{this.state.data.autoservice_Name}</Text>}
                    rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.NotifScreen() } }}
                    outerContainerStyles={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />
                <View style={styles.viewStyle}>
                    <Text style={styles.textServiceName}
                          numberOfLines={2}>{this.state.data.autoservice_Name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{top: 25, right: 8}}>
                            <Icon
                                name='star'
                                type='font-awesome'
                                color={'orange'}
                            />
                        </View>
                        <Text style={styles.textPropStyle}>3</Text>
                    </View>
                </View>
                <View style={styles.cardDetail}>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='users'
                                type='font-awesome'
                                color={colors.GREY.btnPrimary}
                                size={25}
                            />
                            <Text style={styles.text1}>İsim-Soyisim</Text>
                        </View>
                        <View style={styles.flexView1}>
                            <Text style={styles.emailAdressStyle}>{this.state.dataMaster.master_Name} {this.state.dataMaster.master_Surname}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='phone-call'
                                type='feather'
                                color={colors.GREY.btnPrimary}
                                size={25}
                            />
                            <Text style={styles.text1}>Telefon Numarası</Text>
                        </View>
                        <View style={styles.flexView2}>
                            <Text style={styles.text2}>{formatPhoneNumber(this.state.data.autoservice_Phone)}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='globe'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                                size={25}
                            />
                            <Text style={styles.text1}>Konum</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.text2}>{this.state.cityName}/{this.state.district}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='location-arrow'
                                type='font-awesome'
                                color={colors.GREY.btnPrimary}
                                size={25}
                            />
                            <Text style={styles.text1}>Adres</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.text2}>{this.state.data.autoservice_Address}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
        return (
                <ScrollableTabView
                    collapsableBar={topInfo}
                    tabBarTextStyle={{fontSize: 15}}
                    style={styles.container}
                    tabBarUnderlineStyle={{backgroundColor: 'orange'}}
                    tabBarActiveTextColor='black'
                    renderTabBar={() => <DefaultTabBar/>}>
                    <View tabLabel='Oto Servis' style={{borderTopWidth: 1, borderColor: 'grey'}}>
                        <OtoService/>
                    </View>
                    <View tabLabel='Hizmet Tipleri' style={{borderTopWidth: 1, borderColor: 'grey'}}>
                        <ServiceType/>
                    </View>
                    <View tabLabel='Detaylı Bilgi' style={{borderTopWidth: 1, borderColor: 'grey'}}>
                        <Detail/>
                    </View>
                </ScrollableTabView>
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
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainBorder: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    viewStyle:{
        justifyContent:'center',
        alignItems:'center',
        marginTop: 13,
        height: 100
    },
    textPropStyle:{
        fontSize: 22,
        fontWeight:'bold',
        color: 'grey',
        top: 25
    },
    textServiceName: {
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 24,
        fontWeight:'bold',
        color: colors.GREY.iconSecondary,
        top: 8
    },
    cardDetail:{
        backgroundColor: 'white', // flex 1 vardı burada
        height: 290,
        marginTop: 40,
        marginBottom: 5,
        paddingBottom: 25,
        borderBottomWidth: 1
    },
    myViewStyle:{
        flex: 1,
        left: 20,
        marginRight: 40,
        borderBottomColor: colors.GREY.btnSecondary,
        paddingBottom: 5,
        borderBottomWidth: 1
    },
    iconViewStyle:{
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flexView1:{
        flex:1
    },
    emailAdressStyle:{
        fontSize: 15,
        color: colors.GREY.secondary,
    },
    text1:{
        fontSize: 14,
        left: 10,
        color:colors.GREY.btnPrimary,
    },
    flexView2:{
        flex:1
    },
    text2:{
        fontSize: 15,
        left: 10,
        color:colors.GREY.secondary,
    },
    inCardDetail: {
        flex: 1,
        padding: 15,
    },
    serviceSubDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'grey',
        padding: 10,
    },
    serviceSubDetailLast: {
        marginBottom: 30
    },
    serviceSubHour: {
        backgroundColor: '#ffebcf'
    },
    serviceSubIcon: {
        marginRight: 15
    },
    serviceType: {
        flexDirection: 'column',
        marginTop: 2,
        borderWidth: 0.2,
        borderColor: 'grey',
        padding: 10,
    },
    serviceTypeColor: {
        backgroundColor: '#ede7e6'
    },
    serviceTypeDetail: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    bullet: {
        width: 10
    }
});
