import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { setOrders, toggleOrder } from '../store/orderSlice';
import { apiRequest, fixImageUrl } from '../services/api';

export default function MyOrdersScreen() {
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const orders = useSelector(state => state.orders.orders);

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

    const handlePay = async (orderId) => {
        const result = await apiRequest(
            '/orders/updateorder',
            'POST',
            {
                orderID: orderId,
                isPaid: 1,
                isDelivered: 0,
            },
            token
        );

        if (result.status !== 'OK') {
            Alert.alert('Error', result.message || 'Cannot pay order');
            return;
        }

        await reloadOrders();
        Alert.alert('Success', 'Order paid successfully');
    };

    const handleReceive = async (orderId) => {
        const result = await apiRequest(
            '/orders/updateorder',
            'POST',
            {
                orderID: orderId,
                isPaid: 1,
                isDelivered: 1,
            },
            token
        );

        if (result.status !== 'OK') {
            Alert.alert('Error', result.message || 'Cannot receive order');
            return;
        }

        await reloadOrders();
        Alert.alert('Success', 'Order received successfully');
    };

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No orders yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>My Orders</Text>

            <FlatList
                data={orders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <TouchableOpacity
                            onPress={() => dispatch(toggleOrder(item.id))}
                        >
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderTitle}>
                                    Order #{item.id}
                                </Text>

                                <Text style={styles.status}>
                                    Status: {item.status}
                                </Text>
                            </View>

                            <Text>Total Items: {item.totalItems}</Text>

                            <Text>
                                Total Price: ${Number(item.totalPrice).toFixed(2)}
                            </Text>

                            <Text style={styles.detailHint}>
                                Tap to view order details
                            </Text>
                        </TouchableOpacity>

                        {item.expanded && (
                            <View style={styles.detailBox}>
                                {item.items.map(product => (
                                    <View
                                        key={product.id}
                                        style={styles.productRow}
                                    >
                                        <Image
                                            source={{ uri: product.image }}
                                            style={styles.image}
                                        />

                                        <View style={styles.productInfo}>
                                            <Text
                                                style={styles.productTitle}
                                                numberOfLines={2}
                                            >
                                                {product.title}
                                            </Text>

                                            <Text>
                                                Quantity: {product.quantity}
                                            </Text>

                                            <Text>
                                                Price: ${product.price}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {item.status === 'new' && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handlePay(item.id)}
                            >
                                <Text style={styles.actionButtonText}>
                                    Pay
                                </Text>
                            </TouchableOpacity>
                        )}

                        {item.status === 'paid' && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleReceive(item.id)}
                            >
                                <Text style={styles.actionButtonText}>
                                    Receive
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },

    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
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

    orderCard: {
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },

    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    orderTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    status: {
        fontWeight: 'bold',
        color: '#2d8cff',
    },

    detailHint: {
        marginTop: 8,
        color: '#666',
        fontSize: 12,
    },

    detailBox: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },

    productRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    image: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 10,
    },

    productInfo: {
        flex: 1,
    },

    productTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },

    actionButton: {
        backgroundColor: '#2d8cff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },

    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});