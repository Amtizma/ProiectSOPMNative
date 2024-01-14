import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ThemePopup from './ThemePopup';

const TopBar = ({
                    sortOrder,
                    setSortOrder,
                    tasks,
                    categories,
                    onUpdateLists,
                }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showThemePopup, setShowThemePopup] = useState(false);
    const [showAuto, setShowAuto] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [saveAsPdfClicked, setSaveAsPdfClicked] = useState(false);

    const [showRulesPopup, setShowRulesPopup] = useState(false);
    const [selectedType, setSelectedType] = useState('task'); // 'task' or 'category'
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const toggleRulesPopup = () => {
        setShowRulesPopup(!showRulesPopup);
        onUpdateLists(); // Call the function to update lists in the App component
    };
    const toggleAuto = () => {
        setShowAuto(!showAuto);
        setShowFilters(false); // Close filters menu
        setShowMenu(false); // Close the main menu
        setShowThemePopup(false); // Close theme popup
        setShowShareMenu(false);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
        setShowAuto(false); // Close automation menu
        setShowMenu(false); // Close the main menu
        setShowThemePopup(false); // Close theme popup
        setShowShareMenu(false);
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
        setShowAuto(false); // Close automation menu
        setShowFilters(false); // Close filters menu
        setShowShareMenu(false);
    };

    const toggleThemePopup = () => {
        setShowThemePopup(!showThemePopup);
        setShowAuto(false); // Close automation menu
        setShowFilters(false); // Close filters menu
        setShowShareMenu(false);
    };

    const toggleFeedbackPopup = () => {
        setShowFeedbackPopup(!showFeedbackPopup);
    };

    const toggleShareMenu = () => {
        setShowShareMenu(!showShareMenu);
        setShowAuto(false); // Close automation menu
        setShowMenu(false); // Close the main menu
        setShowThemePopup(false); // Close theme popup
        setShowFilters(false); // Close filters menu
    };

    const sendFeedback = () => {
        const feedbackText = document.getElementById('feedback-textarea').value;
        const emailSubject = 'Feedback for Your App';
        const mailtoLink = `mailto:dianastphx@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(feedbackText)}`;
        window.location.href = mailtoLink;
        toggleFeedbackPopup(); // Close the feedback popup after sending
    };

    // Add necessary state and functions
    const [notificationRules, setNotificationRules] = useState({
        time: 0,
        target: 'task',
        timerId: null,
        customTimeUnit: 'minutes',  // Initialize with a default value
    });

    const handleRuleChange = (key, value) => {
        setNotificationRules((prevRules) => ({
            ...prevRules,
            [key]: value,
        }));
    };

    const setupNotifications = () => {
        const { time, customTimeUnit, target } = notificationRules;

        let timeInMilliseconds;
        if (customTimeUnit === 'minutes') {
            timeInMilliseconds = time * 60 * 1000;
        } else if (customTimeUnit === 'days') {
            timeInMilliseconds = time * 24 * 60 * 60 * 1000;
        } else {
            alert('Unsupported time unit');
            return;
        }

        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    // Notification permission granted, set up the notification timer
                    const notificationTimer = setTimeout(() => {
                        new Notification(`Reminder for ${target}`, {
                            body: `It's time to check your ${target}.`,
                        });
                    }, timeInMilliseconds);

                    handleRuleChange('timerId', notificationTimer);
                } else {
                    alert('Notification permission denied');
                }
            });
        } else {
            alert('Notifications not supported in this browser');
        }
    };


    const requestNotificationPermission = async () => {
        try {
            await Notification.requestPermission();
            setupNotifications();
        } catch (error) {
            alert('Notification permission denied');
        }
    };

    useEffect(() => {
        // Cleanup function to clear the timer on component unmount
        return () => {
            clearTimeout(notificationRules.timerId);
        };
    }, [notificationRules.timerId]);

    const timeUnits = [
        { label: 'Minutes', value: 'minutes' },
        { label: 'Days', value: 'days' },
    ];

    const closeMenuOnOutsideClick = (event) => {
        if (
            !event.target.closest('.dropdown-menu') &&
            !event.target.closest('.button') &&
            !event.target.closest('.settings-button')
        ) {
            setShowAuto(false);
            setShowFilters(false);
            setShowMenu(false);
            setShowThemePopup(false);
        }
    };

    const saveAsPDF = () => {
        // Assuming you have the required library for generating PDF (html2pdf.js) installed
        // Make sure to handle the PDF generation logic accordingly
    };

    return (
        <View>
            <View style={styles.topBar}>
                <View style={styles.leftSection}>
                    <Text style={styles.charterTitle}>Charter for</Text>
                </View>
                <View style={styles.rightSection}>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                showAuto ? styles.activeButton : null,
                            ]}
                            onPress={toggleAuto}>
                            <Text>Automation</Text>
                            {showAuto && (
                                <View style={styles.dropdownMenu}>
                                    <ScrollView>
                                        <TouchableOpacity onPress={toggleRulesPopup}>
                                            <Text>Reminders</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toggleFeedbackPopup}>
                                            <Text>Send feedback</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* ... (Other buttons) */}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                showFilters ? styles.activeButton : null,
                            ]}
                            onPress={toggleFilters}>
                            <Text>Filters</Text>
                            {showFilters && (
                                <View style={styles.dropdownMenu}>
                                    <ScrollView>
                                        <TouchableOpacity
                                            onPress={() => setSortOrder('default')}>
                                            <Text>By Default</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSortOrder('byTasks')}>
                                            <Text>By No. of tasks</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSortOrder('byName')}>
                                            <Text>By Column Name</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                showMenu ? styles.activeButton : null,
                            ]}
                            onPress={toggleMenu}>
                            <Text>

                            </Text>
                            {showMenu && (
                                <View style={styles.dropdownMenu}>
                                    <ScrollView>
                                        <TouchableOpacity onPress={toggleThemePopup}>
                                            <Text>Change Theme</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                {showRulesPopup && (
                    <View style={styles.popupContainer}>
                        <View style={styles.popupContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={toggleRulesPopup}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.setReminderText}>Set Reminder!{'\n\n'}</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputRow}>
                                    <Text style={styles.reminderLabel}>In </Text>
                                    <TextInput
                                        style={styles.timeInput}
                                        placeholder="Number of"
                                        keyboardType="numeric"
                                        onChangeText={(input) => {
                                            if (/^\d*\.?\d*$/.test(input)) {
                                                handleRuleChange('time', input);
                                            }
                                        }}
                                    />
                                    <RNPickerSelect
                                        style={{
                                            inputIOS: styles.selectTime,
                                            inputAndroid: styles.selectTime,
                                        }}
                                        value={notificationRules.customTimeUnit}
                                        onValueChange={(value) => handleRuleChange('customTimeUnit', value)}
                                        items={timeUnits.map((unit) => ({ label: unit.label, value: unit.value }))}
                                        useNativeAndroidPickerStyle={false}
                                    />
                                </View>
                            </View>
                            <Text style={styles.reminderLabelAbout}>Remind me about</Text>
                            <RNPickerSelect
                                style={{
                                    inputIOS: styles.selectElement,
                                    inputAndroid: styles.selectElement,
                                }}
                                value={notificationRules.target}
                                onValueChange={(value) => {
                                    handleRuleChange('target', value);
                                    setSelectedTask(value);
                                }}
                                placeholder={{ label: 'Select a Task/Category', value: 'task', enabled: !selectedTask }}
                                items={[

                                    ...tasks.map((task) => ({ label: task, value: task })),
                                    ...categories.map((category) => ({ label: category, value: category })),
                                ]}
                                useNativeAndroidPickerStyle={false}
                            />
                            <TouchableOpacity style={styles.reminderButton} onPress={requestNotificationPermission}>
                                <Text style={styles.reminderButtonText}>Set Reminder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = {
    topBar: {
        marginTop: 50, // Adjust the marginTop to move the topBar lower
        padding: 10, // Add some padding to the topBar
        flexDirection: 'column', // Arrange children in a column
        alignItems: 'center', // Align items to the center of the container
    },
    leftSection: {
        alignItems: 'flex-start', // Align items to the start of the container
    },
    charterTitle: {
        fontSize: 18, // Adjust the font size as needed
        fontWeight: 'bold', // Set the font weight if needed
    },
    rightSection: {
        marginTop: 10, // Add some space between Charter for and buttons
    },
    buttons: {
        flexDirection: 'row', // Arrange buttons in a row
        justifyContent: 'center', // Center buttons horizontally
    },
    button: {
        paddingVertical: 10, // Add padding to the vertical axis
        paddingHorizontal: 20, // Add padding to the horizontal axis
        marginHorizontal: 5, // Add margin between buttons
        backgroundColor: '#3498db', // Set a background color if needed
        borderRadius: 5, // Add border radius for rounded corners
    },
    buttonText: {
        color: '#ffffff', // Set the text color
    },
    activeButton: {
        backgroundColor: '#2c3e50', // Set a different color for active buttons if needed
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        width: "200%",
        left: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8, // Add more rounded corners
        padding: 10,
        marginTop: 5,
        elevation: 4,
        shadowColor: '#000', // Add shadow for a lifted effect
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 200,
    },
    themePopup: {
        // Define your theme popup styles here
    },
    popupContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 'auto', // Set to 50% to move the top of the container to the center
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
        paddingBottom: '200%',
    },
    popupContent: {
        width: '80%',
        marginTop: '60%',
        borderRadius: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        textAlign: "center",
        shadowColor: '#ff4444',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 4,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    setReminderText: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        alignItems: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
    timeInput: {
        width: '50%',
        borderWidth: 2,
        borderColor: '#ddd', // Add a border color
        height: 40,
        backgroundColor: '#F3F3F3',
        borderRadius: 10,
    },
    selectTime: {
        height: 40,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        marginLeft: 5,
        shadowColor: '#000', // Add shadow for a lifted effect
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    selectElement: {
        width: '100%',
        textAlign: 'center',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000', // Add shadow for a lifted effect
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    reminderButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#333',
        alignItems: 'center',
        borderRadius: 10,
    },
    reminderButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    reminderLabelAbout:{
        fontSize: 18,
        marginTop: 30,
        marginBottom: 30,
    },
    reminderLabel:{
        fontSize: 18,
    },
};

export default TopBar;
