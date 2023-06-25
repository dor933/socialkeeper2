import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity,Modal } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Overlay, Icon,CheckBox } from '@rneui/themed';
import {whatsappcontact,telegramcontact,mailcomposer,callnumber} from '../../assets/Utils/Connectivity';
//import Dimensions from 'react-native';
import { Dimensions } from 'react-native';
import { SocialIcon, SocialIconProps } from '@rneui/themed';




export default function Contactdetails({selectedContact,friendid,addtofavorite,modalVisible,setModalVisible,sendsms,isfrommainapp}) {

  useEffect(() => {
    console.log('selectedContact',selectedContact)
  }, [])


   if(!isfrommainapp){

    return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}
      >
              <SafeAreaView style={{top:20}} >
                <View >
        <View style={styles.headerModal}>
          <View style={{paddingLeft:64,marginTop:2}}>
        <Text style={{ fontFamily: 'NunitoSans_700Bold', fontStyle: 'normal', fontWeight:'600', fontSize: 24, lineHeight: 33, color: '#333333'}}>
            Contact Details
            </Text>
            </View>
          <View style={{filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}>
          <TouchableOpacity onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Image source={require('../../assets/Images/Contacts/modalback.png')}  />
          </TouchableOpacity>
       
            </View>
         
          </View>
        
              
              <View>
                        <View style={styles.imagemodelview}>
                         


          <Image source={{uri: selectedContact.imageUri}} style={styles.contactimagemodal} />
          </View>
          <View style={styles.informationcss}>
            <Text style={styles.infromationtext}> {selectedContact.city}</Text>
            <Text style={[styles.infromationtext,{fontFamily:"NunitoSans_400Regular",fontSize:20,paddingTop:10}]}> {selectedContact.userName}</Text>
          </View>
          <View style={{marginTop:40,height:'100%',borderTopColor: '#C4C4C4',borderTopWidth: 1,backgroundColor:"rgba(154, 173, 190, 0.2)"}}>
                    <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

                      <View>

                      <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Mobile</Text>
                        <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
                          {selectedContact.phonenumbers[0]}
                      
                        </Text>
                      </View>
                      <View style={{marginTop:10,right:15,flexDirection:'row'}}>
                        <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center',marginRight:10}}>
                          <TouchableOpacity onPress={()=>sendsms(true)}>
                          <Icon 
                          name="sms"
                          size={17}
                          color="#333333"
                          />
                          </TouchableOpacity>
                          </View>
                          <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>callnumber(selectedContact.phonenumbers[0])}>
                          <Icon 
                          name="phone"
                          size={17}
                          color="#333333"
                          type="Entypo"
                          />
                          </TouchableOpacity>
                          </View>
                          
                        
                        </View>
                      
                    </View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Email</Text>
  <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
    {selectedContact.email}
  </Text>
</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={()=>mailcomposer(selectedContact.email)}>
    <Icon 
    name="email"
    size={17}
    color="#333333"
    type="MaterialCommunityIcons"
    />
    </TouchableOpacity>
    </View>
    
  
  </View>

</View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Hobbies</Text>
  <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
    {selectedContact.tblUserHobbiesDTO.map((hobbie,index)=>{
      if(index==selectedContact.tblUserHobbiesDTO.length-1){
      return(
        <Text key={index}>{hobbie.hobbiename}</Text>
      )
      }
      else{
        return(
          <Text key={index}>{hobbie.hobbiename},</Text>
        )
      }
    })
    }
  </Text>
</View>


</View>
<View style={{height:55,width:Dimensions.get('window').width,backgroundColor:"#FFFFFF",flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
  <Text style={{height:22,fontFamily:'NunitoSans_700Bold',fontSize:16,lineHeight:22,fontStyle:'normal'}}>Account Linked</Text>
     </View>
     <TouchableOpacity onPress={()=> whatsappcontact(selectedContact.phonenumbers[0])}>

     <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>WhatsApp</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#25D366',borderWidth:2,borderColor:"#25D366"}}>
 
      {/* <Image source={require('../../assets//Images/Contacts/whatstrans.png')}
        resizeMode="contain"
        style={{
          width: 16, // Set the icon width
          height: 16, // Set the icon height
        }} */}
      <SocialIcon
      type="whatsapp"
      style={{width:32,height:32}}

      />


      
    

    </View>
    
    
  
  </View>

</View>
</TouchableOpacity>

<TouchableOpacity onPress={()=> telegramcontact(selectedContact.phonenumbers[0])}>

<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Telegram</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:32,width:32,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#039BE5',borderWidth:2,borderColor:"#039BE5"}}>
 
      <Image source={require('../../assets/Images/Contacts/telegram.png')}
        resizeMode="contain"
        style={{
          width: 16, // Set the icon width
          height: 16, // Set the icon height
        }}
      
     />

    </View>
    
    
  
  </View>

</View>
</TouchableOpacity>

{typeof selectedContact.addedtofav =="undefined"  ? (
  <TouchableOpacity onPress={()=> addtofavorite()}>

  <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>
  
  <View>
  
  <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Send favorite request</Text>
  
  </View>
  <View style={{marginTop:10,right:15,flexDirection:'row'}}>
  
  <View style={{height:26,width:26,alignItems:'center',justifyContent:'center'}}>
  
  <Icon
            name="favorite"
            size={24}
            type="AntDesign"
            color="red"
            />
  
  </View>
  
  
  
  </View>
  
  </View>
  </TouchableOpacity>

) : (
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse',opacity:0.3}}>
  
  <View>
  
  <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Send favorite request</Text>
  
  </View>
  <View style={{marginTop:10,right:15,flexDirection:'row'}}>
  
  <View style={{height:26,width:26,alignItems:'center',justifyContent:'center'}}>
  
  <Icon
            name="favorite"
            size={24}
            type="AntDesign"
            color="red"
            />
  
  </View>
  
  
  
  </View>
  
  </View>
)
  
}





 </View>

          </View>

         
            
               
    
          </View>
          
                </SafeAreaView>
      </Modal>

    )
}
else {

  console.log('this is the selected contact')
  console.log(selectedContact)
  return(
    <Modal
    animationType="slide"
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => {

      setModalVisible(!modalVisible);
    }}
  >
          <SafeAreaView style={{top:20}} >
            <View >
    <View style={styles.headerModal}>
      <View style={{paddingLeft:64,marginTop:2}}>
    <Text style={{ fontFamily: 'NunitoSans_700Bold', fontStyle: 'normal', fontWeight:'600', fontSize: 24, lineHeight: 33, color: '#333333'}}>
        Contact Details
        </Text>
        </View>
      <View style={{filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}>
      <TouchableOpacity onPress={() => {
        setModalVisible(!modalVisible);
      }}>
      <Image source={require('../../assets/Images/Contacts/modalback.png')}  />
      </TouchableOpacity>
   
        </View>
     
      </View>
    
          
          <View>
                    <View style={styles.imagemodelview}>
                     


      <Image source={{uri: selectedContact.imageUri}} style={styles.contactimagemodal} />
      </View>
      <View style={styles.informationcss}>
        <Text style={styles.infromationtext}> {selectedContact.city}</Text>
        <Text style={[styles.infromationtext,{fontFamily:"NunitoSans_400Regular",fontSize:20,paddingTop:10}]}> {selectedContact.userName}</Text>
      </View>
      <View style={{marginTop:40,height:'100%',borderTopColor: '#C4C4C4',borderTopWidth: 1,backgroundColor:"rgba(154, 173, 190, 0.2)"}}>
                <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

                  <View>

                  <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Mobile</Text>
                    <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
                      {selectedContact.phoneNum1}
                  
                    </Text>
                  </View>
                  <View style={{marginTop:10,right:15,flexDirection:'row'}}>
                    <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center',marginRight:10}}>
                      <TouchableOpacity onPress={()=>sendsms(true)}>
                      <Icon 
                      name="sms"
                      size={17}
                      color="#333333"
                      />
                      </TouchableOpacity>
                      </View>
                      <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>callnumber(selectedContact.phoneNum1)}>
                      <Icon 
                      name="phone"
                      size={17}
                      color="#333333"
                      type="Entypo"
                      />
                      </TouchableOpacity>
                      </View>
                      
                    
                    </View>
                  
                </View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Email</Text>
<Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
{selectedContact.email}
</Text>
</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
  <TouchableOpacity onPress={()=>mailcomposer(selectedContact.email)}>
<Icon 
name="email"
size={17}
color="#333333"
type="MaterialCommunityIcons"
/>
</TouchableOpacity>
</View>


</View>

</View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Hobbies</Text>
<Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
{selectedContact.tblUserHobbiesDTO.map((hobbie,index)=>{
  if(index==selectedContact.tblUserHobbiesDTO.length-1){
  return(
    <Text key={index}>{hobbie.hobbiename}</Text>
  )
  }
  else{
    return(
      <Text key={index}>{hobbie.hobbiename},</Text>
    )
  }
})
}
</Text>
</View>


</View>
<View style={{height:55,width:Dimensions.get('window').width,backgroundColor:"#FFFFFF",flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
<Text style={{height:22,fontFamily:'NunitoSans_700Bold',fontSize:16,lineHeight:22,fontStyle:'normal'}}>Account Linked</Text>
 </View>
 <TouchableOpacity onPress={()=> whatsappcontact(selectedContact.phoneNum1)}>

 <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>WhatsApp</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#25D366',borderWidth:2,borderColor:"#25D366"}}>

  {/* <Image source={require('../../assets//Images/Contacts/whatstrans.png')}
    resizeMode="contain"
    style={{
      width: 16, // Set the icon width
      height: 16, // Set the icon height
    }} */}

<SocialIcon
      type="whatsapp"
      style={{width:32,height:32}}
      
      
      />
  

</View>



</View>

</View>
</TouchableOpacity>

<TouchableOpacity onPress={()=> telegramcontact(selectedContact.phoneNum1)}>

<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Telegram</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:32,width:32,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#039BE5',borderWidth:2,borderColor:"#039BE5"}}>

  <Image source={require('../../assets/Images/Contacts/telegram.png')}
    resizeMode="contain"
    style={{
      width: 16, // Set the icon width
      height: 16, // Set the icon height
    }}
  
 />

</View>



</View>

</View>
</TouchableOpacity>



<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<TouchableOpacity onPress={addtofavorite}>
<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:14}}>Remove From Friends</Text>

</TouchableOpacity>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:32,width:32,alignItems:'center',justifyContent:'center'}}>

<Icon
        name="delete"
        size={32}
        type="MaterialIcons"
        color="red"
        style={{alignSelf:'center',justifyContent:'center'}}
        />

</View>



</View>

</View>









</View>

      </View>

     
        
           

      </View>
      
            </SafeAreaView>
  </Modal>
  )
}
    
}

const styles = StyleSheet.create({
    headerModal:{
        width: Dimensions.get('window').width,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        
          },
          
  imagemodelview:{
    width:Dimensions.get('window').width,
    height:150,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  
  contactimagemodal:{
    width: 100,
    height: 100,
    borderRadius: 100,
    
  },
  informationcss:{
    width: Dimensions.get('window').width,
    height:30,

    
  },
  infromationtext:{
    fontFamily: 'NunitoSans_300Light',
    fontStyle: 'normal',
    fontsize: 14,
    lineHeight: 19,
    color: '#333333',
    textAlign:'center',

  },

}
)


