import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';

const ThemePopup = ({ onClose }) => {
    const changeTheme = (color1, backgroundImage) => {
        // Apply your theme changes here
    };

    return (
        <Modal transparent={true} animationType="slide" visible={true}>
            <View style={styles.themePopup}>
                <View style={styles.themeContent}>
                    <Text style={styles.themeTitle}>Choose a Theme</Text>
                    <View style={styles.themeButtons}>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: 'lightblue' }]}
                            onPress={() => changeTheme('#c1dddf', '')}
                        >
                            <Text style={styles.themeButtonText}>Default</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: 'pink' }]}
                            onPress={() => changeTheme('#FF90BC', 'https://i.etsystatic.com/22098416/r/il/ef7a12/2542952296/il_fullxfull.2542952296_fgta.jpg')}
                        >
                            <Text style={styles.themeButtonText}>Barbie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: 'gray' }]}
                            onPress={() => changeTheme('#4F4A45', 'https://i.imgur.com/PCZOeXX.jpeg')}
                        >
                            <Text style={styles.themeButtonText}>Star Wars</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: '#860A35' }]}
                            onPress={() => changeTheme('#17B169', 'https://images.unsplash.com/photo-1511268011861-691ed210aae8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')}
                        >
                            <Text style={styles.themeButtonText}>Christmas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: '#ACE1AF' }]}
                            onPress={() => changeTheme('#ACE1AF', 'https://i.etsystatic.com/13631806/r/il/767edb/3473287803/il_794xN.3473287803_82v1.jpg')}
                        >
                            <Text style={styles.themeButtonText}>Nature</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: '#89CFF0' }]}
                            onPress={() => changeTheme('#89CFF0', 'https://media.newyorker.com/photos/5b5a414992497e4fd0017662/master/w_1920,c_limit/Sunday-Reading-Under-the-Sea.jpg')}
                        >
                            <Text style={styles.themeButtonText}>Under the sea</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    themePopup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    themeContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    themeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    themeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    themeButton: {
        padding: 30,
        margin: 5,
        borderRadius: 5,
    },
    themeButtonText: {
        color: 'white',
    },
    closeButton: {
        backgroundColor: 'var(--theme-color)', // Adjust the color according to your theme
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
    },
});

export default ThemePopup;
