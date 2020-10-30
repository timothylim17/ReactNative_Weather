import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { format } from "date-fns";

import { weatherApi } from "../util/weatherApi";
import { Container } from "../components/Container";
import { WeatherIcon } from "../components/WeatherIcon";
import { BasicRow } from "../components/List";
import { H1, H2, P } from "../components/Text";
import { addRecentSearch } from "../util/recentSearch";

const groupForecastByDay = (list) => {
  const data = {};

  list.forEach((item) => {
    const [day] = item.dt_txt.split(" ");
    if (data[day]) {
      if (data[day].temp_max < item.main.temp_max) {
        data[day].temp_max = item.main.temp_max;
      }

      if (data[day].temp_min > item.main.temp_min) {
        data[day].temp_min = item.main.temp_min;
      }
    } else {
      data[day] = {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
      };
    }
  });

  const formattedList = Object.keys(data).map((key) => {
    return {
      day: key,
      ...data[key],
    };
  });

  return formattedList;
};

export default class Details extends React.Component {
  state = {
    currentWeather: {},
    loadingCurrentWeather: true,
    forecast: [],
    loadingForecast: true,
    unit: "imperial",
  };

  componentDidMount() {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
        return Location.getCurrentPositionAsync();
      })
      .then((position) => {
        this.getCurrentWeather({ coords: position.coords });
        this.getForecast({ coords: position.coords });
      });
  }

  componentDidUpdate(prevProps) {
    const oldLat = prevProps.navigation.getParam("lat");
    const lat = this.props.navigation.getParam("lat");

    const oldLon = prevProps.navigation.getParam("lon");
    const lon = this.props.navigation.getParam("lon");

    const oldZipcode = prevProps.navigation.getParam("zipcode");
    const zipcode = this.props.navigation.getParam("zipcode");

    const tempUnit = this.props.navigation.getParam("units");

    if (lat && oldLat !== lat && lon && oldLon !== lon) {
      this.getCurrentWeather({
        coords: { latitude: lat, longitude: lon },
        units: tempUnit,
      });
      this.getForecast({
        coords: { latitude: lat, longitude: lon },
        units: tempUnit,
      });
      this.setState({ unit: tempUnit });
    } else if (zipcode && oldZipcode !== zipcode) {
      this.getCurrentWeather({ zipcode, units: tempUnit });
      this.getForecast({ zipcode, units: tempUnit });
      this.setState({ unit: tempUnit });
    }
  }

  handleError = () => {
    Alert.alert("No location data found!", "Please try again", [
      {
        text: "Okay",
        onPress: () => this.props.navigation.navigate("Search"),
      },
    ]);
  };

  getCurrentWeather = ({ zipcode, coords, units }) => {
    weatherApi("/weather", { zipcode, coords, units })
      .then((response) => {
        if (response.cod === "404") {
          this.handleError();
        } else {
          this.props.navigation.setParams({ title: response.name });
          this.setState({
            currentWeather: response,
            loadingCurrentWeather: false,
          });
          addRecentSearch({
            id: response.id,
            name: response.name,
            lat: response.coord.lat,
            lon: response.coord.lon,
          });
        }
      })
      .catch((err) => {
        console.log("current error", err);
        this.handleError();
      });
  };

  getForecast = ({ zipcode, coords, units }) =>
    weatherApi("/forecast", { zipcode, coords, units })
      .then((response) => {
        if (response.cod !== "404") {
          this.setState({
            loadingForecast: false,
            forecast: groupForecastByDay(response.list),
            // unit: this.props.navigation.getParam("units"),
          });
        }
      })
      .catch((err) => {
        console.log("forecast error", err);
      });

  render() {
    if (this.state.loadingCurrentWeather || this.state.loadingForecast) {
      return (
        <Container>
          <ActivityIndicator color="#fff" size="large" />
        </Container>
      );
    }

    const { weather, main } = this.state.currentWeather;

    let backColor = "#1abc9c";

    if (this.state.unit === "metric") {
      if (main.temp >= 26) {
        backColor = "#eb4d4b";
      } else if (main.temp <= 18) {
        backColor = "#3498db";
      } else {
        backColor = "#1abc9c";
      }
      return (
        <Container viewColor={backColor}>
          <ScrollView>
            <SafeAreaView style={{ paddingTop: 10 }}>
              <WeatherIcon icon={weather[0].icon} />
              <H1>{`${Math.round(main.temp)}°`}</H1>
              <BasicRow>
                <H2>{`Humidity: ${main.humidity}%`}</H2>
              </BasicRow>
              <BasicRow>
                <H2>{`Low: ${Math.round(main.temp_min)}°`}</H2>
                <H2>{`High: ${Math.round(main.temp_max)}°`}</H2>
              </BasicRow>

              <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
                {this.state.forecast.map((day) => {
                  return (
                    <BasicRow
                      key={day.day}
                      style={{ justifyContent: "space-between" }}
                    >
                      <P>{format(new Date(day.day), "iiii, MMM d")}</P>
                      <View style={{ flexDirection: "row" }}>
                        <P style={{ fontWeight: "700", marginRight: 10 }}>
                          {`${Math.round(day.temp_max)}°`}
                        </P>
                        <P>{`${Math.round(day.temp_min)}°`}</P>
                      </View>
                    </BasicRow>
                  );
                })}
              </View>
            </SafeAreaView>
          </ScrollView>
        </Container>
      );
    }
    // If it's fahrenheit
    if (this.state.unit === "imperial") {
      if (main.temp >= 85) {
        backColor = "#eb4d4b";
      } else if (main.temp <= 60) {
        backColor = "#3498db";
      } else {
        backColor = "#1abc9c";
      }
      return (
        <Container viewColor={backColor}>
          <ScrollView>
            <SafeAreaView style={{ paddingTop: 10 }}>
              <WeatherIcon icon={weather[0].icon} />
              <H1>{`${Math.round(main.temp)}°`}</H1>
              <BasicRow>
                <H2>{`Humidity: ${main.humidity}%`}</H2>
              </BasicRow>
              <BasicRow>
                <H2>{`Low: ${Math.round(main.temp_min)}°`}</H2>
                <H2>{`High: ${Math.round(main.temp_max)}°`}</H2>
              </BasicRow>

              <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
                {this.state.forecast.map((day) => {
                  return (
                    <BasicRow
                      key={day.day}
                      style={{ justifyContent: "space-between" }}
                    >
                      <P>{format(new Date(day.day), "iiii, MMM d")}</P>
                      <View style={{ flexDirection: "row" }}>
                        <P style={{ fontWeight: "700", marginRight: 10 }}>
                          {`${Math.round(day.temp_max)}°`}
                        </P>
                        <P>{`${Math.round(day.temp_min)}°`}</P>
                      </View>
                    </BasicRow>
                  );
                })}
              </View>
            </SafeAreaView>
          </ScrollView>
        </Container>
      );
    }
  }
}
