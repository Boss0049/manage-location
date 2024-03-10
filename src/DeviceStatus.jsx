import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet, Text, Platform } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import { DataContext } from "./Context";

const bangkok = {
  latitude: 13.736717,
  longitude: 100.523186,
};

export default function DeviceStatus() {
  const dataContext = useContext(DataContext);
  const { deviceList } = dataContext;

  const [dataActive, setDataActive] = useState([]);
  const [dataInactive, setDataInactive] = useState([]);
  const [dataLocation, setDataLocation] = useState([]);

  useEffect(() => {
    const deviceFormat = deviceList.map((device) => {
      const { deviceName, deviceType, isActive } = device;
      return [deviceName, deviceType, isActive ? "Active" : "Inactive"];
    });

    const dataActive = deviceFormat.filter((device) => device[2] === "Active");
    const dataInactive = deviceFormat.filter(
      (device) => device[2] === "Inactive"
    );

    const locationFormat = deviceList.map((location) => {
      const { latitude, longitude } = location;
      return {
        latitude,
        longitude,
      };
    });
    setDataLocation(locationFormat);
    setDataActive(dataActive);
    setDataInactive(dataInactive);
  }, []);

  return (
    <View className="flex-1 bg-[#D9D9D9]">
      <View className="h-full m-5">
        <View className="max-h-[30%] mb-2">
          <MapView
            className="h-full"
            provider={
              Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            region={bangkok}
            minZoomLevel={5}
            camera={{
              center: bangkok,
              pitch: 10,
              zoom: 10,
            }}
          >
            {dataLocation?.map((location, index) => (
              <Marker key={index} coordinate={location} />
            ))}
          </MapView>
        </View>
        <View className="max-h-[30%] flex-row justify-between m-3">
          <Text className="font-semibold">
            Active devices: {dataActive.length}
          </Text>
          <Text className="font-semibold text-gray-500">
            Inactive devices: {dataInactive.length}
          </Text>
        </View>
        <ScrollView className="max-h-[55%] bg-white px-5 pt-1">
          <Table>
            <Row
              data={["Device Name", "Device type", "Status"]}
              style={styles.head}
              widthArr={[120, 120, 120]}
              textStyle={styles.textHead}
            />
            {[...dataActive, ...dataInactive].map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    style={{ width: 120, paddingBottom: 10 }}
                    data={cellData}
                    textStyle={
                      cellIndex === 2
                        ? rowData[cellIndex] === "Active"
                          ? styles.textStatus
                          : styles.textStatusInactive
                        : styles.text
                    }
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    textAlign: "center",
    fontWeight: "bold",
    height: 40,
  },
  textHead: { textAlign: "left", fontWeight: "bold" },
  text: { textAlign: "left", fontWeight: "500" },
  textStatus: { textAlign: "left", color: "#00ff" },
  textStatusInactive: { textAlign: "left", color: "rgb(107,114,128)" },
  row: { flexDirection: "row" },
});
