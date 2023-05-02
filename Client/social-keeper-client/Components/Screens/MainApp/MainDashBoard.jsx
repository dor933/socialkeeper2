import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Add this import
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../../assets/Firebase/firebaseconfig';


//internal imports:
import PreviousMeetingsScreen from './PreviousMeetingsScreen';
import FutureMeetingScreen from './FutureMeetingScreen';
import SettingDashBoard from './PersonalSettings';
import SuggestedMeetingsScreen from './SuggestedMeetingsScreen';
import Calender from '..//..//CompsToUse/Calender.tsx';

const Tab = createBottomTabNavigator();

const SuggestedMeetingsStack = createStackNavigator(); // Add this line

function SuggestedMeetingsStackScreen() {
    return (
      <SuggestedMeetingsStack.Navigator initialRouteName="SuggestedMeetings">
        <SuggestedMeetingsStack.Screen name="SuggestedMeetings" component={SuggestedMeetingsScreen} options={{headerShown:false}} />
        <SuggestedMeetingsStack.Screen name="SuggestedMeetingCalender" component={Calender} options={{headerShown:false}} />
      </SuggestedMeetingsStack.Navigator>
    );
  }
export default function MainDashBoard() {
    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Previous Meetings') {
                        iconName = focused ? 'ios-timer-outline' : 'ios-timer-outline';
                    } else if (route.name === 'Random Meeting') {
                        iconName = focused ? 'person-add' : 'person-add-outline';
                    } else if (route.name === 'Personal') {
                        //sliders icon for settings
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Suggested Meetings') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,

            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                style: styles.tabBar,
                headerShown: false,
                labelStyle: {
                    fontSize: 12,
                },
                tabStyle: {
                    width: Dimensions.get('window').width / 4,
                },
                //do not show header


            }}
            initialRouteName="Suggested Meetings"

        >
            <Tab.Screen name="Personal" component={SettingDashBoard} options={{
                headerShown: false,
            }}  />


            <Tab.Screen name="Previous Meetings" component={PreviousMeetingsScreen} />



            <Tab.Screen name="Random Meeting" component={FutureMeetingScreen}
            options={{
                headerShown: false,
            }} />
            <Tab.Screen name="Suggested Meetings" component={SuggestedMeetingsStackScreen} 
            options={{
                headerShown: false,
            }} />
        </Tab.Navigator>

    );
}
const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    tabBar: {
        backgroundColor: '#fff',
    },
});
