import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import HeroCarousel from "../../src/components/HeroCarousel";
import { sendOtpApi } from "../../src/api/authApi";
import { router } from "expo-router";

export default function Login() {

  const [mobile, setMobile] = useState("");

  const sendOtp = async () => {

    await sendOtpApi(mobile);

    router.push({
      pathname: "/otp",
      params: { mobile }
    });

  };

  return (

    <View style={{ flex:1, backgroundColor:"#fff" }}>

      <HeroCarousel />

      <View
        style={{
          flex:1,
          padding:24,
          justifyContent:"center"
        }}
      >

        <Text style={{
          fontSize:26,
          fontWeight:"bold",
          marginBottom:20
        }}>
          Find & Play Nearby
        </Text>

        <TextInput
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          style={{
            borderWidth:1,
            borderColor:"#ddd",
            padding:14,
            borderRadius:10,
            marginBottom:16
          }}
        />

        <Pressable
          onPress={sendOtp}
          style={{
            backgroundColor:"#22c55e",
            padding:16,
            borderRadius:10,
            alignItems:"center"
          }}
        >
          <Text style={{ color:"#fff", fontWeight:"bold" }}>
            Send OTP
          </Text>
        </Pressable>

      </View>

    </View>
  );
}