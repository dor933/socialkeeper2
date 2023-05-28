import React from 'react'
import { SafeAreaView, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { useEffect,useState,useContext } from "react";
import axios from 'axios';
import { RegistContext } from '..//../..//RegistContext.jsx';
import { MainAppcontext } from '../MainApp/MainAppcontext.jsx';
import AuthContext from '../../../Authcontext.jsx';
import firebaseInstance from '../../../assets/Firebase/firebaseconfig.js';
import Loadingcomp from '../../CompsToUse/Loadingcomp.jsx';
import { SocialIcon } from 'react-native-elements'




function SignUpAPI({navigation}) {

  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const {setUser} = useContext(MainAppcontext);
  const {setIsAuthenticated}= React.useContext(AuthContext);
  const {firebaseuser, setFirebaseuser} = useContext(MainAppcontext);
  const [isloading, setIsloading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const RedirectUrl=AuthSession.makeRedirectUri({
    useProxy:true,
    
  });




  const [request2, response2, promptAsync2] = Facebook.useAuthRequest({
    clientId: '177882227985650',
    useProxy: true,
    redirectUri: RedirectUrl,
    scopes: ['public_profile', 'email'],
  });


    // Use expo's web browser
    
  
  


  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '923332378077-0gf55cn5cq0dvpahm5bk6vetdaigl7cr.apps.googleusercontent.com',
    
    // Use expo's web browser

    useProxy: true,
    redirectUri: RedirectUrl,
    //brign the id token with all the user info
    

    

    

  });

  

  useEffect(() => {
    console.log('into edffect');
    if (response?.type === "success") {
      console.log('got here this is my resonse look');
      console.log(response);
      
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response,token]);

  useEffect(() => {
    console.log('into edffect');
    if (response2?.type === "success") {
      console.log('got here');
      console.log(response2);
      setToken(response2.authentication.accessToken);
      getuserinfofromfacebook();
    }
  }, [response2,token]);

  const getUserInfo = async () => {
    
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(token)

      console.log('im got here')
      const user = await response.json();
      console.log(user)
      setUserInfo(user);
      //authenticate user with firebase and google
      const credential= firebaseInstance.GoogleAuthProvider.credential(null,token);
      firebaseInstance.signInWithCredential(firebaseInstance.auth, credential).then((result)=>{
        console.log('this is firebase result')
        console.log(result._tokenResponse);
        setFirebaseuser(result._tokenResponse)
      }).catch((error)=>{
        console.log('this is firebase error')
        console.log(error);
      })
      // const credential = firebaseInstance.auth.GoogleAuthProvider.credential(response.authentication.idToken);
      // firebaseInstance.auth().signInWithCredential(credential).then((result)=>{
      //   console.log(result);

      // }).catch((error)=>{
      //   console.log(error);
      // })

      

    
    
      const ifuser= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin',{email:user.email});
      if(ifuser.data=='no user was found'){

        if(user.email!=undefined) {

        personaldetails.email=user.email;
        navigation.navigate('CreateProfile',{isfrommainapp:false});
        }
      }
      else if(typeof ifuser.data.imageUri == 'string'){
        setIsloading(true);
        setUser(ifuser.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      
      console.log(error);
    }
  };

  const getuserinfofromfacebook=async()=>{
    try {

      console.log(token);
      console.log('got here');
      const response= await axios.get(`https://graph.facebook.com/me?fields=email,id,name&access_token=${token}`)
      const user=response.data;
      setUserInfo(user);
      console.log(user);
      const ifuser= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin',{email:user.email});
      if(ifuser.data=='no user was found'){

        setPersonalDetails({email:user.email});
        navigation.navigate('CreateProfile',{isfrommainapp:false});
      }
      else if(typeof ifuser.data.imageUri == 'string'){
        setUser(ifuser.data);
        console.log(ifuser.data);
        setIsAuthenticated(true);
      }
    
    } catch (error) {
      // Add your own error handler here
    }
  }

if(isloading){
  return(
    <Loadingcomp/>
  )
}



  return (

    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center'}}>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.elipseTop}></View>
      <Text style={styles.text}>Sign In</Text>
 
      
      <View style={styles.elipseButtom}></View>
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.elipseTop}></View>
        {/* Connect text */}
        <Text style={styles.text}>Sign In</Text>
        <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />

        {/* Login with google button */}
        <TouchableOpacity onPress={async () => {

          promptAsync();

        } }>
                 {/* <TouchableOpacity onPress={async () => {
               const ifuser= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin',{email:'grogo@example.com'});
               if(ifuser.data=='no user was found'){
         
                 if(user.email!=undefined) {
         
                 personaldetails.email=user.email;
                 navigation.navigate('CreateProfile',{isfrommainapp:false});
                 }
               }
               else if(typeof ifuser.data.imageUri == 'string'){
                 setIsloading(true);
                 setUser(ifuser.data);
                 console.log('this is the user my user test',ifuser.data);
                 setIsAuthenticated(true);
               }
              }}> */}
          <View style={styles.container}>
            
            <Image style={styles.googleLogo} source={require('../../../assets/Images/Logos/GoogleLogo.png')} ></Image>
            <Text style={styles.textForButton}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        {/* Login with outlook button */}
        <TouchableOpacity onPress={async () => promptAsync2()}>
 

          <View style={styles.container2}>
            <SocialIcon
              title='Sign In With Facebook'
              type='facebook'
              style={styles.outLookLogo}

            />

            {/* <Image style={styles.outLookLogo} source={require('../../../assets/Images/Logos/facebook.png')} ></Image> */}
            <Text style={styles.textForButton}>Login with Facebook</Text>
          </View>
        </TouchableOpacity>


        <View style={styles.elipseButtom}></View>
      </SafeAreaView>
    </SafeAreaView>
    </SafeAreaView>
    </SafeAreaView>
  )
}

export default SignUpAPI





const styles = StyleSheet.create({

  //connect text
  text: {
    position: 'absolute',
    width: 141,
    height: 28,
    left: 137,
    top: 353,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    letterSpacing: 0.03,
    color: '#E04747',
  },

  //container for google button
  container2: {
    position: 'absolute',
    width: 320,
    height: 64,
    left: 50,
    top: 500,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    borderRadius: 20,
  },

  //container for outlook button
  container: {
    position: 'absolute',
    width: 320,
    height: 64,
    left: 50,
    top: 400,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    borderRadius: 20,
  },

  //container for safe area
  safeArea: {
    position: 'relative',
    width: 430,
    height: 932,
    backgroundColor: '#FFF1F1',
    borderRadius: 50,
    marginTop:25,
    
  },


  //text for google button
  textForButton: {
    position: 'absolute',
    width: 150,
    height: 19,
    left: 90,
    top: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.4)',
  },

  //text for sign up suggestion
  refToSignIn: {
    position: 'absolute',
    width: 195,
    height: 19,
    left: 110,
    top: 600,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  //CSS for logo
  logo: {
    position: 'absolute',
    width: 295,
    height: 155,
    left: 60,
    top: 126,
  },
  //CSS for elipse on buttom
  elipseButtom: {
    position: 'absolute',
    width: 380,
    height: 364,
    left:240,
    top: 720,
    borderRadius: 200,
    backgroundColor: '#FFAEAE',
  },

  //CSS for elipse on top
  elipseTop: {
    position: 'absolute',
    width: 380,
    height: 364,
    left: -212,
    top: -227,
    borderRadius: 200,
    backgroundColor: '#FFAEAE',
  },

  //CSS for outlook logo
  outLookLogo: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 8,
    left: 5,
  },

  //CSS for google logo
  googleLogo: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 18,
    left: 14,
  }
});