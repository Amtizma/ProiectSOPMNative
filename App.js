import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import CategoryPage from './Category';
import TopBar from './topbar';
import { cats } from "./Category";
import { tsks } from "./AddTask";
import TaskPage from "./AddTask";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const App = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const [handledCats, setHandledCats] = useState([]);
    const [handledTasks, setHandledTasks] = useState([]);
    const [updateLists, setUpdateLists] = useState(false);

    const handleUpdateLists = () => {
        setUpdateLists(true); // Set the flag to trigger the update
    };

    // Use useEffect to update handledCats and handledTasks when updateLists is true
    useEffect(() => {
        if (updateLists) {
            setHandledCats(cats.map(cat => cat.cat));
            setHandledTasks(Object.values(tsks).flat());
            setUpdateLists(false); // Reset the flag after updating
        }
    }, [updateLists]);

    return (
        <View style={styles.appContainer}>
            <View style = {styles.topBar}>
            <TopBar sortOrder={sortOrder} setSortOrder={setSortOrder} tasks={handledTasks} categories={handledCats} onUpdateLists={handleUpdateLists} />
            </View>
            <ScrollView  scrollEnabled={false} style={styles.rest}>
                <CategoryPage />
                <TaskPage sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
    },
    topBar: {
        backgroundColor: '#c1dddf',
    },
    rest: {
        zIndex: -1,
        backgroundColor: 'lightblue',
    },
});

export default App;