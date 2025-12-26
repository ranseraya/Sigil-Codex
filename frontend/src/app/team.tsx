import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const teamMembers = [
  {
    id: 1,
    name: "Ayala Rahanda",
    role: "Project Manager & Fullstack",
    npm: "23081010071",
    color: "#eab308",
    avatar: require("../../assets/images/avatar1.jpg"),
    github: "https://github.com/ranseraya", 
    linkedin: "https://www.linkedin.com/in/ranseraya"
  },
  {
    id: 2,
    name: "Rizky Ananda",
    role: "Backend & DevOps",
    npm: "23081010088",
    color: "#3b82f6",
    avatar: require("../../assets/images/avatar2.jpg"),
    github: "https://github.com/rzkydhann", 
    linkedin: "https://id.linkedin.com/in/rizkyanandaramadhan"
  },
  {
    id: 3,
    name: "Narendra Putra",
    role: "UI/UX & Frontend",
    npm: "23081010113",
    color: "#22c55e",
    avatar: require("../../assets/images/avatar3.jpg"),
    github: "https://github.com/GtSBK05", 
    linkedin: "https://www.linkedin.com/in/narendra-putra-arianto-78653628b"
  },
  {
    id: 4,
    name: "M. Faris",
    role: "QA Tester & Documentations",
    npm: "23081010311",
    color: "#a855f7",
    avatar: require("../../assets/images/avatar4.jpg"),
    github: "https://github.com/mfarisstars29", 
    linkedin: "https://id.linkedin.com/in/muhammad-faris-syaifulloh-a1368b28b"
  },
];

export default function CreditsArchive() {
  const router = useRouter();

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      <View style={tw`absolute inset-0 flex-row justify-between opacity-5`}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={tw`w-[1px] bg-white h-full`} />
        ))}
      </View>

      {/* HEADER */}
      <View style={tw`flex-row items-center p-4 pt-12 bg-slate-800 border-b border-slate-700`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold`}>Meet the Team</Text>
      </View>

      <ScrollView contentContainerStyle={tw`pt-6 pb-20 px-5`}>
        <View style={tw`mb-6`}>
          <Text style={tw`text-white text-2xl font-black uppercase tracking-tighter`}>
            Codex <Text style={tw`text-blue-500`}>Architects</Text>
          </Text>
          <Text style={tw`text-slate-500 text-[14px] mt-1`}>Dibalik Sigil Codex ada barisan code dan cangkir kopi yang tak terhitung jumlahnya.</Text>
        </View>

        <View style={tw`gap-6`}>
          {teamMembers.map((member) => (
            <View key={member.id} style={tw`bg-slate-800 rounded-lg overflow-hidden border border-slate-700`}>
              <View style={tw`bg-slate-950 px-4 py-2 flex-row justify-between items-center border-b border-slate-700`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-2 h-2 rounded-full bg-[${member.color}] mr-2`} />
                  <Text style={tw`text-slate-400 text-[10px] font-bold tracking-widest`}>FILE_00{member.id}</Text>
                </View>
                <MaterialCommunityIcons name="folder-key-outline" size={14} color="#64748b" />
              </View>

              <View style={tw`p-5`}>
                <View style={tw`flex-row mb-4`}>
                  <Image
                    source={member.avatar}
                    style={tw`w-20 h-20 rounded-md border-2 border-slate-600 mr-4`}
                  />
                  <View style={tw`flex-1 justify-center`}>
                    <Text style={tw`text-white text-xl font-bold`}>{member.name}</Text>
                    <Text style={tw`text-[${member.color}] text-xs font-bold mb-1`}>{member.role}</Text>
                    <View style={tw`bg-slate-700 self-start px-2 py-0.5 rounded`}>
                      <Text style={tw`text-slate-300 text-[10px] font-mono`}>ID: {member.npm}</Text>
                    </View>
                  </View>
                </View>

                <View style={tw`flex-row gap-2 border-t border-slate-700 pt-3`}>
                  <TouchableOpacity onPress={() => Linking.openURL(member.github)} style={tw`flex-1 flex-row justify-center items-center bg-slate-700/30 py-2 rounded`}>
                    <Ionicons name="logo-github" size={14} color="white" />
                    <Text style={tw`text-white text-[10px] font-bold ml-2`}>GITHUB</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL(member.linkedin)} style={tw`flex-1 flex-row justify-center items-center bg-slate-700/30 py-2 rounded`}>
                    <Ionicons name="logo-linkedin" size={14} color="#60a5fa" />
                    <Text style={tw`text-blue-400 text-[10px] font-bold ml-2`}>LINKEDIN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={tw`items-center mt-10`}>
          <Text style={tw`text-slate-600 text-[10px]`}>© 2025 Sigil Codex Team. All rights reserved.s</Text>
        </View>
      </ScrollView>
    </View>
  );
}