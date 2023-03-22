import { SafeAreaView, StyleSheet} from 'react-native';
import CreateProfile from './Components/Screens/Profile/CreateProfile';



//Imports to use :
// import SignInAPI from './Components/Screens/Login/SignInAPI';
// import SignUpAPI from './Components/Screens/Login/SignUpAPI';

// import { NavigationContainer } from '@react-navigation/native';
// import FutureMeetingScreen from './Components//Screens/Meetings/FutureMeetingScreen';
// import PreviousMeetingsScreen from './/Components//Screens//Meetings///PreviousMeetingsScreen';
// import SuggestedMeetingsScreen from './/Components//Screens//Meetings///SuggestedMeetingsScreen';
// import FavoriteContacts from './/Components//Screens///Settings/FavoriteContacts';
export default function App() {


  return (
    <SafeAreaView>
      <CreateProfile />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logIn: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
