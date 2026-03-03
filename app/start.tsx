import Button from "@/components/button";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

const isValidToken = (token: string) => {
    // TODO maybe check validation here
    return !!token;
}

export default function Start() {
    const router = useRouter();
    const { isAuthenticated, checkAuthStatus } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/splash-icon.png')}
                resizeMode="cover"
                style={styles.backgroundImage}>
                <View style={styles.buttons}>
                    <Button
                        title="Sign Up For Free"
                        onPress={() => {
                            router.push('/register');
                        }}
                    />
                    <Button
                        title="Login"
                        onPress={() => {
                            router.push('/login');
                        }}
                    />
                    <Button
                        title="Continue without login"
                        onPress={() => {
                            router.push('/(tabs)');
                        }}
                    />
                    <Button
                        title="Forgot password ? "
                        onPress={() => {
                            router.push('/forgot-password');
                        }}
                    />
                    <Button
                        title="Tutorial"
                        onPress={() => {
                            router.push('/tutorial');
                        }}
                    />
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        gap: 10,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    buttons: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
