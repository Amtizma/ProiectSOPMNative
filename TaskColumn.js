import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    PanResponder,
    Animated,
    LayoutAnimation
} from 'react-native';
import AddTaskForm from './AddTaskForm';

const TaskColumn = ({ category, tasks, categories, onAddTask, onDeleteTask, onDeleteColumn, onMoveTask, onEditTask, setShowForm, setScrollEnabled, topBarColor}) => {
    const [activeColumn, setActiveColumn] = useState('');
    const [openOptionMenu, setOpenOptionMenu] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterType, setFilterType] = useState('default');
    const [editingTask, setEditingTask] = useState(null);
    const [isFilterButtonClicked, setIsFilterButtonClicked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(value => !value);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    const resetEditingTask = () => {
        setEditingTask(null);
    };
    const [isSwiping, setIsSwiping] = useState(false);
    const handleEditTask = (taskId, shouldShowForm) => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        setEditingTask(taskToEdit);
        if (shouldShowForm) {
            setShowForm(true);
        }
    };

    const toggleFilterOptions = () => {
        setShowFilterOptions(prevShowFilterOptions => !prevShowFilterOptions);
        setOpenOptionMenu(null);
        setIsFilterButtonClicked(prevIsClicked => !prevIsClicked);
        toggleOpen();
    };

    const buttonRef = useRef(null);

    const closeMenusOnOutsideClick = (event) => {
        if (
            !event.target.closest('.option-menu') &&
            !event.target.closest('.option-button') &&
            !event.target.closest('.task-column-button') &&
            !event.target.closest('.filter-button') &&
            !event.target.closest('.dropdown-menu') &&
            !event.target.closest('.filterButtons')
        ) {
            setOpenOptionMenu(null);
            setShowFilterOptions(false);
        }
    };

    const swipeX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 1 && Math.abs(gestureState.dy) < 1;
            },
            onPanResponderMove: (evt, gestureState) => {
                swipeX.setValue(gestureState.dx);
                setScrollEnabled(false);

            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -10) {
                    handleDeleteColumn();
                    setScrollEnabled(true);
                } else {
                    setScrollEnabled(true);
                    Animated.spring(swipeX, {
                        toValue: 0,
                        friction: 10,
                        tension: 10,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const handleColumnHighlight = () => {
        setActiveColumn(category);
        setTimeout(() => setActiveColumn(''), 2000);
    };

    const handleDeleteColumn = () => {
        onDeleteColumn(category);
    };

    const handleMoveTask = (targetCategory) => {
        if (hoveredTask) {
            onMoveTask(hoveredTask.id, targetCategory);
            setOpenOptionMenu(null);
        }
    };

    const handleDeleteTask = (taskId) => {
        onDeleteTask(category, taskId);
        setOpenOptionMenu(null);
    };

    const toggleOptions = (taskId) => {
        setOpenOptionMenu(prevTaskId => (prevTaskId === taskId ? null : taskId));
        setShowFilterOptions(false);
    };

    const closeOptionMenus = (event) => {
        if (
            !event.target.closest('.option-menu') &&
            !event.target.closest('.option-button')
        ) {
            setOpenOptionMenu(null);
        }
    };

    const applyFilter = (task) => {
        switch (filterType) {
            case 'byName':
                return task.name ? task.name.toLowerCase() : '';
            case 'byPriority':
                const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
                return String(task.priority ? priorityOrder[task.priority.toUpperCase()] : 4);
            default:
                return String(task.id);
        }
    };

    const filteredTasks = tasks.slice().sort((a, b) => applyFilter(a).localeCompare(applyFilter(b)));

    const styles = StyleSheet.create({
        taskColumn: {
            flex: 1,
            justifyContent: "center",
            backgroundColor: '#F0F0F0',
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
        deleteColumnButton: {
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'red',
            padding: 5,
            borderRadius: 5,
            zIndex: 1,
        },
        deleteColumnButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        filterButton: {
            backgroundColor: '#C9C9C9FF',
            padding: 10,
            borderRadius: 5,
        },
        clickedFilterButton: {
            backgroundColor: topBarColor,
        },
        dropdownMenu: {
            backgroundColor: '#fff',
            borderRadius: 5,
            padding: 10,
            elevation: 3,
        },
        filterButtons: {
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#ecf0f1',
        },
        categoryTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginVertical: 10,
            textAlign: 'center',
        },
        task: {
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 8,
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            elevation: 3,
        },
        nameAndCircle: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        priorityCircle: {
            width: 20,
            height: 20,
            borderRadius: 10,
            marginRight: 10,
        },
        high: {
            backgroundColor: '#e74c3c',
        },
        medium: {
            backgroundColor: '#f39c12',
        },
        low: {
            backgroundColor: '#2ecc71',
        },
        taskName: {
            fontSize: 16,
        },
        optionButton: {
            marginLeft: 'auto',
        },
        taskOptions: {
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#fff',
            borderRadius: 5,
            marginTop: 5,
            elevation: 3,
        },
        optionMenu: {
            padding: 10,
        },
        taskDate: {
            fontSize: 12,
            fontStyle: 'italic',
        },
        taskDescription: {
            marginTop: 5,
        },
        formContainer: {
            marginTop: 20,
            flex: 0,
        },
    });


    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.taskColumn,
                activeColumn === category ? styles.activeColumn : null,
                { transform: [{ translateX: swipeX }] },
            ]}
        >
            <TouchableOpacity onPress={toggleFilterOptions} activeOpacity={0.4} style={[styles.filterButton, isFilterButtonClicked ? styles.clickedFilterButton : null]}>
                <Text>Filter Tasks by</Text>
            </TouchableOpacity>
            {showFilterOptions && (
                <ScrollView style={styles.dropdownMenu} >
                    <TouchableOpacity style={styles.filterButtons} onPress={() => setFilterType('default')}>
                        <Text>Default</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButtons} onPress={() => setFilterType('byName')}>
                        <Text>Name</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButtons} onPress={() => setFilterType('byPriority')}>
                        <Text>Priority</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
            <Text style={[styles.categoryTitle]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            {filteredTasks.map((task) => (
                <View
                    key={task.id}
                    style={[styles.task, { backgroundColor: task.color }]}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                >
                    <View style={styles.nameAndCircle}>
                        {task.priority && (
                            <View style={[styles.priorityCircle, styles[task.priority.toLowerCase()]]}></View>
                        )}
                        {task.name && <Text style={styles.taskName}>{task.name}</Text>}
                        <TouchableOpacity
                            onPress={() => toggleOptions(task.id)}
                            style={styles.optionButton}
                            ref={buttonRef}
                        >
                            <Text>...</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.taskOptions}>
                        {openOptionMenu === task.id && (
                            <View style={styles.optionMenu}>
                                <ScrollView>
                                    <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                                        <Text>Remove</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text>Move to</Text>
                                        <ScrollView>
                                            {categories.map((targetCategory) => (
                                                <TouchableOpacity
                                                    key={targetCategory}
                                                    onPress={() => handleMoveTask(targetCategory)}
                                                >
                                                    <Text>{targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1)}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEditTask(task.id)}>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                    {hoveredTask === task && task.description && (
                        <View>
                            <Text style={styles.taskDate}>{new Date(task.id).toLocaleString('en-GB')}</Text>
                            <Text style={styles.taskDescription}>{task.description}</Text>
                        </View>
                    )}
                </View>
            ))}
            <View style={[styles.formContainer]}>
                <AddTaskForm
                    onAddTask={onAddTask}
                    category={category}
                    onHighlight={handleColumnHighlight}
                    editingTask={editingTask}
                    onDeleteTask={onDeleteTask}
                    setShowForm={setShowForm}
                    resetEditingTask={resetEditingTask}
                    topBarColor = {topBarColor}
                />
            </View>
        </Animated.View>
    );
};


export default TaskColumn;
