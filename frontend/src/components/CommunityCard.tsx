import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface CommunityCardProps {
  item: any;
  onPress: () => void;
  onLike: () => void;
  onCopy: () => void;
}

export default function CommunityCard({
  item,
  onPress,
  onLike,
  onCopy,
}: CommunityCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={tw`bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700 shadow-sm`}
    >
      {/* Header: Avatar & Nama */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`flex-row items-center gap-2`}>
          <View
            style={tw`w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full justify-center items-center bg-blue-600`}
          >
            <Text style={tw`text-white font-bold text-xs`}>
              {item.creator_name
                ? item.creator_name.charAt(0).toUpperCase()
                : "?"}
            </Text>
          </View>
          <View>
            <Text style={tw`text-slate-200 text-xs font-bold`}>
              {item.creator_name}
            </Text>
            <Text style={tw`text-slate-500 text-[10px]`}>{item.platform}</Text>
          </View>
        </View>

        {/* Category Chip */}
        <View style={tw`bg-slate-700 px-2 py-1 rounded`}>
          <Text style={tw`text-slate-300 text-[10px]`}>{item.category}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={tw`text-white text-lg font-bold mb-1`}>{item.title}</Text>
      <Text style={tw`text-slate-400 text-sm mb-4 leading-5`} numberOfLines={2}>
        {item.description ? item.description : item.content}
      </Text>

      {/* Footer: Like & Action */}
      <View
        style={tw`flex-row justify-between items-center border-t border-slate-700 pt-3`}
      >
        {/* Tombol LIKE */}
        <TouchableOpacity
          onPress={onLike}
          style={tw`flex-row items-center gap-1 bg-slate-700/50 px-3 py-1.5 rounded-full`}
        >
          <Ionicons
            name={item.is_liked ? "heart" : "heart-outline"}
            size={18}
            color={item.is_liked ? "#ef4444" : "#94a3b8"}
          />
          <Text
            style={tw`${
              item.is_liked ? "text-red-400" : "text-slate-400"
            } text-xs font-bold`}
          >
            {item.total_likes}
          </Text>
        </TouchableOpacity>

        {/* Tombol Copy */}
        <TouchableOpacity onPress={onCopy} style={tw`p-2`}>
          <Ionicons name="copy-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
