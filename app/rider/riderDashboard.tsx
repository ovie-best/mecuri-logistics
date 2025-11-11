// import * as Location from "expo-location";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// export default function RiderDashboard() {
//   const router = useRouter();
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;
//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);
//     })();
//   }, []);

//   if (!location)
//     return <Text className="text-center mt-10">Loading map...</Text>;

//   return (
//     <View className="flex-1">
//       <MapView
//         className="flex-1"
//         initialRegion={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         <Marker coordinate={location} title="You" />
//       </MapView>

//       {/* Top Bar */}
//       <View className="absolute top-10 w-full items-center">
//         <TouchableOpacity className="bg-green-600 px-6 py-3 rounded-full">
//           <Text className="text-white font-bold">🟢 Online</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Incoming Request Simulation */}
//       <TouchableOpacity
//         onPress={() => router.push("/(rider)/request")}
//         className="absolute bottom-12 self-center bg-blue-600 px-6 py-4 rounded-full"
//       >
//         <Text className="text-white font-bold text-lg">Simulate Request</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
