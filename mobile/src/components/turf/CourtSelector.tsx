import { View, Text, TouchableOpacity } from "react-native";

type Court = {
  id: string;
  name: string;
};

type CourtSelectorProps = {
  courts: Court[];
  selectedCourt: string|null;
  setSelectedCourt: (id: string) => void;
};


export default function CourtSelector({
  courts,
  selectedCourt,
  setSelectedCourt,
}:CourtSelectorProps) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Select Court
      </Text>

      <View style={{ flexDirection: "row" }}>
        {courts.map((court:Court) => (
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