import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/store/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.name?.charAt(0) || "U"}
        </Text>
      </View>

      {/* User Info */}
      <Text style={styles.name}>{user?.name || "User"}</Text>
      <Text style={styles.info}>{user?.email || user?.phone}</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  info: {
    color: "#666",
    marginBottom: 30,
  },

  logoutBtn: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});