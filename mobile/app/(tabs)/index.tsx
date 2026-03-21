import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import TurfCard from "../../src/components/TurfCard";
import { turfs } from "../../src/data/turf";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={turfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TurfCard
            turf={item}
            onPress={() =>
              router.push({
                pathname: "/turf/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});