
//imports for map view
import MapView from 'react-native-maps';
import { View, Text } from 'react-native'
import React from 'react'
//imports for location
import { useState, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';


const MapLocationForHobbies = () => {


  //states for location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  //cordinates states for map view
  // const [latitude, setLatitude] = React.useState(37.78825)
  // const [longitude, setLongitude] = React.useState(-122.4324)
  // const [latitudeDelta, setLatitudeDelta] = React.useState(0.0922)
  // const [longitudeDelta, setLongitudeDelta] = React.useState(0.0421)


  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(location);
    console.log(text);
  }

  return (
    <View>
      <Text style={{ width: '100%', height: '20%', top: 100 }}>{text}</Text>

      {/* <MapView
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
        style={{ width: '100%', height: '80%' }}
      /> */}
    </View>
  )
}

export default MapLocationForHobbies