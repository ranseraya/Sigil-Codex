import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import tw from "twrnc";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserStats } from "../../services/user";
import DashboardMenu from "@/src/components/DashboardMenu";

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ prompts: 0, likes_received: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue) {
        const userData = JSON.parse(jsonValue);
        setUser(userData);

        const statsData = await getUserStats(userData.id);
        if (statsData.status === "success") {
          setStats(statsData.data);
        }
      }
    } catch (e) {
      console.error("Gagal load dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      <ScrollView
        contentContainerStyle={tw`pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="white"
          />
        }
      >
        {/* 1. HEADER SECTION */}
        <View
          style={tw`bg-slate-800 pt-16 px-6 pb-10 rounded-b-3xl border-b border-slate-700 shadow-lg`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-slate-400 text-sm mb-1`}>
                Selamat Datang,
              </Text>
              <Text style={tw`text-white text-2xl font-bold`}>
                {user?.name || "Guest"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <View
                style={tw`w-12 h-12 bg-blue-600 rounded-full justify-center items-center border-2 border-slate-700 shadow-lg`}
              >
                <Text style={tw`text-white font-bold text-lg`}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. STATS CARDS */}
        <View style={tw`px-6 mt-8 mb-6`}>
          <View style={tw`flex-row gap-4`}>
            {/* Card 1: Total Prompts */}
            <View
              style={tw`flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-600 flex-row items-center shadow-xl`}
            >
              <View style={tw`bg-blue-500/20 p-2.5 rounded-xl mr-3`}>
                <Ionicons name="document-text" size={20} color="#60a5fa" />
              </View>
              <View>
                <Text style={tw`text-white text-xl font-bold`}>
                  {stats.prompts}
                </Text>
                <Text
                  style={tw`text-slate-400 text-[10px] uppercase font-bold`}
                >
                  My Prompts
                </Text>
              </View>
            </View>

            {/* Card 2: Total Likes */}
            <View
              style={tw`flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-600 flex-row items-center shadow-xl`}
            >
              <View style={tw`bg-pink-500/20 p-2.5 rounded-xl mr-3`}>
                <Ionicons name="heart" size={20} color="#f472b6" />
              </View>
              <View>
                <Text style={tw`text-white text-xl font-bold`}>
                  {stats.likes_received}
                </Text>
                <Text style={tw`text-slate-400 text-[8px] uppercase font-bold`}>
                  Likes Recieved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. MAIN MENU */}
        <View style={tw`px-6`}>
          <DashboardMenu
            title="My Library"
            subtitle="Kelola koleksi prompt pribadi Anda"
            icon="library"
            color="bg-blue-600"
            route="/library"
          />

          <DashboardMenu
            title="Create Prompt"
            subtitle="Buat prompt baru sekarang"
            icon="add-circle"
            color="bg-emerald-600"
            route="/create-prompt"
          />

          <DashboardMenu
            title="Explore Community"
            subtitle="Temukan inspirasi dari global"
            icon="earth"
            color="bg-purple-600"
            route="/(tabs)/explore"
          />

          <DashboardMenu
            title="Favorites"
            subtitle="Prompt yang Anda simpan"
            icon="bookmark"
            color="bg-amber-500"
            route="/favorites"
          />

          <DashboardMenu
            title="About App"
            subtitle="Informasi developer & versi"
            icon="information-circle"
            color="bg-slate-600"
            route="/about"
          />
        </View>

        {/* Quick Tips */}
        <View style={tw`px-6 mt-4`}>
          <Text
            style={tw`text-slate-500 font-bold text-xs uppercase mb-3 ml-1`}
          >
            Did You Know?
          </Text>
          <View
            style={tw`bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-start`}
          >
            <Ionicons
              name="bulb-outline"
              size={24}
              color="#fbbf24"
              style={tw`mr-3`}
            />
            <Text style={tw`text-slate-400 text-xs leading-5 flex-1`}>
              Anda bisa mendapatkan lebih banyak Likes dengan membagikan prompt
              yang memiliki deskripsi jelas dan contoh output yang akurat.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
