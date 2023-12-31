import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REST_API_KEY = "53a4c1ed38ca9033bd5c086437b40943";
const REDIRECT_URI = "http://43.202.241.133:1998/api/login/kakaoRedirect";

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KaKaoLogin({ navigation }) {
  function KaKaoLoginWebView(data) {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      requestToken(authorize_code);
    }
  }

  const requestToken = async (authorize_code) => {
    var KAT = "none";
    var SAT = "none";
    var name = "";
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    await axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,
      },
    })
      .then(async (response) => {
        KAT = response.data.access_token;
        await AsyncStorage.setItem("KakaoAccessToken", KAT);
      })
      .catch(function (error) {
        console.log("kakao error", error);
      });
    await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${KAT}`,
      },
    })
      .then(async (resp) => {
        await AsyncStorage.setItem("kakaoEmail", resp.data.kakao_account.email);
        name = resp.data.kakao_account.profile.nickname;
        await AsyncStorage.setItem("kakaoName", name);
        // await AsyncStorage.setItem("ServerAccessToken", SAT);
      })
      .catch(function (error) {
        console.log("server error", error);
      });
    await axios
      .post(SERVER_ADDRESS + "/api/login/kakao", KAT)
      .then(async (resp) => {
        // SAT = resp.data.data.accessToken;
        // await AsyncStorage.setItem("ServerAccessToken", SAT);
        if (resp.data.code === 200) {
          await AsyncStorage.setItem(
            "UserServerAccessToken",
            resp.data.data.tokenInfo.accessToken
          )
            .then(navigation.navigate("MainDrawer"))
            .catch((e) => console.log(e));
        } else {
          navigation.navigate("Greet", name);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("server error", error);
      });
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&scope=talk_calendar&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={(event) => {
          KaKaoLoginWebView(event.nativeEvent["url"]);
          const data = event.nativeEvent.url;
        }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
});
