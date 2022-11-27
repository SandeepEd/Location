import React, { useState, useRef } from "react";
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as LocationServices from "expo-location";

const Location = () => {
  const mapRef = useRef(null);
  const [ isLoading, setIsLoading ] = useState(false); 
  const [region, setRegion] = useState({
    latitude: 16.089809,
    longitude: 80.169601,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const handleOnClick = async () => {
    setIsLoading(true)
    let { status } = await LocationServices.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setIsLoading(false)
      return;
    }
    const { coords } = await LocationServices.getCurrentPositionAsync();
    console.log(coords);
    const currentRegion = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setIsLoading(false);
    setRegion(currentRegion);
    mapRef.current.animateToRegion(currentRegion, 3 * 1000);
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        <Marker pinColor="green" coordinate={region} />
      </MapView>
      <TouchableOpacity onPress={handleOnClick} style={{ height: 40, width: '80%', justifyContent: 'center', alignItems: 'center',
         marginTop: 10, backgroundColor: '#24a0ed', borderRadius: '5px' }}>
        <Text style={styles.locationText}>Go To My Location
        {isLoading && <ActivityIndicator color={"white"} />}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Current latitude: {region.latitude}</Text>
      <Text style={styles.text}>Current longitude: {region.longitude}</Text>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: '7%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '90%'
  },
  buttonStyle: {
    position: "relative",
    bottom: 0,
    marginBottom: 100,
  },
  locationText: {
    color: 'white',
    fontSize: "20",
  },
  text:{
    fontSize: '20'
  }
});
