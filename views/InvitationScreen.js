import React, {useState} from "react";
import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

const InvitationScreen = ({navigation}) => {
    const [InvitationCode, setInvitationCode] = useState("");
    const onChangeInvitationCode = (payload) => setInvitationCode(payload);
    return (<View style={styles.container}>
        <View
            style={{
                marginVertical: 30,
                backgroundColor: "black",
                borderRadius: 30,
                paddingHorizontal: 30,
                paddingVertical: 30,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TextInput
                placeholder="초대코드를 입력해주세요"
                style={styles.input}
                value={InvitationCode}
                onChangeText={onChangeInvitationCode}
            />
        </View>
        <TouchableOpacity
            onPress={async () => {
                const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
                const ServerAccessToken = await AsyncStorage.getItem("ServerAccessToken");
                await AsyncStorage.setItem("familyCode", InvitationCode);
                await axios({
                    method: "GET", url: SERVER_ADDRESS + "/api/register/currentFamily/" + InvitationCode, headers: {
                        Authorization: "Bearer: " + ServerAccessToken,
                    },
                })
                    .then(async (resp) => {
                        const UserServerAccessToken = resp.data.data.tokenInfo.accessToken;
                        const UserServerRefreshToken = resp.data.data.tokenInfo.refreshToken;
                        await AsyncStorage.setItem("UserServerAccessToken", UserServerAccessToken);
                        await AsyncStorage.setItem("UserServerRefreshToken", UserServerRefreshToken);
                        const members = resp.data.data.familyResponseDto.members;
                        const familyId = resp.data.data.familyResponseDto.familyId;
                        const chatroomId = resp.data.data.familyResponseDto.chatroomId;
                        const plant = resp.data.data.familyResponseDto.Plant;
console.log(resp.data.data.familyResponseDto);
                        var myDB = {};
                        for (let i = 0; i < members.length; i++) {
                            const newkey = members[i].memberId;
                            console.log("MEMBER ID ", members[i].memberId);
                            myDB[newkey] = members[i];
                        }
                        await AsyncStorage.setItem("myDB", JSON.stringify(myDB));
                        await AsyncStorage.setItem("familyId", JSON.stringify(familyId));
                        await AsyncStorage.setItem("chatroomId", JSON.stringify(chatroomId));
                        await AsyncStorage.setItem("plantInfo", JSON.stringify(plant));

                        navigation.navigate("MainDrawer");
                    })
                    .catch(function (error) {
                        console.log("server error", error);
                    });
            }}
            style={{
                backgroundColor: "black",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20,
            }}
        >
            <Text
                style={{
                    color: "white",
                    marginHorizontal: 30,
                    marginVertical: 30,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                GO!
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate("ClickBox")}
            style={{
                backgroundColor: "black",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20,
            }}
        >
            <Text
                style={{
                    color: "white",
                    marginHorizontal: 30,
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                초대코드가 없으신가요?
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate("ClickBox")}
            style={{
                backgroundColor: "black",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20,
            }}
        >
            <Text
                style={{
                    color: "white",
                    marginHorizontal: 30,
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                다음페이지로
            </Text>
        </TouchableOpacity>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: "center", alignItems: "center",
    }, loginText: {
        fontSize: 24, marginBottom: 16,
    }, footer: {
        flexDirection: "row", marginTop: "auto",
    }, character: {
        width: SCREEN_WIDTH, alignItems: "flex-start", paddingHorizontal: 20,
    }, characterFont: {
        fontSize: 500,
    }, input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        fontSize: 18,
        marginVertical: 20,
    },
});

export default InvitationScreen;
