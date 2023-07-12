import { View, Text, StyleSheet,SafeAreaView, FlatList, Dimensions, ScrollView } from 'react-native'
import React from 'react'
//import use effect
import { useEffect, useContext } from 'react';
import Customheader from '../../CompsToUse/Customheader'
import { Tab } from '@rneui/themed';
import { MainAppcontext } from './MainAppcontext';
import Sugmeet from '../../CompsToUse/Sugmeet';


export default function PreviousMeetingsScreen({navigation}) {
  const [index, setIndex] = React.useState(0);
  const {user, setUser} = useContext(MainAppcontext);

 useEffect(() => {
  console.log(index);
  }, [index])

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = Array.from({length: 5}, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return monthNames[d.getMonth()];
  })

  console.log('this is months')
  console.log(months);

    


  return (
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
      <Customheader/>
      <View style={styles.topviewstyle}>
        <Text style={styles.texttopstyle} >
          Meetings History (2023)
        </Text>
      </View>
      <View style={styles.tabsviewstyle}>
        <Tab value={index} onChange={setIndex} dense indicatorStyle={{backgroundColor:'black'}} disableIndicator={true} >
        {
          months.map((month, i) => (
            <Tab.Item key={i}>

    <Text style={[styles.tabtextstyle, index===i? styles.activeTab: styles.inactiveTab]}>{month}</Text>

            </Tab.Item> 
          ))

        }
        
          </Tab>

    
        </View>
        <ScrollView>

        <View >
  


     { user.tblactualmeetings.map((item, index2) => {
        const date = new Date(item.tblSuggestedMeeting.date);
        console.log(date);
        const monthname=monthNames[date.getMonth()];
        console.log(monthname);
        console.log('this is the item new 2805', item)
       
        return (
          <View key={index2}>

  {
    index==0 && monthname== months[0] && 
    <Sugmeet
    key={index2}
    meeting={item.tblSuggestedMeeting}
    invitedbyfriend={false}
    meetingtype="Ended"
    navigation={navigation}
    />
  }
      {
    index==1 && monthname== months[1] && 
    <Sugmeet
    key={index2}
    meeting={item.tblSuggestedMeeting}
    invitedbyfriend={false}
    meetingtype="Ended"
    navigation={navigation}
    />
  }
      {
    index==2 && monthname== months[2] && 
    <Sugmeet
    key={index2}
    meeting={item.tblSuggestedMeeting}
    invitedbyfriend={false}
    meetingtype="Ended"
    navigation={navigation}

    />
  }
     {
    index==3 && monthname== months[3] && 
    <Sugmeet
    key={index2}
    meeting={item.tblSuggestedMeeting}
    invitedbyfriend={false}
    meetingtype="Ended"
    navigation={navigation}

    />
  }
   {
    index==4 && monthname== months[4] && 
    <Sugmeet
    key={index2}
    meeting={item.tblSuggestedMeeting}
    invitedbyfriend={false}
    meetingtype="Ended"
    navigation={navigation}

    />
  }
  </View>
   );
  })}

  {
    user.tblactualmeetings1.map((item, index2) => {
      const date = new Date(item.tblSuggestedMeeting.date);
      console.log(date);
      const monthname=monthNames[date.getMonth()];
      console.log(monthname);
      console.log('this is the item new 2805', item)
     
      return (
        <View key={index2}>
        {
          index==0 && monthname== months[0] &&
          <Sugmeet
          key={index2}
          meeting={item.tblSuggestedMeeting}
          invitedbyfriend={true}
          meetingtype="Ended"
          navigation={navigation}
          />
        }
          {
            index==1 && monthname== months[1] && 
            <Sugmeet
            key={index2}
            meeting={item.tblSuggestedMeeting}
            invitedbyfriend={true}
            meetingtype="Ended"
            navigation={navigation}
            />
          }
              {
            index==2 && monthname== months[2] && 
            <Sugmeet
            key={index2}
            meeting={item.tblSuggestedMeeting}
            invitedbyfriend={true}
            meetingtype="Ended"
            navigation={navigation}
  
            />
          }
             {
            index==3 && monthname== months[3] && 
            <Sugmeet
            key={index2}
            meeting={item.tblSuggestedMeeting}
            invitedbyfriend={true}
            meetingtype="Ended"
            navigation={navigation}
  
            />
          }
           {
            index==4 && monthname== months[4] && 
            <Sugmeet
            key={index2}
            meeting={item.tblSuggestedMeeting}
            invitedbyfriend={true}
            meetingtype="Ended"
            navigation={navigation}
  
            />
          }
          </View>
            );
          })}


  
    
      
  
  

      


  
    
  



</View>

</ScrollView>


          
          
        

    </View>
    </SafeAreaView>
  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40,
    alignItems:'center',
  },
  topviewstyle:{
    height:60,
    width:'100%',
    backgroundColor:'#ffffff',
    justifyContent:'flex-end',
    alignItems:'center',
    flexDirection:'row',
    paddingRight:40,
    paddingTop:30

  },
  activeTab:{
    color:'#E04747'
    

  },
  inactiveTab:{

  },
  texttopstyle:{
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: '#000000',
    lineHeight: 29,
    letterSpacing: 0.03,
    fontStyle: 'normal',

  },
  tabsviewstyle:{
    height:70,
    backgroundColor:'#ffffff',
    alignItems:'center',
    flexDirection:'row-reverse',
    borderBottomColor:'#DFDFDF',
    borderBottomWidth:1,
    paddingTop:15,
    width:'90%',
    alignSelf:'center',
    

  },
  tabtextstyle:{
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color:'#7B7B7B',
    lineHeight: 17,
    letterSpacing: 0.03,
    fontStyle: 'normal',
  },








  
})

