import React, { useEffect, useContext } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import Card from "./components/Card";
import { DataContext } from "./Context";

function Home({ navigation, route }) {
  const dataContext = useContext(DataContext);
  const { groupRef, devicesRef, deviceList, setDeviceList, groupId } =
    dataContext;

  const { logout } = route.params;

  const fetchData = async () => {
    const dataGroup = await groupRef.where("groupId", "==", groupId).get();
    const deviceIdList = dataGroup.docs[0].data()?.deviceIdList;
    const getDeviceList = await devicesRef
      .where("deviceId", "in", deviceIdList)
      .get();
    const newGetDeviceList = getDeviceList.docs.map((device) => device.data());
    setDeviceList(newGetDeviceList);
  };

  useEffect(() => {
    if (groupId) fetchData();
  }, [groupId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Do you want to log out?", "Please press confirm.", [
              {
                text: "Cancel",
                style: "default",
              },
              {
                text: "Confirm",
                onPress: logout,
                style: "destructive",
              },
            ]);
          }}
        >
          <Text className="text-lg font-semibold text-[#FFF200]">Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-[#D9D9D9]">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex flex-row justify-evenly mt-10">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ManageDevices", {
                groupRef,
                devicesRef,
                deviceList,
                groupId,
              })
            }
          >
            <Card text={"Manage\nDevices"} iconName="phone-iphone" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DeviceStatus", {
                groupRef,
                devicesRef,
                deviceList,
              })
            }
          >
            <Card text={"Device\nStatus"} iconName="toggle-on" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Home;
