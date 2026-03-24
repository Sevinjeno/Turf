import { View, Text, TouchableOpacity, FlatList } from "react-native";
import dayjs from "dayjs";

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const dates = Array.from({ length: 10 }).map((_, i) =>
    dayjs().add(i, "day")
  );

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={dates}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => {
        const isSelected =
          selectedDate === item.format("YYYY-MM-DD");

        return (
          <TouchableOpacity
            onPress={() =>
              setSelectedDate(item.format("YYYY-MM-DD"))
            }
            style={{
              margin: 6,
              padding: 12,
              borderRadius: 12,
              backgroundColor: isSelected ? "#111" : "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ color: isSelected ? "#fff" : "#000" }}>
              {item.format("DD")}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {item.format("ddd")}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}