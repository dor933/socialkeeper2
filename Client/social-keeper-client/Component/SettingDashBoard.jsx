import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions,Image } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
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

        {/* here will be the personal name and image and the logo of the app */}
        <Image style={styles.image} source={require('../Images/Screenshot_20230131_103310.png')} />
        {/* <Text style={styles.personalText}>Personal Name</Text> */}
        <Image style={styles.logo} source={require('../Images/social-keeper-website-favicon-color.png')} />

      </View>

      <View style={styles.btnContainer}>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Personal Setting')}>
          <Ionicons style={{
            marginLeft: Dimensions.get('window').width * 0.03,
            marginRight: Dimensions.get('window').width * 0.06

          }} name='ios-person-outline' size={30} color='gray' />
          <Text style={styles.btnText}>Personal Setting</Text>
          <AntDesign
            style={{

              position: 'absolute',
              right: Dimensions.get('window').width * 0.03,
            }} name="right" size={25} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Preferred Meeting Times')}>
          <SimpleLineIcons style={{
            marginLeft: Dimensions.get('window').width * 0.03,
            marginRight: Dimensions.get('window').width * 0.06

          }} name='speedometer' size={30} color='gray' />
          <Text style={styles.btnText}>Preferred Meeting Times</Text>
          <AntDesign
            style={{

              position: 'absolute',
              right: Dimensions.get('window').width * 0.03,
            }} name="right" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Preferred Hoobies')}>
          <Ionicons style={{
            marginLeft: Dimensions.get('window').width * 0.03,
            marginRight: Dimensions.get('window').width * 0.06

          }} name='ios-heart-outline' size={30} color='gray' />
          <Text style={styles.btnText}>Preferred Hoobies</Text>
          <AntDesign
            style={{

              position: 'absolute',
              right: Dimensions.get('window').width * 0.03,
            }} name="right" size={25} color="gray" />

        </TouchableOpacity>



        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Favorite Contacts')}>
          <Ionicons style={{
            marginLeft: Dimensions.get('window').width * 0.03,
            marginRight: Dimensions.get('window').width * 0.06

          }} name='ios-star' size={30} color='gray' />
          <Text style={styles.btnText}>Favorite Contacts</Text>
          <AntDesign
            style={{

              position: 'absolute',
              right: Dimensions.get('window').width * 0.03,
            }} name="right" size={25} color="gray" />
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    
  },
  btnContainer: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'start',

  },
  personalContainer: {
    flex: 2.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: Dimensions.get('window').width * 1,
    paddingVertical: Dimensions.get('window').height * 0.04,

  },
  personalText: {
    fontSize: 25,
    marginRight: Dimensions.get('window').width * 0.03,
  },
  logo: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.15,
    borderRadius: 100,
    backgroundColor: 'transparent',
    marginRight: Dimensions.get('window').width * 0.03,
  },
  image: {
    width: Dimensions.get('window').width * 0.22,
    height: Dimensions.get('window').height * 0.11,
    borderRadius: 100,


    //no background color
   
    marginLeft: Dimensions.get('window').width * 0.03,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.08,
    //add a underline to the button
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  btnText: {
    fontSize: 21,


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
          headerStyle: {
            backgroundColor: '#F5F5F5',
            height: Dimensions.get('window').height * 0.05,
          },
          headerTintColor: 'red',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 15,
            color: 'black',
            marginLeft: Dimensions.get('window').width * 0.03,
          },
          headerBackTitleVisible: false,
          // headerBackImage: () => (
          //   <Ionicons style={{
          //     marginLeft: Dimensions.get('window').width * 0.03,
          //     marginRight: Dimensions.get('window').width * 0.05
          //   }} name='ios-arrow-back' size={30} color='gray' />
          // ),
          //do not show the header,just the back button
 


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