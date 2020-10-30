import React from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  Picker,
} from "react-native";
// import { Picker } from "@react-native-community/picker";

export const SearchBar = ({
  onSearch,
  searchButtonEnabled = false,
  selectedValue,
  onValueChange,
  ...props
}) => (
  <View
    style={{
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "#eee",
      alignItems: "center",
    }}
  >
    <Image
      source={require("../assets/search.png")}
      resizeMode="contain"
      style={{
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: "rgba(0, 0, 0, 0.4)",
      }}
    />
    <TextInput
      style={{
        fontSize: 18,
        flex: 1,
      }}
      keyboardType="number-pad"
      {...props}
    />
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: 152, color: "#000" }}
      onValueChange={onValueChange}
    >
      <Picker.Item label="Imperial (°F)" value="imperial" />
      <Picker.Item label="Metric (°C)" value="metric" />
    </Picker>
    <TouchableOpacity onPress={onSearch} disabled={!searchButtonEnabled}>
      <Text
        style={{
          color: searchButtonEnabled ? "#147efb" : "rgba(0, 0, 0, 0.5)",
        }}
      >
        Get Weather
      </Text>
    </TouchableOpacity>
  </View>
);
