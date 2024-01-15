import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Categories from './CategoryDef';
import AddNewCategory from './CategoryForm';
import Category from './CategoryClass';
import { _pastelColors, assignBackgroundColor } from "./CategoryDef";

var cats = [];

const CategoryPage = ({topBarColor}) => {
    const [categories, setCategories] = useState(['Category 1']);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const fadeAnim = new Animated.Value(0);

    cats = categories.map((category, index) => new Category(category, _pastelColors[index % _pastelColors.length]));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isCollapsed ? 0 : 1,
            duration: 500, // Adjust the duration of the fade effect
            useNativeDriver: false,
        }).start();
    }, [isCollapsed]);

    const addCategory = (newCategory) => {
        setCategories((prevCategories) => {
            if (!prevCategories.includes(newCategory)) {
                return [...prevCategories, newCategory];
            } else {
                return prevCategories;
            }
        });
    };

    const deleteCategory = (index) => {
        const updatedCategories = categories.filter((_, idx) => idx !== index);
        setCategories(updatedCategories);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const containerStyle = {
        ...styles.container,
        backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['lightgrey', 'white'],
        }),
    };

    return (
        <Animated.View style={containerStyle}>
            <TouchableOpacity style={styles.linesContainer} onPress={toggleCollapse}>
                <View style={styles.horizontalLine}><Text> - </Text></View>
                <View style={styles.horizontalLine}><Text> - </Text></View>
                <View style={styles.horizontalLine}><Text> - </Text></View>
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
                <Categories categories={categories} onDelete={deleteCategory} />
                <AddNewCategory addCategory={addCategory} topBarColor = {topBarColor} />
            </Collapsible>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "lightgrey",
        padding: 10,
        borderRadius: 8,
        alignSelf: 'stretch',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeColumn: {
        borderColor: '#3498db',
        borderWidth: 2,
    },
    categorySection: {
        flex: 1,
    },
    linesContainer:{
        textAlign: "center",
    },
    horizontalLine: {
        height: 3, // Set the height to represent a horizontal line
        backgroundColor: 'black', // Set the color of the line
        width: "50%",
        marginVertical: 2, // Adjust the vertical margin as needed
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        textAlign: "center",
    },
    categoryMenu: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        textAlign: "center",
    },
    categoryMenuText: {
        fontSize: 16,
        fontWeight: "bold",
    }
});

export { cats };
export default CategoryPage;
