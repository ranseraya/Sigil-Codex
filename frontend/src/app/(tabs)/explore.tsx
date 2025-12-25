import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { getGlobalPrompts, toggleLikePrompt } from "../../services/community";
import CommunityCard from "@/src/components/CommunityCard";

export default function ExploreScreen() {
  const router = useRouter();

  // Data State
  const [prompts, setPrompts] = useState<any[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // Filter State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, popular, oldest
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = [
    "All",
    "Writing",
    "Coding",
    "Art",
    "Business",
    "Education",
  ];

  // 1. Fetch Data (Panggil API)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson || "{}");
      const network = await NetInfo.fetch();
      const uid = user.id || 0;
      setCurrentUserId(uid);

      if (user.id === 0 || !network.isConnected) {
        setLoading(false);
        setPrompts([]);
        return;
      }

      // Panggil API
      const result = await getGlobalPrompts(uid, sortBy);

      if (result.status === "success") {
        setPrompts(result.data);
        applyFilters(result.data, search, selectedCategory);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // 2. Logic Filter Lokal (Search & Category)
  const applyFilters = (data: any[], searchText: string, category: string) => {
    let result = data;

    if (category !== "All") {
      result = result.filter((item: any) => item.category === category);
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (item: any) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          (item.description &&
            item.description.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredPrompts(result);
  };

  // 3. Handle Like
  const handleLike = async (promptId: number) => {
    if (currentUserId === 0) return;

    // A. Optimistic Update
    const updatedPrompts = prompts.map((p) => {
      if (p.id === promptId) {
        const newLikedState = !p.is_liked;
        return {
          ...p,
          is_liked: newLikedState,
          total_likes: newLikedState ? p.total_likes + 1 : p.total_likes - 1,
        };
      }
      return p;
    });

    setPrompts(updatedPrompts);
    applyFilters(updatedPrompts, search, selectedCategory);

    // B. Kirim ke Server
    try {
      await toggleLikePrompt(currentUserId, promptId);
    } catch (error: any) {
      console.error("Gagal like : " + error.message);
      fetchData();
    }
  };

  // 4. Handle Copy
  const handleCopy = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: "success",
      text1: "Berhasil Disalin! 📋",
      text2: "Prompt siap ditempel di AI favoritmu.",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const goToDetail = (item: any) => {
    router.push({
      pathname: "/prompt-detail",
      params: {
        title: item.title,
        description: item.description || "",
        content: item.content,
        example_output: item.example_output || "",
        category: item.category,
        platform: item.platform,
        creator_name: item.creator_name,
        created_at: item.created_at,
      },
    });
  };

  // RENDER ITEM
  const renderItem = ({ item }: { item: any }) => (
    <CommunityCard
      item={item}
      onPress={() => goToDetail(item)}
      onLike={() => handleLike(item.id)}
      onCopy={() => handleCopy(item.content)}
    />
  );

  return (
    <View style={tw`flex-1 bg-slate-900 pt-12`}>
      {/* Header Area */}
      <View style={tw`px-6 mb-4`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-white text-2xl font-bold`}>Explore</Text>
          {/* Tombol Filter/Sort */}
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={tw`bg-slate-800 p-2 rounded-lg border border-slate-700`}
          >
            <Ionicons name="options-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View
          style={tw`bg-slate-800 flex-row items-center px-4 py-3 rounded-xl border border-slate-700`}
        >
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={tw`flex-1 text-white ml-3`}
            placeholder="Cari prompt..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              applyFilters(prompts, text, selectedCategory);
            }}
          />
        </View>
      </View>

      {/* Categories Horizontal */}
      <View style={tw`mb-2`}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={tw`px-6 gap-2`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(item);
                applyFilters(prompts, search, item);
              }}
              style={tw`px-4 py-2 rounded-full border ${
                selectedCategory === item
                  ? "bg-blue-600 border-blue-600"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Text style={tw`text-white text-xs font-bold`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main List */}
      <FlatList
        data={filteredPrompts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={tw`px-6 pb-24 pt-4`}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor="white"
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={tw`items-center mt-10`}>
              <Text style={tw`text-slate-500`}>Tidak ada data.</Text>
            </View>
          ) : null
        }
      />

      {/* MODAL SORTING */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
          style={tw`flex-1 justify-end bg-black/60`}
        >
          <View
            style={tw`bg-slate-800 p-6 rounded-t-3xl border-t border-slate-700`}
          >
            <Text style={tw`text-white font-bold text-lg mb-4`}>
              Urutkan Berdasarkan
            </Text>

            <View style={tw`gap-3`}>
              <TouchableOpacity
                onPress={() => {
                  setSortBy("popular");
                  setShowFilterModal(false);
                }}
                style={tw`flex-row items-center justify-between p-4 rounded-xl bg-slate-700 ${
                  sortBy === "popular" ? "border border-blue-500" : ""
                }`}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <Ionicons name="flame" size={20} color="#f59e0b" />
                  <Text style={tw`text-white font-semibold`}>
                    Terpopuler (Likes)
                  </Text>
                </View>
                {sortBy === "popular" && (
                  <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSortBy("newest");
                  setShowFilterModal(false);
                }}
                style={tw`flex-row items-center justify-between p-4 rounded-xl bg-slate-700 ${
                  sortBy === "newest" ? "border border-blue-500" : ""
                }`}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <Ionicons name="time" size={20} color="#3b82f6" />
                  <Text style={tw`text-white font-semibold`}>Terbaru</Text>
                </View>
                {sortBy === "newest" && (
                  <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSortBy("oldest");
                  setShowFilterModal(false);
                }}
                style={tw`flex-row items-center justify-between p-4 rounded-xl bg-slate-700 ${
                  sortBy === "oldest" ? "border border-blue-500" : ""
                }`}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <Ionicons
                    name="hourglass-outline"
                    size={20}
                    color="#94a3b8"
                  />
                  <Text style={tw`text-white font-semibold`}>Terlama</Text>
                </View>
                {sortBy === "oldest" && (
                  <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={tw`mt-6 items-center p-2`}
            >
              <Text style={tw`text-slate-400 font-bold`}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
