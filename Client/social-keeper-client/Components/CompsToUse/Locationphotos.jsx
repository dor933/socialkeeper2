import React, { useState,useEffect, useContext  } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { MainAppcontext } from '../Screens/MainApp/MainAppcontext';
import axios from 'axios';

//lower component
const LocationPhotos = ({photosarray,typeofmeeting,meeting,navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [images, setImages] = useState([]);
    const apikey='AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow'
    const {user, setUser} = useContext(MainAppcontext);

    console.log('this is photos array', photosarray)
    console.log('this is typeofmeeting', typeofmeeting)

    useEffect(() => {
        const newImages = [];
        if (photosarray.length > 0) {
            for (let i = 0; i < photosarray.length; i++) {
                const photoref = photosarray[i].photo_reference;
                const photorequest = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoref}&key=${apikey}`;
                newImages.push({ uri: photorequest });
                if (i > 5) {
                    break;
                }
            }
        }
        setImages(newImages);
        console.log('this is meeting22', meeting)
        
    }, [photosarray]);




    const changemeetingstatus = async (meetingNum, status) => {
        try{
        parseInt(meetingNum);
        const url = `http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Updmeeting/${meetingNum}/${status}`;
        console.log('this is the url', url)

        const response = await axios.put(url);
        console.log('this is the response', response.data)
        if (response.data) {
            console.log('this is the response', response.data)
            return response.data;
        }
    }
    catch (error) {
        console.log('this is the error', error)

    }
    }

    const cancelmeeting = async () => {
        const meetingNum = meeting.meetingNum;
        const tblsuggestedcopy= user.tblSuggestedMeetings;
            const tblsuggested1copy= user.tblSuggestedMeetings1;
            let meetingcopy={};
            meetingcopy= user.tblSuggestedMeetings.find(meeting => meeting.meetingNum === meetingNum);
            let data={};
            if(meetingcopy==undefined){
                let meetingtochange=tblsuggested1copy.find(meeting => meeting.meetingNum === meetingNum);
                meetingtochange.status="R";
                setUser({...user,tblSuggestedMeetings1:tblsuggested1copy});
                data=await changemeetingstatus(meetingNum,"R");

            }
            else{
                let meetingtochange=tblsuggestedcopy.find(meeting => meeting.meetingNum === meetingNum);
                meetingtochange.status="R";
                setUser({...user,tblSuggestedMeetings:tblsuggestedcopy});
                data=await changemeetingstatus(meetingNum,"R");

            }
        }



    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const handleClosePress = () => {
        setSelectedImage('');
        setModalVisible(false);
    };

 //part of the image style, order by image location
    const getWrapperStyle = (index) => {
        switch (index) {
            case 0:
                return { ...styles.imageWrapper, borderTopLeftRadius: 40 };
            case 1:
                return { ...styles.imageWrapper, borderTopRightRadius: 40 };
            case 2:
                return { ...styles.imageWrapper};
            case 3:
                return { ...styles.imageWrapper};
            case 4:
                return { ...styles.imageWrapper, borderBottomLeftRadius: 40 };
            case 5:
                return { ...styles.imageWrapper, borderBottomRightRadius: 40 };
            case 6:
                return { ...styles.imageWrapper, borderRadius: 25 };
            default:
                return styles.imageWrapper;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Photos of Meeting Location</Text>
            <View style={styles.imageContainer}>
                {images.map((image, index) => (
                    <TouchableOpacity key={index} style={getWrapperStyle(index)} onPress={() => handleImagePress(image)}>
                        <Image source={image} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </View>
            { ((typeofmeeting == 'waiting') || (typeofmeeting== 'approved')) && 
            

            <TouchableOpacity style={[styles.buttonsviews,{justifyContent:'center'}]} onPress={async() => {

                await cancelmeeting();
                navigation.navigate('SuggestedMeetings');
             }}>
                <Text style={styles.cancelButton}>Cancel the Meeting?</Text>
            </TouchableOpacity>
            }
            {
                typeofmeeting === 'suggested' &&
                <View style={[styles.buttonsviews]}>
                 
                    <TouchableOpacity style={styles.submitbox} onPress={async () => {

                     
                        const meetingNum = meeting.meetingNum;
                        const tblsuggestedcopy= user.tblSuggestedMeetings;
                         const tblsuggested1copy= user.tblSuggestedMeetings1;
                         let meetingcopy={};
                         meetingcopy= user.tblSuggestedMeetings.find(meeting => meeting.meetingNum === meetingNum);
                         let data={};

                        if(meetingcopy==undefined){
                            //run on the array and find the meeting with the same meetingNum and change the status to 'A'

                            let meetingtochange=tblsuggested1copy.find(meeting => meeting.meetingNum === meetingNum);
                            //change the status to 'A'
                            meetingtochange.status="A";
                            setUser({...user,tblSuggestedMeetings1:tblsuggested1copy});
                             data=await changemeetingstatus(meetingNum,"A");
                            console.log('this is data', data)


                        }
                        else{
                            console.log('im in else')
                            //run on the array and find the meeting with the same meetingNum and change the status to 'A'
                     
                            let meetingtochange=tblsuggestedcopy.find(meeting => meeting.meetingNum === meetingNum);
                            //change the status to 'A'
                            meetingtochange.status="W";
                            // set tblsuggestedcopy as the new tblsuggestedmeetings
                            setUser({...user,tblSuggestedMeetings:tblsuggestedcopy});
                            data=await changemeetingstatus(meetingNum,"W");
                            console.log('this is data', data)

                            console.log('this is tblsuggestedcopy')
                            console.log(tblsuggestedcopy)

                        }


                        navigation.navigate('SuggestedMeetings');



                        
                        

                     }}>
                        <Text style={styles.buttonstext}>Schedule Meeting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addtimearraybox} onPress={async () => { 

                   await cancelmeeting();
                 navigation.navigate('SuggestedMeetings');

                      }}>
                 <Text style={styles.buttonstext}>Cancel the Meeting</Text>
                  </TouchableOpacity>
                

                </View>
            }
            <Modal visible={modalVisible} animationType='fade' transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Image source={selectedImage} style={styles.modalImage} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 0,
        
    },
    submitbox:{

        backgroundColor: "#1976D2",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:"48%",
        height:"40%",


    },
    buttonstext:{
        fontFamily:'Lato_700Bold',
        fontSize: 16,
        fontStyle: 'normal',
        lineHeight: 19,
        letterSpacing:0.01,
        textAlign: 'center',
        color:'rgba(255, 255, 255, 0.9)',

    } ,
    buttonsviews:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.12,
        top: Dimensions.get('window').height * 0.005,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        
    },
    text: {
        fontWeight: 'bold',
        paddingBottom: 30,
        paddingRight: 170,
        fontFamily:'Lato_700Bold'
                
        
    },
    addtimearraybox:{
        backgroundColor: "#E04747",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        width:"48%",
        height:"40%",
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
        
    },
    imageWrapper: {
        borderWidth: 4,
        borderColor: 'white',
        width: '50%',
        height: 230,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '80%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
    },
    buttonsviews:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.12,
        top: Dimensions.get('window').height * 0.03,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',

        
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    cancelButton: {
        color: '#D24747',
        fontSize: 14,
        top: 25
    },
});

export default LocationPhotos;
