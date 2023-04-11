import React, { useState, createContext } from 'react'
import uuid from 'uuid';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});

    
    return (
        <MainAppcontext.Provider value={{ user,setUser }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}