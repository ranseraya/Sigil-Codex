import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "../services/auth";
import CustomInput from "../components/CustomInput";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      // Panggil API Register
      const result = await registerUser(name, email, password);

      if (result.status === "success") {
        Alert.alert("Sukses", "Akun berhasil dibuat! Silakan Login.");
        router.back();
      } else {
        Alert.alert("Gagal", result.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal Register",
        error.message || "Terjadi kesalahan jaringan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900 justify-center px-6`}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={tw`absolute top-12 left-6 z-10`}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={tw`items-center mb-8`}>
        <Text style={tw`text-blue-400 text-3xl font-bold tracking-wider`}>
          CREATE ACCOUNT
        </Text>
        <Text style={tw`text-slate-400 text-sm mt-2`}>
          Join PromptVault Community
        </Text>
      </View>

      <View>
        <CustomInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="ex: Ayala Developer"
        />

        <CustomInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="ex: user@promptvault.com"
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
          onPress={handleRegister}
          disabled={loading}
          style={tw`bg-blue-600 p-4 rounded-xl shadow-lg items-center ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white font-bold text-lg`}>REGISTER</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={tw`mt-6 flex-row justify-center`}>
        <Text style={tw`text-slate-400`}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={tw`text-blue-400 font-bold`}>Login disini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
