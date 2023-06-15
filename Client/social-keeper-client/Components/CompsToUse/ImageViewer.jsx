import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { useState,useContext } from "react";

// export default function ImageViewer({ placeholderImageSource, selectedImage }) {
//   const imageSource =
//     selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

//   return (
//     <View>
//       <Image style={styles.image} source={require("../Screens/Profile/avatar-user.png")}></Image>
//     </View>
//   );
// }


export default function ImageViewer({ placeholderImageSource, selectedImage }) {


  const imageSource = selectedImage !== null
  ? { uri: selectedImage }
  : placeholderImageSource;


  return <Image source={imageSource} style={styles.image} />;

}

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 20,
  },
});
