import { View, Text , StyleSheet} from 'react-native'
import React from 'react'


export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  
    return <Image source={imageSource} style={styles.image} />;
  }

  const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 20,
    },
    });