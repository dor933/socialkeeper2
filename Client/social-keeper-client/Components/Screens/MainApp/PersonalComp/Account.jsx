import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React,{useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { ListItem } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { duration } from 'moment';
import { Avatar, Badge, withBadge } from 'react-native-elements'
import { List } from 'react-native-paper';


//create functional component

function AccountSettings(props) {
  const [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });
  const [expanded, setExpanded] = React.useState(false);

  return (
    
<ListItem.Accordion
        title="Account"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        content={
          <>

         <MaterialCommunityIcons
          name="account-cog"
          size={26}
          color="rgba(255, 255, 255, 0.5)"
          style={{paddingRight:15}}

        />

          <ListItem.Content>
        
            <ListItem.Title style={styles.listaccordiontext}>Profile</ListItem.Title>
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={() => {
        if(!expanded){
        return <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="rgba(255, 255, 255, 0.5)"

        />
        }else{
            return <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />

            }
      }}
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}    
    
              
        >
        <ListItem title="Profile" >

             
        </ListItem>
        
        <ListItem title="Password" />
        </ListItem.Accordion>

  );
}

function Meetingtimes(props) {
    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);

    return (
        <ListItem.Accordion
        title="Meetingtimes"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        content={
          <>

         <MaterialCommunityIcons
          name="calendar-clock"
          size={26}
          color="rgba(255, 255, 255, 0.5)"
          style={{paddingRight:15}}

        />

          <ListItem.Content>
        
            <ListItem.Title style={styles.listaccordiontext}>Meeting Times</ListItem.Title>
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={() => {
        if(!expanded){
        return <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="rgba(255, 255, 255, 0.5)"

        />
        }else{
            return <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />

            }
      }}
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}    

    
              
        >
      
        
        </ListItem.Accordion>
    );
}

function Intersets(props) {
    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);

    return (
        <ListItem.Accordion
        title="Meetingtimes"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        content={
          <>

         <MaterialCommunityIcons
          name="heart"
          size={26}
          color="rgba(255, 255, 255, 0.5)"
          style={{paddingRight:15}}

        />

          <ListItem.Content>
        
            <ListItem.Title style={styles.listaccordiontext}>Interests</ListItem.Title>
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={() => {
        if(!expanded){
        return <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="rgba(255, 255, 255, 0.5)"

        />
        }else{
            return <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />

            }
      }}
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)} 
    

    
              
        >
        <ListItem title="Interests" >

             
        </ListItem>
        
        <ListItem title="Interests" />
        </ListItem.Accordion>
    );
}

