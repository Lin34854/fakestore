import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { setCartItems } from '../store/cartSlice';
import { setOrders } from '../store/orderSlice';
import { apiRequest, fixImageUrl } from '../services/api';

export default function AuthScreen() {
    const dispatch = useDispatch();

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    const loadCartAndOrders = async (token) => {
        const cartData = await apiRequest('/cart', 'GET', null, token);

        if (cartData.status === 'OK') {
            const cartItems = await Promise.all(
                cartData.items.map(async item => {
                    const product = await apiRequest(`/products/${item.id}`);
                    const fixedProduct = fixImageUrl(product);

                    return {
                        ...fixedProduct,
                        quantity: item.count,
                    };
                })
            );

            dispatch(setCartItems(cartItems));
        }

        const ordersData = await apiRequest('/orders/all', 'GET', null, token);

        if (ordersData.status === 'OK') {
            const orders = await Promise.all(
                ordersData.orders.map(async order => {
                    const parsedItems = JSON.parse(order.order_items);

                    const items = await Promise.all(
                        parsedItems.map(async item => {
                            const product = await apiRequest(`/products/${item.prodID}`);
                            const fixedProduct = fixImageUrl(product);

                            return {
                                ...fixedProduct,
                                quantity: item.quantity,
                                price: item.price,
                            };
                        })
                    );

                    let status = 'new';
                    if (order.is_delivered === 1) {
                        status = 'delivered';
                    } else if (order.is_paid === 1) {
                        status = 'paid';
                    }

                    return {
                        id: order.id,
                        items,
                        totalItems: order.item_numbers,
                        totalPrice: order.total_price,
                        status,
                        expanded: false,
                    };
                })
            );

            dispatch(setOrders(orders));
        }
    };

    const handleSubmit = async () => {
        if (isSignUp && name.trim() === '') {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        const path = isSignUp ? '/users/signup' : '/users/signin';

        const body = isSignUp
            ? { name, email, password }
            : { email, password };

        try {
            const data = await apiRequest(path, 'POST', body);

            if (data.status !== 'OK') {
                Alert.alert('Error', data.message || 'Login failed');
                return;
            }

            dispatch(setUser({
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                },
                token: data.token,
            }));

            await loadCartAndOrders(data.token);

            Alert.alert(
                'Success',
                isSignUp ? 'Sign up successful' : 'Sign in successful'
            );
        } catch (error) {
            Alert.alert('Error', 'Cannot connect to server');
        }
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