import { View, Text, StyleSheet, Dimensions, TouchableOpacity,SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';


const hours = [...Array(24)].map((_, i) => `${i}:00`);
const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

export default function PreferredMeetingTimes() {
    const [selecteStartdHour, setSelectedStartHour] = useState(hours[0]);
    const [selectedEndHour, setSelectedEndHour] = useState(hours[0]);
    const [selectedDay, setSelectedDay] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Day:</Text>
            <View style={styles.daysContainer} >

                {days.map(day => (

                    <TouchableOpacity
                        key={day}
                        style={styles.day}
                        onPress={() => setSelectedDay(day)}
                    >
                        <Text style={styles.dayText}>{day}</Text>
                    </TouchableOpacity>
                ))}

            </View>
            <View style={styles.firstPcikerView} >
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
            </View>
            <View style={styles.secondPicker} >
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
            <View style={styles.btnContainer} >
                <TouchableOpacity style={styles.btn} >
                    <Text style={styles.btnText} >Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.04,
    },
    picker: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.2,

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
    firstPciker: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondPicker: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    daysContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    day: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
        margin: 5,
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.1,
        height: Dimensions.get('window').height * 0.05,
    },
    dayText: {
        fontSize: 24,
    },
    btnContainer: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        backgroundColor: 'lightblue',
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    btnText: {
        fontSize: 24,
    },

});
