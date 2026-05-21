import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import {
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} from '../store/cartSlice';

import { createOrder } from '../store/orderSlice';

export default function ShoppingCartScreen() {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckOut = () => {
        dispatch(createOrder({
            items: cartItems,
            totalItems,
            totalPrice,
        }));

        dispatch(clearCart());

        alert('Order created successfully');
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
                                    onPress={() =>
                                        dispatch(decreaseQuantity(item.id))
                                    }
                                >
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.quantity}>
                                    Quantity: {item.quantity}
                                </Text>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        dispatch(increaseQuantity(item.id))
                                    }
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