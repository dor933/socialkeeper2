import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, TouchableOpacity, Dimensions, SafeAreaView, Image,Animated } from 'react-native';
import * as Contacts from 'expo-contacts';
import { CheckBox } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

export default function FavoriteContacts() {
    const [contacts, setContacts] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [search, setSearch] = useState('');

    //this is for loading the contacts from the phone and setting them to the contacts state
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

    //this is for toggling favorite contacts, it will add or remove the contact from the favorites list
    const toggleFavorite = (id) => {
        const updatedFavorites = new Set(favorites);
        if (updatedFavorites.has(id)) {
            updatedFavorites.delete(id);
        } else {
            updatedFavorites.add(id);
        }
        setFavorites(updatedFavorites);
    };

    //this is the function that renders each contact
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
                    <Octicons style={{
                        position: 'absolute',
                        right: 0,
                        marginRight: Dimensions.get('window').width * 0.05,
                    }} name="person-add" size={24} color={isFavorite ? "red" : "black"} />
                </View>
            </TouchableOpacity>
        );
    };

    //this is for filtering the contacts,filters by name and sorts the favorites to the top
    const filteredContacts = contacts.filter((contact) => {
        const contactName = contact.name || '';
        return contactName.toLowerCase().includes(search.toLowerCase());
    }).sort((a, b) => {
        const aIsFavorite = favorites.has(a.id);
        const bIsFavorite = favorites.has(b.id);
        if (aIsFavorite && !bIsFavorite) {
            return -1;
        }
        if (!aIsFavorite && bIsFavorite) {
            return 1;
        }
        return 0;
    });

   
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logo}>
                <Image
                    style={styles.logo}
                    source={require('../../Images/social-keeper-low-resolution-logo-color-on-transparent-background.png')}
                />
            </View>
            <View style={styles.desc}>
                <Text style={styles.descText}>Choose your favorite contacts </Text>
            </View>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
                <MaterialIcons style={styles.searchIcon} name="search" size={24} color="gray" />
            </View>
            {/* //this is the list of contacts, first on the list will be the favorite */}
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
        alignItems: 'center',
    },
    desc: {
        height: Dimensions.get('window').height * 0.07,
    },
    descText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff0000',
    },
    logo: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').height * 0.1,
        resizeMode: 'contain',
        marginTop: Dimensions.get('window').height * 0.01,
        marginBottom: Dimensions.get('window').height * 0.03,
    },

    searchBar: {
        marginBottom: Dimensions.get('window').height * 0.01,
        height: Dimensions.get('window').height * 0.05,
        paddingHorizontal: 16,
        width: Dimensions.get('window').width * 0.85,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        backgroundColor: '#eeeeee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
        position: 'relative',
    },
    searchInput: {
        fontSize: 14,
        width: Dimensions.get('window').width * 0.9,
        
    },
    searchIcon: {
        position: 'absolute',
        right: 0,
        marginRight: Dimensions.get('window').width * 0.05,
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
        backgroundColor: '#FFC0CB',
    },

});
