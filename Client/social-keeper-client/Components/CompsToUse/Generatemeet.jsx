import react from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image, BackHandler, SafeAreaView, Dimensions,Alert, FlatList,ImageBackground} from 'react-native';
//import usestate
import { useState, useEffect, useContext } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import Customheader from '../CompsToUse/Customheader';
import { MainAppcontext } from '..//Screens//MainApp/MainAppcontext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TimePicker from '../Screens/Settings/PrefComp/Timepicker';
import DatePickerComponent from './DatePickerComponent';
import Radiobutton from './Radiobutton';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from 'axios';
import { isLoading } from 'expo-font';
import Loadingcomp from './Loadingcomp';
import { Icon } from 'react-native-elements';






 function Generatetomeeting({navigation,route}) {

    const {user,setUser}= useContext(MainAppcontext);
    const [allfavoritecontacts,setAllfavoritecontacts]=useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [chosenuser, setchosenuser] = useState(null);
    const [chosenhobby, setchosenhobby] = useState(null);
    const [hobbies, setHobbies] = useState([]);
    const [commonhobbies, setCommonhobbies] = useState([]);
    const [starttimevalue, setstarttimevalue] = useState(null);
    const [endtimevalue, setendtimevalue] = useState(null);
    const [datevalue, setdatevalue] = useState(route.params.date);
    const [selectedid, setSelectedid] = useState(null);
    const [addressbeenselected, setAddressbeenselected] = useState(false);
    const [chosencity, setchosencity] = useState(null);
    const [loading, setLoading] = useState(false);
    const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
    const getcurrenttime= new Date().getHours()+ ':' + new Date().getMinutes();
    console.log('this is the current time',getcurrenttime);

    let currentDate = new Date();
    // getMonth() returns month from 0 to 11, so add 1 to get correct month number
    let month = ('0' + (currentDate.getMonth()+1)).slice(-2); // convert month to 2 digits
    let date = ('0' + currentDate.getDate()).slice(-2); // convert date to 2 digits
    
    let formattedDate = currentDate.getFullYear() + '-' + month + '-' + date;
    

    useEffect(() => {
      const backAction = () => {
        if (loading) {
          // If disableBack is true, do nothing and prevent the default behavior.
          return true;
        }
  
        // If disableBack is false, allow the default back behavior.
        return false;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
  
      return () => backHandler.remove();
    }, [loading]); 

    useEffect(() => {

      console.log('this is selected id',selectedid);

    }, [selectedid])

    useEffect(() => {

      //get the date right now without time according to israel time

   
      
      
      
     

    }, [])


    
 
    useEffect(() => {

        console.log(chosenhobby)
        console.log(commonhobbies)
        console.log('this is the date',datevalue)


    }, [chosenhobby])

    useEffect(() => {

        if(chosenuser!=null){

            console.log('this is the chosen user',chosenuser);
            console.log('this is the user tbluserhobbies',user.tblUserHobbiesDTO);

            const commonhobbies=[];


            user.tblUserHobbiesDTO.map((hobbie)=>{

            commonhobbies.push(hobbie);
        })

        chosenuser.hobbies.map ((hobbie)=>{

           let myhobbie=commonhobbies.find (item => item.hobbieNum === hobbie.hobbieNum);
            if(myhobbie==null){

            commonhobbies.push(hobbie);
            }
        })
        setCommonhobbies(commonhobbies);
        console.log('this is the common hobbies',commonhobbies);
    }




    }, [chosenuser])

    const handleSelectItem = (data,details) => {
      const myadder= {
        city: data.structured_formatting.main_text,
        longitude: details.geometry.location.lng,
        latitude: details.geometry.location.lat,
      }
      setchosencity(myadder);
      setAddressbeenselected(true);
      console.log('this is chosen city',chosencity);
    };

    const handlestarttime=(time)=>{
        setstarttimevalue(time);
    }

    const handleendtime=(time)=>{
        setendtimevalue(time);
    }

    const handledate=(date)=>{
        setdatevalue(date);
        console.log('this is the date',date);
    }

    const checkvalidity=()=>{
      if(chosenuser==null){
        alert('please choose a user');
        return false;
      }
      if(chosenhobby==null){
        alert('please choose a hobby');
        return false;
      }

      if(starttimevalue==null){
        alert('please choose a start time');
        return false;
      }

    
      const starttimevaluearray=starttimevalue.split(':');
      const starttimevaluehours=starttimevaluearray[0];
      const starttimevalueminutes=starttimevaluearray[1];
      const starttimevalueobject=new Date();
      starttimevalueobject.setHours(starttimevaluehours);
     starttimevalueobject.setMinutes(starttimevalueminutes);
      const currenttimearray=getcurrenttime.split(':');
      const currenttimehours=currenttimearray[0];
      const currenttimeminutes=currenttimearray[1];
      const currenttimeobject=new Date();
      currenttimeobject.setHours(currenttimehours);
      currenttimeobject.setMinutes(currenttimeminutes);

      if(starttimevalueobject<currenttimeobject && datevalue==formattedDate){
        console.log('this is the date value',datevalue);
        console.log('this is the formatted date',formattedDate);
        console.log('this is the current time',getcurrenttime);
        console.log('this is the start time',starttimevalue);
        alert('please choose a start time that is later than the current time2');
        return false;
      }

      if(endtimevalue==null){
        alert('please choose an end time');
        return false;
      }
      if(datevalue==null){
        alert('please choose a date');
        return false;
      }
      if(chosencity==null && selectedid==2){
        alert('please choose a location');
        return false;
      }
      if(selectedid==null){
        alert('please choose a location type');
        return false;
      }
      return true;
    }

    const generatemeeting = async () => {

      const validation=checkvalidity();
      if(validation==false){
        return;
      }

      else if(loading){
        console.log('loading');
        return;
      }

      else{



      const meetingobject={
        meetingdate:datevalue,
        meetingstarttime:starttimevalue,
        meetingendtime:endtimevalue,
        meetinglocation: chosencity!=null? chosencity: null,
        meetinghobbie:chosenhobby,
        meetinguserphone:chosenuser.phoneNum1,
        meetingcreatorphone:user.phoneNum1,


    }

    console.log('this is the meeting object',meetingobject);

    setIspersonalactiveated(true)
    setLoading(true);

    const response= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainApp/Meetingbydemand',meetingobject);
    if(response.data.place != null){

      setLoading(false);
      setIspersonalactiveated(false)
      const mymeeting=response.data;
      const copyoftblsuggestedmeetings=user.tblSuggestedMeetings;
      copyoftblsuggestedmeetings.push(mymeeting);
      setUser({...user,tblSuggestedMeetings:copyoftblsuggestedmeetings});
      navigation.navigate('Meetdetails', {meeting: mymeeting,usertomeet:mymeeting.user2,type:mymeeting.place.types[0],meetingtype:'suggested'});

    }
    else{
      setLoading(false);
      setIspersonalactiveated(false)
     Alert.alert('Place not found', 'Please choose another location or time');
    }

    setstarttimevalue(null);
    setendtimevalue(null);
    setchosencity(null);
    setchosenhobby(null);


    console.log('this is the meeting object',meetingobject);
  }
}



    const renderhobbies=({item})=>{
        return(
     
<TouchableOpacity style={[styles.containerhobbie, {backgroundColor:chosenhobby?.hobbieNum?  item.hobbieNum==chosenhobby.hobbieNum? '#eb6a5e': 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.05)'}]} onPress={()=> {
    setchosenhobby(item);
}}>

<ImageBackground style={styles.hobbieImage} source={{uri:item.hobbieimage}}>
  
</ImageBackground>
<View>
<Text style={styles.hobbieName}>{item.hobbiename}</Text>

</View>


</TouchableOpacity>
        )
    }






    useEffect(() => {

        console.log(user);
        const tblcopyfavoritecontacts= user.tblFavoriteContacts;
        const tblcopyfavoritecontacts1= user.tblFavoriteContacts1;

        console.log('this is user',user);

        const allfavoritecontacts=tblcopyfavoritecontacts.concat(tblcopyfavoritecontacts1);

     

        console.log('this is the userdtohobbies',allfavoritecontacts[0].tblUser1.tblUserHobbiesDTO);
        const favoriteaslabelandvalue=allfavoritecontacts.map((item)=>{

            const hobbies=item.tblUser1.tblUserHobbiesDTO.map((hobby)=>{

              console.log('this is the hobbie from the use effect',hobby);
                return{
                  hobbiename:hobby.hobbiename,
                    hobbieNum:hobby.hobbieNum,
                    hobbieimage:hobby.hobbieimage,
                    rank:hobby.rank,
                    phoneNum1:hobby.phoneNum1
                }

            }
            )

            return{
                label:item.tblUser1.userName,
                value:item.ID,
                imageuri:item.tblUser1.imageUri,
                hobbies:hobbies,
                phoneNum1:item.tblUser1.phoneNum1,
            }
        })


      
        setAllfavoritecontacts(favoriteaslabelandvalue);
        setchosenuser(favoriteaslabelandvalue[0]);
        
        

    }, [])


    if(loading){
      return (

        <Loadingcomp/>
      )
    }

    return (
      
        <SafeAreaView style={{flex:1, backgroundColor:'#ffffff'}}>



            <View style={[styles.container]}>

            <ImageBackground 
        source={require('../../assets/Images/RandomImages/SocialKeeper.png')} 
        style={{flex:1,alignItems:'center',zIndex:1}}
        resizeMode="center"
        

     >

<View style={{
            backgroundColor: '#ffffff',
            opacity: 0.9,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }}/>
           
      
             
               
            <Customheader/>

            <View style={[styles.rowstyle,{justifyContent:'space-between',width:Dimensions.get('window').width-25,height:Dimensions.get('window').height/10,borderBottomWidth:0}]}>
            <View>
              <Image 
                 source={{uri:chosenuser?.imageuri}}
                 style={{width: Dimensions.get('window').width/7, height: Dimensions.get('window').height/15, borderRadius: 100}}
                />
              </View>
              <View>
              <Text style={styles.meetingtext}>Generate Meeting With</Text>
         

              </View>
           
            
            </View>
            <View style={{flex:1}}>
            <View style={[styles.rowstyle]} >

           
     
            <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={allfavoritecontacts}
          search
          maxHeight={300}
          
          labelField="label" 
          valueField="value"
          placeholder={!isFocus ? 'Select Friend' : '...'}
          searchPlaceholder="Search..."
          value={chosenuser}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setchosenuser(item);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
        
            <Image
                source={{uri:chosenuser?.imageuri}}
                style={{width: 40, height: 40, borderRadius: 20, marginLeft:10}}
                />
          )}
        />


    
            </View>
            <View style={styles.rowstyle} >


             <FlatList
                data={commonhobbies}
                renderItem={renderhobbies}
                keyExtractor={(item) => item.hobbieNum}
                style={{marginBottom:Dimensions.get('window').height/120}}
                //show 2 items at a time
                numColumns={3}
                
                />
             

                </View>

               
          

                        <View style={[styles.rowstyle,{height:Dimensions.get('window').height/7}]} >

<View style={{flexDirection:'row', width:Dimensions.get('window').width/1.6,height:"100%",paddingTop:Dimensions.get('window').height/120,paddingBottom:Dimensions.get('window').height/120}}>


<View style={{marginRight:10,borderRadius:10, backgroundColor:'#a7ccfa',paddingHorizontal:10}}>
<Text style={[styles.chooseusertext,{textAlign:'center',marginBottom:Dimensions.get('window').height/78,fontFamily:'Pacifico_400Regular'}]}>
  End Time
</Text>
<TimePicker onTimeSelected={handleendtime} fromgenerate={true} />

</View>

<View style={{borderRadius:10,backgroundColor:'#faada7',paddingHorizontal:10}}>
<Text style={[styles.chooseusertext,{textAlign:'center',marginBottom:Dimensions.get('window').height/78,fontFamily:'Pacifico_400Regular'}]} >
  Start Time
</Text>
<TimePicker onTimeSelected={handlestarttime} fromgenerate={true} />

</View>

</View>



</View>

                        <View style={[styles.rowstyle,{height:Dimensions.get('window').height/6.5,borderBottomWidth:0,
                    backgroundColor:'#ffffff'
                      }]} >

<View style={{width:Dimensions.get('window').width/1.7, height:Dimensions.get('window').height/5.5}}>

  <View style={{flexDirection:'row',justifyContent:'space-between'}}>

<GooglePlacesAutocomplete
  placeholder='City'
  fetchDetails={true}
  onPress={(data, details = null) => {

    if(selectedid==2){

    handleSelectItem(data,details);
    console.log(data);
    console.log(details);
  }


}
}
  //check if autocomplete window is open
  
  
  query={{
    key: 'AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow',
    language: 'en',
    types: '(cities)',
    components: 'country:il',
  }}

  textInputProps={{

    editable: selectedid==2? true:false,
  }
  }
  
  styles={{

   


    textInput: {
      fontSize: 16,
      fontWeight: "normal",
      fontFamily: "Lato_400Regular",
      fontStyle: "normal",
      color: addressbeenselected? '#000000': '#8d97a0',
      height: 50,
      lineHeight: 19,
      letterSpacing: 0.1,
      textAlign: "left",
      backgroundColor: "#ffffff",
      left:4,
     
      width:Dimensions.get('window').width/1.82,
    },

    
    textInputContainer: {
      backgroundColor: "#ffffff",
      opacity: selectedid==2? 1:0.5,
      borderBottomWidth: 1,
      alignSelf:'center',
      top:Dimensions.get('window').height/40,
      
    
   
      
      width:Dimensions.get('window').width/1.82,
      borderRadius: 0,
      borderBottomColor: "#9098a1",
      shadowOpacity: 0.05,
      shadowRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
  }}
  
/>





</View>


<View style={{alignItems:'flex-start',justifyContent:'flex-start',bottom:Dimensions.get('window').height/35,left:Dimensions.get('window').width/40 

}}>
<Icon
  name='location'
  type='evilicon'
  color='#eb6a5e'
  size={30}
  
/>
</View>

</View>




<View style={{ width:Dimensions.get('window').width/4, height:Dimensions.get('window').height/9.5}}>
<Radiobutton
                            selectedid={selectedid}
                            setSelectedid={setSelectedid}

                            />

</View>
                            </View>


                            <View style={[{height:Dimensions.get('window').height/17,alignItems:'center'}]} >

                            <TouchableOpacity style={styles.submitbox} onPress={async ()=> generatemeeting()} >
                <Text style={styles.submittext}>Generate Meeting</Text>
            </TouchableOpacity>

                              </View>

                            
            </View>
            </ImageBackground>
            </View>
        </SafeAreaView>
    );
}

