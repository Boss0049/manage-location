import React, { useState, useEffect, useContext } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { firebase } from "../config";
import { DataContext } from "./Context";

export default function AddDevice({ navigation, route }) {
  const { targetDevice } = route.params;
  const [deviceName, setDeviceName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const dataContext = useContext(DataContext);

  const { groupRef, devicesRef, deviceList, setDeviceList, groupId } =
    dataContext;

  useEffect(() => {
    if (targetDevice?.deviceId) {
      setDeviceName(targetDevice?.deviceName);
      setIsEdit(true);
    }
  }, []);

  const onEdit = async () => {
    if (!deviceName) {
      Alert.alert("Device Name is require.", "Please input Device Name.", [
        {
          text: "Close",
          onPress: () => console.log("Close Pressed"),
          style: "destructive",
        },
      ]);
      return;
    }
    const dataGroup = await groupRef.where("groupId", "==", groupId).get();
    const findDeviceName = await devicesRef
      .where("deviceName", "==", deviceName)
      .get();

    if (findDeviceName.empty) {
      Alert.alert(
        "This Name is not found.",
        "Please check Device Name again.",
        [
          {
            text: "Close",
            onPress: () => console.log("Close Pressed"),
            style: "destructive",
          },
        ]
      );
      return;
    }

    const deviceId = findDeviceName.docs[0].data()?.deviceId;

    const currentDeviceIdList = dataGroup.docs[0].data()?.deviceIdList;
    if (
      currentDeviceIdList.includes(deviceId) &&
      targetDevice?.deviceId !== deviceId
    ) {
      Alert.alert(
        "This Device Name is already in this group.",
        "Please check Device Name again.",
        [
          {
            text: "Close",
            onPress: () => console.log("Close Pressed"),
            style: "destructive",
          },
        ]
      );
      return;
    }

    const newCurrentDeviceIdList = currentDeviceIdList.filter(
      (currentDeviceId) => currentDeviceId !== targetDevice?.deviceId
    );
    await groupRef.doc(dataGroup.docs[0].id).update({
      ...dataGroup.docs[0].data(),
      deviceIdList: [deviceId, ...newCurrentDeviceIdList],
    });
    const newDataMap = deviceList.map((device) => {
      return device.deviceId === targetDevice?.deviceId
        ? findDeviceName.docs[0].data()
        : device;
    });
    setDeviceList(newDataMap);
    Alert.alert("Update", `Save ${deviceName} to this group.`, [
      {
        text: "Close",
        onPress: () => console.log("Close Pressed"),
        style: "destructive",
      },
    ]);
    setDeviceName("");
    navigation.goBack();
  };

  const submit = async () => {
    try {
      if (!deviceName) {
        Alert.alert("Device Name is require.", "Please input Device Name.", [
          {
            text: "Close",
            onPress: () => console.log("Close Pressed"),
            style: "destructive",
          },
        ]);
        return;
      }

      const findDeviceName = await devicesRef
        .where("deviceName", "==", deviceName)
        .get();

      if (findDeviceName.empty) {
        Alert.alert(
          "This Name is not found.",
          "Please check Device Name again.",
          [
            {
              text: "Close",
              onPress: () => console.log("Close Pressed"),
              style: "destructive",
            },
          ]
        );
        return;
      }

      const dataGroup = await groupRef.where("groupId", "==", groupId).get();
      const deviceId = findDeviceName.docs[0].data()?.deviceId;
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (dataGroup.empty) {
        const data = {
          groupId: groupId,
          deviceIdList: [deviceId],
          createAt: timestamp,
          updateAt: timestamp,
        };

        await groupRef.add(data);
        setDeviceList([findDeviceName.docs[0].data()]);
      } else {
        const currentDeviceIdList = dataGroup.docs[0].data()?.deviceIdList;
        if (currentDeviceIdList.includes(deviceId)) {
          Alert.alert(
            "This Device Name is already in this group.",
            "Please check Device Name again.",
            [
              {
                text: "Close",
                onPress: () => console.log("Close Pressed"),
                style: "destructive",
              },
            ]
          );
          return;
        }
        await groupRef.doc(dataGroup.docs[0].id).update({
          ...dataGroup.docs[0].data(),
          deviceIdList: [...currentDeviceIdList, deviceId],
        });
        setDeviceList([findDeviceName.docs[0].data(), ...deviceList]);
      }

      Alert.alert("Success", `Save ${deviceName} to this group.`, [
        {
          text: "Close",
          onPress: () => console.log("Close Pressed"),
          style: "destructive",
        },
      ]);
      setDeviceName("");
      navigation.goBack();
    } catch (err) {
      console.log("======+>>err", err);
      Alert.alert("Some Wrong", "Please try again.", [
        {
          text: "Close",
          onPress: () => console.log("Close Pressed"),
          style: "destructive",
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-[#D9D9D9]">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="h-[90%] bg-white items-center m-6 py-10">
          <MaterialIcons name="phone-iphone" size={100} color="black" />
          <View className="h-[80%]">
            <View className="flex-row w-full mx-10 mt-16 items-center justify-evenly">
              <Text className="w-[30%] font-bold">Device Name :</Text>
              <TextInput
                className="w-[60%] border-2 border-[#D9D9D9] py-2 px-2 rounded-md bg-white"
                placeholder="Device Name"
                placeholderTextColor="#aaaaaa"
                onChangeText={(value) => setDeviceName(value)}
                value={deviceName}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View className="w-full flex-row justify-around">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-[40%] border rounded-[50] border-black border-collapse bg-white py-3"
            >
              <Text className="text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isEdit ? onEdit : submit}
              className="w-[40%] border rounded-[50] border-black border-collapse bg-[#D9D9D9] py-3"
            >
              <Text className="text-center font-semibold">
                {isEdit ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
