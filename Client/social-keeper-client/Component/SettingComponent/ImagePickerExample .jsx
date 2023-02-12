import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Platform, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'



export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={pickImage} >
        {!image && <Image source={require('../../Images/user.png')} style={styles.imgUser} />}
        {image && <Image source={{ uri: image }} style={styles.imgUser} />}
      </TouchableOpacity>
      <Icon name="edit" size={32} color="gray" style={styles.icon} />
    </View>
  );
}
const styles = StyleSheet.create({
  imgUser: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  icon: {
    position: 'fixed',
    bottom: 38,
    right: -33,
  }
});