import react from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import { useState,useContext,useEffect } from 'react';
import {
    useFonts,
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    
    Lato_900Black,
  } from '@expo-google-fonts/lato';
  import {MainAppcontext} from '../Screens/MainApp/MainAppcontext';
  import * as Network from 'expo-network';

//create a functional component

export default function Customheader({ispersonalsettings}) {

  const [isconnected, setIsconnected] = useState(true);

  useEffect(() => {
    checkinternet();

     const intervalid = setInterval(() => {
      checkinternet();
    }, 10000);


    return () => {
      clearInterval(intervalid);
    };

  }, []);

  const checkinternet = async () => {
    const networkstate = await Network.getNetworkStateAsync();
    if (networkstate.isConnected == true) {
      setIsconnected(true);
    }
    else {
      setIsconnected(false);
    }
  }


    let [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        //bring the user from the context

        const {user}= useContext(MainAppcontext);

    return (
        <View style={[styles.container,{backgroundColor: ispersonalsettings==true? "#222222" : "#ffffff" , borderColor: ispersonalsettings==true? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }]}>
        {
          // If the user is not undefined
          user !== undefined && (
            <>
            <View style={styles.box1}>
              <Image source={require('../../assets/Images/RandomImages/social-keeper-website-favicon-color.png')} style={{ width: 50, height: 61 }} />
              <Text style={[styles.textstyle,{color: ispersonalsettings==true? "#ffffff" : "rgba(0,0,0,0.7)"}]}>Hello, {user.userName}</Text>
            </View>
             <View style={styles.box2}>
             <View style={[styles.onlinerectengle,{borderColor:isconnected?"#AAFFAD" : "#FFADAD" }]}>
               <Text style={isconnected?styles.textonlinestyle : styles.textoffline}>
                {isconnected? "Online" : "Offline"}
                
               
               </Text>
             </View>
             <Image
               source={{ uri: user.imageUri}}
               style={{ width: 45, height: 45, borderRadius: 25 }}
             />
           </View>
              </>
          )
        }
       
      </View>
    );
    }

const styles= StyleSheet.create({

    container:{
        backgroundColor: '#ffffff',
        width: Dimensions.get('window').width-20,
        height: Dimensions.get('window').height*0.1,
        alignContent:'center',
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row-reverse',
        borderBottomWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
        //make the boredr solid
        borderStyle:'solid',
        

        
    } ,

    box1: {
        flexDirection:'row-reverse',
        alignItems:'center',
        
    },
    box2: {
        flexDirection:'row-reverse',
        alignItems:'center',
    },
    textstyle:{
        width:143,
        height:24,
        fontFamily:'Lato_700Bold',
        fontSize:16,
        lineHeight:24,
        color:'rgba(0,0,0,0.7)',
        letterSpacing:0.03,
        fontStyle:'normal',
        fontWeight:'bold',
        margin:10,
    },
    textonlinestyle:{
        height:12,
        fontFamily:'Lato_400Regular',
        fontSize:10,
        lineHeight:12,
        color:"#AAFFAD",
        letterSpacing:0.03,
        fontStyle:'normal'
    },

    textoffline:{
        height:12,
        fontFamily:'Lato_400Regular',
        fontSize:10,
        lineHeight:12,
        color:"#FFADAD",
        letterSpacing:0.03,
        fontStyle:'normal'
    },

    onlinerectengle:{
        width:47,
        height:15,
        borderColor:'#AAFFAD',
        borderWidth:1,
        borderRadius:40,
        alignItems:'center',
        margin:10
    
    }
})