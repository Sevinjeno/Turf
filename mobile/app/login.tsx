import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { sendOtpApi, verifyOtpApi } from "../src/api/authApi";

const images = [
  require("../assets/images/1.jpg"),
  require("../assets/images/2.jpg"),
  require("../assets/images/3.jpg"),
  require("../assets/images/4.jpg"),
];

export default function LoginScreen() {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (index + 1) % images.length;
      setNextIndex(newIndex);

      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        setIndex(newIndex);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [index]);

const handleSendOtp = async () => {
  await sendOtpApi(value); // call API directly
  setShowOtp(true);
};

  // const sendOtp = async (mobile: string, value: string) => {
  //   await sendOtpApi(mobile);

  //   router.push({
  //     pathname: "/otp",
  //     params: { mobile },
  //   });
  // };

  const handleVerifyOtp = async () => {
  if (!otp) return alert("Enter OTP");

  try {
    const user = await verifyOtpApi(value, otp);

    console.log("User:", user);

    // 🔥 redirect to app
    router.replace("/(tabs)");
  } catch (err) {
    console.error("OTP verify failed", err);
  }
};

//   if (!value) {
//   return alert("Enter phone or email");
// }

  return (
    <View style={styles.container}>
      {/* 🔥 Top Image */}
      <View style={styles.imageContainer}>
        {/* Current Image */}
        <Image source={images[index]} style={styles.image} />

        {/* Next Image (fades in) */}
        <Animated.Image
          source={images[nextIndex]}
          style={[styles.image, { opacity: fadeAnim }]}
        />

        <Text style={styles.overlayText}>Level Up Your Game</Text>
      </View>

      {/* 🔥 Bottom Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Find & Play Nearby</Text>

        {!showOtp ? (
          <>
            <TextInput
              placeholder="Enter phone or email"
              value={value}
              onChangeText={setValue}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlayText: {
    position: "absolute",
    bottom: 200,
    color: "white",
    fontSize: 39,
    fontWeight: "bold",
  },

  formContainer: {
    flex: 2,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
