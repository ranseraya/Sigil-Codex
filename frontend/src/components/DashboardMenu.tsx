import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface DashboardMenuProps {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    route: any;
}

export default function DashboardMenu({ title, subtitle, icon, color, route }: DashboardMenuProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(route)}
            activeOpacity={0.8}
            style={tw`bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-700 flex-row items-center shadow-sm`}
        >
            <View style={tw`${color} w-14 h-14 rounded-full justify-center items-center mr-4`}>
                <Ionicons name={icon} size={28} color="white" />
            </View>
            <View style={tw`flex-1`}>
                <Text style={tw`text-white text-lg font-bold`}>{title}</Text>
                <Text style={tw`text-slate-400 text-xs`}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#475569" />
        </TouchableOpacity>
    );
}