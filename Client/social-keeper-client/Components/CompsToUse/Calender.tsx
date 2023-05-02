import { StyleSheet, Text, View, Pressable, Alert, Modal, TouchableOpacity, Linking, Image } from 'react-native';
import React, { useState,useContext,useEffect } from 'react';

import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import events from '..//..//assets/events.json';
import EventItem from './Eventitem';
import { MainAppcontext } from '../Screens/MainApp/MainAppcontext';
let index=0;




export default function CalendarScreen({route}) {

    const [selectedEvent, setSelectedEvent] = useState<AgendaEntry | null>(null);
    const [items, setItems] = useState<AgendaSchedule>({});
    const {userevents, setUserevents} = useContext(MainAppcontext);
   console.log(userevents);
   const meeting= route.params.meeting;
   const invitedbyfriend= route.params.invitedbyfriend;
   console.log('this is meet',meeting); 
   

   
   
   useEffect(() => {
    if (meeting) {
        console.log('setting meeting');
        const prevevent=userevents;
       //run on every array of events in any dat
       for(const date in prevevent){

        // run on every event in the array and remove it if it has ismeeting property
        prevevent[date]=prevevent[date].filter((event)=>!event.isMeeting);
     
         }

         setUserevents(prevevent);


        
        
        console.log('this is prevevent',prevevent);
            
        const meetingdate= meeting.date;
        //convert date to string without time
        const eventdate=meetingdate.slice(0, 10);
        let usertomeeting;

        if(invitedbyfriend){
            usertomeeting=meeting.user1.userName;

        }
        else{
            usertomeeting=meeting.user2.userName;
        }

        const meetingadd={
            day:eventdate,
            endtime:meeting.endTime,
            starttime:meeting.startTime,
            height:80,
            name:"meeting with " + usertomeeting
        }

        if(prevevent[eventdate]){
            prevevent[eventdate].push({...meetingadd,isMeeting:true});
        }
        else{
            prevevent[eventdate]=[{...meetingadd,isMeeting:true}];
        }

        console.log('this is prevevent',prevevent);
        setUserevents(prevevent);

  
    }
  }, [meeting]);

  const today = new Date().toISOString().slice(0, 10);

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return  r1.name !== r2.name;

  };

  const theme = {
    selectedDayBackgroundColor: "rgba(224, 71, 71, 0.85)",
    selectedDayTextColor: "white",
    todayTextColor: "rgba(224, 71, 71, 0.85)",
    arrowColor: "orange",
    
    monthTextColor: "rgba(224, 71, 71, 0.85)",
    textSectionTitleColor: "black",
    dayTextColor: "#333333",
    textDisabledColor: "gray",
    dotColor: "rgba(224, 71, 71, 0.85)",
    selectedDotColor: "#ffffff",
    disabledArrowColor: "gray",
    calendarBackground: "white",
    "stylesheet.calendar.header": {
      header: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
      },
    },
  };

  const renderItem = (reservation: AgendaEntry) => {

    return (
        <EventItem
            reservation={reservation}
            onPress={() => {
                setSelectedEvent(reservation);
                console.log("Item pressed");
            }}
            isMeeting={reservation.isMeeting}
        />
        
    
        
    );
  };

  const renderEmptyDate = () => {
    return (
        <EventItem
            reservation={{ name: "No events", height: 15, day: "" }}
            onPress={() => {
                console.log("Empty date pressed");
            }}
        />
    );
  };

  const closeModal = () => {
    setSelectedEvent(null);
  }

  const modalContent = () => {
    if (!selectedEvent) {
      return null;
    }
    const { name, day } = selectedEvent;
    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{name}</Text>
        <Text>{name}</Text>
        

        <Pressable onPress={() => {
          const message = `Hi, I'm interested in the event "${name}" on ${selectedEvent.day}. Will we meet?`;
          const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
          Linking.openURL(url);
        }}>
          {/* <Image source={require('../../../assets/Images/Logos/WhatsApp_icon.png')} style={styles.whatsappLogo} /> */}
        </Pressable>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <Agenda
        items={userevents}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        showOnlySelectedDayItems
        theme={theme}
        selected={meeting.date.slice(0, 10)}
        keyExtractor={(item, index) => index.toString()}
        rowHasChanged={rowHasChanged}
    
        //add marked dates
    
      
      />
      <Modal visible={selectedEvent !== null} animationType="slide">
        {modalContent()}
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refuseButton} onPress={() => console.log("Refuse pressed")}>
          <Text style={styles.buttonText}>Refuse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => console.log("Agree pressed")}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    backgroundColor: "rgba(224, 71, 71, 0.5)",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 30,
  },

  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },

  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "rgba(224, 71, 71, 0.85)"
  },

  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 5,
    padding: 10,
    marginTop: 40,
  },

  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },

  whatsappLogo: {
    marginTop: 20,
    padding: 10,
    width: 80,
    height: 80,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 15,
    position: 'relative',
    bottom: 0,
  },
  acceptButton: {
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    borderRadius: 15,
    padding: 18,
    marginRight: 18,
    width: 120
  },

  refuseButton: {
    backgroundColor: 'rgba(224, 71, 71, 0.9)',
    borderRadius: 15,
    padding: 18,
    marginLeft: 20,
    width: 120,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

