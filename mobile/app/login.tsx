import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { sendOtpApi, verifyOtpApi } from "../src/api/authApi";
import OtpInput from "../src/components/OtpInput";
import { useAuth } from "../src/store/AuthContext";

const images = [
  require("../assets/images/1.jpg"),
  require("../assets/images/2.jpg"),
  require("../assets/images/3.jpg"),
  require("../assets/images/4.jpg"),
];

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useState(new Animated.Value(1))[0];

  // 🔥 Smooth background animation
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

  // 🔐 SEND OTP
  const handleSendOtp = async () => {
    if (!value) {
      return setError("Enter phone or email");
    }

    try {
      setLoading(true);
      setError("");

      await sendOtpApi(value);

      setShowOtp(true);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return setError("Enter 6-digit OTP");
    }

    try {
      setLoading(true);
      setError("");

      const user = await verifyOtpApi(value, otp);

      setUser(user);
      router.replace("/(tabs)");
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Top Image */}
      <View style={styles.imageContainer}>
        <Image source={images[index]} style={styles.image} />

        <Animated.Image
          source={images[nextIndex]}
          style={[styles.image, { opacity: fadeAnim }]}
        />

        <Text style={styles.overlayText}>Level Up Your Game</Text>
      </View>

      {/* 🔥 Bottom Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Find & Play Nearby</Text>

        {/* ❌ Error */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {!showOtp ? (
          <>
            {/* 📱 Input */}
            <TextInput
              placeholder="Enter phone or email"
              value={value}
              onChangeText={(text) => {
                setValue(text);
                setError("");
              }}
              style={styles.input}
              editable={!loading}
            />

            {/* 🔘 Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledBtn]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* 🔥 Helper text */}
            <Text style={styles.helperText}>
              OTP sent to {value}
            </Text>

            {/* 🔢 OTP Input */}
            <OtpInput
              otp={otp}
              setOtp={(val) => {
                setOtp(val);
                setError("");
              }}
            />

            {/* 🔘 Verify Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledBtn]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* 🔁 Change */}
            <TouchableOpacity onPress={() => setShowOtp(false)}>
              <Text style={styles.changeText}>
                Change phone/email
              </Text>
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
    backgroundColor: "#fff",
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
    bottom: 160,
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },

  formContainer: {
    flex: 2,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },

  helperText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },

  changeText: {
    textAlign: "center",
    marginTop: 12,
    color: "#555",
  },
});