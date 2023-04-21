import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
//import usestate
import { useState, useEffect } from "react";
//create a simple component
const Days = (props) => {

    const dayindex=props.dayindex;
    const dayletter=props.dayLetter;
    const selectedDay = props.selectedDay;
    const setSelectedDay = props.setSelectedDay;

   

  


      const handlePress = (dayindex) => {
        console.log("dayindex", dayindex);
        console.log("selectedDay", selectedDay.index);

        if (dayindex === selectedDay.index) {
          setSelectedDay({});
          return;
        }
      
        setSelectedDay({index: dayindex, letter: dayletter});
 
      };

    return (
        <TouchableOpacity onPress={() => handlePress(dayindex)}>
        <View style={[styles.container, {borderColor: dayindex==selectedDay.index ? "#E04747" : '' }]}>
        <Text style={[styles.text,{color: dayindex==selectedDay.index ? "#E04747" : "rgba(0,0,0,0.7)" }]}>{dayletter}</Text>
        </View>
        </TouchableOpacity>
    );
    }
    const styles = StyleSheet.create({
        container: {
            
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D9D9D9',
            flexDirection: 'column',
            width: 45,
            borderRadius: 10,
            height: 35,
        },
        text: {
            fontSize: 24,
            fontWeight: '500',
            letterSpacing: 0.03,
            lineHeight: 28,
            textAlign: 'center',
            color:"rgba(0,0,0,0.7)"

        },
    });
    export default Days;