import React,{ Component } from "react";
import { 
    Alert,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import backgroundImage from "../../assets/imgs/login.jpg"
import commonStyles from "../commonStyles";

export default class Auth extends Component{
    state = {
        name:"",
        email:"",
        password: "",
        confirmPassword:"",
        stageNew: false,
    }

    signinOrsingup = () => {
        if(this.state.stageNew){
            Alert.alert("Sucesso!","Criar Conta")
        }else{
            Alert.alert("Sucesso!","Logar")
        }
    }
    render(){
        return(
            <ImageBackground 
                source={backgroundImage}
                style={styles.background}>
                <Text style={styles.title} >Tasks</Text>
                {/* Inputs */}
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? "Crie sua conta" : "Informe seus dados"}
                    </Text>
                    {/* Campo Condicional Nome */}
                    {this.state.stageNew && 
                        <TextInput 
                        placeholder="Nome" 
                        value={this.state.name}
                        style={styles.input}
                        onChangeText={name => this.setState({name})}/>  
                    }
                    {/* Campo Email */}
                    <TextInput 
                        placeholder="E-Mail" 
                        value={this.state.email}
                        style={styles.input}
                        onChangeText={email => this.setState({email})}/>
                    {/* Campo Senha */}
                    <TextInput 
                        placeholder="Senha" 
                        value={this.state.password}
                        style={styles.input}
                        onChangeText={password => this.setState({password})}
                        secureTextEntry={true}/>  
                    {/* Campo Condicional Confirmação Senha */}
                    {this.state.stageNew && 
                        <TextInput 
                        placeholder="Confirmação Senha" 
                        value={this.state.confirmPassword}
                        style={styles.input}
                        onChangeText={confirmPassword => this.setState({confirmPassword})}
                        secureTextEntry={true}/>  
                    }
                    {/* Botão */}
                    <TouchableOpacity onPress={this.signinOrsingup}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? "Registrar" : "Entrar"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                    <TouchableOpacity 
                        style={{padding:10,}} 
                        onPress={() => this.setState({stageNew:!this.state.stageNew})}> 
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? "Já possui conta?" : "Ainda não possui conta?"} 
                        </Text>  
                    </TouchableOpacity>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    background:{
        flex:1,
        width:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    title:{
        color: commonStyles.colors.secondary,
        fontSize:70,
        marginBottom:10,
    },
    subtitle:{
        fontSize:20,
        color:"#FFF",
        textAlign:"center",
        marginBottom:10
    },
    formContainer:{
        backgroundColor:"rgba(0,0,0,0.8)",
        padding:20,
        width:"90%"
        
    },
    input:{
      marginTop:10,
      backgroundColor:"#FFF",
      padding: Platform.OS == "ios" ? 15 : 10,

    },
    button:{
        backgroundColor:"#080",
        marginTop:10,
        padding:10,
        alignItems:"center",
    },
    buttonText:{
        color:"#FFF",
        fontSize:20,
    }
})