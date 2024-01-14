import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const _pastelColors = ['#FFDDC1', '#B5EAD7', '#FFC3A0', '#B8F2E6', '#FFAAA7', '#D8E2DC', '#F4A261', '#2A9D8F', '#E9C46A', '#264653'];

const assignBackgroundColor = (index) => {
    return {
        backgroundColor: _pastelColors[index % _pastelColors.length]
    };
};

const Categories = ({ categories, onDelete }) => {
    return (
        <View>
            <Text style={styles.heading}>Categories</Text>
            <View style={styles.listContainer}>
                {categories.map((category, index) => (
                    <View key={index} style={[styles.categoryItem, assignBackgroundColor(index)]}>
                        <Text>{category}</Text>
                        <TouchableOpacity onPress={() => onDelete(index)} style={[styles.deleteButton, assignBackgroundColor(index)]}>
                            <Text style={styles.deleteButtonText}>x</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listContainer: {
        marginTop: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    deleteButton: {
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
});

export { assignBackgroundColor, _pastelColors };
export default Categories;
