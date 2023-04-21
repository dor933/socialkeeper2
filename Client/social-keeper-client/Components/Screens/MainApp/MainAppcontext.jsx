import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});
    const [userevents, setUserevents] = useState([]);

    
    return (
        <MainAppcontext.Provider value={{ user,setUser,userevents,setUserevents }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}