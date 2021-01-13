import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableWithoutFeedback, Image, Platform, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView
} from 'react-native';
import {Header, Icon, Input} from 'react-native-elements';
import {colors} from '../common/theme';
import { Actions } from 'react-native-router-flux';
import RNPickerSelect from "react-native-picker-select";
import {apiUrlCommon} from "../apiUrlCommon";
import {connect} from 'react-redux';
import {
    FourCharForYearsErrorMessage,
    GeneralFailedMessage,
    JustNumberForYearsErrorMessage
} from "../common/ExceptionMessage";
import SpinnerPage from "../common/spinner";
import {myCarSelectedValue} from "../components/GetMyCar";
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

class MyCarsUpdatedScreen extends Component {
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
            loading:false,
            dataBrand : [],
            dataModel: [],
            dataForYear : '',
            date: ''
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
        this.fetchMyCarsInfo().then();
        this.fetchMyCarBrand().then();
    }

    fetchMyCarsInfo  = async () => {
        try {
            const response = await fetch(apiUrlCommon + "customer_user/GetCustomerUserCarForUpdate/"+myCarSelectedValue);
            const json = await response.json();
            this.setState({ data: json, loading:false });
            this.setState({ date: this.state.data?.result?.year});
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    };

    fetchMyCarBrand = async () => {
        markerBrand = [];
        try {
            const response = await fetch(apiUrlCommon + "brands");
            const json = await response.json();
            this.setState({ dataBrand: json, loading:false });

            for(let items of this.state.dataBrand) {
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
            if (text!=null){
                this.state.data.result.vehicle_Model.model_Name = null;
                const response = await fetch(apiUrlCommon + "vehicle_models/GetVehicleModelByBrandId/"+ text);
                const json = await response.json();
                this.setState({ dataModel: json, loading:false });
                for(let items of this.state.dataModel) {
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

    onYearsChange(text){
        this.setState({date: text});
    };

    onMyCarsFuelChange(text){
        this.setState({selectedFuel: text});
    }

    onMyCarsUpdatedClick(customerBrand,customerModel,customerFuel,cusDate){
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
            Alert.alert(JustNumberForYearsErrorMessage);
            return;
        }
        this.setState({loading : true});

        try{
            let model = new MyCarsUpdatedScreen();
            model.customer_Id = userID;
            model.customer_Car_Id = myCarSelectedValue; // araçlarım listesinden
            model.brand_Id = customerBrand;
            model.vehicle_Model_Id = customerModel;
            model.fuel = customerFuel;
            model.year = cusDate;
            model.status = 1;
            fetch(apiUrlCommon + 'customer_user/CustomerUserCarUpdate',{
                method:'PUT' ,
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
                            'Aracınız başarıyla güncellendi.',
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

    onMyCarsDeleteClick(){
        let getValues =  this.getStateValues();

        this.setState({loading : true});
        try{
            let model = new MyCarsUpdatedScreen();
            model.customer_Id = userID; // token'dan gelicek bir bilgi
            model.customer_Car_Id = myCarSelectedValue;
            model.brand_Id = getValues[0];
            model.vehicle_Model_Id = getValues[1];
            model.fuel = getValues[2];
            model.year = getValues[3];
            model.status = 0;
            fetch(apiUrlCommon + 'customer_user/CustomerUserCarUpdate',{
                method:'PUT' ,
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
                            'Aracınız başarıyla silindi.',
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

    getStateValues(){
        let data = [];
        data = this.state.data;
        let markerStateValues = [];

        if (this.state.selectedBrand == null) {
            markerStateValues[0] = data?.result?.brands?.brand_ID;
        }else {
            markerStateValues[0] = this.state.selectedBrand
        }

        if (this.state.selectedModel == null){
            markerStateValues[1] = data?.result?.vehicle_Model?.model_ID;
        }else {
            markerStateValues[1] = this.state.selectedModel
        }

        if (this.state.selectedFuel == null){
            markerStateValues[2] = data?.result?.fuel;
        }else {
            markerStateValues[2] = this.state.selectedFuel
        }

        if (this.state.date == null){
            markerStateValues[3] = data?.result?.year;
        }else {
            markerStateValues[3] = this.state.date
        }
        return markerStateValues;

    }

    render() {
        let data = [];
        data = this.state.data;
        const placeholderBrand  = {
            label: data?.result?.brands?.brand_Name == null ? "Marka Seçiniz" : data.result?.brands?.brand_Name,
            value: null,
            color: '#000000',
        };
        const placeholderModel  = {
            label:  data?.result?.vehicle_Model?.model_Name == null ? "Model Seçiniz" : data.result?.vehicle_Model?.model_Name,
            value: null,
            color: '#000000',
        };
        const placeholderFuel   = {
            label: data?.result?.fuel == null ? "Yakıt Tipini Seçiniz" : data.result?.fuel,
            value: null,
            color: '#000000',
        };

        const {loading}      = this.state;
        const registerButton = loading ? (
            <SpinnerPage />
        ):(
            <TouchableOpacity
                onPress={() =>
                {
                    let getValues =  this.getStateValues();
                    this.onMyCarsUpdatedClick(getValues[0],getValues[1],getValues[2],getValues[3]);
                }}
                style={styles.button}>
                <Text style={styles.textStyle}>Araç Güncelle</Text>
            </TouchableOpacity>
        );


        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        rightComponent={{icon:'trash', type:'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,
                            onPress: ()=>{ Alert.alert(
                                '',
                                'Aracınızı silmek istediğinizden emin misiniz ?',
                                [{ text: 'Hayır'},
                                         {text: 'Evet',
                                             onPress: () => this.onMyCarsDeleteClick()},
                                ],
                                {cancelable: false},
                            );
                            }}}
                        centerComponent={<Text style={styles.headerTitleStyle}>Araç Güncelle</Text>}
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
                                    onChangeText={ this.onYearsChange.bind(this)}
                                    value={this.state.date}
                                    keyboardType={'numeric'}
                                    returnKeyType={'done'}
                                    maxLength={4}
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
    form: {
        flex: 1,
        marginBottom: 75
    }
});

const mapStateToProps = state => {
    const userToken = state.auth.res.tokenString;
    return{
        userToken
    }
};

export default connect(mapStateToProps,
    {})(MyCarsUpdatedScreen);

