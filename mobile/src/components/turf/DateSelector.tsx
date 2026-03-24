import { ScrollView, TouchableOpacity, Text } from "react-native";
import dayjs from "dayjs";

type Props = {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
};

export default function DateSelector({ selectedDate, setSelectedDate }: Props) {
  const dates = Array.from({ length: 7 }).map((_, i) =>
    dayjs().add(i, "day")
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {dates.map((d) => {
        const dateStr = d.format("YYYY-MM-DD");
        const selected = dateStr === selectedDate;

        return (
          <TouchableOpacity
            key={dateStr}
            onPress={() => setSelectedDate(dateStr)}
            style={{
              padding: 12,
              margin: 5,
              borderRadius: 10,
              backgroundColor: selected ? "#4CAF50" : "#eee",
            }}
          >
            <Text>{d.format("DD MMM")}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}