export default Generatetomeeting;


const styles = StyleSheet.create({
  container:{
      backgroundColor: '#ffffff',
      marginTop:Dimensions.get('window').height/40,
      flex:1,
      alignItems:'center',
  
    },
    rowstyle:{
      flexDirection:'row',
      alignItems:'center',
      height:Dimensions.get('window').height/6.5,
      justifyContent:'space-around',
      borderBottomColor:'#f0ebeb',
      borderBottomWidth:1,
      paddingHorizontal:10,
      marginBottom:Dimensions.get('window').height/120,
      


      },
    meetingtext:{
      fontFamily: 'Pacifico_400Regular',
      fontSize: 25,
      color: '#eb6a5e',
      fontStyle: 'normal',
      lineHeight: 54,
    
      letterSpacing: 0.03,
      //move it to left
      marginTop: 15,
      marginBottom: 5
      
  
    },

    dropdown: {
      height: Dimensions.get('window').height / 17,
      borderColor: '#eb6a5e',
      borderWidth: 0.5,
      width: Dimensions.get('window').width - 140,
      borderRadius: 8,
      
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },

    chooseusertext:{
      fontFamily:'Lato_400Regular',
      fontSize: 12,

      },
      containerhobbie: {
          width:110,
          height:90,
          margin: 5,    
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 25,
          justifyContent:'center',
          alignItems:'center',
          
          
          
          
        },

        submittext:{
          color: '#ffffff',
          fontSize: 15,
          fontFamily:'Lato_400Regular',
          lineHeight: 19,
      },

        submitbox:{

          backgroundColor: "#eb6a5e",
          boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
          borderRadius: 25,
          justifyContent:'center',
          alignItems:'center',
          width:"48%",
          height:"100%",
  
  
      },

        hobbieImage: {
          width: 80,
          height: 60,
          borderRadius: 25,
          overflow: 'hidden',
          
          
          
        },
          
hobbieName: {
 
  fontSize: 11,
  marginTop: 5,
  fontFamily: 'Lato_400Regular',

  


  
},


});


