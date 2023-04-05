import React, { useState } from 'react';
import { StyleSheet, View,Button, TouchableOpacity } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Input } from "@rneui/themed";
import { RegistContext } from '../..//RegistContext.jsx';
import { useContext } from 'react';


export default () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const {personaldetails, setPersonalDetails} = useContext(RegistContext);

  const handlePress = () => setOpen(!open);

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {

      //check if the selected date is null or greater than the current date
      if(selectedDate > new Date()){
        //if its greater say that the date is invalid
        alert("Invalid Date");
        //return
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
      console.log(personaldetails);
    }
    setOpen(false);
  };
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <Input
          placeholder="Date of Birth"
          value={date.toDateString()}
          editable={false}
          leftIcon={{ type: 'font-awesome', name: 'calendar' }}
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
        />
      )}
    </>
  );
};