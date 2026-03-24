import { View, Text } from "react-native";
import { PricePreview as PriceType } from "../../types/bookings";

type Props = {
  price: PriceType | null;
  loading: boolean;
};

export default function PricePreview({ price, loading }: Props) {
  if (loading) return <Text>Calculating...</Text>;

  return (
    <View>
      <Text>Total: ₹{price?.total ?? 0}</Text>
    </View>
  );
}