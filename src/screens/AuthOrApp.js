import { Component } from "react";
import { ActivityIndicator, StyleSheet,View} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AuthOrApp extends Component{
    async componentDidMount(){
        const userDataJson = await AsyncStorage.getItem("userData")
        let userData = null
        try{
            userData = JSON.parse(userDataJson)
        }catch(e){
            //userDataJson invalido
        }

        if(userData && userData.token){
            axios.defaults.headers.common["Authorization"] = `bearer ${userData.token}`
            this.props.navigation.navigate("Home",userData)
        }else{
            this.props.navigation.navigate("Auth")
        }
    }
    render() {
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#000"
    }
})