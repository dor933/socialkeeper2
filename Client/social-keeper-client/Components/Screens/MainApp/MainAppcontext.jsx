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
                

    ]);

   
    
    return (
        <MainAppcontext.Provider value={{ user,setUser, ispersonalactiveated,setIspersonalactiveated, userevents,setUserevents, firebaseuser, setFirebaseuser, suggestedmeeting, setSuggestedmeeting, hobbienumtypes, suggestedmeeting1, setSuggestedmeeting1,isappready,setIsappready }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}