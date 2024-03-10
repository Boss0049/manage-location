import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text } from "react-native";
import { enableLatestRenderer } from "react-native-maps";
import { firebase } from "./config";
import AddDevice from "./src/AddDevice";
import { DataContext } from "./src/Context";
import DeviceStatus from "./src/DeviceStatus";
import Home from "./src/Home";
import Login from "./src/Login";
import ManageDevices from "./src/ManageDevices";

enableLatestRenderer();

const Stack = createNativeStackNavigator();

export default function App() {
  const groupRef = firebase.firestore().collection("group");
  const devicesRef = firebase.firestore().collection("devices");
  const [userInfo, setUserInfo] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [deviceList, setDeviceList] = useState([]);

  return (
    <DataContext.Provider
      value={{
        groupRef,
        devicesRef,
        userInfo,
        setUserInfo,
        deviceList,
        setDeviceList,
        groupId,
        setGroupId,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerStyle: { backgroundColor: "#3A3A3A" } }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "",
              headerLeft: () => (
                <Text className="text-lg font-semibold text-white">Home</Text>
              ),
            }}
          />
          <Stack.Screen
            name="DeviceStatus"
            component={DeviceStatus}
            options={{
              title: "",
              headerBackTitle: "Back",
              headerRight: () => (
                <Text className="text-lg font-semibold text-white">
                  Device Status
                </Text>
              ),
            }}
          />
          <Stack.Screen
            name="ManageDevices"
            component={ManageDevices}
            options={{
              title: "",
              headerBackTitle: "Back",
              headerRight: () => (
                <Text className="text-lg font-semibold text-white">
                  Manage Devices
                </Text>
              ),
            }}
          />
          <Stack.Screen
            name="AddDevice"
            component={AddDevice}
            options={{
              title: "",
              headerBackTitle: "Back",
              headerRight: () => (
                <Text className="text-lg font-semibold text-white">
                  Add Device
                </Text>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
}
