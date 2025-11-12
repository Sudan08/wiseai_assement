import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../../src/hooks/auth/useAuth";
import ImageUploader from "../../src/components/common/ImageUpload";
import { usePostPropertyMutation } from "../../src/hooks/property/usePostProperty";
import {
  propertyFormSchema,
  PropertyFormSchemaType,
} from "../../src/schemas/property.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type PropertyFormData = {
  title: string;
  description: string;
  price: number; // converted from string when submitting
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number; // converted from string
  bathrooms: number; // converted from string
  area: number; // converted from string
  propertyType: string;
  status: string;
  images: string[]; // added since images exist in Property
};

const propertyTypes = ["house", "apartment", "condo", "townhouse", "land"];
const statusOptions = ["available", "sold", "pending"];

export default function PropertyAdd() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { data } = useAuth();

  const userId = data?.user?.id;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormSchemaType>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      propertyType: "house",
      status: "available",
    },
  });

  const { mutateAsync: postProperty, isPending } = usePostPropertyMutation();

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        area: parseFloat(data.area),
        images: selectedImages,
        userId: userId,
      };
      await postProperty(formattedData);

      reset();
      setSelectedImages([]);
    } catch (error) {
      Alert.alert("Error", "Failed to add property");
    } finally {
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 pt-6 pb-10">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Add New Property
          </Text>
          <Text className="text-base text-gray-600">
            Fill in the details to list your property
          </Text>
        </View>

        {/* Basic Information Section */}
        <View className="mb-8">
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
              <Text className="text-xl font-bold text-gray-900">
                Basic Information
              </Text>
            </View>
          </View>

          {/* Title */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Property Title <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                  placeholder="e.g., Modern 3BR House in Downtown"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.title && (
              <Text className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.title.message}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 min-h-[100px]"
                  placeholder="Describe your property features, amenities, and highlights..."
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          {/* Price */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Price <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <Text className="absolute left-4 top-3.5 text-gray-500 text-base font-medium z-10">
                $
              </Text>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Enter a valid price",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl pl-8 pr-4 py-3.5 text-base text-gray-900"
                    placeholder="250000"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                  />
                )}
              />
            </View>
            {errors.price && (
              <Text className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.price.message}
              </Text>
            )}
          </View>
        </View>

        {/* Location Section */}
        <View className="mb-8">
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
              <Text className="text-xl font-bold text-gray-900">
                Location Details
              </Text>
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Street Address <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                  placeholder="123 Main Street"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.address.message}
              </Text>
            )}
          </View>

          {/* City */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              City <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="city"
              rules={{ required: "City is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                  placeholder="New York"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.city.message}
              </Text>
            )}
          </View>

          {/* State and ZIP */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                State <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="state"
                rules={{ required: "State is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                    placeholder="NY"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                )}
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.state.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                ZIP Code <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="zipCode"
                rules={{ required: "ZIP code is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                    placeholder="10001"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                )}
              />
              {errors.zipCode && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.zipCode.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Property Details Section */}
        <View className="mb-8">
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
              <Text className="text-xl font-bold text-gray-900">
                Property Details
              </Text>
            </View>
          </View>

          {/* Bedrooms, Bathrooms, Area */}
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Bedrooms <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="bedrooms"
                rules={{ required: "Required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 text-center"
                    placeholder="3"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                  />
                )}
              />
              {errors.bedrooms && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.bedrooms.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Bathrooms <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="bathrooms"
                rules={{ required: "Required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 text-center"
                    placeholder="2"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors.bathrooms && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.bathrooms.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Area (sq ft) <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="area"
                rules={{ required: "Required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 text-center"
                    placeholder="1500"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors.area && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.area.message}
                </Text>
              )}
            </View>
          </View>

          {/* Property Type */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Property Type <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="propertyType"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => onChange(type)}
                      className={`px-5 py-3 rounded-xl border-2 ${
                        value === type
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`capitalize text-base font-semibold ${
                          value === type ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Status */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Status <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {statusOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => onChange(status)}
                      className={`px-5 py-3 rounded-xl border-2 ${
                        value === status
                          ? "bg-green-50 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`capitalize text-base font-semibold ${
                          value === status ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        </View>

        {/* Images Section */}
        <View className="mb-8">
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
              <Text className="text-xl font-bold text-gray-900">
                Property Images
              </Text>
            </View>
          </View>

          <ImageUploader
            images={selectedImages}
            setImages={setSelectedImages}
          />
        </View>

        {/* Submit Button */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`rounded-xl py-4 items-center shadow-sm ${
              isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
            style={{
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-lg w-full text-center">
              {isPending ? "Adding Property..." : "Add Property"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
