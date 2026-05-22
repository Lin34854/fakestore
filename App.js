import 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './screens/AuthScreen';
import SplashScreen from './screens/SplashScreen';
import UserProfileScreen from './screens/UserProfileScreen';

import CategoryScreen from './screens/CategoryScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ProductListScreen from './screens/ProductListScreen';
import ShoppingCartScreen from './screens/ShoppingCartScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
}

function MainTabs() {
    const cartItems = useSelector(state => state.cart.items);
    const orders = useSelector(state => state.orders.orders);

    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const newOrdersCount = orders.filter(
        order => order.status === 'new'
    ).length;

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Products"
                component={ProductsStack}
                options={{ headerShown: false }}
            />

            <Tab.Screen
                name="Shopping Cart"
                component={ShoppingCartScreen}
                options={{
                    tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
                }}
            />

            <Tab.Screen
                name="My Orders"
                component={MyOrdersScreen}
                options={{
                    tabBarBadge: newOrdersCount > 0 ? newOrdersCount : undefined,
                }}
            />

            <Tab.Screen
                name="User Profile"
                component={UserProfileScreen}
            />
        </Tab.Navigator>
    );
}

function RootNavigator() {
    const token = useSelector(state => state.auth.token);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!token ? (
                    <>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="Auth" component={AuthScreen} />
                    </>
                ) : (
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <RootNavigator />
        </Provider>
    );
}