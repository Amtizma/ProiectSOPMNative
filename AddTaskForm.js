import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import { cats } from './Category';

const AddTaskForm = ({ onAddTask, category, editingTask, onDeleteTask, resetEditingTask }) => {
    const handledCats = cats.map((cat) => cat.cat);

    const [selectedColor, setSelectedColor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [task, setTask] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('');

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
                        <TouchableOpacity
                            style={[styles.priorityButton, { backgroundColor: priority === 'LOW' ? 'green' : 'transparent' }]}
                            onPress={() => setPriority('LOW')}
                        >
                            <Text style={styles.priorityButtonText}>LOW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.priorityButton, { backgroundColor: priority === 'MEDIUM' ? 'yellow' : 'transparent' }]}
                            onPress={() => setPriority('MEDIUM')}
                        >
                            <Text style={styles.priorityButtonText}>MEDIUM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.priorityButton, { backgroundColor: priority === 'HIGH' ? 'red' : 'transparent' }]}
                            onPress={() => setPriority('HIGH')}
                        >
                            <Text style={styles.priorityButtonText}>HIGH</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dropdown}>
                        <Dropdown options={handledCats} onSelectColor={handleSelectColor} />
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: selectedColor || priority ? 'lightblue' : 'grey' }]}
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
        backgroundColor: 'lightblue',
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
    },
});

export default AddTaskForm;
