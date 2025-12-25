import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const teamMembers = [
  {
    id: 1,
    name: "Ayala Septama Rahanda",
    npm: "23081010071",
    role: "Project Manager & Fullstack",
    desc: "Mastermind di balik Aplikasi Sigil Codex.",
    github: "https://github.com/ranseraya",
    linkedin: "https://www.linkedin.com/in/ranseraya",
    roleColor: "bg-yellow-600",
    avatarUrl:
      "https://ui-avatars.com/api/?name=A+R&background=ca8a04&color=fff",
  },
  {
    id: 2,
    name: "Rizky Ananda Ramadhan",
    npm: "23081010088",
    role: "Backend & DevOps",
    desc: "Menjaga database dan API tetap stabil.",
    github: "https://github.com/rzkydhann",
    linkedin: "https://id.linkedin.com/in/rizkyanandaramadhan",
    roleColor: "bg-blue-600",
    avatarUrl:
      "https://ui-avatars.com/api/?name=R+Z&background=2563eb&color=fff",
  },
  {
    id: 3,
    name: "Narendra Putra Arianto",
    npm: "23081010113",
    role: "UI/UX & Frontend",
    desc: "Menciptakan pengalaman pengguna yang magis.",
    github: "https://github.com/GtSBK05",
    linkedin: "https://www.linkedin.com/in/narendra-putra-arianto-78653628b",
    roleColor: "bg-green-600",
    avatarUrl:
      "https://ui-avatars.com/api/?name=N+P+A&background=16a34a&color=fff",
  },
  {
    id: 4,
    name: "M. Faris Syaifulloh",
    npm: "23081010311",
    role: "QA Tester & Dokumentations",
    desc: "Melakukan pengujian fungsionalitas dan usability serta mendokumentasikannya.",
    github: "https://github.com/mfarisstars29",
    linkedin: "https://id.linkedin.com/in/muhammad-faris-syaifulloh-a1368b28b",
    roleColor: "bg-purple-600",
    avatarUrl:
      "https://ui-avatars.com/api/?name=F+a&background=9333ea&color=fff",
  },
];

// --- DATA TECH STACK ---
const techStack = [
  { name: "React Native", icon: "react", color: "#61DAFB" },
  { name: "Expo", icon: "triangle-outline", color: "#ffffff" },
  { name: "TypeScript", icon: "language-typescript", color: "#3178C6" },
  { name: "PHP", icon: "language-php", color: "#777BB4" },
  { name: "Tailwind", icon: "tailwind", color: "#38BDF8" },
  { name: "MySQL", icon: "database", color: "#f29111" },
];

export default function CreditsScreen() {
  const router = useRouter();

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
        <Text style={tw`text-white text-xl font-bold`}>Credits</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-6 pb-20`}
      >
        {/* TITLE & INTRO */}
        <View style={tw`mb-8`}>
          <Text
            style={tw`text-slate-500 text-xs font-bold tracking-widest uppercase mb-1`}
          >
            THE ARCHITECTS
          </Text>
          <Text style={tw`text-white text-3xl font-black mb-2`}>
            Meet the <Text style={tw`text-blue-500`}>Team</Text>
          </Text>
          <Text style={tw`text-slate-400 leading-5`}>
            Dipersembahkan oleh <br />
            Kelompok Aplikasi Mobile UPN Veteran Jawa Timur. <br />
            <br />
            Kami membangun Sigil Codex dengan dedikasi, kopi, dan barisan kode.
          </Text>
        </View>

        {/* TEAM CARDS */}
        <View style={tw`gap-5`}>
          {teamMembers.map((member) => (
            <View
              key={member.id}
              style={tw`bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md relative overflow-hidden`}
            >
              <View
                style={tw`absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl`}
              />

              <View style={tw`flex-row items-start`}>
                <Image
                  source={{ uri: member.avatarUrl }}
                  style={tw`w-16 h-16 rounded-2xl mr-4 border-2 border-slate-600`}
                />

                <View style={tw`flex-1`}>
                  <View style={tw`flex-row justify-between items-start`}>
                    <View>
                      <Text style={tw`text-white text-lg font-bold`}>
                        {member.name}
                      </Text>
                      <Text style={tw`text-white text-xs font-bold`}>
                        {member.npm}
                      </Text>

                      <View
                        style={tw`${member.roleColor} self-start px-2 py-0.5 rounded-md mt-1 mb-2 shadow-sm`}
                      >
                        <Text
                          style={tw`text-white text-[10px] font-bold uppercase`}
                        >
                          {member.role}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text
                    style={tw`text-slate-400 text-xs mb-4 italic leading-4`}
                  >
                    {member.desc}
                  </Text>

                  {/* Social Buttons */}
                  <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                      onPress={() => openLink(member.github)}
                      style={tw`flex-row items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700`}
                    >
                      <Ionicons name="logo-github" size={14} color="white" />
                      <Text style={tw`text-white text-[10px] font-bold`}>
                        Github
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openLink(member.linkedin)}
                      style={tw`flex-row items-center gap-1 bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-900`}
                    >
                      <Ionicons
                        name="logo-linkedin"
                        size={14}
                        color="#60a5fa"
                      />
                      <Text style={tw`text-blue-400 text-[10px] font-bold`}>
                        LinkedIn
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* TECH STACK */}
        <View style={tw`mt-12 mb-8`}>
          <View style={tw`flex-row items-center gap-2 mb-4 justify-center`}>
            <View style={tw`h-[1px] bg-slate-700 flex-1`} />
            <Text
              style={tw`text-slate-500 text-xs font-bold uppercase tracking-widest`}
            >
              POWERED BY
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

        {/* COPYRIGHT */}
        <View style={tw`items-center`}>
          <Text style={tw`text-slate-600 text-[10px]`}>
            © 2025 Sigil Codex Team. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
