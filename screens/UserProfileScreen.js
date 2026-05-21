import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
} from 'react-native';

export default function UserProfileScreen({ route, navigation }) {

    const user = route.params?.user || {
        name: 'Demo User',
        email: 'demo@email.com',
    };

    const [modalVisible, setModalVisible] = useState(false);

    const [newName, setNewName] = useState(user.name);
    const [newPassword, setNewPassword] = useState('');

    const handleUpdate = () => {
        Alert.alert('Success', 'User profile updated');
        setModalVisible(false);
    };

    const handleSignOut = () => {
        Alert.alert('Signed Out');

        navigation.replace('Auth');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>User Profile</Text>

            <View style={styles.infoBox}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.value}>{newName}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.row}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignOut}
                >
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>

            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>
                            Update User Profile
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="New User Name"
                            value={newName}
                            onChangeText={setNewName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />

                        <View style={styles.row}>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.buttonText}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    infoBox: {
        marginBottom: 30,
    },

    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
    },

    value: {
        fontSize: 16,
        color: '#444',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },

    button: {
        backgroundColor: '#2d8cff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 6,
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 15,
    },
});