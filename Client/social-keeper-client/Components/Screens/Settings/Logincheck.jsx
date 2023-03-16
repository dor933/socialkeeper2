import { View,Text, Alert, Button, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
// //import firebase
import { initializeApp } from "firebase/app";
import * as WebBrowser from 'expo-web-browser';
import { getRedirectResult, OAuthProvider, signInWithRedirect } from "firebase/auth";
import { getAuth, signInWithCredential , GoogleAuthProvider, MicrosoftAuthProvider } from "firebase/auth";
//import firebase auth with microsoft as provider
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { useEffect,useState } from "react";


WebBrowser.maybeCompleteAuthSession();

//create react function componenet
export default function Logincheck() {




  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const RedirectUrl=AuthSession.makeRedirectUri({
    useProxy:true,
    
  });

  console.log(RedirectUrl);

  //make redirect uri without 

  const firebaseConfig = {
    apiKey: "AIzaSyDA-GbcFjJNNLqEFteW3ic3l9s7zhpbKwA",
    authDomain: "responsive-cab-377615.firebaseapp.com",
    projectId: "responsive-cab-377615",
    storageBucket: "responsive-cab-377615.appspot.com",
    messagingSenderId: "923332378077",
    appId: "1:923332378077:web:90aafdf4ac7980836c4a34",
    measurementId: "G-RGDBVLPS8S"
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '923332378077-0gf55cn5cq0dvpahm5bk6vetdaigl7cr.apps.googleusercontent.com',
    
    // Use expo's web browser

    useProxy: true,
    redirectUri: RedirectUrl,
    

  });
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/17be7cd7-ce09-4413-8687-9ecb87c5c520/v2.0');



  const [request2, response2, promptAsync2] = useAuthRequest(
    {
      clientId:'76f54ae9-6613-4a73-80c8-0e26c2f03149',
      scopes: ['openid', 'profile', 'email'],
      

      redirectUri: makeRedirectUri({
        redirectUri: RedirectUrl,
        useProxy: true,
      
      }),
    },
  
    discovery
  );

  
      

    


  useEffect(() => {
    console.log('into edffect');
    if (response?.type === "success") {
      console.log('got here');
      console.log(response);
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response,token]);

  useEffect(() => {
    if (response2?.type === "success") {
      console.log('got here');
      console.log(response2);
      setToken(response2.authentication.accessToken);

    } else {
      console.log('got here2');
      console.log(response2);
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

      const user = await response.json();
      setUserInfo(user);
      console.log(user);
    } catch (error) {
      // Add your own error handler here
    }
  };





return (

  // insert selfareaview with style container
  
  <SafeAreaView style={styles.container}>
    <View style={styles.Eliipse}>

    </View>
    <View style={styles.Eliipse2}>
    </View>


     <View style={{marginTop:400}}>

        <View style={{marginTop:50}}>
      <Button title="Sign in with Google" onPress={async () =>  promptAsync()} />
      </View>
      <View style={{marginTop:50}}>
      <Button disabled={!request2} title="Sign in with Microsoft" onPress={async () =>  promptAsync2()} />
      </View>
        </View>
  </SafeAreaView>


   )

    

}

const styles = StyleSheet.create({
  container: {
   position:'relative',
   width:430,
   height:932,
   backgroundColor:'#FFF1F1',
   borderRadius:50,
   
  },
  Eliipse:{
backgroundColor: "#FFAEAE",
position: "absolute",
width: 380,
height: 364,
right: -212,
top: -227,
borderRadius: 120

  },
  Eliipse2:{
    position: 'absolute',
width: 380,
height: 364,
right: 330,
backgroundColor: "#FFAEAE",
top: 700,
borderRadius: 120
},

});