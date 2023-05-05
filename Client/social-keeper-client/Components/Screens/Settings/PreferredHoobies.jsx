
import { View, Text, Image, StyleSheet, TouchableOpacity,ScrollView, Alert, SafeAreaView,FlatList } from 'react-native'
  import { useState, useEffect,useContext } from 'react';
  import Logo from '../..//..//assets/Images/RandomImages/SocialKeeper.jpeg'
  import HobbiesComponent from './HobbiesComponent.jsx'
  import { Ionicons } from '@expo/vector-icons';
  import axios from 'axios';
  import { RegistContext } from '../..//..//RegistContext.jsx';
  //import usefonts
  import { useFonts } from 'expo-font';
  
  export default function PreferredHoobies ({navigation}) {
    // number of pressing on heart button
    const [count, setCount] = useState(0);
    const [hobbies, setHobbies] = useState([]);
    const {selectedhobbies, setSelectedHobbies} = useContext(RegistContext);

    const counting = (number) => {
      let temp = number + count
      setCount(temp)
    }


      

  


    useEffect(() => {

      setSelectedHobbies([]);
      gethobbies();

    },[])

    const gethobbies=async() => {

      const response = await axios.get('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/getallhobbies');
      //add rank to each hobbie
      response.data.forEach(element => {
        element.rank=0;
      });

      setHobbies(response.data);
      console.log(response.data);

    };

  
    const handleContinue = () => {
      if (count === 4) {
        console.log("selectedhobbies",selectedhobbies);
        navigation.navigate('PreferredMeetingTimes');
      } else {
        Alert.alert('You must choose 4 hobbies, can\'t choose less😢');
      }
    }

    const renderhobbies = ({item}) => {
 
      return (
        <HobbiesComponent myitem={item} counting={counting} count={count} />
      
      )
    }
  
    // render all the hobbies (מרנדר את כל התחביבים למסך)
    return (
      
  
      <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>

      <View style={styles.root}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleContinue}>
          <Ionicons name="arrow-forward-outline" size={23} color="#fff" />
        </TouchableOpacity>
  
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
  
        <Text style={styles.text}>Define your favorite hobbies</Text>
        <Text style={styles.text1}>
          Choose 4 of your favorite hobbies from the list,
          and rank them according to their importance
        </Text>

        

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
      right: 165,
    },
  });
  