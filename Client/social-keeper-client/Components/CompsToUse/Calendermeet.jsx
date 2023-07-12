import {useState,useEffect,useContext} from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView , ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Customheader from "./Customheader";

//create a component
const Calendermeet = ({navigation,route}) => {
    const [date, setDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});

    
    useEffect(() => {

        setMarkedDates({});
        console.log('this is the date',date)
  

    }, []);

    const subtractMonth = () => {
        let month = date.getMonth();
        date.setMonth(month - 1);
        setDate(new Date(date));
    };

   const handledate=(date)=>{

    setDate(date);
    console.log('this is the date',date)
    setMarkedDates({
        [date]: {
          selected: true,
          marked: true,
          selectedColor: '#eb6a5e',
        },
      });
    }


        
    

    return (

   
        <SafeAreaView style={{flex:1,backgroundColor:'#ffffff', alignItems:'center'}}>

            <View style={{marginTop:Dimensions.get('window').height/30}}>
            <Customheader />

            </View>



            <ImageBackground 
        source={require('../../assets/Images/RandomImages/SocialKeeper.png')} 
        style={{flex:1, opacity:1,alignItems:'center'}}
        resizeMode="center"
        

     >

        
          <View style={{}}>
            <Text style={{fontFamily:'Pacifico_400Regular',fontSize:20,color:'#eb6a5e', marginTop:Dimensions.get('window').height/40}}>Pick Meeting Date</Text>
          </View>


        <View style={styles.container} >



            <Calendar


                // Initially visible month. Default = Date()
                //make it show the current date
                current={date!= null ? date : new Date()}
                markedDates={markedDates}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    
                }}
                
         

                
                
                
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={new Date()}
                
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={"2025-05-30"}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    console.log("selected day", day);
                    setDate(day.dateString);
                    handledate(day.dateString);
                }
                }
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => {

                    console.log("selected day", day);
                    setDate(day.dateString);
                    handledate(day.dateString);
                }
                }

      

                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {
                    console.log("month changed", month);


                }

                

                }
                // Hide month navigation arrows. Default = false
                hideArrows={false}

                
                style={{ width: Dimensions.get("window").width, justifyContent:'center',height:Dimensions.get("window").height/1.8 }}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //make the right arrow to be the next month

                    renderArrow={(direction) => (
                            <Icon
                                name={direction === 'left' ? 'arrow-right' : 'arrow-left'}
                                type="feather"
                            />
                        )}

                        //make the left arrow to be the previous month
                        

                   
                      

              
                                />



                

                
        </View>
        
<View style={styles.buttonContainer}>
       
       <TouchableOpacity style={styles.acceptButton} onPress={() =>{ 

       if(date!=null){
       navigation.navigate('Generatemeet', {date: date}) 
       }
         else{  
              alert('Please select a date')
            }
        }
       }>
         <Text style={styles.buttonText}>Continue</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.refuseButton} onPress={() => navigation.navigate('SuggestedMeetings')}>
         <Text style={styles.buttonText}>Back</Text>
       </TouchableOpacity>
     </View>
     
        </ImageBackground>

        </SafeAreaView>


    );
};

export default Calendermeet;

// define your styles
const styles = StyleSheet.create({
 container: {
        marginTop:Dimensions.get('window').height/55,
        alignItems:'center',
        opacity:0.74
        
    },

    titleo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#eb6a5e",
        fontFamily: "Lato_700Bold",
    },

    buttonContainer: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height/15,
        width: Dimensions.get('window').width/1.2,
        justifyContent: 'center',
        alignItems: 'center',

        
        
      },
      acceptButton: {
        backgroundColor: 'rgba(25, 118, 210, 0.9)',
        borderRadius: 15,
        padding: 18,
        width: Dimensions.get('window').width/2.8,
      }, 
      refuseButton: {
        backgroundColor: 'rgba(224, 71, 71, 0.9)',
        borderRadius: 15,
        padding: 18,
        marginLeft: 80,
        width: Dimensions.get('window').width/2.8,
        
      },
      buttonText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'Lato_400Regular',
        color: '#ffffff',
        
      },
});





    