import React from 'react';
import { View, ImageBackground, ActivityIndicator, StyleSheet,Text , SafeAreaView} from 'react-native';

const Loadingcomp = () => {
    return (
        
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/Images/RandomImages/SocialKeeper.jpeg')} style={styles.cont} resizeMode='contain'   >
                <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="red" />
               
                
                </View>
                <View style={{height:150}}>
                <Text style={styles.text}>Preparing your meetings...</Text>
                <Text style={styles.text}>This could take between 2 to 3 minutes</Text>

                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default Loadingcomp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'#ffffff',
    },

    cont:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ffffff',
        width:'100%',
        bottom:45,


    },
  

    spinnerContainer: {
        marginTop: 400,
        backgroundColor: 'rgba(255,255,255,0.5)',
      },
      text: {
        fontSize: 20,
        fontFamily: 'Lato_400Regular',
        paddingLeft:5,
        paddingTop:5,
        height: 50,
        textAlign: 'center',
        

        },
});