import React,{Component} from "react";
import { View,Text,ImageBackground,StyleSheet, FlatList,TouchableOpacity,Platform, Alert, Modal} from "react-native";
import moment from "moment"
import 'moment/locale/pt-br'
import commonStyles from "../commonStyles";
import Task from "../components/Task";
import Icon from "react-native-vector-icons/FontAwesome"
import AddTask from "./addTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { server, showError } from "../common";
import axios from "axios";

//Imagens
import todayImage from "../../assets/imgs/today.jpg"
import tomorrowImage from "../../assets/imgs/tomorrow.jpg"
import weekImage from "../../assets/imgs/week.jpg"
import monthImage from "../../assets/imgs/month.jpg"


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
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        },this.filterTasks)
        this.loadTasks()
    }

    loadTasks = async() => {
        try{
            const maxDate = moment()
                .add({days:this.props.daysAhead})
                .format("YYYY-MM-DD 23:59:59")
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({tasks:res.data},this.filterTasks)
        }catch(e){
            showError(e)
        }
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
        AsyncStorage.setItem("tasksState",JSON.stringify({
            showDoneTasks: this.state.showDoneTasks 
        }))
    }
    
    //Marca a task como concluida ou desmarca
    toggleTask = async taskId => {
        try{
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
       
    }


    addTask = async newTask =>{
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert("Dados invalidos","Descrição não informada")
            return
        }
        try{
            await axios.post(`${server}/tasks/`,{
                desc: newTask.desc,
                estimateAt: newTask.date
            })
            this.setState({showAddTasks:false},this.loadTasks)

        }catch(e){
            showError(e)
        }
    }

    deleteTask = async taskId => {
        try{
            await axios.delete(`${server}/tasks/${taskId}/`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
    }

    getImage = () =>{
        switch(this.props.daysAhead){
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () =>{
        switch(this.props.daysAhead){
            case 0: return commonStyles.colors.today
            case 1: return  commonStyles.colors.tomorrow
            case 7: return  commonStyles.colors.week
            default: return  commonStyles.colors.month
        }
    }
    
    render(){
        const today = moment().locale("pt-br").format("ddd,D [de] MMMM")
        return(
            <View style={style.container}>
                    {/* Add Task Pop-Up */}
                    <View style={{zIndex:1}}>
                        <AddTask
                            isVisible={this.state.showAddTasks}
                            onCancel={() => this.setState({ showAddTasks: false })}
                            onSave={this.addTask} />
                    </View>
                     {/* Tarefa Background */}
                    <ImageBackground source={this.getImage()} style={style.background}>
                        <View style={style.iconBar}>
                            {/* Botão Abrir Drawer */}
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name={"bars"} size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                              {/* Botão Visibilidade */}
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <Icon name={this.state.showDoneTasks ? "eye" : "eye-slash"} size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                        </View>
                        <View style={style.titleBar}>
                            <Text style={style.title}>{this.props.title}</Text>
                            <Text style={style.subtitle}>{today }</Text>
                        </View>
                    </ImageBackground>
                    {/* Lista de Tarefas */}
                    <View style={style.taskList}>
                        <FlatList 
                                data={this.state.visibleTasks} 
                                keyExtractor={item => `${item.id}`} 
                                renderItem={({item}) => <Task {...item} 
                                    onToggleTask={this.toggleTask} 
                                    onDelete={this.deleteTask}/>}/>
                    </View>
                    {/* Botão add task */}
                    <TouchableOpacity 
                        style={[style.addButton,{backgroundColor:this.getColor()}]}
                        activeOpacity={0.7}
                        onPress={() => this.setState({showAddTasks:true})}>
                        <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
                    </TouchableOpacity>
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
    taskList:{
        flex:7,
        zIndex:0
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
        justifyContent:"space-between",
        marginTop:Platform.OS === "ios" ? 50 : 30

    },
    addButton:{
        position:"absolute",
        right:30,
        bottom:30,
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:"center",
        alignItems:"center"
    }
})