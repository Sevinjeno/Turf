import { View } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";

export default function PaginationDots({ progress, length }) {

  return (
    <View style={{ flexDirection:"row", gap:8 }}>

      {Array.from({ length }).map((_, i) => {

        const animatedStyle = useAnimatedStyle(() => {

          const opacity = interpolate(
            progress.value,
            [i - 1, i, i + 1],
            [0.3, 1, 0.3]
          );

          const scale = interpolate(
            progress.value,
            [i - 1, i, i + 1],
            [0.8, 1.2, 0.8]
          );

          return {
            opacity,
            transform: [{ scale }]
          };

        });

        return (
          <Animated.View
            key={i}
            style={{
              width:8,
              height:8,
              borderRadius:4,
              backgroundColor:"#fff",
              ...animatedStyle
            }}
          />
        );
      })}

    </View>
  );
}