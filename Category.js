import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Categories from './CategoryDef';
import AddNewCategory from './CategoryForm';
import Category from './CategoryClass';
import { _pastelColors, assignBackgroundColor } from "./CategoryDef";

var cats = [];

const CategoryPage = () => {
    const [categories, setCategories] = useState(['Category 1']);
    const [isCollapsed, setIsCollapsed] = useState(true);

    cats = categories.map((category, index) => new Category(category, _pastelColors[index % _pastelColors.length]));

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

    return (
        <View style={styles.container}>
            <View style={styles.categorySection}>
                <TouchableOpacity style={styles.linesContainer} onPress={toggleCollapse}>
                    <View style={styles.categoryMenu}><Text style={styles.categoryMenuText}> Category Menu </Text></View>
                    <View style={styles.horizontalLine}><Text> - </Text></View>
                    <View style={styles.horizontalLine}><Text> - </Text></View>
                    <View style={styles.horizontalLine}><Text> - </Text></View>

                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed}>
                    <Categories categories={categories} onDelete={deleteCategory} />
                    <AddNewCategory addCategory={addCategory} />
                </Collapsible>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    categorySection: {
        flex: 1,
    },
    linesContainer:{
        backgroundColor: "lightgrey",
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
