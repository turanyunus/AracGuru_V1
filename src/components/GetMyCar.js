import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView, FlatList, Platform
} from 'react-native';
import {colors} from "../common/theme";
import { Icon} from "react-native-elements";
import {Actions} from "react-native-router-flux";
import {apiUrlCommon} from "../apiUrlCommon";
import {GeneralFailedMessage} from "../common/ExceptionMessage";
import {connect} from "react-redux";
import {GetAsyncStorageCommon, tokenDecode} from "../common/functionCommon";
import SpinnerPage from "../common/spinner";

export let myCarSelectedValue = null;
let userID;
let listCountCheck = 0;

class GetMyCar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            carList: [],
            carBrand:'',
            carModel:'',
            carYear:'',
            carFuel:'',
            loading:false
        }
    }

    componentWillMount(){
        this.getMyCarsList().then();
    }

    componentWillUnmount(): void {
        listCountCheck = 0;
    }

    async getMyCarsList(){
        try {
            this.setState({loading : true});
            const {userToken} = this.props;
            const token = await GetAsyncStorageCommon();
            if (token != null){
                userID = tokenDecode(token);
            }else{
                userID = tokenDecode(userToken);
            }

            let response = await fetch(apiUrlCommon + 'customer_user/GetCustomerUserCar/'+userID);
            let json = await response.json();
            this.setState({ carList: json.result });
            const carListCount = this.state.carList.length;

            if (carListCount === 0){
                listCountCheck = 1;
                this.setState({loading : false});
            }else{
                this.setState({loading : false});
            }
        }catch(error) {
            this.setState({loading : false});
            Alert.alert(GeneralFailedMessage);
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.mainView}>
            <View style={styles.textView3}>
                <View style={styles.iconClickStyle}>
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
                                  numberOfLines={2}>{item.brands.brand_Name} - {item.vehicle_Model.model_Name}
                            </Text>
                            <View style={[styles.picupStyle,styles.position]}>
                                <Text style={[styles.picPlaceStyle,styles.placeStyle]}>{item.year}</Text>
                                <Text style={[styles.picPlaceStyle,styles.placeStyle]}> - {item.fuel}</Text>
                            </View>
                        </View>
                        <View style={styles.textView2}>
                            <TouchableOpacity style={[styles.fareStyle,styles.dateStyle]}
                                              key={item.customerUser_Car_Id}
                                              onPress = {()=>{
                                                  myCarSelectedValue = item.customerUser_Car_Id;
                                                  Actions.MyCarsUpdatedScreen();
                                              }}>
                                <Icon
                                    name='edit'
                                    type='font-awesome'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );


    render() {
        const { carList } = this.state;

        const {loading} = this.state;
        const spinnerCheck = loading ? (
            <SpinnerPage />
        ):(
            <ScrollView style={styles.scrollViewStyle}>
                <FlatList data={carList}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={this.renderItem}
                />
            </ScrollView>
        );
        if (listCountCheck === 1){
            return (
                <View style={styles.container}>
                    <Image style={styles.images}
                           source={Platform.OS==='ios'?require('./../../assets/images/car-add.png'):require('./../../assets/images/car-add.png')}/>
                    <Text style={styles.emptyMessage}>Henüz hiç kayıtlı</Text>
                    <Text style={styles.emptyMessage}>aracınız yok.</Text>
                </View>
            );
        }else{
            return (
                <View style={styles.cartContainer}>
                    {spinnerCheck}
                </View>
            );
        }


    }
};

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
        flexDirection: 'row'
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
        marginTop:10,
        marginLeft:5,
        marginRight:10,
        borderBottomWidth: 0.2
    },
    textView1:{
        flex: 5.5,
        marginBottom:10
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
        marginTop:5,
        color:colors.GREY.default
    },
    picupStyle:{
        flexDirection:'row',
    },
    position:{
        marginTop:10
    },
    greenDot:{
        alignSelf:'center',
        borderRadius:10,
        width:10,
        height: 10,
        backgroundColor: colors.GREEN.default
    },
    picPlaceStyle:{
        color: colors.GREY.secondary,
        marginRight: 5
    },
    placeStyle:{
        fontSize:16,
        alignSelf:'center'
    },
    dropStyle:{
        flexDirection:'row',
    },
    textViewStyle:{
        marginBottom:5
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
        flex: 1.5,
        marginTop:10
    },
    fareStyle:{
        fontSize:18,
    },
    container:{
        flex:1,
        padding:20,
        paddingTop:80,
        flexDirection: 'column',
        alignItems: 'center'
    },
    images:{
        marginBottom:15,
    },
    emptyMessage:{
        fontSize:16,
        color:colors.GREY.default,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        fontWeight: 'bold'
    }
});

const mapStateToProps = state => {
    const userToken = state.auth.res.tokenString;
    return{
        userToken
    }
};

export default connect(mapStateToProps,
    {})(GetMyCar);
