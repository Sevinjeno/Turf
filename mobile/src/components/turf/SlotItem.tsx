import { TouchableOpacity, Text } from "react-native";
import { Slot } from "../../types/bookings";

type Props = {
  item: Slot;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

export default function SlotItem({
  item,
  isSelected,
  isDisabled,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={{
        flex: 1,
        margin: 5,
        padding: 14,
        borderRadius: 8,
        backgroundColor: isDisabled
          ? "#ccc"
          : isSelected
          ? "#4CAF50"
          : "#fff",
      }}
    >
      <Text style={{ textAlign: "center" }}>{item.time}</Text>
    </TouchableOpacity>
  );
}