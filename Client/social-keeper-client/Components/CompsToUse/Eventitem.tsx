import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

interface EventItemProps {
  reservation: {
    name: string;
    height: number;
    day: string;
    starttime: string;
    endtime: string;
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
    <Pressable style={itemStyle} onPress={onPress}>
      <Text>{reservation.name}</Text>
      <Text> {reservation.starttime}-{reservation.endtime}</Text>
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
});

export default React.memo(EventItem);