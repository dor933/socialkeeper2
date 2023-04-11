import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const TimePicker = ({ onTimeSelected }) => {
  const hours = [...Array(24)].map((_, i) => `${i}:00`);
  const [selectedHour, setSelectedHour] = useState(null);

  const handlePress = (hour) => {
    console.log(hour);
    setSelectedHour(hour);
    onTimeSelected(hour);
  };


  const renderItem = ({ item }) => (
    <View style={[ {width:100,marginBottom:10,borderRadius:10,alignItems:'center',backgroundColor: item === selectedHour ? '#f0f0f0' : '#fff' }]}>
            <TouchableOpacity
      onPress={() => handlePress(item)}
    >
      <Text style={styles.timeText}>{item}</Text>
    </TouchableOpacity>

    </View>

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
        fontSize: 14,
    },
    timePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        
        
        
      }
});


export default TimePicker;