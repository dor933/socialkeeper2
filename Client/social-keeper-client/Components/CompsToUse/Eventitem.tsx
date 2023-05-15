import React from 'react';
import { StyleSheet, Text, Pressable,View } from 'react-native';
//import lato



interface EventItemProps {
  reservation: {
    name: string;
    height: number;
    day: string;
    starttime: string;
    endtime: string;
    meetingplace: string;
  };
  onPress: () => void;
    isMeeting?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ reservation, onPress, isMeeting=false }) => {

 


    const backgroundColor = isMeeting ? '#1e5cc7' : '#e80927';
    const itemStyle = {
        ...styles.item,
        height: reservation.height,
        backgroundColor: backgroundColor,
        
    };

  return (
    <Pressable style={[itemStyle,{justifyContent:'center'}]} onPress={onPress}>
            <View style={{ flexDirection: 'row-reverse' }}>

      <Text style={[styles.text,{padding:3}]}>{reservation.name}</Text>
      </View>
      <View style={{ flexDirection: 'row-reverse' }}>


      <Text style={[styles.text]}> {reservation.starttime}-{reservation.endtime}</Text>
      </View>
      <View style={{ flexDirection: 'row-reverse' }}>
      <Text style={[styles.text,{marginTop:5,paddingLeft:4}]}> {reservation.meetingplace}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 30,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',

    fontStyle: 'normal',
    lineHeight: 15,
    letterSpacing: 0.5,
  },
});

export default React.memo(EventItem);