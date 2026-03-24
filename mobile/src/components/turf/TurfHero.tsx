import { View, Text, ImageBackground } from "react-native";

type Props = {
  name: string;
  city: string;
  image: string;
};

export default function TurfHero({ name, city, image }: Props) {
  return (
    <ImageBackground
      source={{ uri: image }}
      style={{ height: 220, justifyContent: "flex-end" }}
    >
      <View style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 16 }}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
          {name}
        </Text>
        <Text style={{ color: "#ddd" }}>{city}</Text>
      </View>
    </ImageBackground>
  );
}