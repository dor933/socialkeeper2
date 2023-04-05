import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
//import usestate
import { useState, useEffect } from "react";
//create a simple component
const Days = (props) => {

    const day=props.day;
    const selectedDay = props.selectedDay;
    const setSelectedDay = props.setSelectedDay;

   

  


      const handlePress = (day) => {
        if (day === selectedDay) {
          setSelectedDay("");
          return;
        }
      
        setSelectedDay(day);
 
      };

    return (
        <TouchableOpacity onPress={() => handlePress(day)}>
        <View style={[styles.container, {borderColor: day==selectedDay ? "#E04747" : '' }]}>
        <Text style={[styles.text,{color: day==selectedDay ? "#E04747" : "rgba(0,0,0,0.7)" }]}>{props.day}</Text>
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