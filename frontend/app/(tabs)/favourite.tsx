import { useRouter } from "expo-router";
import { View, Text, FlatList } from "react-native";
import PropertyCard from "../../src/components/common/PropertyCard";
import { useFavourite } from "../../src/hooks/favourite/useFavourite";
import { Property } from "../../src/types";

export default function Favourite() {
  const router = useRouter();
  const { favourites } = useFavourite();

  const properties = favourites.map((fav) => fav.property);
  const renderPropertyCard = ({
    item,
    index,
  }: {
    item: Property;
    index: number;
  }) => (
    <View
      className={`
      rounded-xl overflow-hidden bg-white 
      shadow-lg shadow-black/10 
      border border-gray-100
      ${index === 0 ? "mt-0" : "mt-4"}
      ${index === properties.length - 1 ? "mb-0" : "mb-4"}
      mx-1
    `}
    >
      <PropertyCard
        property={item}
        onPress={() => {
          router.push(`/(tabs)/${item.id}`);
        }}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-10 py-20">
      <View className="bg-gray-50 rounded-2xl p-8 items-center">
        <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
          No Favourites Yet
        </Text>
        <Text className="text-base text-gray-600 text-center leading-6 mb-6">
          Start exploring amazing properties and add them to your favourites
          list!
        </Text>
        <View className="bg-blue-500 rounded-lg px-6 py-3">
          <Text className="text-white font-semibold text-base">
            Browse Properties
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white pt-4 pb-4 px-6 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          My Favourites
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600 font-medium">
            {favourites.length}{" "}
            {favourites.length === 1 ? "property" : "properties"} saved
          </Text>
          {favourites.length > 0 && (
            <View className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="text-blue-800 text-sm font-medium">
                {favourites.length} items
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Properties List */}
      <FlatList
        data={properties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 24,
        }}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          favourites.length > 0 ? (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-700">
                Your Saved Properties
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
