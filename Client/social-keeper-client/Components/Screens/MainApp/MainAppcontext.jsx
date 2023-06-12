import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});
    const [ispersonalactiveated, setIspersonalactiveated] = useState(false);
    const [userevents, setUserevents] = useState([]);
    const [firebaseuser, setFirebaseuser] = useState({});
    const [suggestedmeeting, setSuggestedmeeting] = useState({});
    const [suggestedmeeting1, setSuggestedmeeting1] = useState({});
    const [screenisready, setScreenisready] = useState(false);
    const [isappready, setIsappready] = useState(false);
    const [hobbienumtypes, setHobbienumtypes] = useState([
        {
            hobbienum:1,
            hobbie:'bar'
        },
        {
            hobbienum:2,
            hobbie:'bar'
        },
        {
            hobbienum:3,
            hobbie:'gym'
        },
        {
            hobbienum:4,
            hobbie:'movie_theater'
        },
        {
            hobbienum:5,
            hobbie:'restaurant'
        },
        {
            hobbienum:6,
            hobbie:'cafe'
        },
        {
            hobbienum:7,
            hobbie:'library'
        },
        {
            hobbienum:8,
            hobbie:'park'
        },
        {
            hobbienum:9,
            hobbie:'park'
        },
        {
            hobbienum:10,
            hobbie:'night_club'
        },
        {
            hobbienum:1,
            hobbie:'other'
        },

                

    ]);

    const clearmainappcontext = () => {
        setUser({});
        setIspersonalactiveated(false);
        setUserevents([]);
        setFirebaseuser({});
        setSuggestedmeeting({});
        setSuggestedmeeting1({});
        setScreenisready(false);
        setIsappready(false);

    }
        

   
    
    return (
        <MainAppcontext.Provider value={{ user,clearmainappcontext,setUser,screenisready,setScreenisready, ispersonalactiveated,setIspersonalactiveated, userevents,setUserevents, firebaseuser, setFirebaseuser, suggestedmeeting, setSuggestedmeeting, hobbienumtypes, suggestedmeeting1, setSuggestedmeeting1,isappready,setIsappready }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}