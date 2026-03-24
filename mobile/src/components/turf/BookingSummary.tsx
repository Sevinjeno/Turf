import { View, Text, Button } from "react-native";
import { SelectedSlot } from "../../types/bookings";

type Props = {
  selectedSlot: SelectedSlot;
  selectedCourt: string | null;
  onBook: () => void;
};

export default function BookingSummary({
  selectedSlot,
  selectedCourt,
  onBook,
}: Props) {
  return (
    <View>
      <Text>
        {selectedSlot.start?.time} - {selectedSlot.end?.time}
      </Text>
      <Text>Court: {selectedCourt}</Text>
      <Button title="Book Now" onPress={onBook} />
    </View>
  );
}