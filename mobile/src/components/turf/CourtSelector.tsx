import { View, Text, TouchableOpacity } from "react-native";

export default function CourtSelector({
  courts,
  selectedCourt,
  setSelectedCourt,
}) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Select Court
      </Text>

      <View style={{ flexDirection: "row" }}>
        {courts.map((court) => (
          <TouchableOpacity
            key={court.id}
            onPress={() => setSelectedCourt(court.id)}
            style={{
              padding: 10,
              marginRight: 10,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor:
                selectedCourt === court.id ? "#111" : "#fff",
            }}
          >
            <Text
              style={{
                color:
                  selectedCourt === court.id ? "#fff" : "#000",
              }}
            >
              {court.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}