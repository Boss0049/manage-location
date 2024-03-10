import React, { useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import Card from "./components/Card";
import { MaterialIcons } from "@expo/vector-icons";
import { DataContext } from "./Context";

function ManageDevices({ navigation }) {
  const dataContext = useContext(DataContext);
  const { groupRef, devicesRef, deviceList, setDeviceList, groupId } =
    dataContext;

  const deleteDevice = async (targetDeviceId) => {
    try {
      const dataGroup = await groupRef.where("groupId", "==", groupId).get();
      const deviceIdList = dataGroup.docs[0].data()?.deviceIdList;
      const filterDeviceIdList = deviceIdList?.filter(
        (deviceId) => deviceId !== targetDeviceId
      );
      const filterDeviceList = deviceList?.filter(
        (deviceId) => deviceId.deviceId !== targetDeviceId
      );
      await groupRef.doc(dataGroup.docs[0].id).update({
        ...dataGroup.docs[0].data(),
        deviceIdList: filterDeviceIdList,
      });
      setDeviceList(filterDeviceList);
    } catch (err) {
      Alert.alert("Some thing wrong", "Please try again.", [
        {
          text: "Cancel",
          style: "default",
        },
      ]);
    }
  };

  const RightComponent = ({ deviceId }) => {
    const targetData = deviceList.find((device) => {
      return device.deviceId === deviceId;
    });
    return (
      <View className="pr-2 pt-2 w-[25%] gap-y-5">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddDevice", {
              groupId,
              groupRef,
              devicesRef,
              targetDevice: targetData,
            })
          }
        >
          <MaterialIcons name="edit" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Do you want to delete", "this device ?", [
              {
                text: "Cancel",
                style: "default",
              },
              {
                text: "Delete",
                onPress: () => deleteDevice(deviceId),
                style: "destructive",
              },
            ])
          }
        >
          <MaterialIcons name="delete-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
  const LeftComponent = ({ label }) => {
    return (
      <View className="pl-2 pt-2 w-[25%]">
        <Text className="font-bold text-[10px] ">{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#D9D9D9]">
      <ScrollView>
        <View className="flex flex-row flex-wrap sw-full mt-10 mx-5 justify-between">
          {deviceList?.map((device, index) => {
            return (
              <View className="w-[50%] items-center mb-5" key={device.deviceId}>
                <Card
                  leftComponents={<LeftComponent label={index + 1} />}
                  rightComponent={<RightComponent deviceId={device.deviceId} />}
                  text={device.deviceName}
                  iconName="phone-iphone"
                />
              </View>
            );
          })}
          <View className="w-[50%] items-center mb-5">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddDevice", {
                  groupRef,
                  devicesRef,
                  deviceList,
                  setDeviceList,
                  groupId,
                })
              }
            >
              <Card iconName="add-circle-outline" iconOnly />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ManageDevices;
