import { View, Text, Button } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg">No user data found.</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-2xl font-semibold mb-4">Profile</Text>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-1">
            Name: <Text className="font-normal">{user.name}</Text>
          </Text>
          <Text className="text-lg font-medium mb-1">
            Email: <Text className="font-normal">{user.email}</Text>
          </Text>
          <Text className="text-lg font-medium mb-1">
            Role: <Text className="font-normal">{user.role}</Text>
          </Text>
          <Text className="text-lg font-medium mb-1">
            Created At:{" "}
            <Text className="font-normal">
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        </View>
        <Button title="Logout" onPress={logout} color="#ef4444" />
      </View>
    </>
  );
}
