import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import {
    setCartItems,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from '../store/cartSlice';

import { setOrders } from '../store/orderSlice';
import { apiRequest, fixImageUrl } from '../services/api';

export default function ShoppingCartScreen() {
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const cartItems = useSelector(state => state.cart.items);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const saveCartToServer = async (items) => {
        const serverItems = items.map(item => ({
            id: item.id,
            price: item.price,
            count: item.quantity,
        }));

        const result = await apiRequest(
            '/cart',
            'PUT',
            { items: serverItems },
            token
        );

        if (result.status !== 'OK') {
            Alert.alert('Error', result.message || 'Cannot update cart');
        }
    };

    const handleIncrease = async (productId) => {
        const newItems = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        dispatch(increaseQuantity(productId));
        await saveCartToServer(newItems);
    };

    const handleDecrease = async (productId) => {
        const newItems = cartItems
            .map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0);

        dispatch(decreaseQuantity(productId));
        await saveCartToServer(newItems);
    };

    const reloadOrders = async () => {
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

    const handleCheckOut = async () => {
        const orderItems = cartItems.map(item => ({
            prodID: item.id,
            price: item.price,
            quantity: item.quantity,
        }));

        const result = await apiRequest(
            '/orders/neworder',
            'POST',
            { items: orderItems },
            token
        );

        if (result.status !== 'OK') {
            Alert.alert('Error', result.message || 'Cannot create order');
            return;
        }

        await apiRequest('/cart', 'PUT', { items: [] }, token);

        dispatch(clearCart());
        await reloadOrders();

        Alert.alert('Success', 'Order created successfully');
    };

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Your shopping cart is empty
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>Items: {totalItems}</Text>

                <Text style={styles.summaryText}>
                    Total Price: ${totalPrice.toFixed(2)}
                </Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />

                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
                            </Text>

                            <Text>Price: ${item.price}</Text>

                            <View style={styles.quantityRow}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleDecrease(item.id)}
                                >
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.quantity}>
                                    Quantity: {item.quantity}
                                </Text>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleIncrease(item.id)}
                                >
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckOut}
            >
                <Text style={styles.checkoutButtonText}>Check Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    summaryBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 8,
    },

    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    card: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },

    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 10,
    },

    info: {
        flex: 1,
    },

    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    button: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2d8cff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    quantity: {
        marginHorizontal: 10,
    },

    checkoutButton: {
        backgroundColor: '#2d8cff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },

    checkoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});