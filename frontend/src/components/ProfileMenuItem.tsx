import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface ProfileMenuItemProps {
    icon: any;
    label: string;
    onPress: () => void;
    color?: string;
    isLast?: boolean;
}

export default function ProfileMenuItem({ 
    icon, 
    label, 
    onPress, 
    color = "text-white", 
    isLast = false 
}: ProfileMenuItemProps) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={tw`flex-row items-center p-4 ${!isLast ? 'border-b border-slate-700' : ''}`}
        >
            <View style={tw`w-8`}>
                <Ionicons 
                    name={icon} 
                    size={20} 
                    color={color === "text-red-500" ? "#ef4444" : "#94a3b8"} 
                />
            </View>
            <Text style={tw`flex-1 ${color} font-medium`}>{label}</Text>
            
            {color !== "text-red-500" && (
                <Ionicons name="chevron-forward" size={16} color="#475569" />
            )}
        </TouchableOpacity>
    );
}