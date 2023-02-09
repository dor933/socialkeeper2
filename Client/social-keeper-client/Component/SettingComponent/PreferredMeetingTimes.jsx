import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';


const hours = [...Array(24)].map((_, i) => `${i}:00`);
const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];


export default function PreferredMeetingTimes() {
    const [selecteStartdHour, setSelectedStartHour] = useState(hours[0]);
    const [selectedEndHour, setSelectedEndHour] = useState(hours[0]);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);//array of objects {day: 'S', startHour: '10:00', endHour: '12:00'}

    //this function is called when the user clicks on the add button to add a new preferred meeting time
    //in the future we will send the selectedDays array to the server to save it in the database
    const addFavoriteTime = () => {
        if (selectedDay === '') {
            Alert.alert('Please select a day');
            return;
        }
        //check start hour is not equal to end hour and start hour is before end hour
        if (selecteStartdHour === selectedEndHour) {
            Alert.alert('Start hour and end hour should not be the same');
            return;
        }
        if (hours.indexOf(selecteStartdHour) > hours.indexOf(selectedEndHour)) {
            Alert.alert('Start hour should be before end hour');
            return;
        }
        let newTime = {
            day: selectedDay,
            startHour: selecteStartdHour,
            endHour: selectedEndHour,
        };
        if (selectedDays.find(d => d.day === newTime.day)) {
            setSelectedDays(selectedDays.filter(d => d.day !== newTime.day));
        }
        setSelectedDays([...selectedDays, newTime]);
        setSelectedDay('');
        setSelectedStartHour(hours[0]);
        setSelectedEndHour(hours[0]);
    };


        return (
            <View style={styles.container}>
                <View style={styles.logoContainer} >
                    {/* //social-keeper-low-resolution-logo-color-on-transparent-background.png */}
                    <Image
                        style={styles.logo}
                        source={require('../../Images/social-keeper-low-resolution-logo-color-on-transparent-background.png')}
                    />

                </View>
                <Text style={styles.logoText}>Choose at least 3 favorite times </Text>

                <View style={styles.daysContainer} >
                    {days.map(day => (
                        <TouchableOpacity
                            key={day}
                            style={selectedDay === day ? styles.selectedDay : selectedDays.find(d => d.day === day) ? styles.alreadySelectedDay : styles.day}
                            onPress={() => setSelectedDay(day)}
                        >
                            <Text style={styles.dayText}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.firstPickerContainer} >
                    <Text style={styles.text}>Start Time:</Text>

                    <Picker
                        style={styles.pickerInside}

                        selectedValue={selecteStartdHour}
                        onValueChange={itemValue => setSelectedStartHour(itemValue)}
                        itemStyle={styles.pickerItem}
                    >
                        {hours.map(hour => (
                            <Picker.Item key={hour} label={hour} value={hour} />

                        ))}
                    </Picker>

                </View>
                <View style={styles.dividerLine} />
                <View style={styles.lastPickerContainer} >
                    <Text style={styles.text}>End Time:</Text>
                    <Picker
                        style={styles.pickerInside}
                        selectedValue={selectedEndHour}
                        onValueChange={itemValue => setSelectedEndHour(itemValue)}
                        itemStyle={styles.pickerItem}>
                        {hours.map(hour => (
                            <Picker.Item key={hour} label={hour} value={hour} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.btnContainer} >
                    <TouchableOpacity onPress={addFavoriteTime} style={styles.btn} >
                        <Text style={styles.btnText} >Save </Text>
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
            marginTop: Dimensions.get('window').height * 0.008,
        },
        

        pickerInside: {
            flex: 1,
            width: Dimensions.get('window').width * 1,
            height: Dimensions.get('window').height * 0.02,
        },
        picker: {
            flex: 1,
            width: Dimensions.get('window').width * 0.9,
            height: Dimensions.get('window').height * 0.02,

        },
        logo
            : {
            width: Dimensions.get('window').width * 0.63,
            height: '100%',
            resizeMode: 'contain',
        },
        logoContainer: {
            flex: 1.65,
        },
        logoText: {
            fontSize: Dimensions.get('window').height * 0.022,
            color: 'black',
            textAlign: 'center',
            marginVertical: Dimensions.get('window').width * 0.05,
        },
        firstPickerContainer: {
            flex: 2.3,
            alignItems: 'center',
            justifyContent: 'center',
            //marginBottom: Dimensions.get('window').height * 0.06     
        },
        lastPickerContainer: {
            flex: 2.3,
            alignItems: 'center',
            justifyContent: 'start',
            marginBottom: Dimensions.get('window').height * 0.01,

        },

        pickerItem: {
            fontSize: Dimensions.get('window').height * 0.025,
            flex: 1,
            color: 'black',
            textAlign: 'center',
            fontWeight: 'bold',

        },
        text: {
            fontSize: Dimensions.get('window').height * 0.022,

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
            backgroundColor: 'lightgray',
            margin: 5,
            borderRadius: 3,
            width: Dimensions.get('window').width * 0.1,
            height: '60%'
        },
        selectedDay: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'lightgray',
            margin: 5,
            borderRadius: 3,
            borderColor: 'black',
            borderWidth: 1.1,
            width: Dimensions.get('window').width * 0.1,
            height: '60%'
        },
        alreadySelectedDay: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#484848',
            margin: 3,
            borderRadius: 3,
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
            paddingTop: 8,
        },
        btn: {
            backgroundColor: '#F95F6B',
            width: Dimensions.get('window').width * 0.77,
            height: Dimensions.get('window').height * 0.058,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
        },
        btnText: {
            fontSize: 24,
            color: 'white',
        },
        dividerLine: {
            width: Dimensions.get('window').width * 0.95,
            height: 1,
            backgroundColor: 'lightgray',
            // marginTop: Dimensions.get('window').height * 0.01,
            marginBottom: Dimensions.get('window').height * 0.025,
        },
    });