function Favoritecont ({user}) {
    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);
        const [friendrequestexpanded, setFriendrequestexpanded] = React.useState(false);


    return (
        <ListItem.Accordion
        title="Favorite Contacts"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        content={
          <>

         <MaterialCommunityIcons
          name="star"
          size={26}
          color="rgba(255, 255, 255, 0.5)"
          style={{paddingRight:15}}

        />

          <ListItem.Content>
            {console.log(user.possibleFavoriteContacts_invite_DTO.length)}
        
            <ListItem.Title style={styles.listaccordiontext}>Favorite Contacts
                  
            </ListItem.Title>
            {user.possibleFavoriteContacts_invited_DTO.length > 0 && 
            <Badge
            status="error"
            value={user.possibleFavoriteContacts_invited_DTO.length}
            containerStyle={{ position: 'absolute', top: 0, right: 150 }}
            
            />}  
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={() => {
        if(!expanded){
        return <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="rgba(255, 255, 255, 0.5)"

        />
        }else{
            return <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />

            }
      }}
      isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      

    
              
        >
        <ListItem.Accordion title="Friend requests"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',

        }}
        content={
            <>
            <MaterialCommunityIcons
            name="account-plus"
            size={26}
            color="rgba(255, 255, 255, 0.5)"
            style={{paddingRight:15}}

            />
            <ListItem.Content>
            <ListItem.Title style={styles.listaccordiontext}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={[styles.listaccordiontext]}>Friend requests</Text>
    {user.possibleFavoriteContacts_invited_DTO.length > 0 && (
      <View style={{ paddingLeft: 10 }}>
        <Badge
          status="error"
          value={user.possibleFavoriteContacts_invited_DTO.length}
          containerStyle={{ position: 'relative' }}
        />
      </View>
    )}
  </View>
         
            
            </ListItem.Title>
            </ListItem.Content>
            </>
        }
        icon={() => {
            if(!friendrequestexpanded){
            return <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />
            }else{
                return <MaterialCommunityIcons
                name="chevron-up"
                size={24}
                color="rgba(255, 255, 255, 0.5)"

                />

                }
            }}
            isExpanded={friendrequestexpanded}
            onPress={() => setFriendrequestexpanded(!friendrequestexpanded)}

         >
           
         
            {user.possibleFavoriteContacts_invited_DTO.map((item, i) => (
                <ListItem key={i} bottomDivider

                containerStyle={{backgroundColor:'rgba(255, 255, 255, 0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)', flexDirection:'row-reverse',
                
            
            }}
                >
                <Avatar source={{uri: item.tblUser.imageUri}}
                rounded
                size="medium"
                />
  <ListItem.Content
    style={{
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >                    
                    {console.log('this is the item')}
                    {console.log(item.hobbieNum)}
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser.userName} </ListItem.Title>
                    {console.log('this is tbluser',item.tblUser)}
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                  <TouchableOpacity style={[styles.buttondecline,{ marginRight: 10 }]}>
                    <Text style={styles.buttondeclinetext}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonapprove}>
                    <Text style={styles.approvebuttontext}>Approve</Text>
                  </TouchableOpacity>
                </View>
                
                
                   
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}


             
        </ListItem.Accordion>
        
        </ListItem.Accordion>
    );
}
        
       
const styles = StyleSheet.create({
    settingsview:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        height:Dimensions.get('window').height*0.1,
        justifyContent: 'center',
        padding:0,
        gap: 3,
        paddingRight: 20,
        marginTop:5
      },
    
      settingstext:{
        fontFamily: 'Lato_700Bold',
        fontSize: 24,
        color:'rgba(255, 255, 255, 0.9)',
        fontStyle: 'normal',
        lineHeight: 29,
        display: 'flex',
        alignItems: 'center',
        letterSpacing: 0.03,
        textAlign: 'right',
      },
    
      listaccordiontext:{
        fontFamily: 'Lato_700Bold',
        fontSize: 16,
        color:'rgba(255, 255, 255, 0.9)',
        fontStyle: 'normal',
        lineHeight: 19,
        fontWeight:'bold',
        letterSpacing: 0.03,
        alignSelf: 'flex-end',
    
    
      },
      listaccordionsubtext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 12,
            color:'rgba(255, 255, 255, 0.7)',
            fontStyle: 'normal',
            lineHeight: 19,
            fontWeight:'bold',
            letterSpacing: 0.03,
            alignSelf: 'flex-end',
            
            marginTop: 3,


      },

      listaccordionbuttons:{
        fontFamily: 'Lato_700Bold',
        fontSize: 5,
        color:'rgba(255, 255, 255, 0.9)',
        fontStyle: 'normal',
        lineHeight: 19,
        fontWeight:'bold',
        letterSpacing: 0.03,
        alignSelf: 'flex-start',
        height:5,
        


        },
        buttonapprove:{
            backgroundColor:"#056DFA",
            borderRadius: 20,
            width:60,
            height:29
        },
        buttondecline:{
            backgroundColor:"#FF2849",
            borderRadius: 20,
            width:60,
            height:29
        },
        buttondeclinetext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color:"#FFFFFF",
            fontStyle: 'normal',
            lineHeight: 27,
            textAlign: 'center',

        },
        approvebuttontext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color:"#FFFFFF",
            fontStyle: 'normal',
            lineHeight: 27,
            textAlign: 'center',
            
        },

 

})



export {AccountSettings, Meetingtimes, Intersets, Favoritecont}