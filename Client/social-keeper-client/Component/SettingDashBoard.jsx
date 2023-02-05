import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//internal imports:
import PreferredMeetingTimes from './SettingComponent/PreferredMeetingTimes';
import PreferredHoobies from './SettingComponent/PreferredHoobies';
import ProfileScreen from './SettingComponent/ProfileScreen';
import FavoriteContacts from './SettingComponent/FavoriteContacts';


//this is the home screen for the setting dashboard, 
//it will buttons that will navigate to the diffrent setting screens
//the setting screens will be in the SettingComponent folder
//need to add the personal setting screen (Idan\ tal )
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.personalContainer}>


      </View>

      <View style={styles.btnContainer}>

        <Button
          title="Preferred Meeting Times"
          onPress={() => navigation.navigate('Preferred Meeting Times')}
        />
        <Button
          title="Preferred Hoobies"
          onPress={() => navigation.navigate('Preferred Hoobies')}
        />
        <Button

          title="Personal Setting"
          onPress={() => navigation.navigate('Personal Setting')}
        />
        <Button
          title="Favorite Contacts"
          onPress={() => navigation.navigate('Favorite Contacts')}
        />

      </View>

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
   
  },
  btnContainer: {
    flex: 4,
    width: '100%',
   
    //justifyContent: 'space-between',
    alignItems: 'center',
  },
  personalContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

});
const Stack = createNativeStackNavigator();

//this is the navigation container for the setting dashboard
export default function SettingDashBoard(props) {
  return (
    <NavigationContainer independent={true}
    >
      <Stack.Navigator
        screenOptions={{
          //this is the animation for the navigation
          animation: 'slide_from_right',

        }}
      >
        <Stack.Screen name="Main settings" component={HomeScreen} />
        <Stack.Screen name="Preferred Meeting Times" component={PreferredMeetingTimes} />
        <Stack.Screen name="Preferred Hoobies" component={PreferredHoobies} />
        <Stack.Screen name="Personal Setting" component={ProfileScreen} />
        <Stack.Screen name="Favorite Contacts" component={FavoriteContacts} />

      </Stack.Navigator>
    </NavigationContainer>

  )
}