import { FlatList, TouchableOpacity, Text } from "react-native";
import { Court } from "../../types/bookings";

type Props = {
  courts: Court[];
  selectedCourt: string | null;
  setSelectedCourt: (id: string) => void;
};

export default function CourtSelector({
  courts,
  selectedCourt,
  setSelectedCourt,
}: Props) {
  return (
    <FlatList
      horizontal
      data={courts}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => setSelectedCourt(item.id)}
          style={{
            padding: 10,
            margin: 6,
            borderRadius: 10,
            backgroundColor:
              selectedCourt === item.id ? "#4CAF50" : "#eee",
          }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}