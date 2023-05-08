import React from 'react';
import { View, ImageBackground, ActivityIndicator, StyleSheet,Text , SafeAreaView} from 'react-native';

const Loadingcomp = () => {
    return (
        
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/Images/RandomImages/SocialKeeper.jpeg')} style={styles.cont} resizeMode='contain'   >
                <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
               
                
                </View>
                <View style={{height:50}}>
                <Text style={styles.text}>Preparing your meetings...</Text>

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
        position:'absolute',
        zIndex:999,
        top:0,
        left:0,
        bottom:0,
        right:0,
    },

    cont:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ffffff',
        width:'100%',

    },
  

    spinnerContainer: {
        marginTop: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      },
      text: {
        fontSize: 20,
        fontFamily: 'Lato_400Regular',
        paddingLeft:5,
        paddingTop:5,
        

        },
});