import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Linking, Platform, FlatList, Alert
} from 'react-native';
import {ScrollableTabView, DefaultTabBar} from '@valdio/react-native-scrollable-tabview'
import {  AirbnbRating } from 'react-native-ratings';
import {Icon, Button} from "react-native-elements";
import {colors} from "../common/theme";
import {apiUrlCommon} from "../apiUrlCommon";
import SpinnerPage from "../common/spinner";
import {formatPhoneNumber} from "../common/functionCommon";
import {GeneralFailedMessage} from "../common/ExceptionMessage";

let tow_service;
let give_vote = false;

class Detail extends Component {
    state = {
        vehicles: [],
        insurances: []
    };

    serviceAndVehicle = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetServiceAndVehicleTypeForASById"+"/"+tow_service);
            const json = await response.json();
            this.setState({vehicles: json.result.vehicle_Type, isLoading:false});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    insuranceAndBrands = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetBrandAndInsuranceForASById"+"/"+tow_service);
            const json = await response.json();
            this.setState({ insurances: json.result.insurances, isLoading:false});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    componentWillMount(){
        this.insuranceAndBrands().then();
        this.serviceAndVehicle().then();
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
        const { insurances } = this.state;
        const { vehicles } = this.state;
        return (
            <View style={styles.inCardDetail}>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Araç Tipleri</Text>
                </View>
                <View style={styles.serviceType}>
                    <FlatList data={vehicles}
                              keyExtractor={(item) => item.type_Name}
                              renderItem={this.renderItemVehicle}
                    />
                </View>
                <View style={[styles.serviceTypeColor,styles.serviceType]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Kasko Firmaları</Text>
                </View>
                <View style={[styles.serviceType, styles.serviceSubDetailLast]}>
                    <FlatList data={insurances}
                              keyExtractor={(item) => item.insurance_Name}
                              renderItem={this.renderItem}
                    />
                </View>
            </View>
        )
    }
}

class TowTruck extends Component {
    state = {
        subDetail: [],
    };

    masterInfoDetail = async () => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster"+"/"+tow_service);
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

export default class TowTruckDetail extends Component {
    state = {
        data: [],
        dataMaster: [],
        cityName: '',
        district: '',
        isLoading:true
    };

    getTowTruckDetail = async (tow_service) => {
        try {
            const response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster"+"/"+tow_service);
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
        //console.log(this.props.otoService.autoservice_ID);
        //auto_service  = this.props.otoService.autoservice_ID;
        tow_service  = this.props.towService.autoservice_ID;
        return this.getTowTruckDetail(tow_service);
    }


    dialCall = () => {
        let phoneNumber = '';
        let callNumber = this.state.data.autoservice_Phone;

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:$'+callNumber;
        }else {
            phoneNumber = 'telprompt:$'+callNumber;
        }
        return Linking.openURL(phoneNumber);
    };

    ratingCompleted() {
        this.setState({loading : true});
        Alert.alert("Puanınız kaydedildi. İlginiz için teşekkür ederiz.",
            '',
            [{ text: 'Tamam'}]
        );
        this.setState({loading : false});
    };

    render() {
        const {isLoadingRating} = this.state;
        const ratingButton = isLoadingRating ? (
            <SpinnerPage />
        ):(
            <View style={{top: 10, right: 8}}>
                <AirbnbRating
                    type="star"
                    fractions={1}
                    reviews={["1", "2", "3", "4", "5"]}
                    startingValue={3}
                    imageSize={40}
                    onFinishRating={ ()=> {
                        if (give_vote === false){
                            this.ratingCompleted()
                        }else{
                            Alert.alert("Zaten oy vermiştiniz !");
                        }
                        give_vote = true
                    }
                    }
                    style={{ paddingVertical: 10 }}
                    isDisabled={give_vote}
                />
            </View>
        );
        const masterMain = (
            <View style={styles.mainBorder}>
                <View style={styles.viewStyle}>
                    <Text style={styles.textServiceName}
                          numberOfLines={2}>{this.state.data.autoservice_Name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {ratingButton}
                    </View>
                </View>
                <View style={styles.cardDetail}>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='user'
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
                                name='phone'
                                type='font-awesome'
                                color={colors.GREY.btnPrimary}
                                size={25}
                            />
                            <Text style={styles.text1}>Telefon Numarası</Text>
                        </View>
                        <View style={styles.flexView2}>
                            <Text style={styles.text2}> {formatPhoneNumber(this.state.data.autoservice_Phone)}</Text>
                        </View>
                    </View>
                    <View style={styles.myViewStyle}>
                        <View style={styles.iconViewStyle}>
                            <Icon
                                name='map-marker'
                                type='font-awesome'
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
                <View style={styles.callArea}>
                    <Button
                        onPress={this.dialCall}
                        icon={
                            <Icon
                                name='phone'
                                type='font-awesome'
                                size={30}
                                color="white"
                            />
                        }
                        title="   Hemen Ara"
                        buttonStyle={styles.callButton}
                    />
                </View>
            </View>
        );
        return (
            <ScrollableTabView
                collapsableBar={masterMain}
                tabBarTextStyle={{fontSize: 15}}
                style={styles.container}
                tabBarUnderlineStyle={{backgroundColor: 'orange'}}
                tabBarActiveTextColor='black'
                renderTabBar={() => <DefaultTabBar/>}>
                <View tabLabel='Çekici' style={{borderTopWidth: 1, borderColor: 'grey'}}>
                    <TowTruck/>
                </View>
                <View tabLabel='Detaylı Bilgi' style={{borderTopWidth: 1, borderColor: 'grey'}}>
                    <Detail/>
                </View>
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainBorder: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        marginTop:30
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
        marginTop: 40
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
    callButton: {
        backgroundColor: 'green',
        borderRadius: 10
    },
    callArea: {
        marginTop: 13,
        marginBottom: 13,
        width: '70%',
        alignSelf: 'center',
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