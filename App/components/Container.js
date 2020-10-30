import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const Container = ({ children, viewColor }) => (
  <View style={{ flex: 1, backgroundColor: viewColor }}>
    <LinearGradient colors={["rgba(0,0,0,0.8)", "transparent"]}>
      {children}
    </LinearGradient>
  </View>
);

// cold = #3498db
// middle = #1abc9c
// hot = #eb4d4b
