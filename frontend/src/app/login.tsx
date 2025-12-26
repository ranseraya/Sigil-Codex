import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useRouter, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/auth";
import CustomInput from "../components/CustomInput";

const handleGuestLogin = async () => {
  const guestUser = {
    id: 0,
    name: "Guest",
    email: "guest@offline.mode",
    is_guest: true,
  };

  // Simpan ke AsyncStorage
  await AsyncStorage.setItem("user", JSON.stringify(guestUser));

  // Beri notifikasi & Pindah halaman
  Alert.alert(
    "Mode Tamu",
    "Fitur Cloud (Upload/Like) tidak tersedia dalam mode ini."
  );
  router.replace("/(tabs)");
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);

      if (result.status === "success") {
        // SIMPAN DATA KE HP
        await AsyncStorage.setItem("user", JSON.stringify(result.data));

        Alert.alert("Sukses", `Selamat datang, ${result.data.name}!`);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Gagal Login", result.message || "Email/Password salah");
      }
    } catch (error: any) {
      let errMsg = "Terjadi kesalahan";
      if (error.message) errMsg = error.message;
      if (error.toString().includes("Network Error"))
        errMsg = "Tidak dapat terhubung ke Server.";

      Alert.alert("Koneksi Gagal", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900 justify-center px-6`}>
      <View style={tw`items-center mb-10`}>
        <Text style={tw`text-blue-400 text-3xl font-bold tracking-wider`}>
          Sigil Codex
        </Text>
        <Text style={tw`text-slate-400 text-sm mt-2`}>
          Your Personal AI Command Center
        </Text>
      </View>

      <View>
        <CustomInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="ex: user@sigilcodex.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={true}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={tw`bg-blue-600 p-4 rounded-xl shadow-lg items-center ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white font-bold text-lg`}>LOGIN</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGuestLogin}
          style={tw`mt-4 border border-slate-600 p-4 rounded-xl items-center`}
        >
          <Text style={tw`text-slate-400 font-bold`}>
            Masuk Tanpa Login (Offline)
          </Text>
        </TouchableOpacity>
        <View style={tw`mt-6 flex-row justify-center`}>
          <Text style={tw`text-slate-400`}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={tw`text-blue-400 font-bold`}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
