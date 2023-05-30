
import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView, Alert, SafeAreaView,FlatList } from 'react-native'
  import { useState, useEffect,useContext } from 'react';
  import Logo from '../..//..//assets/Images/RandomImages/SocialKeeper.jpeg'
  import HobbiesComponent from './HobbiesComponent.jsx'
  import { Ionicons } from '@expo/vector-icons';
  import axios from 'axios';
  import { RegistContext } from '../..//..//RegistContext.jsx';
  import { MainAppcontext } from '../MainApp/MainAppcontext';
  import {  Icon } from '@rneui/themed';

  //import usefonts
  import { useFonts } from 'expo-font';
  
  export default function PreferredHoobies ({navigation,route}) {
    // number of pressing on heart button
    const ifinapp=route.params.ifinapp;
    const [count, setCount] = useState(0);
    const [hobbies, setHobbies] = useState([]);
    const {selectedhobbies, setSelectedHobbies} = useContext(RegistContext);
    const {personaldetails, setPersonalDetails} = useContext(RegistContext);
    const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
    const {user, setUser} = useContext(MainAppcontext);


    const counting = (number) => {
      let temp = number + count
      setCount(temp)
    }



    useEffect(() => {

     
      gethobbies();
      if(!ifinapp){
        setSelectedHobbies([]);
        }

        else{
          counting(selectedhobbies.length)
        }
       
      return () => {
        
          setIspersonalactiveated(false);
        
      }

    },[])

    const gethobbies=async() => {

      const response = await axios.get('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/getallhobbies');
      //add rank to each hobbie
   

      setHobbies(response.data);
      console.log('this is the hobbies')
      console.log(response.data);
      console.log('and this is the currently userhobbiesdto')
      console.log(selectedhobbies);

    };

  
    const handleContinue = async () => {
      if(!ifinapp){
      if (count === 4) {
        console.log("selectedhobbies",selectedhobbies);
        navigation.navigate('PreferredMeetingTimes',{isfrommainapp:false});
      } else {
        Alert.alert('You must choose 4 hobbies, can\'t choose less😢');
      }
    }
    else{
      if (count === 4) {
        console.log("selectedhobbies",selectedhobbies);

        const response= await axios.put('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Updhobbies', 
        selectedhobbies
        );

        if(response.status==200){
          Alert.alert('Your hobbies has been updated successfully');
          setUser({...user, tblUserHobbiesDTO: response.data})

          
        }
          
          


      } else {
      }

    }
    }

    const renderhobbies = ({item}) => {
 
      console.log('this is the item')
      console.log(item)
      return (
        <HobbiesComponent myitem={item} counting={counting} count={count} />
      
      )
    }
  
    // render all the hobbies (מרנדר את כל התחביבים למסך)
    return (
      
  
      <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>

      <View style={styles.root}>
        {
          !ifinapp&&
        <TouchableOpacity style={styles.arrowButton} onPress={handleContinue}>
          <Ionicons name="arrow-forward-outline" size={23} color="#fff" />
        </TouchableOpacity>
  }
  
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
  
        <Text style={styles.text}>Define your favorite hobbies</Text>
        <Text style={styles.text1}>
          Choose 4 of your favorite hobbies from the list,
          and rank them according to their importance
        </Text>

        
        {
          console.log('this is the hobbies222',hobbies)
          
        }

        <FlatList
          data={hobbies}
          
          renderItem={({ item }) => (
        
            <View>
              
              {renderhobbies({item})}
       
          </View>
          )}
          keyExtractor={(item) => item.hobbieNum}
          numColumns={2}
        />
  
  <View style={{position:'absolute',bottom:18}}>
      <TouchableOpacity onPress={handleContinue}>
        <Icon
          name="check-circle"
          size={70}
          type="MaterialIcons"
          color="rgba(204,89,90,255)"

        />

      </TouchableOpacity>
      <Text style={{textAlign:'center',fontSize:16,fontFamily:'Lato_700Bold',fontWeight:'700',color:"rgba(204,89,90,255)"}}>Set Hobbies</Text>
      </View>
  
        
      </View>
   
      </SafeAreaView>
      
    );
  };
  
  // style of root (all screen without hobbies style)
  const styles = StyleSheet.create({
    root: {
      alignItems: "center",
      paddingTop: 20,
      backgroundColor: "#fff",
      
    },
  
    logo: {
      width: 250,
      maxWidth: 300,
      maxHeight: 200,
      top: -10,
    },
  
    text: {
      color: "#E04747",
      fontWeight: "bold",
      fontSize: 15,
      top: -15,
    },
  
    text1: {
      color: "rgba(0, 0, 0, 0.7)",
      fontSize: 13,
      top: -5,
    },
  
    scrollview: {
      alignItems: 'center',
      width: 400,
      justifyContent: 'center',
      marginTop: 30,
    },
  
    column: {
      flexDirection: 'row',
      justifyContent: "center",
      width: '100%',
      alignItems: 'center',
    },
  
    arrowButton: {
      backgroundColor: '#E04747',
      borderRadius: 50,
      padding: 13,
      top: 30,
      right: 150,
    },
  });
  