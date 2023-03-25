import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-datepicker';


export default function DatePickerComponent() {
  const [date, setDate] = useState();

  return (
    <View>
      <DatePicker
        date={date} //initial date from state
        mode="date" //The enum of date, datetime and time
        placeholder="select date"
        format="DD-MM-YYYY"
        minDate="01-01-1940"
        maxDate="01-01-2003"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            display: 'none',
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            borderWidth: 0,
            position: 'absolute',
            marginLeft: 36,
            height: 50,
            width: 270,
            left: 0,
          }
        }}
        onDateChange={(date) => {
          setDate(date);
        }}
      />
    </View>
  )
}