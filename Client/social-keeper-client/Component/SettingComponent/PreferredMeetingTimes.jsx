import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';


const hours = [...Array(24)].map((_, i) => `${i}:00`);

export default function PreferredMeetingTimes() {
    const [selecteStartdHour, setSelectedStartHour] = useState(hours[0]);
    const [selectedEndHour, setSelectedEndHour] = useState(hours[0]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Start Time:</Text>
            <View style={styles.picker} >
                <Picker
                    style={styles.picker}
                    selectedValue={selecteStartdHour}
                    onValueChange={itemValue => setSelectedStartHour(itemValue)}
                    itemStyle={styles.pickerItem}>
                    {hours.map(hour => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                    ))}
                </Picker>
            </View>
            <Text style={styles.text}>End Time:</Text>
            <View style={styles.picker} >
                <Picker
                    style={styles.picker}
                    selectedValue={selectedEndHour}
                    onValueChange={itemValue => setSelectedEndHour(itemValue)}
                    itemStyle={styles.pickerItem}>
                    {hours.map(hour => (
                        <Picker.Item key={hour} label={hour} value={hour} />
                    ))}
                </Picker>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        width: 200,
        height: 200,
    },


    pickerItem: {
        fontSize: 36,
        color: 'black',
        textAlign: 'center',
    },
    text: {
        fontSize: 24,
        marginTop: 20,
    },
});
