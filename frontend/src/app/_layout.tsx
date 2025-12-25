import React, { useEffect, useState, useRef } from "react";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Platform,
  View,
  Text,
  Animated,
  ActivityIndicator,
  Keyboard,
  Image,
  LogBox,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";

LogBox.ignoreLogs(['style props are deprecated. Use "boxShadow"']);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // State untuk Splash Screen & Auth
  const [isAppReady, setIsAppReady] = useState<any>(false);
  const [userSession, setUserSession] = useState<any>(null);

  // Animasi Splash
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Konfigurasi Navigation Bar Android (Hidden/Transparan)
    async function configureBar() {
      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      }
    }
    configureBar();

    // Logic Utama: Cek Login & Jalankan Splash
    async function prepareApp() {
      try {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();

        await new Promise((resolve) => setTimeout(resolve, 5000)); //Splash screen 5 detik

        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUserSession(JSON.parse(userData));
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepareApp();

    // Listener Keyboard (Agar navbar tetap hidden)
    const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("hidden");
      }
    });

    return () => keyboardListener.remove();
  }, [scaleAnim]);

  useEffect(() => {
    if (!isAppReady) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(async () => {
      // Cek Koneksi Internet
      const networkState = await NetInfo.fetch();
      const isOnline = networkState.isConnected;

      // Logika Pengarahan
      if (userSession) {
        // KASUS 1: Ada data user tersimpan (Pernah login)

        if (!isOnline) {
          // Jika Offline, beri tahu user tapi TETAP MASUK
          Toast.show({
            type: "info",
            text1: "Mode Offline 📡",
            text2: "Anda masuk menggunakan data lokal.",
            position: "bottom",
          });
        }

        // Langsung lempar ke Dashboard
        router.replace("/(tabs)");
      } else {
        // KASUS 2: Tidak ada sesi (User baru/Logout)
        router.replace("/login");
      }
    });
  }, [isAppReady, userSession, fadeAnim, router]);

  // 3. Redirect setelah App Ready
  useEffect(() => {
    if (!isAppReady) return;

    // Animasi Fade Out Splash Screen
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Setelah animasi selesai, arahkan user
      if (userSession) {
        router.replace("/(tabs)"); // Ke Dashboard
      } else {
        router.replace("/login"); // Ke Login
      }
    });
  }, [isAppReady, userSession, fadeAnim, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {/* NAVIGASI UTAMA */}
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="create-prompt" options={{ headerShown: false }} />
          <Stack.Screen name="edit-prompt" options={{ headerShown: false }} />
          <Stack.Screen name="library" options={{ headerShown: false }} />
          <Stack.Screen name="favorites" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="privacy" options={{ headerShown: false }} />
          <Stack.Screen name="prompt-detail" options={{ headerShown: false }} />
          <Stack.Screen name="credits" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>

        {/* SPLASH SCREEN OVERLAY */}
        <Animated.View
          style={[
            tw`absolute inset-0 bg-slate-900 justify-center items-center z-50`,
            {
              opacity: fadeAnim,
              pointerEvents: isAppReady ? "none" : "auto",
            },
          ]}
        >
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }], alignItems: "center" }}
          >
            <View style={tw`mb-6 shadow-2xl shadow-blue-500/50 rounded-xl`}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={tw`w-36 h-36 rounded-xl`}
                resizeMode="contain"
              />
            </View>

            <Text
              style={tw`text-white text-4xl font-black tracking-wider mb-2`}
            >
              Sigil <Text style={tw`text-blue-500`}>Codex</Text>
            </Text>

            <Text
              style={tw`text-slate-400 text-sm font-medium tracking-widest uppercase`}
            >
              Craft Your Magic
            </Text>
          </Animated.View>
          <View style={tw`absolute bottom-10 items-center`}>
            <ActivityIndicator size="small" color="#3b82f6" style={tw`mb-4`} />
            <Text style={tw`text-slate-600 text-[10px]`}>
              © 2025 Kelompok Aplikasi Mobile • UPN Veteran Jatim
            </Text>
          </View>
        </Animated.View>
        <Toast />
      </View>
      <StatusBar style="light" backgroundColor="transparent" translucent />
    </ThemeProvider>
  );
}
