import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

interface PromptCardProps {
  data: any;
  onDelete?: () => void;
}

export default function PromptCard({ data, onDelete }: PromptCardProps) {
  const router = useRouter();

  const goToDetail = () => {
    router.push({
      pathname: "/prompt-detail",
      params: {
        title: data.title,
        description: data.description || "",
        content: data.content,
        example_output: data.example_output || "",
        category: data.category,
        platform: data.platform,
        creator_name: data.creator_name || "Me",
        created_at: data.created_at,
      },
    });
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(data.content);
    Toast.show({
      type: "success",
      text1: "Berhasil Disalin!",
      text2: "Prompt siap ditempel ke AI favoritmu.",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: "/edit-prompt",
      params: {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        example_output: data.example_output,
        category: data.category,
        platform: data.platform,
        is_public: data.is_public ? "1" : "0",
        is_local: data.is_local ? "true" : "false",
        collection_id: data.collection_id || null,
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={goToDetail}
      activeOpacity={0.9}
      style={tw`bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700 shadow-sm`}
    >
      {/* Header Kartu */}
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <View style={tw`flex-row gap-2`}>
          <View style={tw`bg-blue-900 px-2 py-1 rounded text-xs`}>
            <Text style={tw`text-blue-200 text-xs font-bold`}>
              {data.platform}
            </Text>
          </View>
          <View style={tw`bg-slate-700 px-2 py-1 rounded text-xs`}>
            <Text style={tw`text-slate-300 text-xs`}>{data.category}</Text>
          </View>
        </View>
        {data.is_public === 1 && (
          <Ionicons name="earth" size={16} color="#94a3b8" />
        )}
      </View>

      <Text style={tw`text-white text-lg font-bold mb-1`}>{data.title}</Text>
      <Text style={tw`text-slate-400 text-sm mb-4`} numberOfLines={2}>
        {data.content}
      </Text>

      {/* Action Buttons: Copy, Edit, Delete */}
      <View
        style={tw`flex-row justify-between border-t border-slate-700 pt-3 mt-1`}
      >
        {/* Tombol Copy (Kiri) */}
        <TouchableOpacity
          onPress={copyToClipboard}
          style={tw`flex-row items-center gap-1 bg-slate-700 px-3 py-2 rounded-lg`}
        >
          <Ionicons name="copy-outline" size={16} color="white" />
          <Text style={tw`text-white text-xs font-bold`}>Copy</Text>
        </TouchableOpacity>

        <View style={tw`flex-row gap-2`}>
          {/* Tombol Edit (Tengah) - BARU */}
          <TouchableOpacity
            onPress={handleEdit}
            style={tw`p-2 bg-blue-500/10 rounded-lg`}
          >
            <Ionicons name="create-outline" size={18} color="#3b82f6" />
          </TouchableOpacity>

          {/* Tombol Delete (Kanan) */}
          <TouchableOpacity
            onPress={onDelete}
            style={tw`p-2 bg-red-500/10 rounded-lg`}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}