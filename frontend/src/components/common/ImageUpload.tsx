import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import { useImageUploadMutation } from "../../hooks/useImageUpload";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../../libs/client";

type ImageUploaderProps = {
  images: string[];
  setImages: (urls: string[]) => void;
  maxImages?: number;
};

export default function ImageUploader({
  images,
  setImages,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadMutation = useImageUploadMutation();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  const uploadImageToServer = async (uri: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: uri,
        name: filename,
        type: type,
      } as any);

      const response = await uploadMutation.mutateAsync(formData);
      return response.url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handlePickImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images.`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets) {
        setIsUploading(true);
        const newUrls: string[] = [];

        for (const asset of result.assets) {
          if (images.length + newUrls.length >= maxImages) {
            Alert.alert(
              "Limit Reached",
              `Maximum ${maxImages} images allowed.`
            );
            break;
          }

          const url = await uploadImageToServer(asset.uri);
          if (url) {
            newUrls.push(API_URL + url);
          }
        }

        if (newUrls.length > 0) {
          setImages([...images, ...newUrls]);
        }
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images");
      setIsUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images.`
      );
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera permissions to take photos."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets) {
        setIsUploading(true);
        const url = await uploadImageToServer(result.assets[0].uri);

        if (url) {
          setImages([...images, url]);
        }
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    Alert.alert("Add Images", "Choose an option", [
      { text: "Take Photo", onPress: handleTakePhoto },
      { text: "Choose from Gallery", onPress: handlePickImages },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setImages(images.filter((url) => url !== urlToRemove));
        },
      },
    ]);
  };

  return (
    <View>
      {/* Upload Button */}
      <TouchableOpacity
        onPress={handleImageUpload}
        disabled={isUploading || images.length >= maxImages}
        className={`bg-white border-2 border-dashed rounded-xl p-10 items-center justify-center ${
          isUploading || images.length >= maxImages
            ? "border-gray-200 opacity-50"
            : "border-gray-300"
        }`}
      >
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4">
            {isUploading ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : (
              <Ionicons name="cloud-upload-outline" size={36} color="#3B82F6" />
            )}
          </View>
          <Text className="text-gray-900 font-bold text-base mb-2">
            {isUploading ? "Uploading..." : "Upload Property Images"}
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            {images.length >= maxImages
              ? `Maximum ${maxImages} images reached`
              : "Tap to select photos from gallery or camera"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Image Counter */}
      {images.length > 0 && (
        <View className="mt-4 bg-blue-50 px-4 py-3 rounded-lg">
          <Text className="text-blue-700 text-sm font-medium">
            ✓ {images.length} image(s) uploaded{" "}
            {images.length < maxImages &&
              `(${maxImages - images.length} remaining)`}
          </Text>
        </View>
      )}

      {/* Display Uploaded Images */}
      {images.length > 0 && (
        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Uploaded Images
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {images.map((url, index) => (
              <View
                key={`${url}-${index}`}
                className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  source={{ uri: url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
