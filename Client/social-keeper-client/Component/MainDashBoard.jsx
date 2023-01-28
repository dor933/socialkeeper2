import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PreviousMeetingsScreen from './PreviousMeetingsScreen';
import FutureMeetingScreen from './FutureMeetingScreen';
import SettingDashBoard from './SettingDashBoard';
import SuggestedMeetingsScreen from './SuggestedMeetingsScreen';

const Tab = createBottomTabNavigator();
export default function MainDashBoard() {
    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Previous Meetings') {
                        iconName = focused ? 'ios-timer-outline' : 'ios-timer-outline';
                    } else if (route.name === 'Future Meetings') {
                        iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
                    } else if (route.name === 'Personal') {
                        //sliders icon for settings
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Suggested Meetings') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                style: styles.tabBar,
            }}
            initialRouteName="Suggested Meetings"

        >
            <Tab.Screen name="Personal" component={SettingDashBoard} />
            <Tab.Screen name="Previous Meetings" component={PreviousMeetingsScreen} />
            <Tab.Screen name="Future Meetings" component={FutureMeetingScreen} />
            <Tab.Screen name="Suggested Meetings" component={SuggestedMeetingsScreen} />
        </Tab.Navigator>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        backgroundColor: '#fff',
    },
});
