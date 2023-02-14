import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import * as Contacts from 'expo-contacts';
import { CheckBox } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContactListExample() {
    const [contacts, setContacts] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadContacts = async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();
                setContacts(data);
            }
        };
        loadContacts();
    }, []);

    const toggleFavorite = (id) => {
        const updatedFavorites = new Set(favorites);
        if (updatedFavorites.has(id)) {
            updatedFavorites.delete(id);
        } else {
            updatedFavorites.add(id);
        }
        setFavorites(updatedFavorites);
    };

    const renderItem = ({ item }) => {
        const isFavorite = favorites.has(item.id);
        return (
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>

                <View style={[styles.contactRow, isFavorite && styles.favoriteContactRow]}>
                    <View style={styles.contactInfo}>
                        {item.name && (
                            <Text style={styles.contactName}>{item.name}</Text>
                        )}
                        {item.phoneNumbers && item.phoneNumbers[0] && (
                            <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                        )}
                    </View>
                    {/* icon here */}
                    <MaterialIcons name="favorite" size={24} color={isFavorite ? "red" : "black"} />

                </View>

            </TouchableOpacity>
        );
    };

    const filteredContacts = contacts.filter((contact) => {
        if (contact.name) {
            return contact.name.toLowerCase().includes(search.toLowerCase());
        }
        return false;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>
            <FlatList
                data={filteredContacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}

            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Dimensions.get('window').height * 0.05,
        alignItems: 'center',
    },
    searchBar: {
        height: 40,
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Dimensions.get('window').width * 0.05,
        marginVertical: Dimensions.get('window').height * 0.01,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,

    },
    contactInfo: {
      
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // width: Dimensions.get('window').width * 0.7,
        // height: Dimensions.get('window').height * 0.035,


    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactPhone: {
        color: 'gray',
    },

    favoriteContactName: {
        color: 'red',
        fontWeight: 'bold',
    },
    favoriteContactPhone: {
        color: 'red',
    },
    favoriteContactRow: {
        //lightred
        backgroundColor: '#FFC0CB',

    },

});
