import { Alert,Platform } from "react-native";

                    //IPV4 da rede
const  server = "http://10.0.0.146:3000"
  

function showError(err){
    Alert.alert("Ops! Ocorreu um problema!", `Mensagem: ${err}`)
}
function showSuccess(msg){
    Alert.alert("Sucesso!",msg)
}

export {server,showError,showSuccess}