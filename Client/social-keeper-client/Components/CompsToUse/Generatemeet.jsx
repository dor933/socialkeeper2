import react from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image, SafeAreaView, Dimensions, FlatList,ImageBackground} from 'react-native';
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
    const [datevalue, setdatevalue] = useState(null);
    const [selectedid, setSelectedid] = useState(null);
    const [addressbeenselected, setAddressbeenselected] = useState(false);
    const [chosencity, setchosencity] = useState(null);


    useEffect(() => {

      console.log('this is selected id',selectedid);

    }, [selectedid])
    
 
    useEffect(() => {

        console.log(chosenhobby)


    }, [chosenhobby])

    useEffect(() => {

        if(chosenuser!=null){

            console.log('this is the chosen user',chosenuser);
            console.log('this is the user tbluserhobbies',user.tblUserHobbiesDTO);

            const commonhobbies=[];


            user.tblUserHobbiesDTO.map((hobby)=>{

            chosenuser.hobbies.map((hobby1)=>{
                if(hobby.hobbieNum==hobby1.value){

                    //find in hobbies the hobbie imageuri
                    

                    console.log('this is the hobby',hobby);

                    commonhobbies.push(hobby);
                }
            }
            )
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

        const allfavoritecontacts=tblcopyfavoritecontacts.concat(tblcopyfavoritecontacts1);
        console.log('this is the userdtohobbies',allfavoritecontacts[0].tblUser1.tblUserHobbiesDTO);
        const favoriteaslabelandvalue=allfavoritecontacts.map((item)=>{

            const hobbies=item.tblUser1.tblUserHobbiesDTO.map((hobby)=>{

                return{
                    label:hobby.hobbiename,
                    value:hobby.hobbieNum
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
        console.log(favoriteaslabelandvalue);
        setAllfavoritecontacts(favoriteaslabelandvalue);
        setchosenuser(favoriteaslabelandvalue[0]);
        

    }, [])



    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#ffffff'}}>
            <View style={styles.container}>
            <Customheader/>

            <View>
                <Text style={styles.meetingtext}>Generate Meeting</Text>
            </View>
            <View style={{flex:1}}>
            <View style={styles.rowstyle} >

           
     
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

<View style={{justifyContent:'center',width:Dimensions.get('window').width/4}}>
                <Text style={styles.chooseusertext}>
                    Choose User
                </Text>
                </View>
    
            </View>
            <View style={styles.rowstyle} >


             <FlatList
                data={commonhobbies}
                renderItem={renderhobbies}
                keyExtractor={(item) => item.hobbieNum}
                style={{marginBottom:10}}
                //show 2 items at a time
                numColumns={2}
                
                />
                <View style={{justifyContent:'center', width:Dimensions.get('window').width/4}}>
                <Text style={styles.chooseusertext}>Choose Hobbie</Text>
                </View>

                </View>

               
                    <View style={[styles.rowstyle,{height:Dimensions.get('window').height/9}]} >

                      <View style={{width:Dimensions.get('window').width/1.7}}>
                      <DatePickerComponent fromgeneratemeeting={true} handledate={handledate}/>

                      </View>

                        <View style={{justifyContent:'center', width:Dimensions.get('window').width/4}}>
                <Text style={styles.chooseusertext}>Choose Date</Text>

                </View>

                        </View>

                        <View style={[styles.rowstyle,{height:Dimensions.get('window').height/8}]} >

<View style={{flexDirection:'row', width:Dimensions.get('window').width/1.6,height:"100%",paddingTop:5,paddingBottom:5}}>


<View>
<Text style={[styles.chooseusertext,{textAlign:'center',marginBottom:Dimensions.get('window').height/78}]}>
  End Time
</Text>
<TimePicker onTimeSelected={handleendtime} />

</View>

<View>
<Text style={[styles.chooseusertext,{textAlign:'center',marginBottom:Dimensions.get('window').height/78}]} >
  Start Time
</Text>
<TimePicker onTimeSelected={handlestarttime} />

</View>

</View>
<View style={{justifyContent:'center', width:Dimensions.get('window').width/4}}>
<Text style={styles.chooseusertext}>Choose Time</Text>

</View>


</View>

                        <View style={[styles.rowstyle,{height:Dimensions.get('window').height/7}]} >

<View style={{width:Dimensions.get('window').width/1.7}}>
<GooglePlacesAutocomplete
  placeholder='City'

  
  fetchDetails={true}
  onPress={(data, details = null) => {

    if(selectedid==1){

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
      fontStyle: "normal",
      color: addressbeenselected? '#000000': '#8d97a0',
      height: 40,
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
      top:Dimensions.get('window').height/60,
    
   
      
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


<View style={{justifyContent:'center', width:Dimensions.get('window').width/4}}>
<Radiobutton
                            selectedid={selectedid}
                            setSelectedid={setSelectedid}

                            />

</View>
                            </View>


                            <View style={[{height:Dimensions.get('window').height/17,alignItems:'center',marginTop:Dimensions.get('window').height/42}]} >

                            <TouchableOpacity style={styles.submitbox} onPress={async ()=> generatemeeting()} >
                <Text style={styles.submittext}>Generate Meeting</Text>
            </TouchableOpacity>

                              </View>

                            
            </View>
            
            </View>
        </SafeAreaView>
    );
}

export default Generatetomeeting;


const styles = StyleSheet.create({
    container:{
        backgroundColor: '#ffffff',
        flex:1,
        marginTop:20,
        alignItems:'center',
    
      },
      rowstyle:{
        flexDirection:'row',
        alignItems:'center',
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height/7.3,
        justifyContent:'space-between',
        borderBottomColor:'#f0ebeb',
        borderBottomWidth:1,
        paddingHorizontal:10,


        },
      meetingtext:{
        fontFamily: 'Pacifico_400Regular',
        fontSize: 33,
        color: '#eb6a5e',
        textAlign:'center',
        fontStyle: 'normal',
        lineHeight: 54,
      
        letterSpacing: 0.03,
        //move it to left
        marginTop: 15,
        marginBottom: 5
        
    
      },

      dropdown: {
        height: Dimensions.get('window').height / 17,
        borderColor: 'gray',
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

            backgroundColor: "#1976D2",
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



