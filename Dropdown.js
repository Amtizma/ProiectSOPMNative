import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cats } from './Category';

const Dropdown = ({ options, onSelectColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggling = () => setIsOpen(!isOpen);

    let getColour = (value) => {
        for (let i = 0; i < cats.length; i++) {
            if (cats[i].cat === value) {
                return cats[i].colour;
            }
        }
    };

    const onOptionClicked = (value) => {
        const selectedColor = getColour(value);
        setSelectedOption(value);
        setIsOpen(false);
        onSelectColor(selectedColor); // Transmit the color to the parent component
    };

    return (
        <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownHeader} onPress={toggling}>
                <Text>{selectedOption || 'Select a category'}</Text>
                <View style={[styles.arrow, { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }]}></View>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdownList}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            style={styles.dropdownListItem}
                            onPress={() => onOptionClicked(option)}
                            key={index}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        marginBottom: 10,
    },
    dropdownHeader: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#C9C9C9FF',
        alignItems: 'center',
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 10,
        borderStyle: 'solid',
        marginLeft: 10,
        borderColor: 'black',
    },
    dropdownList: {
        left: 0,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        zIndex: 1,
    },
    dropdownListItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'black',
    },
});

export default Dropdown;
