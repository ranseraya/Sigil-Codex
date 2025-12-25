import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Share } from "react-native";
import tw from "twrnc";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

export default function PromptDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    title,
    description,
    content,
    example_output,
    category,
    platform,
    creator_name,
  } = params;

  // FITUR COPY
  const handleCopy = async () => {
    await Clipboard.setStringAsync(content as string);

    Toast.show({
      type: "success",
      text1: "Berhasil Disalin! 📋",
      text2: "Prompt siap ditempel di AI favoritmu.",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  // FITUR SHARE
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${content}\n\nShared via Sigil Codex`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* HEADER */}
      <View
        style={tw`flex-row items-center justify-between p-4 pt-12 bg-slate-800 border-b border-slate-700 shadow-md`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 bg-slate-700/50 rounded-full`}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text
          style={tw`text-white text-lg font-bold flex-1 text-center`}
          numberOfLines={1}
        >
          Detail Prompt
        </Text>

        <TouchableOpacity
          onPress={handleShare}
          style={tw`p-2 bg-slate-700/50 rounded-full`}
        >
          <Ionicons name="share-social-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24`}>
        {/* JUDUL & META INFO */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row gap-2 mb-3`}>
            <View
              style={tw`bg-blue-600/20 px-3 py-1 rounded-lg border border-blue-500/30`}
            >
              <Text style={tw`text-blue-400 text-xs font-bold uppercase`}>
                {platform}
              </Text>
            </View>
            <View
              style={tw`bg-purple-600/20 px-3 py-1 rounded-lg border border-purple-500/30`}
            >
              <Text style={tw`text-purple-400 text-xs font-bold uppercase`}>
                {category}
              </Text>
            </View>
          </View>

          <Text style={tw`text-white text-xl font-black mb-2 leading-8`}>
            {title}
          </Text>

          {creator_name && (
            <View style={tw`flex-row items-center gap-2 mb-2`}>
              <Ionicons
                name="person-circle-outline"
                size={18}
                color="#94a3b8"
              />
              <Text style={tw`text-slate-400 text-sm`}>
                Created by {creator_name}
              </Text>
            </View>
          )}

          {description ? (
            <Text style={tw`text-slate-300 text-sm leading-6 mt-2 italic`}>
              {description}
            </Text>
          ) : null}
        </View>

        {/* AREA UTAMA: PROMPT CONTENT */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Text
              style={tw`text-slate-500 font-bold text-xs uppercase tracking-widest`}
            >
              PROMPT
            </Text>
            <TouchableOpacity onPress={handleCopy}>
              <Text style={tw`text-blue-400 text-xs font-bold`}>
                Salin Teks
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={tw`bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm relative`}
          >
            <Text style={tw`text-white text-xs leading-6`}>{content}</Text>

            {/* Watermark Icon Decoration */}
            <Ionicons
              icon="quote"
              size={40}
              color="#ffffff"
              style={tw`absolute bottom-4 right-4 opacity-5`}
            />
          </View>
        </View>

        {/* EXAMPLE OUTPUT */}
        {example_output ? (
          <View style={tw`mb-6`}>
            <Text
              style={tw`text-slate-500 font-bold text-xs uppercase tracking-widest mb-2`}
            >
              EXAMPLE OUTPUT
            </Text>
            <View
              style={tw`bg-slate-900 p-4 rounded-xl border border-slate-700 border-dashed`}
            >
              <Text style={tw`text-slate-400 text-xs leading-6 italic`}>
                {example_output}
              </Text>
            </View>
          </View>
        ) : null}

        {/* INFO TAMBAHAN */}
        <View style={tw`items-center mt-4`}>
          <Text style={tw`text-slate-600 text-[10px]`}>
            Prompt ini dilindungi oleh hak cipta komunitas Sigil Codex.
          </Text>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON (COPY) */}
      <View style={tw`absolute bottom-8 left-6 right-6`}>
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.8}
          style={tw`bg-blue-600 py-4 rounded-2xl shadow-xl flex-row justify-center items-center gap-2 border border-blue-400/30`}
        >
          <Ionicons name="copy" size={20} color="white" />
          <Text style={tw`text-white font-bold text-lg`}>Salin Prompt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
