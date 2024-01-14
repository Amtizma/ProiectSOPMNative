import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const AddColumnPopup = ({ onClose, onAddColumn, themeColor }) => {
    const [columnName, setColumnName] = useState('');

    const handleAddColumn = () => {
        if (columnName) {
            onAddColumn(columnName);
            onClose();
        }
    };

    return (
        <View style={styles.addColumnPopup}>
            <Text style={styles.heading}>Add a Column</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter column name"
                value={columnName}
                onChangeText={(text) => setColumnName(text)}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Add"
                    onPress={handleAddColumn}
                    color={themeColor}
                />
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    addColumnPopup: {
        // Style for the main container
        // You can define padding, margin, or other styles here
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cancelButton: {
        color: 'red', // You can customize the cancel button color
    },
});

export default AddColumnPopup;
