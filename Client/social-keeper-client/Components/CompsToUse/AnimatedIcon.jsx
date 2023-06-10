import React, { useRef,useState,useContext } from 'react';
import { Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../../Authcontext';

const AnimatedIcon = ({isExpanded,toggle,isnewfriendaction}) => {

    const {isnotif, setIsnotif} = React.useContext(AuthContext);
    const {numberofnewfriendrequest, setNumberofnewfriendrequest} = React.useContext(AuthContext);
    const {numberofnewfriends, setNumberofnewfriends} = React.useContext(AuthContext);

    console.log('this is the isnewfriendaction')
    console.log(isnewfriendaction)

    
 


    const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
    console.log('this is the isExpanded')
    console.log(isExpanded)


    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '270deg'],

    });

    const onPress = () => {
        const newState = isExpanded == 0 ? 1 : 0;  // Toggle state
        toggle(!isExpanded)
        Animated.timing(rotateAnim, {
            toValue: newState,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255, 255, 255, 0.5)" 
                onPress={onPress}
            />
        </Animated.View>
    );
};

export default AnimatedIcon;
