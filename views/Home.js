import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MarqueeText from "react-native-marquee";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { TouchableOpacity } from "react-native-gesture-handler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const FCM_SERVER_KEY =
  "AAAAUCMBJiU:APA91bEs9fOJNe6l2ILHFI88jep5rw9wqR-qTWWbBrKxj7JQnKQ8ZAp4tJbn_yXcL2aP0ydygPIcT89XB6h38vhIozsJ5J61s7w2znBL9hPQG6a18sQcUFkMitr2pkvoCmmfslVQmk-u";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const fontRatio = SCREEN_HEIGHT / 800;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation, fonts }) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [TMI, setTMI] = useState("");
  const onChangeTMI = (payload) => setTMI(payload);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayTMI, setTodayTMI] = useState("");
  const [flower, setFlower] = useState(false);
  const [plant, setPlant] = useState(null);
  const openModal = () => {
    setTMI(""); // 모달 열릴 때 tmi 초기화
    setModalVisible(true);
  };
  const movingObject = () => {
    const movingValue = useRef(new Animated.Value(0)).current;
    const [alienType, setAlienType] = useState("BASIC");
    useEffect(() => {
      const fetchAlienType = async () => {
        try {
          // alienType = await AsyncStorage.getItem("alienType");
          setAlienType(await AsyncStorage.getItem("alienType"));
        } catch (error) {
          console.error("Error fetching alienType from AsyncStorage:", error);
        }
      };
      fetchAlienType();
    }, []);
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(movingValue, {
            toValue: 100,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            toValue: -100,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(movingValue, {
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);
    const interpolated = movingValue.interpolate({
      inputRange: [-1, 1],
      outputRange: [-1, 1],
    });

    useEffect(() => {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
          console.log(notification);
          console.log(notification.request);
          console.log(notification.request.content);
          console.log(notification.request.content.data);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("responseListener: " + response);
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    return (
      <Animated.View style={{ transform: [{ translateX: interpolated }] }}>
        <TouchableOpacity onPress={() => navigation.navigate("Mini Games")}>
          {alienType === "BASIC" ? (
            <Image
              source={require(`../assets/img/character/BASIC.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "GLASSES" ? (
            <Image
              source={require(`../assets/img/character/GLASSES.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "GIRL" ? (
            <Image
              source={require(`../assets/img/character/GIRL.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "BAND_AID" ? (
            <Image
              source={require(`../assets/img/character/BAND_AID.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "RABBIT" ? (
            <Image
              source={require(`../assets/img/character/RABBIT.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "HEADBAND" ? (
            <Image
              source={require(`../assets/img/character/HEADBAND.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "TOMATO" ? (
            <Image
              source={require(`../assets/img/character/TOMATO.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "CHRISTMAS_TREE" ? (
            <Image
              source={require(`../assets/img/character/CHRISTMAS_TREE.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : alienType === "SANTA" ? (
            <Image
              source={require(`../assets/img/character/SANTA.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require(`../assets/img/character/PIRATE.png`)}
              style={{
                width: SCREEN_WIDTH * 0.22,
                height: SCREEN_HEIGHT * 0.2,
                resizeMode: "contain",
              }}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  async function fetchData() {
    const SERVER_ADDRESS = await AsyncStorage.getItem("ServerAddress");
    const UserServerAccessToken = await AsyncStorage.getItem(
      "UserServerAccessToken"
    );
    const familyId = await AsyncStorage.getItem("familyId");
    await axios({
      method: "GET",
      url: SERVER_ADDRESS + "/familyTmi",

      headers: {
        Authorization: "Bearer: " + UserServerAccessToken,
      },
    })
      .then((resp) => {
        const tmis = resp.data;
        var mytmi = "";
        for (let i = 0; i < tmis.length; i++) {
          mytmi = mytmi + tmis[i].writer + ": " + tmis[i].content + "  ";
        }
        setTodayTMI(mytmi);
      })
      .catch((e) => console.log(e));
  }

  const getData = async () => {
    try {
      const plant = await AsyncStorage.getItem("plantInfo");
      setPlant(
        JSON.stringify({
          level: 5,
          point: 100,
          name: "Sunflower",
        })
      );
    } catch (error) {
      console.error("Error getMsg:", error);
    }
  };
  useEffect(() => {
    fetchData();
    getData();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [plantlevel, setPlantlevel] = useState(null);

  useEffect(() => {
    const getplantInfo = async () => {
      try {
        const plant = await AsyncStorage.getItem("plantInfo");
        setPlantlevel(JSON.parse(plant).level);
        setPlant(plant);
      } catch (error) {
        console.error("Error getMsg:", error);
      }
    };

    getplantInfo();
  }, []);

  const increasePlantLevel = () => {
    setPlantlevel((prevLevel) => prevLevel + 1);
  };

  const renderFlower = () => {
    // if (flower) {
    // 레벨에 따라 다른 이미지 렌더링
    switch (plantlevel) {
      case 0:
        return (
          <Image
            source={require("../assets/img/level_0.png")}
            style={styles.plant}
          />
        );

      case 1:
        return (
          <Image
            source={require("../assets/img/level_1.png")}
            style={styles.plant}
          />
        );

      case 2:
        return (
          <Image
            source={require("../assets/img/level_2.png")}
            style={styles.plant}
          />
        );

      case 3:
        return (
          <Image
            source={require("../assets/img/level_3.png")}
            style={styles.plant}
          />
        );

      case 4:
        return (
          <Image
            source={require("../assets/img/level_4.png")}
            style={styles.plant}
          />
        );

      // 추가 레벨에 따른 이미지 케이스
      default:
        setPlantlevel(0);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../assets/img/background.png")}
        style={styles.backgroundImage}
      >
        <Container>
          <View style={styles.tmiTool}>
            <Image
              source={require("../assets/img/tmiTool.png")}
              style={{
                width: SCREEN_WIDTH * 0.85,
                height: SCREEN_HEIGHT * 0.5,
                resizeMode: "contain",
              }}
            />
            <View style={styles.tmiContainer}>
              <View style={styles.marqueeWrapper}>
                <MarqueeText
                  onPress={() => navigation.navigate("Attendance")}
                  style={styles.marqueeText}
                  speed={0.4}
                  marqueeOnStart
                  loop
                  delay={1000}
                >
                  {todayTMI
                    ? todayTMI
                    : "제가 LA에 있을때는 말이죠 정말 제가 꿈에 무대인 메이저리그로 진출해서 가는 식당마다 싸인해달라 기자들은 항상 붙어다니며 취재하고 제가 그 머~ 어~ 대통령이 된 기분이였어요 그런데 17일만에 17일만에 마이너리그로 떨어졌어요 못던져서 그만두고 그냥 확 한국으로 가버리고 싶었어요 그래서 집에 가는길에 그 맥주6개 달린거 있잖아요 맥주6개 그걸 사가지고 집으로 갔어요 그전에는 술먹으면 야구 못하는줄 알았어요 그냥 한국으로 가버릴려구.... 그리고 맥주 6개먹고 확 죽어버릴려고 그랬어요 야구 못하게 되니깐 그러나 집에가서 일단은 부모님에게 전화를 해야겠다고 생각을 했어요 다음날 가려고 전화를 딱 했는데 어머니께서 찬호야 어후~ 찬호야 아들 잘있어 밥은 먹고 다니는겨~ 잘지내는겨 대뜸 그러시는 거에요 내가 말도 하기도 전해 그래서 저는 야구좀 안되지만 잘하고 있다고 여기사람들 잘챙겨준다고 라고 거짓말을 했어요 한국은 못가게 됬지 내일 야구장은 가야하지 막막하더라구요 그럼 어떻게 가야하나 생각을 했어요 그리고 나서 영어공부를 하게 됬는데요 영어... 감독한테 이야기를 못해서 한이 맺힌거지 그래서 이야기 할려고 한 단어씩 한 문장씩 만들어서 그래서 다음날 써 먹었어요 그리고 감독에게 Hey How are you라고 말했어요 이렇게 해서 영어공부를 하는거에요 그리고 마이너생활하다. 이제 메이저리그로 콜업이 됬어요 너무 긴장이 되더라구요 막상 콜업되니깐 콜업전에 그소식을 듣고 정말 기분이 미칠듯이 좋았는데 막상 콜업되고 2회때 갑작스럽게 마운드에 올라서니깐 긴장이 되더라구요 그리고 공을 던졌어요 역시 아니나 다를까 볼넷을 줬어요 그리고 나서 코치님이 딱 올라오는거에요 아 또 내려가는구나 라고 생각했는데 긴장하지 말고 편한하게 던져라 말하고 마운드를 내려가는 거에요 긴장이 한결 풀리더니 갑자기 포수 글러브쏙으로 잘들어가는거에요 어 된다. 이거 된다. 하고 속으로 생각했어요 그리고 직구 또 직구 던지고 새미 소사를 삼진잡았어요 정말 그때 기분은 말로 표현할수가 없는거에요 이때부터 자신감이 붙은거에요 그리고 3회말에 만루의 위기가 있었는데 소사를 다시 삼진 처리하고 큰 위기를 넘기고 정말 그때 삼진 7개를 잡아내고 기분이 하늘로 날아갈것 같았어요 그리고 한국으로 왔는데 많은 사람들이 막 환호하고 그.. 뭐~ 영웅이다. 정말 대단하다. 라고 말했어요 그때 정말 이 눈물이 나더라구요 그리고 텍사스로 제가 이적을 했어요 하지만 못던졌어요 그리고 많은 사람들이 저를 보고 막 매국노 또 야구 때려쳐라 그러는거에요 그리고 한국으로 갔는데 이 계란이 날라오는거에요 그때 정말 확 죽어버리고 싶었어요 야구는 안되지 사람들은 날 싫어하지 정말 절망적이더라구요 너무 힘들어서 그냥 이대로 죽었으면 하는 안좋은 생각까지 할려고 그랬어요 그리고 2005년 도중에 샌디에이고로 트레이드 된거에요 그리고 2006년 대망의 제1회 WBC에 참가하게 되죠 그때 저는 선발투수가 아니였어요 감독님께서 찬호야 마무리투수로써 활약하면 좋을것 같은데 어떻게 생각하니라고 물어보시는거에요 그래서 저는 어후 전 괜찮습니다. 팀에 도움이 될수만 있다면 보직을 변경하겠습니다. 라고 말을했어요 그리고 저희 팀이 4강에 진출을 하게됬어요 어후 기분정말 끝내주더라구요 그리고 뉴욕메츠로 가다가 그리고 친정팀인 LA로 다시 갔어요 이때 정말 선수들이 반겨주더라구요 제가 맞히 집나간 강아지 처럼 반겨주더라구요 너무 좋았어요 그리고 시즌이 끝나고 필라델피아로 갔어요 이듬해에 저희팀이 월드시리즈라는 무대에 갑니다. 야 그때 기분정말 말로표현할수가 없을정도 였는데요 그리고 뉴욕양키스와 만났었고 페드로 마르티네즈 다음으로 바로 등판했어요 긴장이 되더라구요 제가 이닝을 마무리 지어야하는데 그렇지 못하고 결국 1실점하고 내려왔어요 아쉽게 준우승을 했지만 정말 좋은 경험이였다고 생각했고요 2010년때는 뉴욕양키스와 피츠버그로 이적을했는데 피츠버그때 제가 일본투수인 노모히데오의 123승과 타이기록을 세웠고 마침내 124승의 아시아 최다승을 거두었어요 그때 많은 분들이 축하한다고 막 그러시는거에요 기분이 정말 좋더라구요 그리고 나서 일본리그를 걸치다가 마침내 국내리그로 복귀를 했어요 그리고 한화에서 뛰다가 12년을 마지막으로 현역은퇴를 하게됬습니다. 한국에서 은퇴할때 정말 눈물이 나더라구요 말로 표현할수 없을만큼 정말 고마웠고 좋았습니다. 그리고 은퇴생활을 하고 MBC예능 프로그램인 진짜 사나이에 출연하면서 제가 신인상을 수상했습니다. 어후 제가 신인왕이라니 야구하면서 단한번도 신인왕을 받은적이 없었는데 정말 첫 예능에서 그것도 최고의 프로그램인 진짜 사나이에서 신인상을 수상했을때 정말 너무 고맙더라구요 첫예능인데 내가 혹여나 실수라도 하면 어떻게 될까 혹시 잘못 되지는 않을까 걱정을 했는데 많은 사람들이 웃어주고 기뻐해주고 정말 좋더라구요 그리고 그 스크린야구장 있잖아요 거기에 홍보대사로 제가 뽑힌거에요 어후~ 너무 감격스럽더라구요 제가 홍보대사라니 그래서 제가 광고도 찍고 사람들과 이야기도 하고 정말 이런 자리에 초대해주셔서 정말 감사하더라구요 그리고 얼마전에 승엽이와 골프를 치다가 이골프장에서 이 뱀을 발견한거에요 그래서 잡았는데 승엽이가 어후 사람아니에요 라고 말을 하는거에요 이 뱀을 생각하니깐 갑자기 제가 LA에 있을때 미국에서 이 뱀들을 많이 봤는데요 그때 뱀을 미국에서 처음 봤는데 어후 무섭더라구요 하지만 이뱀을 저는 타자라고 생각을 했어요 만약에 이 뱀을 못잡으면 내가 타자에게 진다고 생각해서 낼름 잡았죠 그리고 밖으로 던져버렸어요 LA를 말해서 그러는데 지금 현진이가 LAD에서 뛰고 있잖아요 요새 부상으로 맘고생이 심할텐데 제가LA있을때 말이죠 저또한 허리부상으로 인해서 굉장히 힘들었어요 아픈걸 알면서도 내가 선발이니 뛰었고 결국에는 부상이 악화되어서 결국 망쳐버렸어요 현진이에게 아프지 말고 너가 잘했으면 좋겠어라고 말했어요 하지만 현진이에게 실망했어요 그놈이 팬들을 무시하고 도망을 가더라구요 그 세계최고의 투수인 어 Clayton Kershaw는 싸인 다 해주는데 도망을 가서 약간 기분이 조금그랬어요 그래서 다음에 만날때 이렇게 말할려고요 현진아 그렇지마 너를 알아주는것도 팬들이고 너를 지금 이자리에 있게 해준것도 팬이다. 라고요 LAD다져스 말하니깐 제가 LAD에 처음 들어갈때 말이죠 당시 감독이 토미였어요 그리고 막 선수들이 아는 노래있냐고? 막 대뜸 그렇는거에요 어 그래서 제 머리속에는 그뭐지 여러분들도 한번씩 생일이 있잖아요 그래서 제가 생일송을 불렀어요 해피 벌쓰 데이 뚜유~~~ 라고요 그당시 영어가 미숙해서 발음이 이상했어요 그리고 탐나는 자리가 있냐고 물었을때 제가 감독님이름인 토미라고 말했어요 그러고는 선수들과 코치님들이 다들 웃는거에요 이렇게 ㅋㅋㅋㅋ 그래서 저도 웃었죠 이렇게 ㅋㅋㅋㅋ 그러고 저의 화려한 입단식을 가졌어요 입단식 하니깐 한화가 생각나네요 제가 국내무대로 처음 왔는데 막 어린후배들이 저를 막 존경합니다. 막 그렇는거에요 그래서 제가 이야기를 했죠 그런데 예들이 다들 비몽사몽해 있는거에요 그리고 막 태균이가 들어왔어요 태균이가 어 선배님 정말 오랜만입니다. 잘지냈습니까? 이러는거에요 그래서 어 그래 너도 잘있지 라고 말했어요 그리고 태균이와 짧은 이야기를 나누었는데 태균이가 갑자기 급한일이 있다면서 가는거에요 아 잠깐 이야기를 하고 싶었는데 가니깐 약간은 아쉽더라구요 아쉬운게 있어서 생각나는데 제가 SK와이번스 스프링캠프에 참가를 했어요 어후 선수들이 분위기가 좋고 참 재미있더라구요 그 뭐지 마춘텔인가에서 제가 이렇게 말을 했는데요 (예 UH 야구팬들 여려분 항상 야구를 통해서 여러분들이 어떠한 uh 즐거움과 또 삶의 그러한 활력을 uh 얻기를 바라겠구요 또 야구 팬들 여루분 덕분에 한국 야구가 계속 발전하고 있습니다. 예 그래서(씁) 저도 이젠 팬으로서 팬 한사람으로서 한국 야구에 큰 도움이 될수 있도록 노력하고 있구요 항상 여러분들과 같이 야구를 응원하는 그러한 한 사람으로서 노력하겠습니다.)라고 말했어요 그리고 김광현 있죠 광현이를 맞났는데 광현이 피칭이 너무 좋더라구요 그래서 어 광현아 공은 좋은데 올해 몇승할것 같다고 물어보니깐 10승만해도 충분하다고 하더라구요. 그리고 그 때 기자들 중 유독 저의 마음을 끌었던 기자형이 있었는데 그 기자형은 집에 저를 초대해서 저에게 다양한 이야기와 경험을 주었었죠. 그 기자형의 방에는 다양한 스포츠 자료가........"}
                </MarqueeText>
              </View>
            </View>
          </View>

          <View style={styles.tmiTextContainer}>
            <TouchableOpacity onPress={openModal}>
              <Text
                style={{
                  color: "white",
                  fontSize: 19 * fontRatio,
                  fontFamily: "dnf",
                }}
              >
                오늘의 TMI
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          ></View>
          <View style={styles.alien}>{movingObject()}</View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={increasePlantLevel}>
              {renderFlower()}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              jㄱustifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 50,
            }}
          >
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextInput
                      value={TMI}
                      placeholder="당신의 TMI를 알려주세요!"
                      onChangeText={onChangeTMI}
                      multiline={true}
                      numberOfLines={3}
                      maxLength={40}
                      editable={true}
                      style={{
                        ...styles.input,
                        margin: 5,
                        borderColor: "#D63CE3",
                        height: 100,
                        width: 300,
                        textAlign: "center",
                      }}
                    />
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                      <Pressable
                        style={[styles.button, styles.buttonWrite]}
                        onPress={async () => {
                          const SERVER_ADDRESS = await AsyncStorage.getItem(
                            "ServerAddress"
                          );
                          const UserServerAccessToken =
                            await AsyncStorage.getItem("UserServerAccessToken");
                          await axios({
                            method: "POST",
                            url: SERVER_ADDRESS + "/tmi",
                            headers: {
                              Authorization: "Bearer: " + UserServerAccessToken,
                            },
                            data: {
                              content: TMI,
                            },
                          })
                            .then(async (resp) => {
                              //todo
                              // const writer = await AsyncStorage.getItem("nickname");
                              // setTodayTMI(writer + ": " + TMI + "  " + todayTMI);
                              fetchData();
                            })
                            .catch(function (error) {
                              console.log("server error", error);
                            });
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={{ ...styles.textStyle, color: "#fff" }}>
                          작성
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={{ ...styles.textStyle, color: "#727272" }}>
                          취소
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View
              style={{
                left: "-25%",
                bottom: 5,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  const SERVER_ADDRESS = await AsyncStorage.getItem(
                    "ServerAddress"
                  );
                  const UserServerAccessToken = await AsyncStorage.getItem(
                    "UserServerAccessToken"
                  );
                  await axios({
                    method: "GET",
                    url: SERVER_ADDRESS + "/tmi/check",
                    headers: {
                      Authorization: "Bearer: " + UserServerAccessToken,
                    },
                  })
                    .then(async (resp) => {
                      if (resp.data.message != "오늘의 tmi를 작성했습니다.") {
                        Alert.alert("출석을 위해 TMI를 작성해주세요!");
                      } else {
                        await axios({
                          method: "GET",
                          url: SERVER_ADDRESS + "/attendance",
                          headers: {
                            Authorization: "Bearer: " + UserServerAccessToken,
                          },
                        })
                          .then((resp) => {
                            Alert.alert(resp.data.message);
                            if (flower) {
                              setFlower(false);
                            } else {
                              setFlower(true);
                            }
                          })
                          .catch((e) => console.log(e));
                      }
                    })
                    .catch((e) => console.log(e));
                }}
              >
                <Image
                  source={require("../assets/img/wateringCan.png")}
                  style={styles.wateringCan}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    resizeMode: "cover",
  },
  tmiTool: {
    // position: "absolute",
    alignItems: "center",
    top: "-22%",
  },
  tmiTextContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "6%" : "5%",
  },
  tmiContainer: {
    bottom: "38%",
    padding: "11%",
  },
  marqueeWrapper: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.7,
    overflow: "hidden", // 영역을 벗어난 부분 숨기기
  },
  marqueeText: {
    marginTop: 5,
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 65,
    // height: 34,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "black",
  },
  buttonWrite: {
    backgroundColor: "#C336CF",
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#DED1DF",
    marginHorizontal: 10,
  },
  textStyle: {
    textAlign: "center",
    fontFamily: "dnf",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  wateringCan: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: "contain",
  },
  bottomContainer: {
    position: "absolute",
    flex: 1,
    bottom: 40,
  },
  plant: {
    width: SCREEN_WIDTH * 0.23,
    height: SCREEN_HEIGHT * 0.2,
    resizeMode: "contain",
  },
  alien: {
    position: "absolute",
    bottom: "22%",
  },
});
