import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

function Card({ text, iconName, iconOnly, rightComponent, leftComponents }) {
  return (
    <>
      {iconOnly ? (
        <View className="w-[150px] h-[150px] bg-white justify-center items-center">
          <MaterialIcons name={iconName} size={80} color="black" />
        </View>
      ) : (
        <View className={`w-[150px] h-[150px] bg-white`}>
          <View
            className={`w-full h-[70%] ${
              rightComponent && leftComponents
                ? "flex-row justify-between"
                : "justify-center"
            }`}
          >
            {leftComponents}
            <View
              className={`${
                rightComponent && leftComponents
                  ? "self-end w-[50%]"
                  : "w-full items-center"
              }`}
            >
              <MaterialIcons name={iconName} size={80} color="black" />
            </View>
            {rightComponent}
          </View>

          {text && (
            <View className="h-[25%] items-center justify-center">
              <Text className="text-md justify-self-end text-center font-semibold whitespace-pre-line px-5">
                {text}
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

export default Card;
