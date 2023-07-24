import React, { useMemo, useState } from 'react';
import { Circle } from 'react-native-maps';
import RadioGroup from 'react-native-radio-buttons-group';

export default function Radiobutton(props) {

    setSelectedid= props.setSelectedid;
    selectedid= props.selectedid;

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'By Location',
            value: 'option1',
            containerStyle:{paddingLeft:15,

           
                


            },
           labelStyle:{fontFamily:'Lato_300Light',fontSize:10,},
           borderSize:1,
           



        },
        {
            id: '2',
            label: 'By City',
            value: 'option2',
            labelStyle:{fontFamily:'Lato_300Light',fontSize:10,
            paddingLeft:5.5,
            //make the style of the circle            
        },
        borderSize:1,

        

            
        }
    ]), []);

    
    return (
        <RadioGroup 
        radioButtons={radioButtons} 
        onPress={setSelectedid}
        selectedId={selectedid}
        layout='column'
        containerStyle={{alignItems:'center'}}
    />
    );
    }