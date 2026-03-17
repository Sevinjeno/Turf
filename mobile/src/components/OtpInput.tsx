import { View, TextInput, StyleSheet } from "react-native";
import { useRef } from "react";

type Props = {
  otp: string;
  setOtp: (val: string) => void;
};

export default function OtpInput({ otp, setOtp }: Props) {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // only numbers

    let newOtp = otp.split("");
    newOtp[index] = text;
    const updatedOtp = newOtp.join("");

    setOtp(updatedOtp);

    // move forward
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          value={otp[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleBackspace(nativeEvent.key, index)
          }
          keyboardType="number-pad"
          maxLength={1}
          style={styles.input}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  input: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
});