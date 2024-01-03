import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import UserModificationPage from './UserModificationPage';
import reactDom from 'react-dom';


const App2 = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  

  const API_KEY = 'aa32713062cd9fef1cffab33a372688c';

  const getWeather = async () => {
    try {
      setLoading(true);

      const currentResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const currentTemperatureCelsius = currentResponse.data.main.temp - 273.15;

      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
      const forecasts = forecastResponse.data.list.map(item => ({
        date: item.dt_txt,
        temperatureCelsius: item.main.temp - 273.15,
        description: item.weather[0].description,
      }));

      setWeather({
        current: {
          name: currentResponse.data.name,
          description: currentResponse.data.weather[0].description,
          temperatureCelsius: currentTemperatureCelsius,
        },
        forecast: forecasts,
      });

      setSelectedForecast(null);
    } catch (error) {
      console.error('Error fetching weather data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForecastPress = (forecast) => {
    setSelectedForecast(forecast);
  };

  const renderCurrentWeather = () => (
    <>
      <Text style={styles.weatherText}>Météo à {weather.current.name} :</Text>
      <Text style={styles.weatherText}>{weather.current.description}</Text>
      <Text style={styles.weatherText}>Température actuelle : {weather.current.temperatureCelsius.toFixed(2)}°C</Text>
    </>
  );


  const navigateToUserModification = () => {
    navigation.navigate('UserModificationPage');
  };

  useEffect(() => {
    // Actions supplémentaires lors du chargement de l'application
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userModificationButton} onPress={() => navigation.navigate('UserModificationPage')}>
        <Text style={styles.userModificationButtonText}>Modifier mes informations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deconnexionButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.userModificationButtonText}>Déconnexion</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Météo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom de votre ville"
        onChangeText={(text) => setCity(text)}
        value={city}
      />
      <Button title="Obtenir la météo" onPress={getWeather} />
      {loading && <Text style={styles.loadingText}>Chargement...</Text>}
      {weather && (
        <View style={styles.weatherContainer}>
          {selectedForecast ? (
            <View style={styles.selectedForecastContainer}>
              <Text style={styles.selectedForecastText}>Prévision du {selectedForecast.date}</Text>
              <Text style={styles.selectedForecastText}>Température : {selectedForecast.temperatureCelsius.toFixed(2)}°C</Text>
            </View>
          ) : (
            renderCurrentWeather()
          )}

          <Text style={styles.weatherText}>Prévisions pour les jours suivants :</Text>
          <View style={styles.forecastScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastContainer}>
              {weather.forecast.map(item => (
                <TouchableOpacity
                  key={item.date}
                  style={styles.forecastItem}
                  onPress={() => handleForecastPress(item)}
                >
                  <Text>{item.date}</Text>
                  <Text>{item.description}</Text>
                  <Text>{item.temperatureCelsius.toFixed(2)}°C</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}


      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '40%',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 10,
  },
  forecastContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  forecastItem: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  selectedForecastContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedForecastText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastScrollContainer: {
    marginTop: 10,
    width: '80%',
  },
  userModificationButton: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 8,
  },
  userModificationButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    
  },

  deconnexionButton: {
    position: 'absolute',
    top: 10,
    right: 30,
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 8,

  },
});

export default App2;
