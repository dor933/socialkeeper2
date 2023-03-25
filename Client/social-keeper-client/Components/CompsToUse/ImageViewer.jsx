import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

// export default function ImageViewer({ placeholderImageSource, selectedImage }) {
//   const imageSource =
//     selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

//   return (
//     <View>
//       <Image style={styles.image} source={require("../Screens/Profile/avatar-user.png")}></Image>
//     </View>
//   );
// }


export default function ImageViewer() {
  // const imageSource = selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

  return (
    <View>
      <Image style={styles.image} source={require("../Screens/Profile/avatar-user.png")}></Image>
    </View>
    
  );
}

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    top: 250,
    left: 170,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 20,
  },
});
