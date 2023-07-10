import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const TimePicker = ({ onTimeSelected , fromgenerate}) => {
  const hours = [...Array(24)].map((_, i) => `${i}:00`);
  const [selectedHour, setSelectedHour] = useState(null);

  const handlePress = (hour) => {
    console.log(hour);
    setSelectedHour(hour);
    onTimeSelected(hour);
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={[ {width:100,marginBottom:10,borderRadius: 10,alignItems:'center',backgroundColor: item == selectedHour? '#cce7e8' : '#ffffff' }]
    

    } 
    onPress={() => handlePress(item)}
    >
    
      <Text style={[styles.timeText,{fontFamily:fromgenerate? 'Pacifico_400Regular' : 'Lato_400Regular', fontSize:!fromgenerate? 14 : 10}]}>{item}</Text>

    </TouchableOpacity>

  );

  return (
    <FlatList
      data={hours}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={1} // Change the number of columns if needed
      contentContainerStyle={styles.timePicker}
      

    />
  );
};

const styles = StyleSheet.create({
    timeItem: {
    margin: 10,
 
    width: "100%",

    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Pacifico_400Regular',
        
        
    },
    timePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        
        
        
        
      }
});


export default TimePicker;