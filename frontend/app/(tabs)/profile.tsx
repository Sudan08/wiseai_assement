import React, { useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useAuth } from "../../src/hooks/auth/useAuth";
import { useGetMyProperty } from "../../src/hooks/property/useGetMyProperty";
import MyPropertyCard from "../../src/components/common/MyPropertyCard";
import { useDeletePropertyMutation } from "../../src/hooks/property/useDeleteProperty";
import { Property } from "../../src/types";
import { DeleteConfirmationModal } from "../../src/components/common/DeleteModal";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { data, logout } = useAuth();
  const { data: prop, isLoading } = useGetMyProperty();
  const myProperty = prop?.data;
  const user = data?.user;

  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const deleteMutation = useDeletePropertyMutation();

  // Delete action
  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedProperty) {
      await deleteMutation.mutateAsync({ propertyId: selectedProperty.id });
      setModalVisible(false);
      setSelectedProperty(null);
      // Success/error handling can be added here (snackbar, toast etc.)
    }
  };

  // Hide modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProperty(null);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg">No user data found.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="bg-gray-50 flex-1">
        <View className="flex-1 items-center justify-start pt-10 pb-4 px-6">
          <View className="bg-white rounded-2xl shadow-md w-full p-6 mb-6">
            <Text className="text-2xl font-bold mb-6 text-center">Profile</Text>
            <View className="mb-3">
              <Text className="text-base font-semibold mb-2">
                Name: <Text className="font-normal">{user.name}</Text>
              </Text>
              <Text className="text-base font-semibold mb-2">
                Email: <Text className="font-normal">{user.email}</Text>
              </Text>
              <Text className="text-base font-semibold mb-2">
                Role: <Text className="font-normal">{user.role}</Text>
              </Text>
              <Text className="text-base font-semibold mb-2">
                Created At:{" "}
                <Text className="font-normal">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </Text>
            </View>
            <Button title="Logout" onPress={logout} color="#ef4444" />
          </View>

          <View className="w-full">
            <Text className="text-xl font-semibold mb-4">My Properties</Text>
            {isLoading ? (
              <Text className="text-base text-gray-500 my-8 text-center">
                Loading properties...
              </Text>
            ) : (
              <>
                {!myProperty?.length && (
                  <Text className="text-base text-gray-400 my-8 text-center">
                    No properties found.
                  </Text>
                )}
                {!!myProperty?.length &&
                  myProperty.map((property, idx) => (
                    <MyPropertyCard
                      key={property.id || idx}
                      property={property}
                      onView={() => {
                        router.push(`/(tabs)/${property.id}`);
                      }}
                      onEdit={() => {
                        router.push(
                          `/(tabs)/propertyEdit?propertyId=${property.id}`
                        );
                      }}
                      onDeletePress={() => handleDeleteProperty(property)}
                    />
                  ))}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={isModalVisible}
        propertyTitle={selectedProperty?.title}
        isDeleting={deleteMutation.isPending}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
