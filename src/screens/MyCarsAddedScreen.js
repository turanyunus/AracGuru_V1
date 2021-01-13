import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableWithoutFeedback, Image, Platform, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {colors} from '../common/theme';
import { Actions } from 'react-native-router-flux';
import RNPickerSelect from "react-native-picker-select";
import {apiUrlCommon} from "../apiUrlCommon";
import {
    FourCharForYearsErrorMessage,
    GeneralFailedMessage,
    JustNumberForYearsErrorMessage,
    NullCheckMessage, ThirtyCharForYearsErrorMessage
} from "../common/ExceptionMessage";
import {MyCarsAddedInput} from "../models/MyCarsAddedInput";
import SpinnerPage from "../common/spinner";
import {GetAsyncStorageCommon, tokenDecode} from "../common/functionCommon";
const {width, height} = Dimensions.get('window');

let markerBrand = [];
let markersModel = [];
let userID;

const fuel = [
    {
        label: 'Benzin',
        value: 'Benzin',
    },
    {
        label: 'Dizel',
        value: 'Dizel',
    },
    {
        label: 'Benzin+LPG',
        value: 'Benzin+LPG',
    },
    {
        label: 'Hybrid',
        value: 'Hybrid',
    }
];

export default class MyCarsAddedScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedBrand:'',
            selectedModel:'',
            selectedYear:'',
            selectedFuel:'',
            customerBrand: [],
            customerModel: [],
            customerYear: [],
            customerFuel: [],
            loading:false
        };
    }

    async componentDidMount(){
        const {userToken} = this.props;
        const token = await GetAsyncStorageCommon();
        if (token != null){
            userID = tokenDecode(token);
        }else{
            userID = tokenDecode(userToken);
        }
        this.fetchMyCarBrand().then();
    }

    fetchMyCarBrand = async () => {
        markerBrand = [];
        try {
            const response = await fetch(apiUrlCommon + "brands");
            const json = await response.json();
            this.setState({ data: json, loading:false });

            for(let items of this.state.data) {
                markerBrand.push({
                    label: items.brand_Name,
                    value:  items.brand_ID,
                });
                await this.setState({
                    customerBrand: markerBrand  // add this
                });
            }
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    onMyCarBrandChange(text){
        this.setState({selectedBrand: text});
        this.fetchMyCarModel(text).then();
    };

    fetchMyCarModel = async (text) => {
        markersModel = [];
        try {
            if (text != null){
                const response = await fetch(apiUrlCommon + "vehicle_models/GetVehicleModelByBrandId/"+ text);
                const json = await response.json();
                this.setState({ data: json, loading:false });
                for(let items of this.state.data) {
                    markersModel.push({
                        label: items.model_Name,
                        value:  items.model_ID,
                    });
                    await this.setState({
                        customerModel: markersModel // add this
                    });
                }
            }
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    onMyCarsModelChange(text){
        this.setState({selectedModel: text});
    }

    onMyCarsFuelChange(text){
        this.setState({selectedFuel: text});
    }

    onMyCarsAddedClick(){
        if (this.state.selectedBrand === '' || this.state.selectedBrand == null){
            Alert.alert(NullCheckMessage);
            return;
        }else if (this.state.selectedModel === '' || this.state.selectedModel == null){
            Alert.alert(NullCheckMessage);
            return;
        }else if (this.state.selectedFuel === '' || this.state.selectedFuel == null){
            Alert.alert(NullCheckMessage);
            return;
        }else if (this.state.date === '' || this.state.date == null){
            Alert.alert(NullCheckMessage);
            return;
        }

        let dateLength = this.state.date.length;
        if (dateLength !== 4){
            Alert.alert(
                FourCharForYearsErrorMessage,
                '',
                [{ text: 'Tamam'}
                ],
            );
            return;
        }
        if (isNaN(this.state.date)){
            Alert.alert(
                JustNumberForYearsErrorMessage,
                '',
                [{ text: 'Tamam'}
                ],
            );
            return;
        }

        this.setState({loading : true});
        try{

            let model = new MyCarsAddedInput();
            model.customer_Id = userID;
            model.brand_Id = this.state.selectedBrand;
            model.vehicle_Model_Id = this.state.selectedModel;
            model.fuel = this.state.selectedFuel;
            model.year = this.state.date;

            fetch(apiUrlCommon + 'customer_user/CustomerUserCar',{
                method:'POST' ,
                headers :{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(model)
            }).then((res)=> res.json())
                .then((res) => {
                    this.setState({loading : false});
                    if (res.error != null)
                        Alert.alert(res.error.message);
                    else{
                        Alert.alert(
                            'Aracınız başarıyla eklendi.',
                            '',
                            [{ text: 'Tamam'}
                            ],
                        );
                        Actions.GetMyCarsScreen();
                    }
                })
                .catch((err) => {
                    this.setState({loading : false});
                    Alert.alert(GeneralFailedMessage);
                });
        }catch (e) {
            this.setState({loading : false});
            Alert.alert(GeneralFailedMessage);
        }
    }

    render() {
        const placeholderBrand = {
            label: "Marka Seçiniz",
            value: null,
            color: '#000000',
        };
        const placeholderModel = {
            label: "Model Seçiniz",
            value: null,
            color: '#000000',
        };
        const placeholderFuel = {
            label: "Yakıt Tipini Seçiniz",
            value: null,
            color: '#000000',
        };

        const {loading} = this.state;
        const registerButton = loading ? (
            <SpinnerPage />
        ):(
            <TouchableOpacity
                onPress={() => this.onMyCarsAddedClick()}
                style={styles.button}>
                <Text style={styles.textStyle}>Araç Ekle</Text>
            </TouchableOpacity>
        );


        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        centerComponent={<Text style={styles.headerTitleStyle}>Araç Ekle</Text>}
                        //rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.NotifScreen() } }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"padding"} style={styles.form}>
                        <View style={styles.viewStyle}>
                            <View style={styles.imageParentView}>
                                <View style={styles.imageViewStyle}>
                                    <Image source={Platform.OS==='ios'?require('../../assets/images/profilePic.png'):require('../../assets/images/profilePic.png')} style={{borderRadius: 130/2, width: 130, height: 130}} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.newViewStyle}>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='badge'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <ScrollView>
                                    <RNPickerSelect
                                        placeholder={placeholderBrand}
                                        items={markerBrand}
                                        onValueChange={this.onMyCarBrandChange.bind(this)}
                                        style={styles}
                                        value={this.state.selectedBrand}
                                        useNativeAndroidPickerStyle={false}
                                        pickerProps={{ model: "dialog" }}
                                        doneText={'Bitti'}
                                    />
                                </ScrollView>
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='speedometer'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <ScrollView>
                                    <RNPickerSelect
                                        placeholder={placeholderModel}
                                        items={markersModel}
                                        onValueChange={this.onMyCarsModelChange.bind(this)}
                                        style={styles}
                                        value={this.state.selectedModel}
                                        useNativeAndroidPickerStyle={false}
                                        pickerProps={{ model: "dialog" }}
                                        doneText={'Bitti'}
                                    />
                                </ScrollView>
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='calendar'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <TextInput
                                    style={styles.textInputStyle}
                                    onChangeText={(text)=>{this.setState({date: text})}}
                                    value={this.state.date}
                                    maxLength={4}
                                    keyboardType={'numeric'}
                                    returnKeyType={'done'}
                                    returnKeyLabel={'Bitti'}
                                    placeholder = "Araç Yılını Giriniz"
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='rocket'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <ScrollView>
                                    <RNPickerSelect
                                        placeholder={placeholderFuel}
                                        items={fuel}
                                        onValueChange={this.onMyCarsFuelChange.bind(this)}
                                        style={styles}
                                        value={this.state.selectedFuel}
                                        useNativeAndroidPickerStyle={false}
                                        pickerProps={{ model: "dialog" }}
                                        doneText={'Bitti'}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.flexView3}>
                            {registerButton}
                        </View>
                    </KeyboardAvoidingView>
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
    logo:{
        flex:1,
        position:'absolute',
        top:110,
        width:'100%',
        justifyContent:"flex-end",
        alignItems:'center'
    },
    footer:{
        flex:1,
        position:'absolute',
        bottom:0,
        height:150,
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center'
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
    profStyle:{
        fontSize: 18,
        left: 20,
        fontWeight:'bold',
        color:colors.GREY.btnPrimary,

    },
    viewStyle:{
        justifyContent:'center',
        alignItems:'center',
        marginTop: 13
    },
    imageParentView:{
        borderRadius: 150/2,
        width: 150,
        height: 150,
        backgroundColor: colors.GREY.default,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageViewStyle:{
        borderRadius: 140/2,
        width: 140,
        height: 140,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPropStyle:{
        fontSize: 21,
        fontWeight:'bold',
        color: colors.GREY.iconSecondary,

        top: 8
    },
    newViewStyle:{
        flex: 1,
        marginTop: 10,
        marginRight: 15,
        marginLeft: 15
    },
    emailStyle:{
        fontSize: 17,
        left: 10,
        color: colors.GREY.btnPrimary,

    },
    emailAdressStyle:{
        fontSize: 15,
        color: colors.GREY.secondary,

    },
    mainIconView:{
        flex: 1,
        left: 20,
        marginRight: 40,
        borderBottomColor: colors.GREY.iconSecondary,
        borderBottomWidth: 1
    },
    text1:{
        fontSize: 17,
        left: 10,
        color:colors.GREY.btnPrimary,

    },
    text2:{
        fontSize: 15,
        left: 10,
        color:colors.GREY.secondary,

    },
    textIconStyle:{
        width: width,
        height: 50,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textIconStyle2:{
        width: width,
        height: 50,
        marginTop:10,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainView:{
        flex:1,
        backgroundColor: colors.WHITE
    },
    flexView1:{
        flex:1
    },
    flexView2:{
        flex:1
    },
    flexView3:{
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center'
    },
    textInputContainerStyle:{
        flexDirection:'row',
        alignItems: "center",
        marginRight:20,
        padding: 15
    },
    iconContainer: {
        paddingTop:8,
        width: 35
    },
    textInputStyle:{
        marginLeft:20,
        width: '82%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        paddingLeft:10,
        fontSize:18,
        color: '#CCC'
    },
    button:{
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:10,
        height:50,
        width:'70%',
        backgroundColor: colors.GREY.default
    },
    buttonDisabled: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:10,
        height:50,
        width:'70%',
        display: 'none',
        backgroundColor: colors.GREY.default,
        opacity:0.7
    },
    textStyle:{
        fontSize: 16,
        color: colors.WHITE,
        textAlign: "center",
        fontWeight: 'bold'
    },
    inputIOS: {
        fontSize: 18,
        marginLeft: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        marginLeft: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputTextStyle:{
        borderColor: 'gray',
        borderWidth:1,
        paddingLeft:10
    },
    form: {
        flex: 1,
        marginBottom: 75
    }
});
