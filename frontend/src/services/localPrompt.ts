import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "offline_prompts";

// Tipe data prompt lokal
export interface LocalPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  example_output: string;
  category: string;
  platform: string;
  created_at: string;
  is_local: boolean;
}

// Ambil Semua Prompt Lokal
export const getLocalPrompts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e: any) {
    console.log(e.message);
    return [];
  }
};

// Simpan Prompt Baru ke Lokal
export const saveLocalPrompt = async (data: any) => {
  try {
    const existingPrompts = await getLocalPrompts();

    const newPrompt: LocalPrompt = {
      id: "local_" + Date.now(),
      title: data.title,
      description: data.description,
      content: data.content,
      example_output: data.example_output,
      category: data.category,
      platform: data.platform,
      created_at: new Date().toISOString(),
      is_local: true,
    };

    const updatedPrompts = [newPrompt, ...existingPrompts];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrompts));
    return { status: "success", message: "Disimpan di memori HP" };
  } catch (e: any) {
    console.log(e.message);
    return { status: "error", message: "Gagal menyimpan lokal" };
  }
};

// Hapus Prompt Lokal
export const deleteLocalPrompt = async (id: string) => {
  try {
    const existingPrompts = await getLocalPrompts();
    const filtered = existingPrompts.filter((p: LocalPrompt) => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { status: "success" };
  } catch (e: any) {
    console.log(e.message);
    return { status: "error" };
  }
};

export const updateLocalPrompt = async (id: string, updatedData: any) => {
  try {
    const existingPrompts = await getLocalPrompts();

    const index = existingPrompts.findIndex((p: any) => p.id === id);

    if (index !== -1) {
      existingPrompts[index] = {
        ...existingPrompts[index],
        ...updatedData,
        title: updatedData.title,
        description: updatedData.description,
        content: updatedData.content,
        example_output: updatedData.example_output,
        category: updatedData.category,
        platform: updatedData.platform,
      };

      // Simpan kembali ke storage
      await AsyncStorage.setItem(
        "offline_prompts",
        JSON.stringify(existingPrompts)
      );
      return { status: "success", message: "Data lokal diperbarui" };
    }

    return { status: "error", message: "ID tidak ditemukan" };
  } catch (e: any) {
    console.log(e.message);
    return { status: "error", message: "Gagal update lokal" };
  }
};
