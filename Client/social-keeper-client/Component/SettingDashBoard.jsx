import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PreferredMeetingTimes from './SettingComponent/PreferredMeetingTimes';
import PreferredHoobies from './SettingComponent/PreferredHoobies';


//this is the home screen for the setting dashboard, 
//it will buttons that will navigate to the diffrent setting screens
//the setting screens will be in the SettingComponent folder
//need to add the personal setting screen (Idan\ tal )
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Preferred Meeting Times"
        onPress={() => navigation.navigate('Preferred Meeting Times')}
      />
      <Button
        title="Preferred Hoobies"
        onPress={() => navigation.navigate('Preferred Hoobies')}
      />
    </View>
  );
}




const Stack = createNativeStackNavigator();

//this is the navigation container for the setting dashboard
export default function SettingDashBoard(props) {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Main settings" component={HomeScreen} />
        <Stack.Screen name="Preferred Meeting Times" component={PreferredMeetingTimes} />
        <Stack.Screen name="Preferred Hoobies" component={PreferredHoobies} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}