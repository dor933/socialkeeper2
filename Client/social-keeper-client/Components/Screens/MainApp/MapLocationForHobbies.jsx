
//imports for map view
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text , Image, TouchableOpacity} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MainAppcontext } from './MainAppcontext';
import { whatsappcontact } from '../../../assets/Utils/Connectivity';
//import icons
import { Ionicons } from "@expo/vector-icons";  
import { savePlace } from '../../../assets/Utils/places';



const MapLocationForHobbies = ({route,navigation}) => {


  //states for location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Searchlocation, setSearchlocation] = useState(null);
  const [locationname, setLocationname] = useState(null);
  const [mymeeting, setMymeeting] = useState(null);
  const {hobbienumtypes} = React.useContext(MainAppcontext);
  const [type, setType] = useState(null);
  const [usertomeet, setUsertomeet] = useState(null);
  const [placereplacement, setPlacereplacement] = useState(null);
  const {information}= route.params;
  let replacementmeeting= null;
  let replacetype= null;
  let replacelocationname= null;
  let isreplacedplace= false;
  


  
useEffect(() => {
  if(placereplacement){
  let hobbienumreplace=''
  try{
   hobbienumreplace= hobbienumtypes.find(hobbie=>hobbie.hobbie==placereplacement.types[0]).hobbienum
  }
  catch{
     hobbienumreplace= hobbienumtypes.find(hobbie=>hobbie.hobbie=='other').hobbienum
  }
  console.log(hobbienumreplace)
  setnewmeetingplace(placereplacement,hobbienumreplace)
  }

}, [placereplacement])

const setnewmeetingplace= (details,hobbienumreplace) => {


  replacementmeeting=[{...mymeeting, place:details, isplacechanged:true, latitude:details.geometry.location.lat, longitude:details.geometry.location.lng,hobbieNum:hobbienumreplace}]
  setMymeeting({...mymeeting, place:details, isplacechanged:true, latitude:details.geometry.location.lat, longitude:details.geometry.location.lng,hobbieNum:hobbienumreplace})
  replacelocationname=details.name
  setLocationname(details.name)
  replacetype=details.types[0]
  setType(details.types[0])



}
  


  


  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

    })

    setLocation({
      latitude: information.meeting.latitude,
      longitude: information.meeting.longitude,
    });
    setLocationname(information.meeting.place.name);
    setType(information.type);
    setUsertomeet(information.usertosend);
    setMymeeting(information.meeting);
    console.log('this is the information', information.type)
  
  }, []);




  if(!location){
    return <View>
      
    </View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rectengal}>
        <Text style={styles.text}>Meeting Location</Text>
        <Text style={styles.subtext}> Confirm meeting location or select new one!</Text>
        
      </View>
      <View style={styles.rectengal2}>
        <Text style={styles.textlittle} > Meeting with {usertomeet.userName} </Text>

        
        <Image style={styles.image} source={{uri:usertomeet.imageUri}}/>
        
  

        </View>
      <View style={styles.bottomrow}>
       
        <TouchableOpacity style={styles.rectengalconfirm} onPress={()=> {
       if(isreplacedplace){
         
        navigation.navigate('Meetdetails',{meeting:replacementmeeting, usertomeet:usertomeet, type:replacetype, meetingtype:'suggested'})
        }
        else{

          navigation.navigate('Meetdetails',{meeting:mymeeting, usertomeet:usertomeet, type:type, meetingtype:'suggested'})
        

      }

      }
      }>
          <Text style={styles.textconfirm}>Confirm Location</Text>
          <View style={styles.icon} >

            <Ionicons
              name="checkmark-outline"
              size={14}
              color="blue"
              style={{alignSelf:'center'}}
            
              
            />
      

          </View>

          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsapprectengal} onPress={ ()=> {
            whatsappcontact(usertomeet.phonenumbers[0])
            
          } }>
            <Ionicons
              name="logo-whatsapp"
              size={24}
              color="white"
              style={{alignSelf:'center'}}
            />

          </TouchableOpacity>

        </View>
   <View>
        <GooglePlacesAutocomplete

         
          
          placeholder='Search'
          fetchDetails={true}
          onPress={async (data, details = null) => {
            console.log('im trying to get the location')

            console.log('this is the data', data)
            console.log('this is the details', details)

            setSearchlocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });

            await savePlace(details)
            setPlacereplacement(details)
       

         


          }}
          onFail={(error) => console.error(error)}
          
          query={{
            key: 'AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow',
            language: 'en',
          }}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            description: styles.description,
          }}

          // enablePoweredByContainer={false}
          // suppressDefaultStyles={true}
          nearbyPlacesAPI='GooglePlacesSearch'
          debounce={400}
          
          
          
        />
      </View>

      <MapView
  
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,

        }}
      region={{
        latitude: Searchlocation ? 
        Searchlocation.latitude :
        location.latitude,
        longitude: Searchlocation? 
        Searchlocation.longitude :
        location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,


      }
      }
      provider={PROVIDER_GOOGLE}
    
        style={styles.map}
      >
        
        <Marker
          coordinate={{
            latitude: Searchlocation ? 
            Searchlocation.latitude :
            location.latitude,
            longitude: Searchlocation? 
            Searchlocation.longitude :
            location.longitude,
          }}
          title='Meeting Location'
          description={locationname}



        

        />
      
      </MapView>
      


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    zIndex:2,
    position:'absolute',
    marginTop:135,
    width:Dimensions.get('window').width-20,
    alignSelf:'center',
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
  },
  listView: {
    backgroundColor: '#ffffff',
    zIndex: 5,
    position: 'absolute',
    marginTop: 176,
    width: Dimensions.get('window').width - 20,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    color: '#5d5d5d',

  },
  text:{
    fontSize: 20,
    color: '#000B23',
    alignItems:'center',
    fontFamily:'Lato_700Bold',
    fontWeight:'bold',
    lineHeight:30,
    paddingTop:7,
    paddingLeft:10,
    

  },

  subtext:{
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    fontFamily:'Lato_400Regular',
    letterSpacing:0.03,
    lineHeight:16,
    paddingLeft:10,
    paddingTop:5,

  },
  image:{
    width: 18,
    height: 18,
    borderRadius: 15,
    borderColor:'#ffffff',
    
  },
  rectengal: {
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    height: 85,
    shadowRadius: 4,
    shadowOpacity: 1,
    borderRadius: 25,
    position:'absolute',
    marginTop: 32,
    width: Dimensions.get('window').width - 20,
    textalign:'center',
    alignSelf: 'center',
    justifyContent:'flex-start',
    padding:10
    


  },
  icon: {
    width: 18,
    height: 18,
    backgroundColor:'#ffffff',
  
    position:'absolute',
    marginTop: 50,
    marginLeft:8,
    alignContent:'center',
    justifyContent:'center',
    borderRadius: 15,
    
  },

  rectengal2: {
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    height:28,
    width: 180,
    position:'absolute',
    marginTop: 50,
    marginLeft:20,
    flexDirection:'row-reverse',
    alignItems:'center',
    //made space between the text and the image

    justifyContent:'space-around',
    
    
    zIndex:1,
  },

  textlittle:{
    fontSize: 11,
    fontFamily:'Lato_400Regular',
    letterSpacing:0.03,
    lineHeight:16,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingLeft:4,

  },

  bottomrow: {
    zIndex: 1,
 
    position:'absolute',
    marginTop: Dimensions.get('window').height - 130,
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    padding:10,
    flexDirection:'row',
    justifyContent:'space-around',
  },
  rectengalconfirm: {
    borderRadius: 25,
    backgroundColor: 'rgba(25,118,210,0.67)',
    height:50,
    width: 180,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    justifyContent:'center',

  
  },
  textconfirm:{
    fontSize: 15,
    fontFamily:'Lato_700Bold',
    letterSpacing:0.03,
    lineHeight:16,
    color: '#ffffff',
    paddingLeft:20,
    
  },

  whatsapprectengal: {
    borderRadius: 15,
    backgroundColor: 'rgba(139,200,63,0.67)',
    height:50,
    width: 65,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },



});

export default MapLocationForHobbies