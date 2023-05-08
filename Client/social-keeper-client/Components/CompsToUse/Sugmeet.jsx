//create react function component
import React, { useEffect } from "react";
//import react native components
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Button, Image } from "react-native";
//import icons
import { ListItem } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";
import { List } from "react-native-paper";
//import lato font




//create function component
export default function Sugmeet({ meeting, navigation, invitedbyfriend}) {

  //re rub the function when the meeting changes
  
    //load lato font
  
    const datetime= meeting.date;

    

    //convert datatime to show only the date without the time
    const date = datetime.split('T')[0];

      return (
        <View>
          <ListItem.Swipeable
            rightContent={() => (
                //make info button
                <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handlecall()}
                >
                <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
             


            )   
            }
            leftContent={() => (
                <TouchableOpacity
                style={styles.infoButton}
                
                onPress={() => {

                    console.log('this is meetingonemoemntbefore', meeting)
                    navigation.navigate('SuggestedMeetingCalender', {meeting:meeting,invitedbyfriend:invitedbyfriend})
                }}
                >
                <Ionicons name="information-circle" size={24} color="white" />

                </TouchableOpacity>
            )
            }
            containerStyle={styles.container}
           
            rightWidth={Dimensions.get('window').width/3}
            leftWidth={Dimensions.get('window').width/3}
            

            
          >
            <View style={styles.rectengle} >

               {invitedbyfriend ? (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        width: Dimensions.get("window").width - 20,
        height: 65,
      }}
    >
      {console.log("this is meeting", meeting)}

      <Image style={styles.imagestyle} source={{ uri: meeting.user1.imageUri }} />

      <View style={{ marginLeft: 10 }}>
        <Text style={styles.textstyle}>{meeting.user1.userName}</Text>
        <Text style={styles.subtextstyle}>{date}</Text>
      </View>

      <View>
      <Text style={[styles.subtextstyle, { fontWeight:'800', color:'#d99199' }]}>Invited by {meeting.user1.userName}!</Text>

        <Text style={styles.subtextstyle}>
          {meeting.startTime}/ {meeting.endTime}
        </Text>
        <Text style={styles.subtextstyle}>{meeting.place.name}</Text>
      </View>
      
    </View>
  ) : (  <View
    style={{
      flexDirection: "row-reverse",
      alignItems: "center",
      width: Dimensions.get("window").width - 20,
      height: 65,
    }}
  >
    {console.log("this is meeting", meeting)}

    <Image style={styles.imagestyle} source={{ uri: meeting.user2.imageUri }} />

    <View style={{ marginLeft: 10 }}>
      <Text style={styles.textstyle}>{meeting.user2.userName}</Text>
      <Text style={styles.subtextstyle}>{date}</Text>
    </View>

    <View>
      <Text style={styles.subtextstyle}>
        -{meeting.startTime}/ {meeting.endTime}
      </Text>
      <Text style={styles.subtextstyle}>{meeting.place.name}</Text>
    </View>
  </View>
                )}


                
               



                
            </View>
          </ListItem.Swipeable>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        
        height:65,
        width:Dimensions.get('window').width-20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor:'rgba(0, 0, 0, 0.25)',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:4,
        alignSelf:'center',
        flexDirection:'row',
        borderRadius: 25,
        marginTop:10
        
        
    },

    rectengle:{
        backgroundColor:'rgba(0, 0, 0, 0.05)',
        borderRadius: 25,
        width:Dimensions.get('window').width-20,
        height:65,
        

    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        width:"100%",
        borderRadius: 25,
        marginTop:10,
        
      },
      imagestyle:{
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
        marginLeft: 10,
        borderwidth: 3,
        borderColor: '#ffffff'
        },
        textstyle:{
            fontFamily: 'Lato_700Bold',
            fontSize: 14,
            color:'rgba(0, 0, 0, 0.7)',
            fontStyle: 'normal',
            lineHeight: 19,
            letterSpacing: 0.03,
            fontWeight: 'bold',
        
        },
        subtextstyle:{
            fontFamily: 'Lato_400Regular',
            fontSize: 12,
            color:'rgba(0, 0, 0, 0.7)',
            fontStyle: 'normal',
            lineHeight: 16,
            letterSpacing: 0.03,
            fontWeight: 'normal',
        },
        infoButton: {
            backgroundColor: '#00ADEF',
            justifyContent: 'center',
            alignItems: 'center',
            height: 65,
            width:"100%",
            borderRadius: 25,
            marginTop:10,

            },

});
