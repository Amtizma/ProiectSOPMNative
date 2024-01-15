import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import { cats } from './Category';
import {LinearGradient} from 'expo-linear-gradient';
const AddTaskForm = ({ onAddTask, category, editingTask, onDeleteTask, resetEditingTask, topBarColor }) => {
    const handledCats = cats.map((cat) => cat.cat);
    const [selectedColor, setSelectedColor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [task, setTask] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
    };

    useEffect(() => {
        if (editingTask) {
            setTask(editingTask.description || '');
            setName(editingTask.name || '');
            setPriority(editingTask.priority || '');
            setSelectedColor(editingTask.color || null);
            setShowForm(true);
        }
    }, [editingTask]);

    const handleSubmit = () => {
        if (task.trim() !== '') {
            if (editingTask) {
                onDeleteTask(category, editingTask.id);
                onAddTask(task, category, selectedColor, name, priority, editingTask.id);
                resetEditingTask();
            } else onAddTask(task, category, selectedColor, name, priority);

            setTask('');
            setPriority('');
            setName('');
            setShowForm(false);
        }
    };

    const handleCancel = () => {
        setTask('');
        setPriority('');
        setName('');
        setSelectedColor(null);
        setShowForm(false);
        resetEditingTask();
    };
    const getPriorityButtonStyle = (priority) => {
        return [
            styles.priorityButton,
            selectedPriority === priority ? styles.selectedPriorityButton : null,
        ];
    };
    const styles = StyleSheet.create({
        taskFormContainer: {
            flex: 1,
        },
        formContainer: {
            paddingHorizontal: 16,
        },
        inputContainer: {
            marginBottom: 10,
        },
        categoryNameTextbox: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
        },
        gradientStyle:{
            flex: 1,
            justifyContent: 'space-between',
            margin: 5,
            borderRadius: 5,
        },
        priorityOptions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        priorityButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 5,
        },
        priorityButtonText: {
            color: 'white',
        },
        dropdown: {
            marginBottom: 10,
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        confirmButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 5,
            backgroundColor: topBarColor,
        },
        confirmButtonText: {
            color: 'white',
        },
        cancelButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 5,
            marginLeft: 10,
        },
        cancelButtonText: {
            color: 'black',
        },
        addButton: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 5,
            backgroundColor: topBarColor,
            marginTop: 10,
        },
        addButtonText: {
            color: 'white',
        },
        selectedPriorityButton: {
            color: '#fff',
            borderWidth: 3,
            borderColor: '#000',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
        },
    });

    return (
        <View style={styles.taskFormContainer}>
            {showForm ? (
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.categoryNameTextbox}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder="Enter task title"
                            required
                        />
                        <TextInput
                            style={styles.categoryNameTextbox}
                            value={task}
                            onChangeText={(text) => setTask(text)}
                            placeholder="Enter task description"
                            required
                        />
                    </View>
                    <View style={styles.priorityOptions}>
                        <LinearGradient
                            colors={['green', topBarColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientStyle}
                        >
                            <TouchableOpacity
                                style={getPriorityButtonStyle('LOW')}
                                onPress={() => {
                                    setPriority('LOW');
                                    setSelectedPriority('LOW');
                                }}
                            >
                            <Text style={styles.priorityButtonText}>LOW</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            colors={['orange', topBarColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientStyle}
                        >
                            <TouchableOpacity
                                style={getPriorityButtonStyle('MEDIUM')}
                                onPress={() => {
                                    setPriority('MEDIUM');
                                    setSelectedPriority('MEDIUM');
                                }}
                            >
                        <Text style={styles.priorityButtonText}>MEDIUM</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            colors={['red', topBarColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientStyle}
                        >
                            <TouchableOpacity
                                style={getPriorityButtonStyle('HIGH')}
                                onPress={() => {
                                    setPriority('HIGH');
                                    setSelectedPriority('HIGH');
                                }}
                            >
                            <Text style={styles.priorityButtonText}>HIGH</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    <View style={styles.dropdown}>
                        <Dropdown options={handledCats} onSelectColor={handleSelectColor} />
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleSubmit}
                            disabled={!selectedColor && !priority}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleButtonClick}>
                    <Text style={styles.addButtonText}>Add new Task</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


export default AddTaskForm;
