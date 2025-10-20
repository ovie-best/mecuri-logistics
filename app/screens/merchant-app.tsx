import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const RideScreen: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Merchant / Ride Screen</Text>
    </View>
  );
};

export default RideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
