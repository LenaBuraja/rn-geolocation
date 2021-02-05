import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, Button } from 'react-native';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default function App() {

  const [region, setRegion] = useState({
    latitude: 53.9,
    longitude: 27.56667,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
    const [delta, setDelta] = useState(0.005);

  const [swowMap, setShowMap] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [flags, setFlags] = useState<LatLng[]>([]);
  const [pointsDirections, setPointsDirections] = useState();

  useEffect(() => {
    getLocationAsync()
  }, []);
  
  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation});
    const { latitude, longitude } = location.coords
    setRegion({
      latitude,
      longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
    setShowMap(true);
  };

  useEffect(() => {
    setRegion({
      ...region,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
  }, [delta]);

  const directions = useCallback(() => {
    //https://maps.googleapis.com/maps/api/directions/outputFormat?parameters
  }, []);

  const createRoad = () => {
    const newFlags: LatLng[] = [{...region}, { latitude: 53.911375, longitude: 27.517275 }, { latitude: 53.890755, longitude: 27.550997 }];
    setFlags(newFlags);
  };
 
  return (
    <>
      <StatusBar />
        {
          errorMessage ? <Text style={styles.textLocationNeeded}>{errorMessage}</Text>
            : swowMap
            ? <>
            <Button onPress={async ()=> {
              const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
              setDelta(0.005);
              setRegion({
                ...location.coords,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
            }} title={'Curr'} />
            <Button onPress={async ()=> {
              setDelta((prev) => prev - 0.005);
            }} title={'+'} />
            <Button onPress={async ()=> {
              setDelta((prev) => prev + 0.005);
            }} title={'-'} />
            <Button onPress={async ()=> {
              createRoad();
            }} title={'Roud'} />
            <MapView
              followsUserLocation
              showsUserLocation
              //initialRegion={initialRegion}
              region={region}
              //onRegionChange={setRegion}
              provider={PROVIDER_GOOGLE}
              style={styles.map1}
            >
              {flags !== [] &&
                flags.map((marker, idx) => (
                  <Marker
                    coordinate={marker}
                    title={`Точка №${idx + 1}`}
                    //description={marker.description}
                  />
                ))
              }
              {/*flags !== [] &&
                <Polyline
                  key="editingPolyline"
                  coordinates={flags}
                  strokeColor="#F00"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={1}
                />
              */}
            </MapView>
          </>
          : <Text style={styles.textLocationNeeded}>We need your location data..</Text>
        }
    </>
  );
}

const styles = StyleSheet.create({
  containerNoLocation: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
  },
  map2: {
    flex: 1,
    position: 'absolute',
  },
  textLocationNeeded: {
    fontSize: 16,
    marginBottom: 16
  },
  map1: {
    height: '100%',
    marginVertical: 50,
  },
  map: {
    height: 200,
    marginVertical: 50,
  },
  but: {
    marginRight: 10,
    marginTop: 60,
    position: 'absolute',
  },
});
