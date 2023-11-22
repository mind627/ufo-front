import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';
import AlienSvg from '../AlienSvg';
import {KorolJoystick} from "korol-joystick";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

export default function MiniGames({navigation}) {
    const [characterPosition, setCharacterPosition] = useState({x: 200, y: 200});
    const [showButton, setShowButton] = useState({
        ladder: false,
        mole: false,
        roulette: false,
        door: false,
    });

    const SOME_THRESHOLD = 100;

    const handleJoystickMove = (e) => {
        const angleInRadian = e.angle.radian;
        const deltaX = e.force * Math.cos(angleInRadian) * 4;
        const deltaY = e.force * Math.sin(angleInRadian) * 4;

        // 캐릭터 화면 밖으로 나가지 않도록 제한
        setCharacterPosition((prevPosition) => ({
            x: Math.max(0, Math.min(prevPosition.x + deltaX, SCREEN_WIDTH - SCREEN_WIDTH * 0.12)),
            y: Math.max(0, Math.min(prevPosition.y - deltaY, SCREEN_HEIGHT - SCREEN_HEIGHT * 0.1)),
        }));
    };

    // 게임 이미지 & 캐릭터 사이 거리 계산
    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    };

    useLayoutEffect(() => {
        const gameImgPosition = {
            ladder: {x: SCREEN_WIDTH * 0.018, y: SCREEN_HEIGHT * 0.14},
            mole: {x: SCREEN_WIDTH * 0.9, y: SCREEN_HEIGHT * 0.3},
            roulette: {x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.6},
            door: {x: SCREEN_WIDTH * 0.95, y: SCREEN_HEIGHT * 0.65}
        };

        const updatedShowButton = {};

        Object.keys(gameImgPosition).forEach((button) => {
            const distance = calculateDistance(characterPosition, gameImgPosition[button]);
            updatedShowButton[button] = distance < SOME_THRESHOLD;
        });

        setShowButton(updatedShowButton);
    }, [characterPosition]);


    return (
        <View style={styles.container}>
            <ImageBackground
                // source={require('../assets/img/Background.png')}
                style={styles.bgImage}
            >
                <View style={styles.doorForm}>
                    <Image
                        style={styles.door}
                        source={require('../assets/img/door.png')}/>
                </View>
                {showButton.door ? (
                    <View style={styles.spaceshipForm}>
                        <TouchableOpacity onPress={
                            () => {
                                Alert.alert("맵을 나가시겠습니까?", null, [
                                    {
                                        text: "취소",
                                        style: "cancel",
                                    },
                                    {
                                        text: "나가기",
                                        onPress: () => {
                                            navigation.navigate("Home")
                                        }
                                    },
                                ]);
                            }}>
                            <Image
                                style={styles.spaceship}
                                source={require('../assets/img/door.png')}/>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={styles.ladderForm}>
                    <Image
                        style={styles.ladder}
                        source={require('../assets/img/ladder.png')}
                    />
                </View>

                {showButton.ladder ? (
                    <View style={styles.spaceshipForm}>
                        <TouchableOpacity onPress={
                            () => {
                                navigation.navigate("Ladder")
                            }}>
                            <Image
                                style={styles.ladder}
                                source={require('../assets/img/ladder.png')}
                            />
                            <Text
                                style={styles.buttonText}>
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={styles.moleForm}>
                    <Image
                        style={styles.mole}
                        source={require('../assets/img/mole.png')}
                    />
                </View>

                {showButton.mole ? (
                    <View style={styles.spaceshipForm}>
                        <TouchableOpacity onPress={
                            () => {
                                navigation.navigate("Mole")
                            }}>
                            <Image
                                style={styles.spaceship}
                                source={require('../assets/img/mole.png')}
                            />
                            <Text
                                style={styles.buttonText}>
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <GestureHandlerRootView
                    style={styles.joystick}
                >
                    <KorolJoystick
                        color="#FFFFFF"
                        radius={70}
                        onMove={handleJoystickMove}
                    />
                </GestureHandlerRootView>

                <Animated.View style={styles.rouletteForm}>
                    <LottieView
                        style={styles.roulette}
                        source={require('../assets/json/roulette.json')}
                        autoPlay
                        loop
                    />
                </Animated.View>

                {showButton.roulette ? (
                    <View style={styles.spaceshipForm}>
                        <TouchableOpacity onPress={
                            () => {
                                navigation.navigate("Roulette")
                            }}>
                            <LottieView
                                style={styles.spaceship}
                                source={require('../assets/json/roulette.json')}
                                autoPlay
                                loop
                            />
                            <Text
                                style={styles.buttonText}>
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={{
                    left: characterPosition.x,
                    top: characterPosition.y,
                    width: SCREEN_WIDTH * 0.1,
                    height: SCREEN_WIDTH * 0.1,
                    resizeMode: "contain"
                }}>
                    <AlienSvg/>
                </View>

                <StatusBar style="auto"/>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    bgImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "#000000",
    },
    ladderForm: {
        position: "absolute",
        left: -SCREEN_WIDTH * 0.018,
        top: SCREEN_HEIGHT * 0.1,
    },
    ladder: {
        width: SCREEN_WIDTH * 0.2,
        height: SCREEN_HEIGHT * 0.15,
        resizeMode: "contain",
    },
    moleForm: {
        position: "absolute",
        right: SCREEN_WIDTH * 0.05,
        top: SCREEN_HEIGHT * 0.2,
    },
    mole: {
        width: SCREEN_WIDTH * 0.15,
        height: SCREEN_HEIGHT * 0.2,
        resizeMode: "contain",
    },
    rouletteForm: {
        position: "absolute",
        left: SCREEN_WIDTH * 0.3,
        bottom: SCREEN_HEIGHT * 0.3,
    },
    roulette: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.1,
        resizeMode: "contain",
    },
    doorForm: {
        position: "absolute",
        right: -SCREEN_WIDTH * 0.02,
        bottom: SCREEN_HEIGHT * 0.25,
    },
    door: {
        width: SCREEN_WIDTH * 0.17,
        height: SCREEN_HEIGHT * 0.17,
        resizeMode: "contain",
    },
    joystick: {
        position: "absolute",
        left: "5%",
        bottom: "5%",
    },
    spaceshipForm: {
        position: "absolute",
        right: "10%",
        bottom: "4%",
    },
    spaceship: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.1,
        resizeMode: "contain",
    },
    // buttonText: {
    //     position: "absolute",
    //     right: "12%",
    //     bottom: "10%",
    //     color: "red",
    //     fontWeight: "bold"
    // }
});