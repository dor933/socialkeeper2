import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Alert, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
    useFonts,
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    
    Lato_900Black,
  } from '@expo-google-fonts/lato';
  import Days from './PrefComp/Days';
import Timepicker from './PrefComp/Timepicker';
import {
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  } from '@expo-google-fonts/inter';
import { Button } from 'react-native-paper';
import {RegistContext} from "../..//..//RegistContext.jsx";





const hours = [...Array(24)].map((_, i) => `${i}:00`);
const days = ['S', 'Sa', 'F', 'Th', 'W', 'T', 'M'];


export default function PreferredMeetingTimes({ navigation }, props) {
    const {prefferdtimes,setPrefferdTimes}= React.useContext(RegistContext);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);//array of objects {day: 'S', startHour: '10:00', endHour: '12:00'}
    let [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
        });
       
        const [valuestart, setValuestart] = useState(null);
        const [valueend, setValueend] = useState(null);

        const handlevaluestart = (value) => {
            setValuestart(value);
        }
        const handlevalueend = (value) => {
            setValueend(value);
        }

        const addtimetoarray = () => {
            if (selectedDay === '') {
                Alert.alert('Please select a day');
            }
            else if (valuestart === null) {
                Alert.alert('Please select a start time');
            }
            else if (valueend === null) {
                Alert.alert('Please select an end time');
            }
            else {
                const newSelectedDays = [...selectedDays];
                newSelectedDays.push({ day: selectedDay, startHour: valuestart, endHour: valueend });
                setSelectedDays(newSelectedDays);
                setSelectedDay('');
                console.log(newSelectedDays);
            }
        }


        const submittimes= () => {

            setPrefferdTimes(selectedDays);
            console.log(prefferdtimes);
            navigation.navigate('FavoriteContacts');

        }

        const removeTimeFromArray = (index) => {
            const newSelectedDays = [...selectedDays];
            newSelectedDays.splice(index, 1);
            setSelectedDays(newSelectedDays);
          };

      
        



 
    
    //this function is called when the user clicks on the add button to add a new preferred meeting time
    //in the future we will send the selectedDays array to the server to save it in the database
  

    return (
        <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>
        <View style={styles.container}>
            <View style={styles.header}>
            <Image source={require('../../../assets/Images/Pref/arrowkeeper.png')} style={{backfaceVisibility:'#E04747'}}  />
            </View>
            <View style={styles.keeperview}>
            <Image source={require('../../..//assets/Images/RandomImages/SocialKeeper.jpeg')} style={styles.keeperview} />
            </View>
            <View style={styles.TextViews}>
                <Text style={{fontFamily:'Lato_700Bold',fontWeight:"800", fontSize: 24, color: '#E04747', lineHeight:29,letterSpacing:0.03,textAlign:'center' }}>Preferred Meeting Times</Text>
                <Text style={{fontFamily:'Lato_400Regular',fontWeight:"400", fontSize: 16, color: '#E04747', lineHeight:19,letterSpacing:0.03,textAlign:'center',color:"rgba(0,0,0,0.7)",top:8 }}>Select the days and hours you prefer to meet</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' ,height:Dimensions.get('window').height*0.15,alignContent:'center', width: Dimensions.get('window').width * 0.9, top: Dimensions.get('window').height * 0.02 }}>
                {
                    days.map((day, index) => {
                        return (
                            <Days key={index} 
                            day={day} 
                            setSelectedDay={setSelectedDay}
                            selectedDay={selectedDay}

                            
                            />
                        )
                    })

                }
                </View>

            <View style={styles.Prefferdtimesview}>
                <View style={{ flexDirection: 'row', width:"90%", height: Dimensions.get('window').height * 0.15 }}>
                <View style={{flexDirection:'column',height:"100%",width:"50%"}}>
                    <Text style={{ fontSize: 16,marginBottom:10, color: '#E04747', lineHeight:19,letterSpacing:0.03,textAlign:'center',color:"rgba(0,0,0,0.7)",fontFamily:"Lato_400Regular" }}>End time</Text>
              
             <Timepicker onTimeSelected={handlevalueend} />
                                    
            
                </View>

                <View
      style={{
        width: "0.3%", // Border width
        height: '120%',
        bottom:10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        // Border color
      }}
    />
                <View style={{flexDirection:'column',height:"100%",width:"50%",marginLeft:20}}>
                    <Text style={{fontFamily:'Lato_400Regular',marginBottom:10, fontSize: 16, color: '#E04747', lineHeight:19,letterSpacing:0.03,textAlign:'center',color:"rgba(0,0,0,0.7)" }}>Start time</Text>
              

             
                <Timepicker onTimeSelected={handlevaluestart} />
                 
                                         
            
                </View>
              
                </View>
                
                </View>

              <View style={styles.preferredTimesList}>
                <FlatList
                    data={selectedDays}
                    renderItem={({ item,index }) => (
                   <View style={styles.preferredTimeItem}>
                    <Text style={styles.preferredTimeText}>{`${item.day} ${item.startHour}-${item.endHour}`}</Text>
                   <TouchableOpacity style={styles.removeButton} onPress={() => removeTimeFromArray(index)}>
                   <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                  </View> )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
                        

      
              
                <View style={styles.buttonsviews}>
               
                    <TouchableOpacity style={styles.submitbox} onPress={()=> submittimes()}>
                        <Text style={styles.buttonstext}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addtimearraybox} onPress={()=> addtimetoarray()}>
                        <Text style={styles.buttonstext}>Add</Text>
                        </TouchableOpacity>
                    </View>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: Dimensions.get('window').height * 0.04,
        marginTop: Dimensions.get('window').height * 0.04,
    },

    header:{
        alignItems:'flex-start',
        width: Dimensions.get('window').width * 0.9,
        top: Dimensions.get('window').height * 0.02,
        height: Dimensions.get('window').height * 0.1,
        
    } ,

    buttonstext:{
        fontFamily:'Inter_700Bold',
        fontSize: 16,
        fontStyle: 'normal',
        lineHeight: 19,
        letterSpacing:0.01,
        textAlign: 'center',
        color:'rgba(255, 255, 255, 0.8)',
        fontWeight:'700'

    } ,

    keeperview:{
        width:270,
        height:110,
    },

    submitbox:{

        backgroundColor: "#1976D2",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:"44%",
        height:"23%"


    },

    addtimearraybox:{
        backgroundColor: "#E04747",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        width:"44%",
        height:"23%",
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },



    buttonsviews:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.2,
        top: Dimensions.get('window').height * 0.005,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        
    },

    resetbuttonview:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        top: Dimensions.get('window').height * 0.02,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        

    },

    resetbuttonstyle:{
        backgroundColor: "#E04747",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        width:"44%",
        height:"40%",
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },




    TextViews:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        top: Dimensions.get('window').height * 0.02,
        alignItems:'center',
        justifyContent:'center',
        



    },
    preferredTimesList: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.15,
        
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
     
      },
      preferredTimeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
      preferredTimeText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Lato_400Regular',
      },
      removeButton: {
        backgroundColor: '#E04747',
        borderRadius: 5,
        padding: 5,
      },
      removeButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
      },
   


   
});
