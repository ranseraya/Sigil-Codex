import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import CustomInput from "../components/CustomInput";

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Load data
    AsyncStorage.getItem("user").then((data) => {
      if (data) {
        const user = JSON.parse(data);
        setUserId(user.id);
        setName(user.name);
        setEmail(user.email);
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post("/user/update_profile.php", {
        id: userId,
        name,
        email,
      });

      if (response.data.status === "success") {
        // Update data di HP (AsyncStorage) dengan data baru
        await AsyncStorage.setItem("user", JSON.stringify(response.data.data));
        Alert.alert("Sukses", "Profil berhasil diperbarui!");
        router.back();
      } else {
        Alert.alert("Gagal", response.data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal terhubung ke server");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      <View
        style={tw`flex-row items-center p-4 pt-12 bg-slate-800 border-b border-slate-700`}
      >
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold`}>Edit Profile</Text>
      </View>

      <View style={tw`p-6`}>
        {/* Avatar UI */}
        <View style={tw`items-center mb-8`}>
          <View
            style={tw`w-24 h-24 bg-blue-600 rounded-full justify-center items-center mb-2`}
          >
            <Text style={tw`text-white text-4xl font-bold`}>
              {name.charAt(0)}
            </Text>
          </View>
          <Text style={tw`text-blue-400 text-xs`}>
            Tap to change photo (Disabled)
          </Text>
        </View>

        <CustomInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <CustomInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={tw`bg-blue-600 p-4 rounded-xl items-center shadow-lg ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white font-bold text-lg`}>SAVE CHANGES</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
