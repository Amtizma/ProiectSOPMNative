import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


const AddNewCategory = ({ addCategory, topBarColor }) => {
    const [showInput, setShowInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const handleButtonClick = () => {
        setShowInput(true);
    };

    const handleSubmit = () => {
        if (newCategoryName.trim() !== '') {
            addCategory(newCategoryName);
            setNewCategoryName('');
            setShowInput(false);
        }
    };

    const handleCancel = () => {
        setShowInput(false);
        setNewCategoryName('');
    };
    const styles = StyleSheet.create({
        categoryNameTextbox: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
        },
        confirmButton: {
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: topBarColor,
            borderRadius: 5,
            marginTop: 10,
        },
        confirmButtonText: {
            color: 'white',
        },
        cancelButton: {
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            marginTop: 10,
        },
        cancelButtonText: {
            color: 'black',
        },
        addButton: {
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: topBarColor,
            borderRadius: 5,
            marginTop: 10,
        },
        addButtonText: {
            color: 'white',
        },
    });

    return (
        <View>
            {showInput ? (
                <View>
                    <TextInput
                        style={styles.categoryNameTextbox}
                        placeholder="Enter category name"
                        value={newCategoryName}
                        onChangeText={(text) => setNewCategoryName(text)}
                        maxLength={15}
                    />
                    <TouchableOpacity onPress={handleSubmit} style={[styles.confirmButton]}>
                        <Text style={styles.confirmButtonText}>Add Category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={handleButtonClick} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add new Category</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};



export default AddNewCategory;
