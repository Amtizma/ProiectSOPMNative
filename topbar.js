import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal, Alert, Linking
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ThemePopup from './ThemePopup';
import * as Notifications from 'expo-notifications';

const TopBar = ({
                    sortOrder,
                    setSortOrder,
                    tasks,
                    categories,
                    onUpdateLists,
                    setTopBarColor,
                    setBackgroundColor
                }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showThemePopup, setShowThemePopup] = useState(false);
    const [showAuto, setShowAuto] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [saveAsPdfClicked, setSaveAsPdfClicked] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [showRulesPopup, setShowRulesPopup] = useState(false);
    const [selectedType, setSelectedType] = useState('task'); // 'task' or 'category'
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [reminderButtonColor, setReminderButtonColor] = useState("#c1dddf");
    const [activeButtonColor, setActiveButtonColor] = useState("lightblue");
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

    const sendFeedback = async () => {
        const emailSubject = 'Feedback for Your App';
        const mailtoLink = `mailto:dianastphx@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(feedbackText)}`;

        try {
            const supported = await Linking.canOpenURL(mailtoLink);

            if (supported) {
                await Linking.openURL(mailtoLink);
                toggleFeedbackPopup(); // Close the feedback popup after sending
            } else {
                console.error("Can't open the email client.");
            }
        } catch (error) {
            console.error('Error opening the email client:', error);
        }
    };


    // Add necessary state and functions
    const [notificationRules, setNotificationRules] = useState({
        time: 0,
        target: 'task',
        timerId: null,
        customTimeUnit: 'minutes', // Initialize with a default value
    });

    const handleRuleChange = (key, value) => {
        setNotificationRules((prevRules) => ({
            ...prevRules,
            [key]: value,
        }));
    };

    const setupNotifications = async () => {
        const { time, customTimeUnit, target } = notificationRules;

        let timeInSeconds;
        if (customTimeUnit === 'minutes') {
            timeInSeconds = time * 60;
        } else if (customTimeUnit === 'days') {
            timeInSeconds = time * 24 * 60 * 60;
        } else {
            alert('Unsupported time unit');
            return;
        }

        if (timeInSeconds > 0) {
            try {
                const identifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `Reminder for ${target}`,
                        body: `It's time to check your ${target}.`,
                    },
                    trigger: {
                        seconds: timeInSeconds,
                        repeats: false,
                    },
                });

                handleRuleChange('timerId', identifier);
                alert('Reminder set');
            } catch (error) {
                console.error('Failed to schedule notification:', error);
                alert('Failed to schedule notification');
            }
        } else {
            alert('Invalid time for reminder');
        }
    };


    const [notification, setNotification] = useState(null);
    useEffect(() => {
        // Cleanup function to clear the scheduled notification on component unmount
        return () => {
            if (notificationRules.timerId) {
                Notifications.cancelScheduledNotificationAsync(notificationRules.timerId);
            }
        };
    }, [notificationRules.timerId]);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    // Display an alert when a notification is received
    useEffect(() => {
        if (notification) {
            Alert.alert(
                notification.request.content.title,
                notification.request.content.body
            );
            setNotification(null);
        }
    }, [notification]);

    const timeUnits = [
        { label: 'Minutes', value: 'minutes' },
        { label: 'Days', value: 'days' },
    ];

    const requestNotificationPermission = async () => {
        try {
            await Notifications.requestPermissionsAsync();  // Corrected line
            await setupNotifications();
            toggleRulesPopup();
        } catch (error) {
            alert('Notification permission denied');
        }
    };
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
    const changeTheme = (topbarColor, backgroundColor) =>{
        setTopBarColor(topbarColor);
        setBackgroundColor(backgroundColor);
        setReminderButtonColor(topbarColor);
        setActiveButtonColor(backgroundColor);

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
            backgroundColor: '#C9C9C9FF', // Set a background color if needed
            borderRadius: 5, // Add border radius for rounded corners
        },
        buttonText: {
            color: '#ffffff', // Set the text color
            textAlign: 'center',
        },
        activeButton: {
            backgroundColor: activeButtonColor, // Set a different color for active buttons if needed
        },
        dropdownMenu: {
            position: 'absolute',
            width: "216%",
            left: 0,
            backgroundColor: '#ffffff',
            borderRadius: 8, // Add more rounded corners
            padding: 10,
            marginTop: 30,
            elevation: 10,
            shadowColor: '#000', // Add shadow for a lifted effect
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 200,
        },
        dropdownMenu2: {
            position: 'absolute',
            width: "150%",
            left: 0,
            backgroundColor: '#ffffff',
            borderRadius: 8, // Add more rounded corners
            padding: 10,
            marginTop: 30,
            elevation: 10,
            shadowColor: '#000', // Add shadow for a lifted effect
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 200,
        },
        dropdownMenu3: {
            position: 'absolute',
            width: "140%",
            left: 0,
            backgroundColor: '#ffffff',
            borderRadius: 8, // Add more rounded corners
            padding: 10,
            marginTop: 30,
            elevation: 10,
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
        setChooseAThemeText: {
            marginBottom: 10,
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
            backgroundColor: reminderButtonColor,
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
        themeButtons: {
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 10,
        },
        themeButton: {
            textAlign: 'center',
            padding: 20,
            margin: 5,
            borderRadius: 5,
        },
        feedbackTextarea:{
            padding: 50,
            borderWidth: 2,
            borderRadius: 10,
            margin: 10,
            width: "90%",
            textAlign: 'center',
        },
        filterButtons: {
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#ecf0f1',
        },
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
                                <View style={styles.dropdownMenu2}>
                                    <ScrollView>
                                        <TouchableOpacity style={styles.filterButtons} onPress={toggleRulesPopup}>
                                            <Text>Reminders</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.filterButtons} onPress={toggleFeedbackPopup}>
                                            <Text>Send feedback</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )}
                        </TouchableOpacity>
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
                                            style={styles.filterButtons}
                                            onPress={() => setSortOrder('default')}>
                                            <Text>By Default</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.filterButtons}
                                            onPress={() => setSortOrder('byTasks')}>
                                            <Text>By No. of tasks</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.filterButtons}
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
                            Change theme
                            </Text>
                            {showMenu && (
                                <View style={styles.dropdownMenu3}>
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
                {showFeedbackPopup && (
                    <View style={styles.popupContainer}>
                        <View style={styles.popupContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={toggleFeedbackPopup}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.setReminderText}>Give Feedback</Text>
                            <Text>What would you like to share with us?</Text>
                            <TextInput
                                style={styles.feedbackTextarea}
                                placeholder="Write your feedback here..."
                                multiline
                                value={feedbackText}
                                onChangeText={text => setFeedbackText(text)}
                            />
                            <TouchableOpacity
                                style={{ ...styles.reminderButton }}
                                onPress={sendFeedback}>
                                <Text style={styles.reminderButtonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {showThemePopup && (
                    <View style={styles.popupContainer}>
                        <View style={styles.popupContent}>
                            <Text style={styles.setChooseAThemeText}>Choose a Theme</Text>
                            <View style={styles.themeButtons}>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: 'lightblue' }]} onPress={() => changeTheme('#c1dddf', 'lightblue')}>
                                    <Text style={styles.buttonText}>Default</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: 'pink' }]} onPress={() => changeTheme('#FF90BC', '#F2B3CD')}>
                                    <Text style={styles.buttonText}>Barbie</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: 'gray' }]} onPress={() => changeTheme('#4F4A45', '#525C62')}>
                                    <Text style={styles.buttonText}>Star Wars</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: '#860A35' }]} onPress={() => changeTheme('#17B169', '#BF1936')}>
                                    <Text style={styles.buttonText}>Christmas</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: '#ACE1AF' }]} onPress={() => changeTheme('#ACE1AF', '#C8C79A')}>
                                    <Text style={styles.buttonText}>Nature</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.themeButton, { backgroundColor: '#89CFF0' }]} onPress={() => changeTheme('#89CFF0', '#185A96')}>
                                    <Text style={styles.buttonText}>Under the sea</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={toggleThemePopup}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            )}
            </View>
        </View>
    );
};


export default TopBar;
