import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { getFavoritePrompts } from "../services/prompt";
import { toggleLikePrompt } from "../services/community";

export default function FavoritesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // FETCH DATA FAVORITES
  const fetchFavorites = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson || "{}");

      if (user.id) {
        setUserId(user.id);
        const res = await getFavoritePrompts(user.id);

        if (res.status === "success") {
          setPrompts(res.data);
        }
      }
    } catch (error) {
      console.error("Gagal load favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Panggil setiap kali layar dibuka
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  // HANDLER COPY
  const handleCopy = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: "success",
      text1: "Disalin!",
      text2: "Siap digunakan.",
      position: "bottom",
      visibilityTime: 1500,
    });
  };

  // HANDLER UNLIKE
  const handleUnlike = async (item: any) => {
    if (!userId) return;

    // Optimistic Update
    const oldPrompts = [...prompts];
    setPrompts((prev) => prev.filter((p) => p.id !== item.id));

    try {
      await toggleLikePrompt(userId, item.id);
      Toast.show({ type: "info", text1: "Dihapus dari Favorit" });
    } catch (error: any) {
      setPrompts(oldPrompts);
      Toast.show({
        type: "error",
        text1: "Gagal menghapus",
        text2: "Cek koneksi internet Anda. : " + error.message,
      });
    }
  };

  // RENDER ITEM CARD
  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700`}>
      {/* Header Card */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-row items-center flex-1`}>
          <View
            style={tw`w-8 h-8 bg-blue-600 rounded-full justify-center items-center mr-3`}
          >
            <Text style={tw`text-white font-bold text-xs`}>
              {item.username ? item.username.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <View>
            <Text style={tw`text-white font-bold text-sm`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={tw`text-slate-400 text-[10px]`}>
              By {item.username || "Unknown"}
            </Text>
          </View>
        </View>

        {/* Tombol Unlike */}
        <TouchableOpacity onPress={() => handleUnlike(item)} style={tw`p-2`}>
          <Ionicons name="heart" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Content Preview */}
      <View
        style={tw`bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 mb-3`}
      >
        <Text style={tw`text-slate-300 text-xs leading-5`} numberOfLines={3}>
          {item.content}
        </Text>
      </View>

      {/* Footer Actions */}
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-row gap-2`}>
          <View style={tw`bg-slate-700 px-2 py-1 rounded-md`}>
            <Text style={tw`text-slate-300 text-[10px]`}>
              {item.platform || "AI"}
            </Text>
          </View>
          <View style={tw`bg-slate-700 px-2 py-1 rounded-md`}>
            <Text style={tw`text-slate-300 text-[10px]`}>
              {item.category || "General"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleCopy(item.content)}
          style={tw`flex-row items-center bg-blue-600/20 px-3 py-1.5 rounded-lg border border-blue-500/30`}
        >
          <Ionicons
            name="copy-outline"
            size={14}
            color="#60a5fa"
            style={tw`mr-1`}
          />
          <Text style={tw`text-blue-400 text-xs font-bold`}>Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* HEADER */}
      <View
        style={tw`flex-row items-center p-4 pt-12 bg-slate-800 border-b border-slate-700`}
      >
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold`}>My Favorites</Text>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={prompts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={tw`p-6 pb-20`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchFavorites();
              }}
              tintColor="white"
            />
          }
          ListEmptyComponent={
            <View style={tw`items-center mt-20 opacity-50`}>
              <Ionicons
                name="heart-dislike-outline"
                size={60}
                color="#94a3b8"
              />
              <Text style={tw`text-slate-400 font-bold mt-4 text-lg`}>
                Belum ada Favorit
              </Text>
              <Text style={tw`text-slate-500 text-center text-xs mt-2 px-10`}>
                Jelajahi menu Explore dan berikan {"Love"} pada prompt yang kamu
                suka!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
