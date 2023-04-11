import { View, Text,StyleSheet,SafeAreaView } from 'react-native'
import Customheader from '../../CompsToUse/Customheader'



export default function FutureMeetingScreen() {
  return (
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
      <Customheader/>
    </View>
    </SafeAreaView>
  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40
  }

  
})