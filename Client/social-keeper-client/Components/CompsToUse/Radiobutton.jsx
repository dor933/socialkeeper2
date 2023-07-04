import React, { useMemo, useState } from 'react';
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
           labelStyle:{fontFamily:'Lato_400Regular',fontSize:10,}



        },
        {
            id: '2',
            label: 'By City',
            value: 'option2',
            labelStyle:{fontFamily:'Lato_400Regular',fontSize:10,
            paddingLeft:6,
        }

            
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