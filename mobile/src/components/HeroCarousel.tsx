import { View, Image, Dimensions } from "react-native";
import { useEffect } from "react";
import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate
} from "react-native-reanimated";

import { HERO_IMAGES } from "../constants/images";
import PaginationDots from "./PaginationDots";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

export default function HeroCarousel() {

  const progress = useSharedValue(0);

  useEffect(() => {

    const interval = setInterval(() => {

      progress.value = withTiming(
        (progress.value + 1) % HERO_IMAGES.length,
        { duration:900 }
      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (

    <View style={{ height:height * 0.45 }}>

      {HERO_IMAGES.map((img, index) => {

        const animatedStyle = useAnimatedStyle(() => {

          const opacity = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [0, 1, 0]
          );

          const translateX = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [-40, 0, 40]
          );

          return {
            opacity,
            transform:[{ translateX }]
          };

        });

        return (
          <Animated.Image
            key={index}
            source={img}
            resizeMode="cover"
            style={[
              {
                position:"absolute",
                width,
                height:"100%"
              },
              animatedStyle
            ]}
          />
        );
      })}

      <LinearGradient
        colors={["transparent","rgba(0,0,0,0.6)"]}
        style={{
          position:"absolute",
          width:"100%",
          height:"100%"
        }}
      />

      <View
        style={{
          position:"absolute",
          bottom:25,
          alignSelf:"center"
        }}
      >
        <PaginationDots
          progress={progress}
          length={HERO_IMAGES.length}
        />
      </View>

    </View>
  );
}