import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import tw from 'twrnc';

interface CustomInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    height?: string;
}

export default function CustomInput({ 
    label, 
    value, 
    onChangeText, 
    multiline = false, 
    height,
    placeholder,
    ...props 
}: CustomInputProps) {
    return (
        <View style={tw`mb-4`}>
            <Text style={tw`text-slate-400 mb-2 font-bold uppercase text-xs ml-1`}>
                {label}
            </Text>
            <TextInput 
                style={tw`bg-slate-800 text-white p-4 rounded-xl border border-slate-700 ${height ? height : ''}`}
                value={value} 
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#64748b"
                multiline={multiline}
                textAlignVertical={multiline ? "top" : "center"}
                {...props}
            />
        </View>
    );
}