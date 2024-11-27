import React,{Component} from "react";
import { View,Text,ImageBackground,StyleSheet, FlatList,TouchableOpacity,Platform} from "react-native";
import TodayImage from "../../assets/imgs/today.jpg"
import moment from "moment"
import 'moment/locale/pt-br'
import commonStyles from "../commonStyles";
import Task from "../components/Task";
import Icon from "react-native-vector-icons/FontAwesome"

export default class TaskList extends Component{
    //Dados 
    state={
        showDoneTasks: true,
        visibleTasks: [],
        task:[{
            id:Math.random(),
            desc: "Comprar livro de React Native",
            estimateAt: new Date(),
            doneAt: new Date(),
        },
        {
            id:Math.random(),
            desc: "Estudar para embarca",
            estimateAt: new Date(),
            doneAt: null,
        },]
    }

 

    toggleFilter = () =>{
        this.setState({showDoneTasks: !this.state.showDoneTasks},this.filterTasks)
    }

    filterTasks = () =>{
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.task]
        }else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.task.filter(pending)
        }
        this.setState({visibleTasks})
    }
    
    //Marca a task como concluida ou desmarca
    toggleTask = taskId => {
        const tasks = [...this.state.task]
        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({tasks}, this.filterTasks)
       
    }
    
    render(){
        const today = moment().locale("pt-br").format("ddd,D [de] MMMM")
        return(
            <View style={style.container}>
                <ImageBackground source={TodayImage} style={style.background}>
                    <View style={style.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? "eye" : "eye-slash"} size={20} color={commonStyles.colors.secondary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={style.titleBar}>
                        <Text style={style.title}>Hoje</Text>
                        <Text style={style.subtitle}>{today }</Text>
                    </View>
                </ImageBackground>
                <View style={style.taskContainer}>
                   <FlatList 
                        data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`} 
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask}/>} 
                    />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    background:{
        flex:3
    },
    taskContainer:{
        flex:7
    },
    titleBar:{
        flex:1,
        justifyContent:"flex-end"
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft:20,
        marginBottom:20,
    },
    subtitle:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft:20,
        marginBottom:30, 
    },
    iconBar:{
        flexDirection:"row",
        marginHorizontal:20,
        justifyContent:"flex-end",
        marginTop:Platform.OS === "ios" ? 50 : 30

    }
})