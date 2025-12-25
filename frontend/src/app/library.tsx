import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
  Platform,
} from "react-native";
import tw from "twrnc";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { getMyPrompts, deletePrompt } from "../services/prompt";
import { getLocalPrompts, deleteLocalPrompt } from "../services/localPrompt";
import {
  getCollections,
  createCollection,
  deleteCollection,
} from "../services/collections";
import PromptCard from "../components/PromptCard";

export default function LibraryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // STATE DATA
  const [prompts, setPrompts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // STATE COLLECTIONS (FOLDER)
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(
    null
  );
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // STATE FILTER & SORT
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson || "{}");

      // Ambil Data OFFLINE
      let allPrompts: any[] = (await getLocalPrompts()) || [];

      // Cek Koneksi Internet
      const network = await NetInfo.fetch();

      // Ambil Data ONLINE
      if (user.id && user.id !== 0 && network.isConnected) {
        try {
          const cloudRes = await getMyPrompts(user.id);
          if (cloudRes.status === "success") {
            const onlineData = cloudRes.data.map((item: any) => ({
              ...item,
              is_local: false,
            }));
            allPrompts = [...allPrompts, ...onlineData];
          }

          const collRes = await getCollections(user.id);
          if (collRes.status === "success") {
            setCollections(collRes.data);
          }
        } catch (e: any) {
          console.log("Gagal sync cloud: " + e.message);
        }
      }

      setPrompts(allPrompts);
    } catch (error) {
      console.error("Error fetchData:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // FILTER OTOMATIS
  useEffect(() => {
    let result = [...prompts];

    if (selectedCollection !== null) {
      result = result.filter(
        (item) => item.collection_id === selectedCollection
      );
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          (item.content && item.content.toLowerCase().includes(lower))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOrder === "a-z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredData(result);
  }, [prompts, selectedCollection, search, selectedCategory, sortOrder]);

  // ACTION HANDLERS
  const executeDeleteFolder = async (folderId: number) => {
    try {
      await deleteCollection(folderId);
      Toast.show({ type: "success", text1: "Folder berhasil dihapus" });

      if (selectedCollection === folderId) setSelectedCollection(null);
      await fetchData();
    } catch (error: any) {
      console.log("ERROR DELETE:" + error);
      console.log("Response:" + error.response);
      if (Platform.OS === "web")
        alert("Gagal menghapus folder. : " + error.message);
      else Alert.alert("Gagal", "Tidak bisa menghapus folder.");
    }
  };

  // HANDLER HAPUS FOLDER
  const handleDeleteFolder = (folder: any) => {
    const message = `Yakin ingin menghapus folder "${folder.name}"?\n\nTenang saja, prompt di dalamnya TIDAK akan hilang (hanya dipindahkan ke kategori "No Folder").`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        (async () => {
          await executeDeleteFolder(folder.id);
        })();
      }
    } else {
      Alert.alert("Hapus Folder", message, [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => executeDeleteFolder(folder.id),
        },
      ]);
    }
  };

  // HANDLER HAPUS PROMPT
  const handleDelete = async (item: any) => {
    const message = "Yakin ingin menghapus prompt ini selamanya?";

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        if (item.is_local) await deleteLocalPrompt(item.id);
        else await deletePrompt(item.id);
        fetchData();
      }
    } else {
      Alert.alert("Hapus Prompt", message, [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            if (item.is_local) await deleteLocalPrompt(item.id);
            else await deletePrompt(item.id);
            fetchData();
          },
        },
      ]);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const userJson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userJson || "{}");
    if (!user.id) {
      Alert.alert("Error", "Login diperlukan.");
      return;
    }

    try {
      await createCollection(user.id, newFolderName);
      setNewFolderName("");
      setShowAddFolder(false);
      fetchData();
    } catch (e: any) {
      Alert.alert("Gagal", "Tidak dapat membuat folder. : ", e.message);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* HEADER */}
      <View
        style={tw`flex-row items-center p-4 pt-12 bg-slate-800 border-b border-slate-700`}
      >
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold flex-1`}>My Library</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Ionicons name="filter" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={tw`px-6 pt-4 mb-4`}>
        <TextInput
          style={tw`bg-slate-800 text-white p-3 rounded-xl border border-slate-700`}
          placeholder="Cari prompt, judul..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* TABS FOLDER */}
      <View style={tw`mb-2 pl-6`}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { id: null, name: "All Prompts" },
            ...collections,
            { id: "ADD", name: "+" },
          ]}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={tw`pr-6`}
          renderItem={({ item }) => {
            if (item.id === "ADD") {
              return (
                <TouchableOpacity
                  onPress={() => setShowAddFolder(true)}
                  style={tw`bg-slate-800 border border-slate-600 px-4 py-2 rounded-full border-dashed ml-2`}
                >
                  <Text style={tw`text-slate-400 font-bold text-xs`}>
                    + Folder
                  </Text>
                </TouchableOpacity>
              );
            }

            const isActive = selectedCollection === item.id;
            const isAllPrompts = item.id === null;

            return (
              <TouchableOpacity
                onPress={() => setSelectedCollection(item.id)}
                onLongPress={() => !isAllPrompts && handleDeleteFolder(item)}
                delayLongPress={500}
                style={tw`px-4 py-2 rounded-full mr-2 border ${
                  isActive
                    ? "bg-blue-600 border-blue-600"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* LIST UTAMA */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`px-6 pb-24 pt-2`}
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
              <Ionicons name="folder-open-outline" size={40} color="#475569" />
              <Text style={tw`text-slate-500 text-center mt-4`}>
                Folder ini kosong.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View>
            <View
              style={tw`flex-row justify-end px-2 mb-[-10px] z-10 relative top-3 right-2`}
            >
              {item.is_local ? (
                <View
                  style={tw`bg-orange-500 px-2 py-0.5 rounded-full flex-row items-center shadow-sm`}
                >
                  <Text style={tw`text-white text-[8px] font-bold`}>
                    OFFLINE
                  </Text>
                </View>
              ) : (
                <View
                  style={tw`bg-blue-600 px-2 py-0.5 rounded-full flex-row items-center shadow-sm`}
                >
                  <Text style={tw`text-white text-[8px] font-bold`}>CLOUD</Text>
                </View>
              )}
            </View>
            <PromptCard data={item} onDelete={() => handleDelete(item)} />
          </View>
        )}
      />

      {/* FAB ADD BUTTON */}
      <TouchableOpacity
        onPress={() => {
          if (selectedCollection !== null) {
            router.push({
              pathname: "/create-prompt",
              params: { initialCollectionId: selectedCollection },
            });
          } else {
            router.push("/create-prompt");
          }
        }}
        style={tw`absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg border border-white/10`}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* MODAL ADD FOLDER */}
      <Modal visible={showAddFolder} transparent animationType="fade">
        <View style={tw`flex-1 bg-black/70 justify-center items-center px-6`}>
          <View
            style={tw`bg-slate-800 w-full p-6 rounded-2xl border border-slate-700`}
          >
            <Text style={tw`text-white font-bold text-lg mb-4`}>
              Buat Folder Baru
            </Text>
            <TextInput
              style={tw`bg-slate-900 text-white p-4 rounded-xl border border-slate-600 mb-6 font-bold`}
              placeholder="Nama Folder (misal: Skripsi)"
              placeholderTextColor="#64748b"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            <View style={tw`flex-row justify-end gap-3`}>
              <TouchableOpacity onPress={() => setShowAddFolder(false)}>
                <Text style={tw`text-slate-400 font-bold p-3`}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateFolder}
                style={tw`bg-blue-600 px-6 py-3 rounded-xl`}
              >
                <Text style={tw`text-white font-bold`}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL FILTER & SORT */}
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
              Filter & Sort
            </Text>

            {/* Sort Options */}
            <Text style={tw`text-slate-400 mb-2 font-bold text-xs`}>
              URUTKAN
            </Text>
            <View style={tw`flex-row gap-2 mb-6`}>
              {["newest", "oldest", "a-z"].map((o) => (
                <TouchableOpacity
                  key={o}
                  onPress={() => setSortOrder(o)}
                  style={tw`px-3 py-2 rounded-lg border ${
                    sortOrder === o
                      ? "bg-blue-600 border-blue-600"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <Text style={tw`text-white capitalize text-xs`}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Options */}
            <Text style={tw`text-slate-400 mb-2 font-bold text-xs`}>
              KATEGORI
            </Text>
            <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
              {["All", "Writing", "Coding", "Business", "Art", "Education"].map(
                (c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setSelectedCategory(c)}
                    style={tw`px-3 py-2 rounded-lg border ${
                      selectedCategory === c
                        ? "bg-purple-600 border-purple-600"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Text style={tw`text-white text-xs`}>{c}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={tw`bg-slate-700 p-3 rounded-xl items-center`}
            >
              <Text style={tw`text-white font-bold`}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
