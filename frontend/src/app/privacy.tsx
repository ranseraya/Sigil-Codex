import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const SettingItem = ({
  icon,
  color,
  title,
  desc,
  value,
  onToggle,
  isSwitch = true,
  onPress,
}: any) => (
  <TouchableOpacity
    disabled={isSwitch}
    onPress={onPress}
    style={tw`flex-row items-center bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700`}
  >
    <View
      style={tw`w-10 h-10 ${color} rounded-full justify-center items-center mr-4`}
    >
      <Ionicons name={icon} size={20} color="white" />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-white font-bold`}>{title}</Text>
      <Text style={tw`text-slate-400 text-xs`}>{desc}</Text>
    </View>
    {isSwitch ? (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#334155", true: "#2563eb" }}
        thumbColor={value ? "#ffffff" : "#94a3b8"}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#64748b" />
    )}
  </TouchableOpacity>
);

export default function PrivacyScreen() {
  const router = useRouter();

  // STATE SETTINGS
  const [isBiometric, setIsBiometric] = useState(false);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [isAnalytics, setIsAnalytics] = useState(true);

  // STATE MODAL PASSWORD
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  // LOAD SETTINGS SAAT APLIKASI DIBUKA
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const bio = await AsyncStorage.getItem("setting_biometric");
      const priv = await AsyncStorage.getItem("setting_private");
      const ana = await AsyncStorage.getItem("setting_analytics");

      if (bio !== null) setIsBiometric(bio === "true");
      if (priv !== null) setIsPrivateProfile(priv === "true");
      if (ana !== null) setIsAnalytics(ana === "true");
    } catch (e: any) {
      console.log("Failed to load settings : " + e.message);
    }
  };

  // FUNGSI TOGGLE
  const toggleSwitch = async (key: string, value: boolean, setter: any) => {
    setter(value);
    await AsyncStorage.setItem(key, String(value));

    // Efek Feedback
    if (value)
      Toast.show({
        type: "success",
        text1: "Pengaturan Diaktifkan",
        text2: "Perubahan telah disimpan.",
      });
  };

  // FUNGSI GANTI PASSWORD (SIMULASI)
  const handleChangePassword = () => {
    if (!oldPass || !newPass) {
      Alert.alert("Error", "Mohon isi semua kolom password.");
      return;
    }

    setLoadingPass(true);

    // Simulasi loading server 2 detik
    setTimeout(() => {
      setLoadingPass(false);
      setModalVisible(false);
      setOldPass("");
      setNewPass("");

      Alert.alert(
        "Sukses",
        "Password Anda berhasil diperbarui! Silakan login ulang nanti."
      );
    }, 2000);
  };

  // FUNGSI HAPUS AKUN (DUMMY)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Hapus Akun Permanen",
      "Tindakan ini tidak dapat dibatalkan. Semua data prompt Anda akan hilang selamanya. Yakin?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Hapus",
          style: "destructive",
          onPress: () => {
            Toast.show({
              type: "error",
              text1: "Gagal",
              text2: "Fitur dinonaktifkan demi keamanan demo.",
            });
          },
        },
      ]
    );
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
        <Text style={tw`text-white text-xl font-bold`}>Privacy & Security</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`}>
        {/* KEAMANAN */}
        <Text style={tw`text-slate-500 font-bold text-xs uppercase mb-3 ml-1`}>
          KEAMANAN AKUN
        </Text>

        <SettingItem
          icon="key"
          color="bg-orange-500"
          title="Ganti Password"
          desc="Perbarui kata sandi secara berkala."
          isSwitch={false}
          onPress={() => setModalVisible(true)}
        />

        <SettingItem
          icon="finger-print"
          color="bg-blue-600"
          title="Login Biometrik"
          desc="Gunakan FaceID/Fingerprint untuk masuk."
          value={isBiometric}
          onToggle={(val: boolean) =>
            toggleSwitch("setting_biometric", val, setIsBiometric)
          }
        />

        {/* PRIVASI */}
        <Text
          style={tw`text-slate-500 font-bold text-xs uppercase mb-3 mt-6 ml-1`}
        >
          PRIVASI DATA
        </Text>

        <SettingItem
          icon="eye-off"
          color="bg-purple-600"
          title="Mode Profil Privat"
          desc="Sembunyikan aktivitas dari publik."
          value={isPrivateProfile}
          onToggle={(val: boolean) =>
            toggleSwitch("setting_private", val, setIsPrivateProfile)
          }
        />

        <SettingItem
          icon="bar-chart"
          color="bg-green-600"
          title="Izinkan Analitik"
          desc="Kirim data anonim untuk perbaikan aplikasi."
          value={isAnalytics}
          onToggle={(val: boolean) =>
            toggleSwitch("setting_analytics", val, setIsAnalytics)
          }
        />

        {/* DANGER ZONE */}
        <Text
          style={tw`text-slate-500 font-bold text-xs uppercase mb-3 mt-6 ml-1`}
        >
          ZONA BAHAYA
        </Text>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={tw`flex-row items-center bg-red-900/20 p-4 rounded-xl border border-red-900/50`}
        >
          <View
            style={tw`w-10 h-10 bg-red-600 rounded-full justify-center items-center mr-4`}
          >
            <Ionicons name="trash" size={20} color="white" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-red-500 font-bold`}>Hapus Akun Saya</Text>
            <Text style={tw`text-red-400/60 text-xs`}>
              Data akan dihapus permanen.
            </Text>
          </View>
        </TouchableOpacity>

        <View style={tw`h-20`} />
      </ScrollView>

      {/* MODAL GANTI PASSWORD */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={tw`flex-1 bg-black/80 justify-end`}>
          <TouchableOpacity
            style={tw`flex-1`}
            onPress={() => setModalVisible(false)}
          />

          <View
            style={tw`bg-slate-800 p-6 rounded-t-3xl border-t border-slate-700`}
          >
            <View
              style={tw`w-12 h-1 bg-slate-600 rounded-full self-center mb-6`}
            />

            <Text style={tw`text-white text-xl font-bold mb-6`}>
              Ubah Kata Sandi
            </Text>

            <Text style={tw`text-slate-400 mb-2 font-bold`}>Password Lama</Text>
            <TextInput
              style={tw`bg-slate-900 text-white p-4 rounded-xl border border-slate-600 mb-4`}
              secureTextEntry
              placeholder="Masukkan password lama"
              placeholderTextColor="#64748b"
              value={oldPass}
              onChangeText={setOldPass}
            />

            <Text style={tw`text-slate-400 mb-2 font-bold`}>Password Baru</Text>
            <TextInput
              style={tw`bg-slate-900 text-white p-4 rounded-xl border border-slate-600 mb-6`}
              secureTextEntry
              placeholder="Masukkan password baru"
              placeholderTextColor="#64748b"
              value={newPass}
              onChangeText={setNewPass}
            />

            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={loadingPass}
              style={tw`bg-blue-600 p-4 rounded-xl items-center flex-row justify-center`}
            >
              {loadingPass ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-white font-bold text-lg`}>
                  Simpan Password
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`mt-4 items-center p-2`}
            >
              <Text style={tw`text-slate-500 font-bold`}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
