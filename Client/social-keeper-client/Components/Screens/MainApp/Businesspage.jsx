import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Modal,TouchableOpacity, ScrollView,FlatList, SafeAreaView } from "react-native";
//import use effect and use state
import { useState, useEffect } from "react";
import { Icon } from '@rneui/themed';
import StarRating from 'react-native-star-rating-widget';
//import font awesome
import { FontAwesome } from '@expo/vector-icons';



//import navigation
//create functional component

const Businesspage = ({route,navigation}) => {
    const [objtosend, setObjtosend] = useState(null);
    const [photosarray, setPhotosarray] = useState(null);
    const [modalvisible, setModalvisible] = useState(false);
    const [selectedimage, setSelectedimage] = useState(null);
    const myobject=route.params.information;
    const place= myobject.meeting.place;
    const apikey='AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow'


    useEffect(() => {
        setObjtosend(myobject);
        setPhotosarray(myobject.meeting.place.photos);

    }, []);


    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.cont}>
            <View style={styles.topcover}>

                <ImageBackground style={styles.image} source={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apikey}`}}>
                <View style={styles.overlay} >
                <Text style={styles.textstyle}>{place.name}</Text>

                <Image source={{uri:place.icon}} style={styles.icon}/>
                </View>

                    </ImageBackground>
                    {
                        console.log('place',place)
                    }
                

            </View>
            <ScrollView style={{bottom:25}} >
            <View style={styles.container2}>
                <View style={{flexDirection:'row',justifyContent:'center',width:'100%',alignItems:'center',marginTop:20}}>
                    <Icon name="check-circle" size={20} color="blue" />
                <Text style={styles.textcont2}> {place.name}</Text>

                </View>
                <View style={{marginTop:10}}>
                <Text style={{textAlign:'center',fontFamily:'Lato_300Light'}}> {place.vicinity}</Text>

                </View>
                { place.user_ratings_total &&
                <View style={[styles.item,{marginTop:10}]}>
                <Text style={{fontFamily:'Lato_300Light',fontSize:12}}>Total Reviews: {place.user_ratings_total}</Text>
                <FontAwesome name="heart" size={14} color="red" />
                    </View>  
                }

                { place.rating &&
                    <View style={[styles.item,{marginTop:5}]}>
                <Text style={{fontFamily:'Lato_300Light',fontSize:12,height:16}}>Avarage Rating: </Text>
                <StarRating
                    rating={place.rating}
                    starDimension="20px"
                    starSize={10}
                    starSpacing="2px"
                    starRatedColor="red"
                    starEmptyColor="grey"
                    starHoverColor="red"
                    starStrokeWidth="2px"
                    starType="svg"
                    starStrokeColor="red"
                    />
                    </View>
                }


                { place.opening_hours && place.opening_hours.weekday_text &&
                <View style={{width:'100%',alignItems:'center',marginTop:20}}>
                    <Text style={{fontFamily:'Lato_400Regular',fontWeight:'700',height:30,fontSize:16}}> Opening Hours</Text>
                     {
                        place.opening_hours && place.opening_hours.weekday_text ?
                        place.opening_hours.weekday_text.map((item,index)=>{
                            return(
                                <Text key={index} style={{fontFamily:'Lato_400Regular',height:30,fontSize:16}}>{item}</Text>
                            )
                        }) : null

                        }
                    

           
                </View>
}
                { place.reviews && place.reviews.length > 0 &&
                <>
                <View style={{marginTop:10}}>
                <Text style={{fontFamily:'Inter_400Regular',fontSize:14,fontWeight:'700',marginRight:40,marginBottom:10}}> Top Reviews</Text>
             

                </View>

                {
                    place.reviews.map((item,index)=>{
                            return(
                                <View style={styles.ratingbox}>
                                    <Image source={{uri:item.profile_photo_url}} style={styles.imagerating}/>
                                    <View style={{alignItems:'center',marginLeft:10}}>
                                    <Text style={{fontFamily:'Lato_400Regular',height:20,color:'#e67465',fontSize:14}}>{item.author_name}</Text>
                                    <StarRating
                                        starSize={20}
                                        maxStars={5}
                                        rating={item.rating}
                                        starStyle={{marginRight:5}}
                                        fullStarColor={'#e67465'}
                                        
                                        emptyStarColor={'#e67465'}
                                        //disable change
                                        onChange={()=> null}
                                        //make the starts from right to left
                                        />
                                        
                                        
                                    </View>
                                    <View style={{marginLeft:10}}>
                                        <Text style={{fontFamily:'Lato_300Light',fontSize:10}}>{item.relative_time_description}</Text>
                                      
                                    </View>
                               
                                    
                                </View>
                            )
                        }
                        )
                        
                
                    }
                    </>
                }

                {
                    photosarray && photosarray.length > 0 &&
                    <>
                      <View style={{marginTop:20}}>

                                    <Text style={{fontFamily:'Lato_700Bold',fontSize:16,marginRight:40}}> Photos</Text>
                                    </View>
                                    <ScrollView contentContainerStyle={{marginTop:20}} horizontal={true}>

                         { photosarray.map((item,index)=>{
                           return(
                                 <TouchableOpacity key={index} onPress={()=>{setModalvisible(true);setSelectedimage(item)}}>
                               <Image source={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item.photo_reference}&key=${apikey}`}} style={{width:100,height:100,marginHorizontal:10,borderRadius:50}}/>
                                 </TouchableOpacity>
                           )
                        }
                        )

                
                    }
                    </ScrollView>
                            
                            </>
                }


