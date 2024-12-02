import React from "react";
import { View,Text, StyleSheet, TouchableWithoutFeedback, Touchable, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from "../commonStyles";
import moment from "moment";
import 'moment/locale/pt-br'
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default props =>{
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format("ddd, D [de]  MMMM")

    const  getRightContent = () => {
        return(
            <TouchableOpacity style={styles.right}
                onPress={()=> props.onDelete && props.onDelete(props.id)}
            >
                <Icon name="trash" size={30} color="#FFF"/>
            </TouchableOpacity>
        )
    }

    const  getLeftContent = () => {
        return(
            <View style={styles.left}>
                <Icon name="trash" size={20} color="#FFF" style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    const leftOpen = () => { props.onDelete && props.onDelete(props.id)}

  
    
    return(
        <Swipeable 
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        onSwipeableOpen={(direction => direction === "left" ? leftOpen() : undefined)}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.onToggleTask(props.id)}
                >
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                <Text style={[styles.desc,props.doneAt != null ? {textDecorationLine:"line-through"} : {}]}>
                    {props.desc}
                </Text>
                <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt){
    if(doneAt != null){
        return (
            <View style={styles.done}>
                <Icon name="check" size={18} color="#FFF"/>
            </View>
        )
    }else{
        return (
            <View  style={styles.pending}>
                <Text></Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        borderColor:"#AAA",
        borderBottomWidth:1,
        alignItems:"center",
        paddingVertical:10,
        backgroundColor:"#FFF"
    },
    checkContainer:{
        width:'20%',
        alignItems:"center",
        justifyContent:"center"
    },
    pending:{
        height:25,
        width:25,
        borderRadius:13,
        borderWidth:1,
        borderColor: "#555"
    },
    done:{
        height:25,
        width:25,
        borderRadius:13,
        backgroundColor:"#4D7031",
        alignItems:"center",
        justifyContent:"center"
    },
    desc:{
        color:commonStyles.colors.mainText,
        fontSize:15,
    },
    date:{
        color:commonStyles.colors.subText,
        fontSize:12,
    },right:{
        backgroundColor: "red",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end",
        paddingHorizontal:20,

    },
    left:{
        flex:1,
        backgroundColor: "red",
        flexDirection: "row",
        alignItems:"center"
    },
    excludeIcon:{
        marginLeft:10
    },
    excludeText:{
        color: "#FFF",
        fontSize:20,
        margin:10,
    }
})