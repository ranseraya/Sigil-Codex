import React from 'react';
import { View, Text, Switch } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface SettingsToggleProps {
    icon: any;
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}

export default function SettingsToggle({ icon, title, subtitle, value, onValueChange }: SettingsToggleProps) {
    return (
        <View style={tw`flex-row justify-between items-center bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700`}>
             <View style={tw`flex-row items-center gap-3`}>
                <Ionicons name={icon} size={22} color="white" />
                <View>
                    <Text style={tw`text-white font-semibold`}>{title}</Text>
                    <Text style={tw`text-slate-400 text-xs`}>{subtitle}</Text>
                </View>
            </View>
            <Switch 
                value={value} 
                onValueChange={onValueChange} 
                trackColor={{false: "#334155", true: "#2563eb"}} 
                thumbColor={value ? "#ffffff" : "#f4f3f4"}
            />
        </View>
    );
}