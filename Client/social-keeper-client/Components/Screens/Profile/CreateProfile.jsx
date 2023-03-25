import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Input } from "@rneui/themed";
import DatePickerComponent from "../../CompsToUse/DatePickerComponent";
import { Button } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../../CompsToUse/ImageViewer";


export default function CreateProfile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const placeHolderImage = require("..//..///../assets//Images///RandomImages/avatar-user.png");


  //Pick image from gallery function (expo)
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true,


    });

    if (result.canceled) {
      Alert.alert("Image upload canceled");
    } else {
      setSelectedImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logo image */}
      <Image
        style={styles.logo}
        source={require("../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png")}
      />

      {/* Title */}
      <Text style={styles.text}>Create Your Profile</Text>

      {/* Photo viewer component */}
      <ImageViewer placeholderImageSource={placeHolderImage} selectedImage={selectedImage}
      />

      {/* Button to chnoose image from gallery */}
      <Button
        theme="primary"
        title="+"
        buttonStyle={{
          backgroundColor: "grey",
          borderRadius: 25,
          shadowOpacity: 0.05,
          shadowRadius: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        titleStyle={{
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 16,
          lineHeight: 19,
          letterSpacing: 0.1,
        }}
        containerStyle={{
          marginHorizontal: 50,
          width: 35,
          height: 35,
          marginVertical: 10,
          top: 200,
          left: 165,
        }}
        onPress={pickImageAsync}
      />

      {/* UserName - must use matirial UI or something equal .. */}
      <View style={styles.userName}>
        <Input
          placeholder="User name"
          leftIcon={{ type: "font-awesome", name: "user" }}
        />
      </View>
      {/* Birth date - must use matirial UI or something equal ..  */}
      <View style={styles.birthdayDate}>
      <Input
          placeholder="Gender"
          leftIcon={{ type: "font-awesome", name: "venus-mars" }}
          style={styles.icons}
        />
                <DatePickerComponent></DatePickerComponent>

      </View>
      

      {/* Gender - must use matirial UI or something equal ..  */}
      <View style={styles.gender}>
        <Input
          leftIcon={{ type: "font-awesome", name: "calendar" }}
          style={styles.icons}
        />
      </View>
      

      {/* Address? - to check if relevant - must use matirial UI or something equal ..  */}
      <View>
        <View style={styles.address}>
          <Input
            placeholder="Address"
            leftIcon={{ type: "font-awesome", name: "map" }}
            style={styles.icons}
          />
        </View>
      </View>
      <Button
        title="Confirm"
        // loading={false}
        // loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: "#E04747",
          borderRadius: 25,
          shadowOpacity: 0.05,
          shadowRadius: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        titleStyle={{
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 16,
          lineHeight: 19,
          letterSpacing: 0.1,
        }}
        containerStyle={{
          marginHorizontal: 50,
          width: 200,
          height: 60,
          marginVertical: 10,
          top: 530,
          left: 50,
        }}
        onPress={() => Alert.alert("Confirm button pressed")}
      />
    </SafeAreaView>
  );
}

//Styles for the CreateProfile screen
const styles = StyleSheet.create({
  //CSS for the SafeAreaView
  safeArea: {
    position: "relative",
    width: 430,
    height: 932,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
  },
  //CSS for the logo image
  logo: {
    position: "absolute",
    width: 295,
    height: 155,
    left: 60,
    top: 35,
  },
  //CSS for the title text
  text: {
    position: "absolute",
    width: 220,
    height: 29,
    left: 95,
    top: 200,
    fontStyle: "normal",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.03,
    color: "#E04747",
  },

  //CSS for user name
  userName: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 59,
    top: 400,
  },

  //CSS for birthday date
  birthdayDate: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 460,
  },

  //CSS for gender
  gender: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 520,
  },
  //CSS for address
  address: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 420,
  },
  confirmBtn: {
    width: 174,
    height: 60,
    backgroundColor: "#E04747",
  },
  //CSS for imagePicker
  imagePicker: {
    position: "absolute",
    width: 200,
    height: 200,
    left: 100,
    top: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
});
