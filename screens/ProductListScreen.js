import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProductListScreen({ route, navigation }) {
    const { category } = route.params;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                `https://fakestoreapi.com/products/category/${category}`
            );

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading products...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('ProductDetail', {
                                productId: item.id,
                            })
                        }
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />

                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
                            </Text>

                            <Text style={styles.price}>
                                Price: ${item.price}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },

    card: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },

    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 12,
    },

    info: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    price: {
        fontSize: 14,
    },

    backButton: {
        backgroundColor: '#2d8cff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },

    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});