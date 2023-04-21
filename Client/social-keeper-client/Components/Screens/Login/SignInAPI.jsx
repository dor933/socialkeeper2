import React from 'react'
import { SafeAreaView, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> main
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
<<<<<<< HEAD
import { useEffect, useState, useContext } from "react";
=======
import { useEffect,useState,useContext } from "react";
>>>>>>> main
import axios from 'axios';
import { RegistContext } from '..//../..//RegistContext.jsx';
import { MainAppcontext } from '../MainApp/MainAppcontext.jsx';
import AuthContext from '../../../Authcontext.jsx';


<<<<<<< HEAD
function SignUpAPI({ navigation }) {

  const { personaldetails, setPersonalDetails } = useContext(RegistContext);
  const { setUser } = useContext(MainAppcontext);
  const { setIsAuthenticated } = React.useContext(AuthContext);
=======
function SignUpAPI({navigation}) {

  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const {setUser} = useContext(MainAppcontext);
  const {setIsAuthenticated}= React.useContext(AuthContext);
>>>>>>> main

  WebBrowser.maybeCompleteAuthSession();

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
<<<<<<< HEAD
  const RedirectUrl = AuthSession.makeRedirectUri({
    useProxy: true,

  });
  console.log(RedirectUrl);
=======
  const RedirectUrl=AuthSession.makeRedirectUri({
    useProxy:true,
    
  });

>>>>>>> main



  const [request2, response2, promptAsync2] = Facebook.useAuthRequest({
    clientId: '177882227985650',
    useProxy: true,
    redirectUri: RedirectUrl,
    scopes: ['public_profile', 'email'],
  });


<<<<<<< HEAD
  // Use expo's web browser



=======
    // Use expo's web browser
    
  
  
>>>>>>> main


  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '923332378077-0gf55cn5cq0dvpahm5bk6vetdaigl7cr.apps.googleusercontent.com',
<<<<<<< HEAD

=======
    
>>>>>>> main
    // Use expo's web browser

    useProxy: true,
    redirectUri: RedirectUrl,
<<<<<<< HEAD
=======
    

>>>>>>> main
  });

  useEffect(() => {
    console.log('into edffect');
    if (response?.type === "success") {
      console.log('got here');
      console.log(response);
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
<<<<<<< HEAD
  }, [response, token]);
=======
  }, [response,token]);
>>>>>>> main

  useEffect(() => {
    console.log('into edffect');
    if (response2?.type === "success") {
      console.log('got here');
      console.log(response2);
      setToken(response2.authentication.accessToken);
      getuserinfofromfacebook();
    }
<<<<<<< HEAD
  }, [response2, token]);
=======
  }, [response2,token]);
>>>>>>> main

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
      console.log(user);
<<<<<<< HEAD
      const ifuser = await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin', { email: user.email });
      if (ifuser.data == 'no user was found') {

        if (user.email != undefined) {

          personaldetails.email = user.email;
          navigation.navigate('CreateProfile');
        }
      }
      else if (typeof ifuser.data.imageUri == 'string') {
=======
      const ifuser= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin',{email:user.email});
      if(ifuser.data=='no user was found'){

        if(user.email!=undefined) {

        personaldetails.email=user.email;
        navigation.navigate('CreateProfile');
        }
      }
      else if(typeof ifuser.data.imageUri == 'string'){
>>>>>>> main
        setUser(ifuser.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Add your own error handler here
    }
  };

<<<<<<< HEAD
  const getuserinfofromfacebook = async () => {
=======
  const getuserinfofromfacebook=async()=>{
>>>>>>> main
    try {

      console.log(token);
      console.log('got here');
<<<<<<< HEAD
      const response = await axios.get(`https://graph.facebook.com/me?fields=email,id,name&access_token=${token}`)
      const user = response.data;
      setUserInfo(user);
      console.log(user);
      const ifuser = await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin', { email: user.email });
      if (ifuser.data == 'no user was found') {

        personaldetails.email = user.email;
        navigation.navigate('CreateProfile');
      }
      else if (typeof ifuser.data.imageUri == 'string') {
=======
      const response= await axios.get(`https://graph.facebook.com/me?fields=email,id,name&access_token=${token}`)
      const user=response.data;
      setUserInfo(user);
      console.log(user);
      const ifuser= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Signin',{email:user.email});
      if(ifuser.data=='no user was found'){

        personaldetails.email=user.email;
        navigation.navigate('CreateProfile');
      }
      else if(typeof ifuser.data.imageUri == 'string'){
>>>>>>> main
        setUser(ifuser.data);
        console.log(ifuser.data);
        setIsAuthenticated(true);
      }
<<<<<<< HEAD

=======
    
>>>>>>> main
    } catch (error) {
      // Add your own error handler here
    }
  }

<<<<<<< HEAD

>>>>>>> Stashed changes
=======
        
>>>>>>> main



  return (

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center'}}>
>>>>>>> main
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.elipseTop}></View>
      {/* Connect text */}
      <Text style={styles.text}>Sign In</Text>
      <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />

      {/* Login with google button */}
      <TouchableOpacity onPress={async() => promptAsync()}>
        <View style={styles.container}>
          <Image style={styles.googleLogo} source={require('../../../assets/Images/Logos/GoogleLogo.png')} ></Image>
          <Text style={styles.textForButton}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Login with outlook button */}
      <TouchableOpacity onPress={async() => promptAsync2()}>
        <View style={styles.container2}>
          <Image style={styles.outLookLogo} source={require('../../../assets/Images/Logos/facebook.png')} ></Image>
          <Text style={styles.textForButton}>Login with Facebook</Text>
        </View>
      </TouchableOpacity>

      
      <View style={styles.elipseButtom}></View>
=======
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.elipseTop}></View>
        {/* Connect text */}
        <Text style={styles.text}>Sign In</Text>
        <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />

        {/* Login with google button */}
        <TouchableOpacity onPress={async () => promptAsync()}>
          <View style={styles.container}>
            <Image style={styles.googleLogo} source={require('../../../assets/Images/Logos/GoogleLogo.png')} ></Image>
            <Text style={styles.textForButton}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        {/* Login with outlook button */}
        <TouchableOpacity onPress={async () => promptAsync2()}>
          <View style={styles.container2}>
            <Image style={styles.outLookLogo} source={require('../../../assets/Images/Logos/facebook.png')} ></Image>
            <Text style={styles.textForButton}>Login with Facebook</Text>
          </View>
        </TouchableOpacity>


        <View style={styles.elipseButtom}></View>
      </SafeAreaView>
>>>>>>> Stashed changes
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
    left: 125,
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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
=======
    
>>>>>>> main
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
<<<<<<< HEAD
<<<<<<< Updated upstream
    left: 100,
=======
    left: 212,
>>>>>>> Stashed changes
=======
    left:212,
>>>>>>> main
    top: 650,
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
    top: 16,
    left: 16,
  },

  //CSS for google logo
  googleLogo: {
    position: 'absolute',
    width: 37,
    height: 36,
    top: 14,
    left: 14,
  }
});