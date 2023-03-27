import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View, TouchableOpacity, Dimensions, Modal} from 'react-native';
import call from 'react-native-phone-call'
import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import {
    useFonts,
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  } from "@expo-google-fonts/nunito-sans";



export default function Mymodal(props) {

    const smsfunction= props.smsfunction;
    const addtofavoritefunction= props.addtofavoritefunction;

    const [modalVisible, setModalVisible] = useState(false);

    
  let [fontsLoaded] = useFonts({
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

    async function whatsappcontact(){

        let url = `whatsapp://send?text=You have been invited to be my friend on Social Keeper&phone=972${selectedContact.phonenumbers[0]}`;
    
        Linking.openURL(url).then((data) => {
          console.log('WhatsApp Opened');
        }).catch(() => {
          alert('Make sure WhatsApp installed on your device');
        });
      }
    
      async function telegramcontact(){
    
        let url = `tg://msg?text=You have been invited to be my friend on Social Keeper&phone=972${selectedContact.phonenumbers[0]}`;
    
    
        Linking.openURL(url).then((data) => {
          console.log('Telegram Opened');
        }).catch(() => {
          alert('Make sure Telegram installed on your device');
        });
      }
      
      async function mailcomposer(){
    
      
        let url = `mailto:doratzabi1@gmail.com?subject=You have been invited to be my friend on Social Keeper&body=You have been invited to be my friend on Social Keeper`;
        //send the email
        Linking.openURL(url).then((data) => {
          console.log('Mail Opened');
        }).catch(() => {
          alert('Make sure Mail installed on your device');
        });
    
      }
    
      async function callnumber(){
     
        console.log(selectedContact.phonenumbers[0])
        const args = {
          number: selectedContact.phonenumbers[0],
          prompt: true,
        }
        call(args).catch(console.error)
      }

    return (
        <View>
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}
      >
              <SafeAreaView style={{top:45}} >
                <View >
        <View style={styles.headerModal}>
          <View style={{paddingLeft:45}}>
        <Text style={{ fontFamily: 'NunitoSans_700Bold', fontStyle: 'normal', fontWeight:'600', fontSize: 24, lineHeight: 33, color: '#333333'}}>
            Contact Details
            </Text>
            </View>
          <View style={{filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}>
          <TouchableOpacity onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Image source={require('../../../../assets/Images/Contacts/modalback.png')}  />
          </TouchableOpacity>
       
            </View>
         
          </View>
          {console.log("selected contact")}
          {console.log(selectedContact)}
          {console.log("already members")}
          {console.log(alreadymembers)}
            { alreadymembers.includes(selectedContact) && (
              
              <View>
                        <View style={styles.imagemodelview}>
                          {console.log("selected contact from modal")}
                          {console.log(selectedContact)}


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
                          <TouchableOpacity onPress={()=>smsfunction(true)}>
                          <Icon 
                          name="sms"
                          size={17}
                          color="#333333"
                          />
                          </TouchableOpacity>
                          </View>
                          <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>callnumber()}>
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
    Email will be here
  </Text>
</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={()=>mailcomposer()}>
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
    Hobbies will be here
  </Text>
</View>


</View>
<View style={{height:55,width:Dimensions.get('window').width,backgroundColor:"#FFFFFF",flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
  <Text style={{height:22,fontFamily:'NunitoSans_700Bold',fontSize:16,lineHeight:22,fontStyle:'normal'}}>Account Linked</Text>
     </View>
     <TouchableOpacity onPress={()=> whatsappcontact()}>

     <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>WhatsApp</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#25D366',borderWidth:2,borderColor:"#25D366"}}>
 
      <Image source={require('../../../../assets/Images/Contacts/whatstrans.png')}
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

<TouchableOpacity onPress={()=> telegramcontact()}>

<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Telegram</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#039BE5',borderWidth:2,borderColor:"#039BE5"}}>
 
      <Image source={require('../../../../assets/Images/Contacts/telegram.png')}
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

{selectedContact.addedtofav == false ? (
  <TouchableOpacity onPress={()=> addtofavoritefunction()}>

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
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse',opacity:0.5}}>
  
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

        ) 
            }
               
    
          </View>
          
                </SafeAreaView>
      </Modal>
      </View>
   
    );
    }