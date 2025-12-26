import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import tw from "twrnc";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../../services/auth";
import { getMyPrompts, getFavorites } from "../../services/prompt";
import ProfileMenuItem from "@/src/components/ProfileMenuItem";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    prompts: 0,
    favorites: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser.id) {
          const myPrompts = await getMyPrompts(parsedUser.id);
          const myFavs = await getFavorites(parsedUser.id);

          setStats({
            prompts: myPrompts.status === "success" ? myPrompts.data.length : 0,
            favorites: myFavs.status === "success" ? myFavs.data.length : 0,
          });
        }
      }
    } catch (error) {
      console.log("Error loading profile", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLogout = () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-slate-900 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      <ScrollView contentContainerStyle={tw`pb-24`}>
        {/* HEADER BACKGROUND */}
        <View style={tw`h-32 bg-blue-900/30 w-full absolute top-0 left-0`} />

        {/* PROFILE CARD */}
        <View style={tw`px-6 pt-16 mb-6`}>
          <View style={tw`items-center`}>
            {/* Avatar */}
            <View
              style={tw`w-24 h-24 bg-blue-600 rounded-full justify-center items-center border-4 border-slate-900 mb-3 shadow-xl`}
            >
              <Text style={tw`text-white text-4xl font-bold`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>

            <Text style={tw`text-white text-2xl font-bold`}>
              {user?.name || "Guest"}
            </Text>
            <Text style={tw`text-slate-400 text-sm mb-4`}>
              {user?.email || "No Email"}
            </Text>

            {/* Badge Status */}
            <View
              style={tw`bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20`}
            >
              <Text style={tw`text-green-400 text-xs font-bold`}>
                Verified Member
              </Text>
            </View>
          </View>
        </View>

        {/* STATISTIK AREA */}
        <View style={tw`flex-row mx-6 mb-8`}>
          <View
            style={tw`flex-1 bg-slate-800 p-4 rounded-l-xl border-r border-slate-700 items-center`}
          >
            <Text style={tw`text-blue-400 text-2xl font-bold`}>
              {stats.prompts}
            </Text>
            <Text style={tw`text-slate-400 text-xs uppercase tracking-wider`}>
              Prompts
            </Text>
          </View>
          <View style={tw`flex-1 bg-slate-800 p-4 rounded-r-xl items-center`}>
            <Text style={tw`text-pink-400 text-2xl font-bold`}>
              {stats.favorites}
            </Text>
            <Text style={tw`text-slate-400 text-xs uppercase tracking-wider`}>
              Favorites
            </Text>
          </View>
        </View>

        {/* SETTINGS MENU */}
        <View style={tw`mx-6 bg-slate-800 rounded-xl overflow-hidden mb-6`}>
          <Text
            style={tw`text-slate-500 text-xs font-bold px-4 pt-4 pb-2 uppercase`}
          >
            Account Settings
          </Text>

          <ProfileMenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push("/edit-profile")} // Link ke Edit Profile
          />
          <ProfileMenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => router.push("/notifications")} // Link ke Notifikasi
          />
          <ProfileMenuItem
            icon="lock-closed-outline"
            label="Privacy & Security"
            onPress={() => router.push("/privacy")} // Link ke Privacy
          />
          <ProfileMenuItem
            icon="information-circle-outline"
            label="About App"
            onPress={() => router.push("/about")}
          />


          <ProfileMenuItem
            icon="people-outline"
            label="Meet the Team"
            onPress={() => router.push("/team")}
          />

          {/* Tombol Logout */}
          <ProfileMenuItem
            icon="log-out-outline"
            label="Log Out"
            color="text-red-500"
            onPress={handleLogout}
            isLast={true}
          />
        </View>

        <View style={tw`items-center`}>
          <Text style={tw`text-slate-600 text-xs`}>Sigil Codex App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
