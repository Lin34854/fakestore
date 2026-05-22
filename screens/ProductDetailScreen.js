import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { apiRequest, fixImageUrl } from '../services/api';

export default function ProductDetailScreen({ route }) {
    const { productId } = route.params;

    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const cartItems = useSelector(state => state.cart.items);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            const data = await apiRequest(`/products/${productId}`);
            setProduct(fixImageUrl(data));
        } catch (error) {
            Alert.alert('Error', 'Cannot load product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const saveCartToServer = async (newItems) => {
        const serverItems = newItems.map(item => ({
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
            Alert.alert('Error', result.message || 'Cannot save cart');
        }
    };

    const handleAddToCart = async () => {
        const existingItem = cartItems.find(item => item.id === product.id);

        let newItems;

        if (existingItem) {
            newItems = cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newItems = [...cartItems, { ...product, quantity: 1 }];
        }

        dispatch(addToCart(product));
        await saveCartToServer(newItems);

        Alert.alert('Success', 'Added to shopping cart');
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading product...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />

            <Text style={styles.title}>{product.title}</Text>

            <Text style={styles.price}>${product.price}</Text>

            <Text style={styles.rating}>
                Rating: {product.rating?.rate} ({product.rating?.count})
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                <Text style={styles.buttonText}>Add to Shopping Cart</Text>
            </TouchableOpacity>

            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    image: {
        width: '100%',
        height: 250,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        marginBottom: 5,
    },
    rating: {
        marginBottom: 15,
        color: '#555',
    },
    button: {
        backgroundColor: '#2d8cff',
        padding: 12,
        borderRadius: 6,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    descTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        lineHeight: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});