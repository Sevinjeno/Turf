import { View, Text } from "react-native";
import {BookingPreviewResponse} from "../../types/bookings"


interface pricePreviewProps {
    price?:BookingPreviewResponse|null;
    loading:boolean
}

export default function PricePreview({ price, loading }:pricePreviewProps) {
  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Calculating price...</Text>
      </View>
    );
  }

  if (!price) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Select slot & court to see price</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#e8fff0",
      }}
    >
      <Text style={{ marginBottom: 6 }}>
        Base Price: ₹{price.basePrice}
      </Text>
      <Text style={{ marginBottom: 6 }}>
        Platform Fee: ₹{price.platformFee}
      </Text>

      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        Total: ₹{price.totalAmount}
      </Text>
    </View>
  );
}