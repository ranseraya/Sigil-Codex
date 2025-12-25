import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { NotificationData } from '../app/notifications';

export interface NotificationItemProps {
    item: NotificationData;
    isSelected: boolean;
    isSelectionMode: boolean;
    onPress: () => void;
    onLongPress: () => void;
}

export default function NotificationItem({ item, isSelected, isSelectionMode, onPress, onLongPress }: NotificationItemProps) {
    const getIcon = (type: string) => {
        if(type === 'system') return { name: 'settings', color: '#64748b' };
        if(type === 'like') return { name: 'heart', color: '#ec4899' };
        if(type === 'warning') return { name: 'warning', color: '#eab308' };
        return { name: 'information-circle', color: '#3b82f6' };
    };

    const iconData = getIcon(item.type);

    return (
        <TouchableOpacity 
            onLongPress={onLongPress}
            onPress={onPress}
            style={tw`flex-row bg-slate-800 p-4 rounded-xl mb-3 border 
              ${isSelected ? 'border-blue-500 bg-blue-900/20' : 
                (item.read ? 'border-slate-700' : 'border-l-4 border-l-blue-500 border-t border-t-slate-700 border-r border-r-slate-700 border-b border-b-slate-700')
              }`}
        >
            {/* CHECKBOX */}
            {isSelectionMode && (
                <View style={tw`justify-center mr-4`}>
                    <View style={tw`w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'} justify-center items-center`}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                </View>
            )}

            {/* Icon Tipe */}
            <View style={tw`bg-slate-700/50 w-10 h-10 rounded-full justify-center items-center mr-4`}>
                <Ionicons name={iconData.name as any} size={20} color={iconData.color} />
            </View>
            
            <View style={tw`flex-1`}>
                <View style={tw`flex-row justify-between mb-1`}>
                    <Text style={tw`text-white font-bold flex-1 mr-2 ${item.read ? 'font-normal text-slate-300' : ''}`}>{item.title}</Text>
                    <Text style={tw`text-slate-500 text-xs`}>{item.time}</Text>
                </View>
                <Text style={tw`text-slate-400 text-sm leading-5`} numberOfLines={2}>{item.msg}</Text>
            </View>
        </TouchableOpacity>
    );
}