import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

export default function SplashScreen({ navigation }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Auth');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
                }}
                style={styles.image}
            />

            <Text style={styles.title}>FAKE STORE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d8cff',
    },

    image: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
});