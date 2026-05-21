import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

export default function AuthScreen({ navigation }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = () => {
        if (isSignUp && name.trim() === '') {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        const user = {
            name: isSignUp ? name : 'Demo User',
            email,
        };

        Alert.alert(
            'Success',
            isSignUp ? 'Sign up successful' : 'Sign in successful'
        );

        navigation.replace('MainTabs', { user });
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>
                    {isSignUp
                        ? 'Sign up a new user'
                        : 'Sign in with your email and password'}
                </Text>

                {isSignUp && (
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        value={name}
                        onChangeText={setName}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={clearForm}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.switchText}>
                        {isSignUp
                            ? 'Switch to sign in with an existing user'
                            : 'Switch to sign up a new user'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#f2f2f2',
    },
    form: {
        backgroundColor: '#5146a6',
        padding: 20,
        borderRadius: 8,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#2d8cff',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 12,
    },
});