import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "twrnc";

interface SelectionGroupProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (item: string) => void;
  colorTheme?: "blue" | "purple";
}

export default function SelectionGroup({
  label,
  options,
  selected,
  onSelect,
  colorTheme = "blue",
}: SelectionGroupProps) {
  const activeColor =
    colorTheme === "blue"
      ? "bg-blue-600 border-blue-600"
      : "bg-purple-600 border-purple-600";

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-slate-400 mb-3 font-bold uppercase text-xs ml-1`}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`flex-row gap-2`}>
          {options.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              style={tw`px-4 py-2 rounded-full border ${
                selected === item
                  ? activeColor
                  : "bg-slate-800 border-slate-600"
              }`}
            >
              <Text style={tw`text-white font-semibold text-xs`}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
