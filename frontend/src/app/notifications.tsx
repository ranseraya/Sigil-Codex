import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NotificationItem from "../components/NotificationsItem";

// Tipe Data Notifikasi
export interface NotificationData {
  id: number;
  title: string;
  msg: string;
  type: "system" | "like" | "info" | "warning";
  time: string;
  read: boolean;
  archived: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();

  // State Tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "read" | "archived"
  >("all");

  // State Selection Mode
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // State Modal Single Action
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NotificationData | null>(
    null
  );

  // DATA DUMMY
  const [data, setData] = useState<NotificationData[]>([
    {
      id: 1,
      title: "Welcome!",
      msg: "Selamat datang di komunitas Sigil Codex.",
      type: "system",
      time: "Just now",
      read: false,
      archived: false,
    },
    {
      id: 2,
      title: "New Like",
      msg: "Ayala menyukai prompt Anda.",
      type: "like",
      time: "5 min ago",
      read: false,
      archived: false,
    },
    {
      id: 3,
      title: "System Update",
      msg: "Maintenance server dijadwalkan besok.",
      type: "warning",
      time: "1 hour ago",
      read: true,
      archived: false,
    },
    {
      id: 4,
      title: "Weekly Digest",
      msg: "Lihat prompt terpopuler minggu ini.",
      type: "info",
      time: "2 days ago",
      read: true,
      archived: true,
    },
    {
      id: 5,
      title: "Security Alert",
      msg: "Login terdeteksi dari perangkat baru.",
      type: "warning",
      time: "3 days ago",
      read: true,
      archived: false,
    },
  ]);

  // Filter Data
  const getFilteredData = () => {
    switch (activeTab) {
      case "unread":
        return data.filter((item) => !item.read && !item.archived);
      case "read":
        return data.filter((item) => item.read && !item.archived);
      case "archived":
        return data.filter((item) => item.archived);
      default:
        return data.filter((item) => !item.archived);
    }
  };

  const currentData = getFilteredData();

  const handleLongPress = (id: number) => {
    setIsSelectionMode(true);
    toggleSelection(id);
  };

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      const newIds = selectedIds.filter((itemId) => itemId !== id);
      setSelectedIds(newIds);
      if (newIds.length === 0) setIsSelectionMode(false);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentData.length) {
      setSelectedIds([]);
    } else {
      const allIds = currentData.map((item) => item.id);
      setSelectedIds(allIds);
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // LOGIC BULK ACTIONS

  const performBulkAction = (
    action: "read" | "unread" | "archive" | "delete"
  ) => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      "Konfirmasi",
      `Terapkan tindakan pada ${selectedIds.length} pesan terpilih?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: () => {
            setData((prev) => {
              if (action === "delete") {
                return prev.filter((item) => !selectedIds.includes(item.id));
              }
              return prev.map((item) => {
                if (selectedIds.includes(item.id)) {
                  if (action === "read") return { ...item, read: true };
                  if (action === "unread") return { ...item, read: false };
                  if (action === "archive") return { ...item, archived: true };
                }
                return item;
              });
            });
            exitSelectionMode();
          },
        },
      ]
    );
  };

  // RENDER ITEM
  const renderItem = ({ item }: { item: NotificationData }) => (
    <NotificationItem
      item={item}
      isSelectionMode={isSelectionMode}
      isSelected={selectedIds.includes(item.id)}
      onLongPress={() => handleLongPress(item.id)}
      onPress={() => {
        if (isSelectionMode) {
          toggleSelection(item.id);
        } else {
          if (!item.read) {
            setData((prev) =>
              prev.map((d) => (d.id === item.id ? { ...d, read: true } : d))
            );
          }
          setSelectedItem(item);
          setModalVisible(true);
        }
      }}
    />
  );

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      {/* HEADER */}
      <View
        style={tw`flex-row items-center justify-between p-4 pt-12 bg-slate-800 border-b border-slate-700 shadow-md`}
      >
        {isSelectionMode ? (
          // Header Mode Seleksi
          <View style={tw`flex-row items-center flex-1`}>
            <TouchableOpacity onPress={exitSelectionMode} style={tw`mr-4`}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-lg font-bold flex-1`}>
              {selectedIds.length} Selected
            </Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={tw`text-blue-400 font-bold`}>
                {selectedIds.length === currentData.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Header Normal
          <View style={tw`flex-row items-center flex-1`}>
            <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold flex-1`}>
              Notifications
            </Text>
            <TouchableOpacity
              onPress={() => performBulkAction("read")}
            ></TouchableOpacity>
          </View>
        )}
      </View>

      {/* FILTER TABS */}
      <View
        style={tw`py-4 ${isSelectionMode ? "opacity-50" : "opacity-100"}`}
        pointerEvents={isSelectionMode ? "none" : "auto"}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 gap-2`}
        >
          {["all", "unread", "read", "archived"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={tw`px-5 py-2 rounded-full border ${
                activeTab === tab
                  ? "bg-blue-600 border-blue-600"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Text style={tw`text-white capitalize font-semibold text-xs`}>
                {tab}{" "}
                {tab === "unread" &&
                  data.filter((i) => !i.read && !i.archived).length > 0 &&
                  `(${data.filter((i) => !i.read && !i.archived).length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`px-4 pb-32`}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={tw`items-center mt-20 opacity-50`}>
            <Ionicons name="file-tray-outline" size={64} color="#cbd5e1" />
            <Text style={tw`text-slate-400 mt-4 font-bold`}>
              No notifications found
            </Text>
          </View>
        }
      />

      {/* BOTTOM ACTION BAR */}
      {isSelectionMode && (
        <View
          style={tw`absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 flex-row justify-around items-center pb-8 shadow-2xl`}
        >
          {/* Mark Read */}
          <TouchableOpacity
            onPress={() => performBulkAction("read")}
            style={tw`items-center`}
          >
            <Ionicons name="mail-open-outline" size={24} color="white" />
            <Text style={tw`text-white text-[10px] mt-1`}>Read</Text>
          </TouchableOpacity>

          {/* Mark Unread */}
          <TouchableOpacity
            onPress={() => performBulkAction("unread")}
            style={tw`items-center`}
          >
            <Ionicons name="mail-unread-outline" size={24} color="white" />
            <Text style={tw`text-white text-[10px] mt-1`}>Unread</Text>
          </TouchableOpacity>

          {/* Archive */}
          <TouchableOpacity
            onPress={() => performBulkAction("archive")}
            style={tw`items-center`}
          >
            <Ionicons name="archive-outline" size={24} color="white" />
            <Text style={tw`text-white text-[10px] mt-1`}>Archive</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            onPress={() => performBulkAction("delete")}
            style={tw`items-center`}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <Text style={tw`text-red-500 text-[10px] mt-1`}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL DETAIL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={tw`flex-1 justify-end bg-black/60`}
        >
          <View
            style={tw`bg-slate-800 rounded-t-3xl p-6 border-t border-slate-700`}
          >
            <View style={tw`items-center mb-6`}>
              <View style={tw`w-12 h-1 bg-slate-600 rounded-full`} />
            </View>
            <Text style={tw`text-white font-bold text-lg mb-1`}>
              {selectedItem?.title}
            </Text>
            <Text style={tw`text-slate-400 text-sm mb-6`}>
              {selectedItem?.msg}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`mt-2 items-center bg-slate-700 p-3 rounded-xl`}
            >
              <Text style={tw`text-white font-bold`}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}