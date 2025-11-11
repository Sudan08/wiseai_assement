import React from "react";
import { View } from "react-native";

const SkeletonBox = ({ className }: { className?: string }) => (
  <View className={`bg-gray-200 rounded ${className}`} />
);

const PropertyCardSkeleton = () => {
  return (
    <View className="bg-white rounded-2xl shadow-md my-4 mx-5 overflow-hidden">
      <SkeletonBox className="w-full h-44 rounded-t-2xl" />
      <View className="p-4">
        <SkeletonBox className="h-5 w-3/5 mb-2" />
        <SkeletonBox className="h-4 w-4/5 mb-3" />
        <SkeletonBox className="h-4 w-2/5 mb-4" />
        <View className="flex-row space-x-5 mb-2">
          <SkeletonBox className="h-4 w-12" />
          <SkeletonBox className="h-4 w-12" />
          <SkeletonBox className="h-4 w-16" />
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-12" />
        </View>
      </View>
    </View>
  );
};

export default PropertyCardSkeleton;
