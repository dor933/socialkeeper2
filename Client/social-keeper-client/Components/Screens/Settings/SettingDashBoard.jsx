import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React,{useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
//internal imports:
import PreferredMeetingTimes from './PreferredMeetingTimes';
import PreferredHoobies from './PreferredHoobies';
import ProfileScreen from '../Profile/ProfileScreen';
import FavoriteContacts from './FavoriteContacts';


//this is the home screen for the setting dashboard, 
//need to add the personal setting (יצירת פרופיל) screen (Idan\ tal )
function HomeScreen({ navigation }, props) {

  //the user name will be taken from the database
  //the user image will be taken from the database
  const [userName, setUserName] = useState('Dekel')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Personal</Text>
      <View style={styles.personalContainer}>
        <View style={styles.imageContainer}>
          {/* here will be the personal name and image and the logo of the app */}
          <Image style={styles.image} source={require('../../../assets/images/RandomImages/Screenshot_20230131_103310.png')} />
          <View style={styles.personalTextContainer}>
            <Text style={styles.personalText}>Hello, {userName}</Text>
            <Text style={styles.personalText}></Text>
          </View>
          {/* <Text style={styles.personalText}>Personal Name</Text> */}
        </View>
        <Image style={styles.logo} source={require('../../../assets/images/RandomImages/social-keeper-website-favicon-color.png')} />

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
  title: {
//the title, it will be on the left side of the screen,just above the image
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: Dimensions.get('window').width * 0.03,
    marginRight: Dimensions.get('window').width * 0.6,
    marginTop: Dimensions.get('window').height * 0.03,
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
   // paddingVertical: Dimensions.get('window').height * 0.04,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.0,
    marginTop: Dimensions.get('window').height * 0.02,
  },
  personalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: Dimensions.get('window').width * 0.03,
    marginLeft: Dimensions.get('window').width * 0.03,
  },
  logo: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height * 0.1,
    borderRadius: 100,
    backgroundColor: 'transparent',
    marginRight: Dimensions.get('window').width * 0.03,
    marginTop: Dimensions.get('window').height * 0.03,
    marginBottom: Dimensions.get('window').height * 0.0,
  },
  image: {
    width: Dimensions.get('window').width * 0.20,
    height: Dimensions.get('window').height * 0.09,
    borderRadius: 100,
    marginTop: Dimensions.get('window').height * 0.022,
    marginLeft: Dimensions.get('window').width * 0.05,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.08,
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
    <Text>
      settnigs try to change2sasdasdasdssss
    </Text>
    // <NavigationContainer independent={true}
    // >
    //   <Stack.Navigator
    //     screenOptions={{
    //       //this is the animation for the navigation
    //       animation: 'slide_from_right',
    //       headerBlurEffect: 'light',
    //       headerStyle: {
    //         backgroundColor: '#F5F5F5',
    //         height: Dimensions.get('window').height * 0.0,
    //       },

    //       headerTintColor: 'red',
    //       headerTitleStyle: {
    //         fontWeight: 'bold',
    //         fontSize: 15,
    //         color: 'black',
    //         marginLeft: Dimensions.get('window').width * 0.03,
    //       },
    //       headerBackTitleVisible: false,
    //       // headerBackImage: () => (
    //       //   <Ionicons style={{
    //       //     marginLeft: Dimensions.get('window').width * 0.03,
    //       //     marginRight: Dimensions.get('window').width * 0.05
    //       //   }} name='ios-arrow-back' size={30} color='gray' />
    //       // ),
    //       //do not show the header,just the back button

    //     }}
    //   >
    //     <Stack.Screen name="Personal" options={{
    //       headerShown: false,
    //     }
    //     } component={HomeScreen} />
    //     <Stack.Screen name="Preferred Meeting Times" component={PreferredMeetingTimes} />
    //     <Stack.Screen name="Preferred Hoobies" component={PreferredHoobies} />
    //     <Stack.Screen name="Personal Setting" component={ProfileScreen}  />
    //     <Stack.Screen name="Favorite Contacts" component={FavoriteContacts} />
    //   </Stack.Navigator>
    // </NavigationContainer>

  )
}