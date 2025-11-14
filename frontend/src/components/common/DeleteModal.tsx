import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  propertyTitle?: string;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  visible,
  onClose,
  onConfirm,
  isDeleting = false,
  propertyTitle = "this property",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
          {/* Icon */}
          <View className="items-center mb-4">
            <View className="bg-red-100 rounded-full p-3">
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-center text-gray-900 mb-2">
            Delete Property?
          </Text>

          {/* Description */}
          <Text className="text-center text-gray-600 mb-6">
            Are you sure you want to delete "{propertyTitle}"? This action
            cannot be undone.
          </Text>

          {/* Buttons */}
          <View className="space-y-3 gap-3 q">
            <TouchableOpacity
              className={`bg-red-600 rounded-xl py-3 items-center ${
                isDeleting ? "opacity-50" : ""
              }`}
              onPress={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Yes, Delete
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 rounded-xl py-3 items-center"
              onPress={onClose}
              disabled={isDeleting}
            >
              <Text className="text-gray-800 font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
