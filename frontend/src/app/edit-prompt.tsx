import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { updateLocalPrompt, saveLocalPrompt } from "../services/localPrompt";
import { getCollections, createCollection } from "../services/collections";
import CustomInput from "../components/CustomInput";
import SelectionGroup from "../components/SelectionGroup";

export default function EditPromptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  // Cek Asal Data (Cloud / Local)
  const originIsLocal = params.is_local === "true";
  const [saveMode, setSaveMode] = useState<"cloud" | "local">(
    originIsLocal ? "local" : "cloud"
  );

  // Collections & Folder Selection
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(
    params.collection_id && params.collection_id !== "null"
      ? Number(params.collection_id)
      : null
  );

  // Tambah Folder
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Form Data
  const [title, setTitle] = useState((params.title as string) || "");
  const [description, setDescription] = useState(
    (params.description as string) || ""
  );
  const [content, setContent] = useState((params.content as string) || "");
  const [exampleOutput, setExampleOutput] = useState(
    (params.example_output as string) || ""
  );
  const [category, setCategory] = useState(
    (params.category as string) || "Writing"
  );
  const [platform, setPlatform] = useState(
    (params.platform as string) || "ChatGPT"
  );
  const [isPublic, setIsPublic] = useState(params.is_public === "1");

  const platforms = [
    "ChatGPT",
    "Midjourney",
    "DALL-E",
    "Claude",
    "Stable Diffusion",
  ];
  const categories = [
    "Writing",
    "Coding",
    "Art",
    "Business",
    "Education",
    "Other",
  ];

  // FETCH FOLDERS ---
  useEffect(() => {
    const loadColl = async () => {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson || "{}");
      if (user.id) {
        try {
          const res = await getCollections(user.id);
          if (res.status === "success") setCollections(res.data);
        } catch (e: any) {
          console.log("Gagal load collections : ", e.message);
        }
      }
    };
    loadColl();
  }, []);

  // CREATE FOLDER
  const handleQuickCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson || "{}");
      if (!user.id) return;

      const res = await createCollection(user.id, newFolderName);

      if (res.status === "success") {
        const updatedCols = await getCollections(user.id);
        setCollections(updatedCols.data);

        // OTOMATIS PILIH folder yang baru dibuat
        const newFolder = updatedCols.data.find(
          (f: any) => f.name === newFolderName
        );
        if (newFolder) setSelectedCollectionId(newFolder.id);

        setShowAddFolder(false);
        setNewFolderName("");
        Alert.alert("Sukses", "Folder baru berhasil dibuat & dipilih!");
      }
    } catch (e: any) {
      Alert.alert("Gagal", "Gagal membuat folder. : ", e.message);
    }
  };

  // HANDLER SAVE
  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Judul dan Isi wajib diisi!");
      return;
    }
    setLoading(true);

    try {
      // TARGET: LOCAL
      if (saveMode === "local") {
        const payload = {
          title,
          description,
          content,
          example_output: exampleOutput,
          category,
          platform,
        };

        if (originIsLocal) {
          // Local -> Local (Update Existing)
          await updateLocalPrompt(params.id as string, payload);
        } else {
          // Cloud -> Local (Download/Copy sebagai data baru di local)
          await saveLocalPrompt(payload);
        }
        Alert.alert("Sukses", "Data tersimpan di Device (Offline).");
        router.back();
        router.replace("/library");
      }
      // TARGET: CLOUD
      else {
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson || "{}");
        if (!user.id) {
          setLoading(false);
          Alert.alert("Gagal", "Login diperlukan untuk akses Cloud.");
          return;
        }

        const payload = {
          user_id: user.id,
          title,
          description,
          content,
          example_output: exampleOutput,
          category,
          platform,
          is_public: isPublic ? 1 : 0,
          collection_id: selectedCollectionId,
        };

        if (!originIsLocal) {
          // Cloud -> Cloud (Update Existing)
          const updateRes = await api.post("/personal/update.php", {
            ...payload,
            id: params.id,
          });
          if (updateRes.data.status === "success") {
            Alert.alert("Sukses", "Data Cloud diperbarui!");
          } else {
            throw new Error(updateRes.data.message);
          }
        } else {
          // Local -> Cloud (Upload/Migrasi)
          const createRes = await api.post("/personal/create.php", payload);
          if (createRes.data.status === "success") {
            Alert.alert("Sukses", "Berhasil di-upload ke Cloud!");
          } else {
            throw new Error(createRes.data.message);
          }
        }
        router.back();
        router.replace("/library");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* HEADER */}
      <View
        style={tw`flex-row items-center p-4 pt-12 border-b border-slate-700 bg-slate-800`}
      >
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-white text-lg font-bold`}>Edit Prompt</Text>
          <Text style={tw`text-slate-400 text-[10px]`}>
            Asal: {originIsLocal ? "Offline Storage" : "Cloud Server"}
          </Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1 p-6`}>
        {/* LOKASI SIMPAN */}
        <Text style={tw`text-slate-400 mb-2 font-bold uppercase text-xs ml-1`}>
          SIMPAN PERUBAHAN KE
        </Text>
        <View
          style={tw`flex-row bg-slate-800 p-1 rounded-xl border border-slate-700 mb-6`}
        >
          <TouchableOpacity
            onPress={() => setSaveMode("cloud")}
            style={tw`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
              saveMode === "cloud" ? "bg-blue-600" : ""
            }`}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={18}
              color={saveMode === "cloud" ? "white" : "#94a3b8"}
            />
            <Text
              style={tw`${
                saveMode === "cloud" ? "text-white font-bold" : "text-slate-400"
              }`}
            >
              Cloud
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSaveMode("local")}
            style={tw`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
              saveMode === "local" ? "bg-orange-500" : ""
            }`}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={18}
              color={saveMode === "local" ? "white" : "#94a3b8"}
            />
            <Text
              style={tw`${
                saveMode === "local" ? "text-white font-bold" : "text-slate-400"
              }`}
            >
              Device
            </Text>
          </TouchableOpacity>
        </View>

        {/* INPUTS */}
        <CustomInput
          label="Judul Prompt"
          value={title}
          onChangeText={setTitle}
        />

        <CustomInput
          label="Deskripsi Singkat"
          value={description}
          onChangeText={setDescription}
        />

        {/* PINDAH FOLDER (Cloud Only) */}
        {saveMode === "cloud" && (
          <>
            <Text
              style={tw`text-slate-400 mb-3 font-bold uppercase text-xs ml-1`}
            >
              FOLDER (PINDAHKAN)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={tw`mb-6`}
            >
              <View style={tw`flex-row gap-2 items-center`}>
                {/* No Folder Option */}
                <TouchableOpacity
                  onPress={() => setSelectedCollectionId(null)}
                  style={tw`px-4 py-2 rounded-full border ${
                    selectedCollectionId === null
                      ? "bg-slate-600 border-slate-500"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <Text style={tw`text-white font-semibold text-xs`}>
                    No Folder
                  </Text>
                </TouchableOpacity>

                {/* List Folder */}
                {collections.map((col) => (
                  <TouchableOpacity
                    key={col.id}
                    onPress={() => setSelectedCollectionId(col.id)}
                    style={tw`px-4 py-2 rounded-full border ${
                      selectedCollectionId === col.id
                        ? "bg-blue-600 border-blue-600"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    <Text style={tw`text-white font-semibold text-xs`}>
                      {col.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* TOMBOL ADD FOLDER (+) */}
                <TouchableOpacity
                  onPress={() => setShowAddFolder(true)}
                  style={tw`w-8 h-8 rounded-full bg-slate-800 border border-slate-600 border-dashed justify-center items-center ml-1`}
                >
                  <Ionicons name="add" size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}

        {/* PLATFORM & CATEGORY */}
        <SelectionGroup
          label="Platform AI"
          options={platforms}
          selected={platform}
          onSelect={setPlatform}
          colorTheme="blue"
        />

        <SelectionGroup
          label="Kategori"
          options={categories}
          selected={category}
          onSelect={setCategory}
          colorTheme="purple"
        />

        {/* CONTENT */}
        <CustomInput
          label="Isi Prompt"
          value={content}
          onChangeText={setContent}
          multiline={true}
          height="min-h-32"
        />

        <CustomInput
          label="Contoh Output"
          value={exampleOutput}
          onChangeText={setExampleOutput}
          multiline={true}
          height="min-h-24"
        />

        {/* SWITCH PUBLIC (Cloud Only) */}
        {saveMode === "cloud" && (
          <View
            style={tw`flex-row justify-between items-center bg-slate-800 p-4 rounded-xl mb-8 border border-slate-700`}
          >
            <View>
              <Text style={tw`text-white font-bold`}>
                Bagikan ke Komunitas?
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: "#334155", true: "#2563eb" }}
            />
          </View>
        )}
        <View style={tw`mb-20`} />
      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={tw`absolute bottom-6 left-6 right-6`}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={tw`bg-green-600 p-4 rounded-xl shadow-lg items-center flex-row justify-center gap-2 ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="white"
              />
              <Text style={tw`text-white font-bold text-lg`}>
                {saveMode === (originIsLocal ? "local" : "cloud")
                  ? "SIMPAN PERUBAHAN"
                  : saveMode === "cloud"
                  ? "UPLOAD KE CLOUD"
                  : "DOWNLOAD KE DEVICE"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ADD FOLDER */}
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
                onPress={handleQuickCreateFolder}
                style={tw`bg-blue-600 px-6 py-3 rounded-xl`}
              >
                <Text style={tw`text-white font-bold`}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
