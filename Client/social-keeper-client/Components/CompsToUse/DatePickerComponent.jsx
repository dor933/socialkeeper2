import React, { useState,useEffect } from 'react';
import { StyleSheet, View,Button, TouchableOpacity } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Input } from "@rneui/themed";
import { RegistContext } from '../..//RegistContext.jsx';
import { useContext } from 'react';
import { Icon } from 'react-native-elements';


export default (props) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const [hasDateBeenSelected, setHasDateBeenSelected] = useState(false);
  const keyboardshow = props.keyboardshow;
  const handledate=props.handledate;
  const fromgeneratemeeting=props.fromgeneratemeeting;
  console.log('from generate meeting is',fromgeneratemeeting)
  const isfrommainapp = props.isfrommainapp;
  console.log(isfrommainapp)

 

  const handlePress = () => {
      
    setOpen(!open);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {

      if(fromgeneratemeeting){
    
        //the selected date must be in the future
        const currentDate = new Date();
        const differenceInTime = currentDate - selectedDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (selectedDate < currentDate || differenceInDays > 6570) {
          // If the selected date is in the past or doesn't meet the constraint, show an alert
          alert("Invalid Date");
          return;
        }


        //if the selected date is not null
        if(selectedDate){

        const currentDate = new Date(selectedDate || date);
        //make the current date as string and without time
        const datestring= currentDate.toISOString().split('T')[0];

        setDate(currentDate);
        setHasDateBeenSelected(true);
        console.log('this is the date',datestring)
        handledate(datestring);
        }
        setOpen(false);








      }
      else{

      const currentDate = new Date();
      const differenceInTime = currentDate - selectedDate;
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      
      if (selectedDate > currentDate || differenceInDays < 6570) {
        // If the selected date is in the future or doesn't meet the constraint, show an alert
        alert("Invalid Date");
        return;
      }
      
      //if the selected date is not null
      if(selectedDate){
        
      const currentDate = new Date(selectedDate || date);
      //make the current date as string and without time
     const datestring= currentDate.toISOString().split('T')[0];
     

      //set the date to the date string
      setDate(currentDate);
      setPersonalDetails({...personaldetails, birthDate: datestring});
      setHasDateBeenSelected(true);
      console.log(personaldetails);
    }
    setOpen(false);
  }
  };
  };

  if(!keyboardshow){

  return (


    <>
    
      <TouchableOpacity onPress={handlePress} >
        <Input
          placeholder= { !fromgeneratemeeting? "Date of Birth" : "Meeting Time"}
          value={hasDateBeenSelected ? date.toDateString() : !fromgeneratemeeting? 'Date of Birth' : "Meeting Date"}
          editable={false}
          leftIcon={
            <Icon
              name={"date-range"}
              size={24}
              style={{color: isfrommainapp? '#ffffff': hasDateBeenSelected? "black" : "#8d97a0"}}


            />
          }
          style={{color: isfrommainapp? '#ffffff': hasDateBeenSelected? "black" : "#8d97a0" , fontFamily:'Lato_400Regular'}}
        />
      </TouchableOpacity>

      {open && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          style={{
            width: 200,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'black',
            
          }}
          //pick a theme for the date picker
        />
      )}
    </>
  );
  }
  else{
    return(
      <>
      

      </>
    )
  }
};