<View style={styles.buttonContainer}>
       
       <TouchableOpacity style={styles.acceptButton} onPress={() => 
       navigation.navigate('MapLocationForHobbies', {information: objtosend}) 
       }>
         <Text style={styles.buttonText}>Continue</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.refuseButton} onPress={() => navigation.navigate('SuggestedMeetingCalender',{meeting:objtosend.meeting,invitedbyfriend:objtosend.invitedbyfriend})}>
         <Text style={styles.buttonText}>Back</Text>
       </TouchableOpacity>
     </View>
                </View>
                </ScrollView>
        

            </View>
            { selectedimage &&
              <Modal    
                animationType="slide"
                transparent={true}
                visible={modalvisible}
                onRequestClose={() => {

                }}
                >
               
                    <View style={styles.modalView}>

                        <Image source={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${selectedimage.photo_reference}&key=${apikey}`}} style={{width:300,height:300,borderRadius:50}}/>
                        <TouchableOpacity style={{position:'absolute',top:260,right:280}} onPress={()=>{setModalvisible(false)}}>
                            <Icon name="close" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
            </Modal>
}


                    


        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        backgroundColor:'#ffffff',
        
    }, buttonContainer: {
        flexDirection: 'row',
        marginTop: 35,
        width: '100%',
        justifyContent: 'center',
        
        
      }, 
       acceptButton: {
        backgroundColor: 'rgba(25, 118, 210, 0.9)',
        borderRadius: 15,
        padding: 18,
        width: 120
      }, 
      refuseButton: {
        backgroundColor: 'rgba(224, 71, 71, 0.9)',
        borderRadius: 15,
        padding: 18,
        marginLeft: 80,
        width: 120,
        
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
  
        modalView: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',

        },

    textstyle:{
        fontSize:20,
        letterSpacing:0.03,
        fontStyle:'normal',
        textAlign:'center',
        color:'black',
        fontFamily:'Inter_900Black',
        color:'white',
        marginTop:0
        
        
    },
    image:{
        //make the imgae to be little bit blur and dark
        width:'100%',
        height:'100%',
        //make the image darker
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        //make the image blur
        //make the image to be in the center
        justifyContent:'center',
        
        
    
    },
    imagerating:{
        width:50,
        height:50,
        alignSelf:'center',
        borderRadius:50,
        marginLeft:20
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent:'center',
      },
    icon:{
        //make the icon to be in the center and without opacity
        alignSelf:'center',
        opacity:1,
        marginTop:30,
        width:100,
        height:100,

        


    },

    textcont2:{

        fontSize:20,
        letterSpacing:0.03,
        fontStyle:'normal',
        textAlign:'center',
        color:'black',
        fontFamily:'Lato_400Regular',
        marginLeft:10,
        
    },
    cont:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#f5e6e4',
        width:'100%',

    },
    item: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginVertical: 8,
        backgroundColor: '#ede9e8',
        justifyContent: 'space-between',
        borderRadius: 15,
        paddingVertical: 3,
        paddingHorizontal: 8,
        width: 300,
        alignSelf: 'center',
    },
    scrollViewStyle: {
        paddingTop: 300,  // height of your image view
    },
    topcover:{
        width:"100%",
        height:300,
        backgroundColor:'#ffffff',
        
        

        
    },
    container2:{
        width: '100%',
        left: 0,
        backgroundColor: '#f5e6e4',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        
        shadowOpacity: 0.05,
        shadowRadius: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        bottom:0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        },


        ratingbox:{
            width: 315,
            height: 80,
            backgroundColor: 'rgba(255,255,255,0.7)',
            // React Native doesn't support 'mix-blend-mode' property
            // React Native also doesn't support 'backdrop-filter' property
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.05,
            shadowRadius: 30,
            borderRadius: 15,
            marginTop:5,
            alignSelf:'center',
            flexDirection:'row',
            alignItems:'center',
            
        },
});

export default Businesspage;



