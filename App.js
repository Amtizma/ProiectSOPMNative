import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import CategoryPage from './Category';
import TopBar from './topbar';
import { cats } from "./Category";
import { tsks } from "./AddTask";
import TaskPage from "./AddTask";
const App = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const [handledCats, setHandledCats] = useState([]);
    const [handledTasks, setHandledTasks] = useState([]);
    const [updateLists, setUpdateLists] = useState(false);
    const [topBarColor, setTopBarColor] = useState('#c1dddf');
    const [backgroundColor, setBackgroundColor] = useState('lightblue');


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
    const styles = StyleSheet.create({
        appContainer: {
            flex: 1,
            backgroundColor: backgroundColor,

        },
        topBar: {
            backgroundColor: topBarColor,
            zIndex: 1,
        },
        rest: {
            zIndex: -1,
            backgroundColor: backgroundColor,
        },
    });
    return (
        <View style={styles.appContainer}>
            <View style = {styles.topBar}>
                <TopBar sortOrder={sortOrder} setSortOrder={setSortOrder} tasks={handledTasks} categories={handledCats} onUpdateLists={handleUpdateLists} setTopBarColor = {setTopBarColor} setBackgroundColor = {setBackgroundColor}/>
            </View>
            <FlatList
                data={[{ key: 'CategoryPage' }, { key: 'TaskPage' }]}
                renderItem={({ item }) => (
                    <View style={styles.rest}>
                        {item.key === 'CategoryPage' && <CategoryPage topBarColor={topBarColor} />}
                        {item.key === 'TaskPage' && <TaskPage sortOrder={sortOrder} setSortOrder={setSortOrder} topBarColor={topBarColor} />}
                    </View>
                )}
                keyExtractor={(item) => item.key}
            />
        </View>
    );
};




export default App;