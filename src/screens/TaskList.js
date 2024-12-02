import React,{Component} from "react";
import { View,Text,ImageBackground,StyleSheet, FlatList,TouchableOpacity,Platform, Alert} from "react-native";
import TodayImage from "../../assets/imgs/today.jpg"
import moment from "moment"
import 'moment/locale/pt-br'
import commonStyles from "../commonStyles";
import Task from "../components/Task";
import Icon from "react-native-vector-icons/FontAwesome"
import AddTask from "./addTask";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    showDoneTasks: true,
    showAddTasks:false,
    visibleTasks: [],
    tasks:[]
}

export default class TaskList extends Component{
    //Dados 
    state={
        ...initialState 
    }

    componentDidMount = async () =>{
        const stateString = await AsyncStorage.getItem("tasksState")        
        const state = JSON.parse(stateString) || initialState
        this.setState(state,this.filterTasks)
    }

    toggleFilter = () =>{
        this.setState({showDoneTasks: !this.state.showDoneTasks},this.filterTasks)
    }

    filterTasks = () =>{
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        }else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({visibleTasks})
        AsyncStorage.setItem("tasksState",JSON.stringify(this.state))
    }
    
    //Marca a task como concluida ou desmarca
    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({tasks}, this.filterTasks)
       
    }

    addTask = newTask =>{
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert("Dados invalidos","Descrição não informada")
            return
        }
        const tasks = [...this.state.tasks]
        tasks.push({
            id:Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt:null,
        })
        this.setState({tasks,showAddTasks:false},this.filterTasks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({tasks},this.filterTasks)
    }
    
    render(){
        const today = moment().locale("pt-br").format("ddd,D [de] MMMM")
        return(
            <GestureHandlerRootView>
                <View style={style.container}>
                    <AddTask 
                        isVisible={this.state.showAddTasks}
                        onCancel={() => this.setState({showAddTasks:false})}
                        onSave={this.addTask}/>
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
                            renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>} 
                        />
                    </View>
                    <TouchableOpacity 
                        style={style.addButton}
                        activeOpacity={0.7}
                        onPress={() => this.setState({showAddTasks:true})}>
                        <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
                    </TouchableOpacity>
                </View>
            </GestureHandlerRootView>
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

    },
    addButton:{
        position:"absolute",
        right:30,
        bottom:30,
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor: commonStyles.colors.today,
        justifyContent:"center",
        alignItems:"center"
    }
})