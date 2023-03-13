import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,Dimensions } from 'react-native';

const GenderDropdown = ({ value, onValueChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const options = ['Male', 'Female', 'Other'];

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedValue}>{'Select Gender'}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"//</View>

        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  onValueChange(option);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  selectedValue: {
    width: Dimensions.get('window').width * 0.85,
    padding: Dimensions.get('window').width * 0.03,
    margin: Dimensions.get('window').width * 0.02,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: Dimensions.get('window').width * 0.13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  optionsContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  optionText: {
    fontSize: 18,
  },
});

export default GenderDropdown;
