import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AboutScreen() {
  const router = useRouter();

  const techStack = [
    { name: "React Native", icon: "react", color: "#61DAFB" },
    { name: "Expo", icon: "triangle-outline", color: "#ffffff" },
    { name: "TypeScript", icon: "language-typescript", color: "#3178C6" },
    { name: "PHP Native", icon: "language-php", color: "#777BB4" },
    { name: "Tailwind", icon: "tailwind", color: "#38BDF8" },
    { name: "MySQL", icon: "database", color: "#f29111" },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
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
        <Text style={tw`text-white text-xl font-bold`}>About App</Text>
      </View>

      <ScrollView
        contentContainerStyle={tw`pb-20`}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={tw`items-center py-10 px-6`}>
          {/* LOGO GLOW EFFECT */}
          <View style={tw`relative mb-6`}>
            <View
              style={tw`absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full`}
            />
            <View
              style={tw`shadow-2xl shadow-black bg-slate-800 rounded-3xl p-1 border border-slate-700`}
            >
              <Image
                source={require("../../assets/images/icon.png")}
                style={tw`w-28 h-28 rounded-2xl`}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={tw`text-white text-3xl font-black tracking-wide mb-1`}>
            Sigil <Text style={tw`text-blue-500`}>Codex</Text>
          </Text>

          <View
            style={tw`bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 mt-3 flex-row items-center gap-2`}
          >
            <View style={tw`w-2 h-2 rounded-full bg-green-500`} />
            <Text style={tw`text-slate-300 text-xs font-bold tracking-wide`}>
              v1.0.0 (Official Build)
            </Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={tw`px-6 mb-10`}>
          <Text style={tw`text-slate-300 text-center leading-6`}>
            Aplikasi manajemen prompt AI yang dirancang sebagai{" "}
            <Text style={tw`text-blue-400 font-bold`}>Grimoire Digital</Text>{" "}
            Anda. Simpan, kelola, dan akses koleksi {'mantra'} digital Anda dengan
            aman, baik secara online maupun offline.
          </Text>
        </View>

        {/* KEY FEATURES */}
        <View style={tw`px-6 mb-10`}>
          <Text
            style={tw`text-slate-500 font-bold text-[10px] uppercase mb-4 text-center tracking-widest`}
          >
            CORE CAPABILITIES
          </Text>

          <View style={tw`gap-3`}>
            {/* Feature 1 */}
            <View
              style={tw`flex-row items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm`}
            >
              <View
                style={tw`w-12 h-12 bg-blue-500/10 rounded-xl justify-center items-center mr-4 border border-blue-500/20`}
              >
                <Ionicons name="library" size={22} color="#60a5fa" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold text-base`}>
                  Prompt Library
                </Text>
                <Text style={tw`text-slate-400 text-xs mt-0.5`}>
                  Organisir prompt dalam folder tanpa batas.
                </Text>
              </View>
            </View>

            {/* Feature 2 */}
            <View
              style={tw`flex-row items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm`}
            >
              <View
                style={tw`w-12 h-12 bg-purple-500/10 rounded-xl justify-center items-center mr-4 border border-purple-500/20`}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={22}
                  color="#c084fc"
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold text-base`}>
                  Hybrid Sync
                </Text>
                <Text style={tw`text-slate-400 text-xs mt-0.5`}>
                  Simpan di Cloud atau Local Storage.
                </Text>
              </View>
            </View>

            {/* Feature 3 */}
            <View
              style={tw`flex-row items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm`}
            >
              <View
                style={tw`w-12 h-12 bg-green-500/10 rounded-xl justify-center items-center mr-4 border border-green-500/20`}
              >
                <Ionicons name="shield-checkmark" size={22} color="#4ade80" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold text-base`}>
                  Secure Vault
                </Text>
                <Text style={tw`text-slate-400 text-xs mt-0.5`}>
                  Privasi data terjamin aman.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* TECH STACK */}
        <View style={tw`mb-12`}>
          <View
            style={tw`flex-row items-center gap-2 mb-6 justify-center px-10`}
          >
            <View style={tw`h-[1px] bg-slate-700 flex-1`} />
            <Text
              style={tw`text-slate-500 text-[10px] font-bold uppercase tracking-widest`}
            >
              BUILT WITH
            </Text>
            <View style={tw`h-[1px] bg-slate-700 flex-1`} />
          </View>

          <View style={tw`flex-row flex-wrap justify-center gap-2`}>
            {techStack.map((tech, index) => (
              <View key={index} style={tw`items-center`}>
                <View
                  style={tw`w-12 h-12 bg-slate-800 rounded-xl justify-center items-center border border-slate-700 mb-1`}
                >
                  {tech.name === "Expo" ? (
                    <Ionicons
                      name="triangle-outline"
                      size={24}
                      color={tech.color}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={tech.icon as any}
                      size={24}
                      color={tech.color}
                    />
                  )}
                </View>
                <Text style={tw`text-slate-500 text-[10px]`}>{tech.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* LINKS & FOOTER */}
        <View style={tw`px-6 mb-6`}>
          <TouchableOpacity
            onPress={() => openLink("https://github.com/ranseraya")}
            style={tw`flex-row justify-center items-center bg-blue-600/10 py-4 rounded-2xl border border-blue-500/30 active:bg-blue-600/20`}
          >
            <Ionicons
              name="logo-github"
              size={20}
              color="#60a5fa"
              style={tw`mr-2`}
            />
            <Text style={tw`text-blue-400 font-bold`}>Visit Source Code</Text>
          </TouchableOpacity>

          <View style={tw`items-center mt-10 opacity-50`}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={tw`w-8 h-8 rounded-lg mb-2 grayscale opacity-50`}
            />
            <Text style={tw`text-slate-600 text-[10px]`}>
              © 2025 Sigil Codex Team. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
