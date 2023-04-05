import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState,useContext } from 'react';
import StarRating from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import {
  useFonts,
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold, 
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { RegistContext } from '../..//..//RegistContext.jsx';

function HobbiesComponent({navigation,myitem,counting,count}) {

  const {selectedhobbies, setSelectedHobbies,personaldetails} = useContext(RegistContext);

  

  let [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
   
    });

  const item=myitem;

  const [rating, setRating] = useState(0);
  const [activeHeart, setActiveHeart] = useState(false);

  //count of heart btn pressing and logic (ניתן ללחוץ לייק רק 4 פעמים לא יותר)
  const toggleHeart = () => {
    setActiveHeart(!activeHeart);
    if (activeHeart) {
     
      counting(-1);
      //remove the hobbie from the selectedhobbies array
      const newselectedhobbies=selectedhobbies.filter((hobbie)=>hobbie.hobbieNum!==item.hobbieNum);
      setSelectedHobbies(newselectedhobbies);
      console.log("newselectedhobbies",newselectedhobbies);
      return;

    }
    else {

      if (count >= 4) {
        setActiveHeart(false);
        return
      }
      counting(1)
      
      let updatedhobbies=[];
      updatedhobbies=[...selectedhobbies, {hobbieNum:item.hobbieNum, rank:rating, phoneNum1: personaldetails.phoneNumber}]
      setSelectedHobbies(updatedhobbies);
      console.log("updatehobbies",updatedhobbies);

    }
  };

  const handlerating = (rating) => {
    setRating(rating);
    //update the rank of the hobbie in the selectedhobbies array
    const newselectedhobbies=selectedhobbies.map((hobbie)=>{
      if(hobbie.hobbieNum===item.hobbieNum){
        hobbie.rank=rating;
      }
      return hobbie;
    });
    setSelectedHobbies(newselectedhobbies);
    console.log("newselectedhobbies",newselectedhobbies);

  }

  //render the hobbie
  return (
    

    <View style={styles.container}>

      <ImageBackground style={styles.hobbieImage} source={{uri:item.imageuri}}>
        <TouchableOpacity onPress={toggleHeart} style={styles.heartButton}>
          <Icon name={activeHeart ? "heart" : "heart-o"} size={30} color="red" />
        </TouchableOpacity>
      </ImageBackground>
      <View>
      <Text style={styles.hobbieName}>{item.hobbieName}</Text>

      </View>

      {activeHeart ?
        // rating code (רק שלוחצים על האייקון לב מופיע הדירוג כוכבים)
        // נצטרך לשלוח את הדירוג של התחביבים ממסך זה בהמשך 
        <StarRating
          starSize={22}
          maxStars={5}
          rating={rating}
          onChange={handlerating}
          style={styles.rating}
        />
        : null
      }


    </View>
    
  );
}

// style of hobbies
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 2 - 20,
    height:200,
    margin: 5,    
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 25,
    justifyContent:'center',
    alignItems:'center',
    
    
    
    
  },

  hobbieImage: {
    width: 140,
    height: 140,
    borderRadius: 25,
    overflow: 'hidden',
    
    
    
  },
  
  hobbieName: {
   
    fontSize: 11,
    marginTop: 5,
    fontFamily: 'Lato_700Bold',
    paddingRight: 80,
    fontWeight: 'bold',
    


    
  },

  rating: {
    marginTop: 5,
    marginLeft: 7,
  },

  heartButton: {
    position: 'absolute',
    top: 5,
    left: 8,
  },
});

export default HobbiesComponent;

