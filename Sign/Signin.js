import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import CountryFlag from 'react-native-country-flag';

import api from "../api/api";
import { getDeviceId } from "../utils/DeviceId";

import {
    AreaInput,
    Background,
    Container,
    DividerContainer,
    DividerLine,
    DividerText,
    LabelText,
    SocialButton,
    SocialButtonsContainer,
    SocialButtonText,
    SubmitButton,
    SubmitText,
    Title
} from './Styles';

WebBrowser.maybeCompleteAuthSession();

const countries = [
    { cca2: 'BR', callingCode: '55', name: 'Brazil' },
    { cca2: 'US', callingCode: '1', name: 'United States' },
    { cca2: 'PT', callingCode: '351', name: 'Portugal' },
];

export default function Login({ navigation }) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('BR');
    const [callingCode, setCallingCode] = useState('55');
    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const [handledGoogle, setHandledGoogle] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '<SEU_CLIENTID_EXPO>',
        iosClientId: '<SEU_CLIENTID_IOS>',
        androidClientId: '<SEU_CLIENTID_ANDROID>',
        webClientId: '<SEU_WEBCLIENTID>',
    });
}

    // ✅ CORREÇÃO: evitar loop infinito do Google
    useEffect(() => {
        if (response?.type === 'success' && !handledGoogle) {
            setHandledGoogle(true);

            const { authentication } = response;

            if (!authentication) {
                Alert.alert("Erro", "Falha no login Google");
                return;
            }

            const idToken = authentication.idToken || authentication.accessToken;

            if (!idToken) {
                Alert.alert("Erro", "Token Google inválido");
                return;
            }

            handleGoogleLoginBackend(idToken);
        }
    }, [response]);

    function selectCountry(item) {
        setCountryCode(item.cca2);
        setCallingCode(item.callingCode);
        setModalVisible(false);
    }

    // ================= PHONE =================
    async function handlePhoneLogin() {
        if (loading) return;

        if (!phoneNumber || phoneNumber.length < 6) {
            Alert.alert("Error", "Enter a valid phone number");
            return;
        }

        const fullPhone = `+${callingCode}${phoneNumber}`;

        try {
            setLoading(true);

            const deviceId = await getDeviceId();

            await api.post("/auth/send-sms", { phone: fullPhone });

            navigation.navigate("Otp", { phone: fullPhone, deviceId });

        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to send code");
        } finally {
            setLoading(false);
        }
    }

    // ================= GOOGLE =================
    async function handleGoogleLoginBackend(idToken) {
        if (socialLoading) return;

        try {
            setSocialLoading(true);

            const deviceId = await getDeviceId();

            const responseBackend = await api.post("/auth/google", {
                idToken,
                deviceId
            });

            const { accessToken, refreshToken } = responseBackend.data;

            await AsyncStorage.setItem("accessToken", accessToken);

            if (refreshToken) {
                await AsyncStorage.setItem("refreshToken", refreshToken);
            }

            navigation.replace("Home");

        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Google login failed");
        } finally {
            setSocialLoading(false);
        }
    }

    // ================= APPLE =================
    async function handleAppleLogin() {
        if (socialLoading) return;

        try {
            setSocialLoading(true);

            const credential = await AppleAuthentication.signInAsync({
                
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const identityToken = credential.identityToken;

            if (!identityToken) {
                Alert.alert("Erro", "Apple não retornou identityToken");
                return;
            }

            const deviceId = await getDeviceId();

            const response = await api.post("/auth/apple", {
                identityToken,
                deviceId,
            });

            const { accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem("accessToken", accessToken);

            if (refreshToken) {
                await AsyncStorage.setItem("refreshToken", refreshToken);
            }

            navigation.replace("Home");

        } catch (err) {
    console.log("APPLE FRONTEND ERROR:", err);
    console.log("APPLE RESPONSE:", err?.response?.data);

    Alert.alert(
      "Error",
      JSON.stringify(err?.response?.data || err.message)
    );
        }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Background>
                <Container>

                    <Title>Sign in</Title>

                    <LabelText>Phone Number</LabelText>

                    <AreaInput style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#813EFF',
                        borderRadius: 8,
                        height: 55,
                        paddingHorizontal: 10,
                        width: "85%",
                    }}>

                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <CountryFlag isoCode={countryCode} size={20} />
                        </TouchableOpacity>

                        <View style={{ width: 1, height: 30, backgroundColor: '#813EFF', marginHorizontal: 10 }} />

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text>+{callingCode}</Text>
                            <TextInput
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                style={{ flex: 1 }}
                            />
                        </View>
                    </AreaInput>

                    <SubmitButton onPress={handlePhoneLogin}>
                        <SubmitText>{loading ? "Sending..." : "Sign in"}</SubmitText>
                    </SubmitButton>

                    <DividerContainer>
                        <DividerLine />
                        <DividerText>or</DividerText>
                        <DividerLine />
                    </DividerContainer>

                    <SocialButtonsContainer>

                        {Platform.OS === "android" && (
                            <SocialButton onPress={() => !socialLoading && promptAsync()}>
                                <SocialButtonText>
                                    {socialLoading ? "Loading..." : "Continue with Google"}
                                </SocialButtonText>
                            </SocialButton>
                        )}

                        {Platform.OS === "ios" && (
                            <AppleAuthentication.AppleAuthenticationButton
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={5}
                                style={{ width: 250, height: 44 }}
                                onPress={handleAppleLogin}
                            />
                        )}

                    </SocialButtonsContainer>

                </Container>
            </Background>
        </TouchableWithoutFeedback>
    );
}