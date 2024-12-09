import React from "react";
import Auth from "./screens/Auth";
import TaskList from "./screens/TaskList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createDrawerNavigator} from '@react-navigation/drawer';
import Menu from "./screens/Menu";
import AuthOrApp from "./screens/AuthOrApp";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const menuConfig = {
    initialRouteName:"Today",
    labelStyle: {
        fontWeight: 'normal',
        fontSize: 20,
    },
    activeTintColor: '#080',
    headerShown: false,
}

const DrawerNavigator = props => {
    const {email,name} = props.route.params
    return (
        <Drawer.Navigator 
            screenOptions={menuConfig}
            drawerContent={(props) => <Menu {...props} email={email} name={name}/>}>
            <Drawer.Screen name="Today" options={{ title: 'Hoje' }}>
                {props => <TaskList {...props} title='Hoje' daysAhead={0} />}
            </Drawer.Screen>
            <Drawer.Screen name="Tomorrow" options={{ title: 'Amanhã' }}>
                {props => <TaskList {...props} title='Amanhã' daysAhead={1} />}
            </Drawer.Screen>
            <Drawer.Screen name="Week" options={{ title: 'Semana' }}>
                {props => <TaskList {...props} title='Semana' daysAhead={7} />}
            </Drawer.Screen>
            <Drawer.Screen name="Month" options={{ title: 'Mês' }}>
                {props => <TaskList {...props} title='Mês' daysAhead={30} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
};

function AuthNavigator(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="AuthOrApp" component={AuthOrApp}/>
                <Stack.Screen name="Auth" component={Auth}/>
                <Stack.Screen name="Home" component={DrawerNavigator}/>
            </Stack.Navigator>
    )
}

 export default function MainNavigation(){
    return(
        <NavigationContainer>
            <AuthNavigator/>
        </NavigationContainer>
    )
 }