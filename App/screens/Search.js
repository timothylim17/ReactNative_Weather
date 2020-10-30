import React from "react";
import { FlatList, Text, View } from "react-native";
import { Picker } from "@react-native-community/picker";

import { SearchBar } from "../components/SearchBar";
import { SearchItem } from "../components/List";
import { getRecentSearch } from "../util/recentSearch";

class Search extends React.Component {
  state = {
    query: "",
    unit: "",
    recentSearch: [],
  };

  componentDidMount() {
    getRecentSearch().then((recentSearch) => {
      this.setState({ recentSearch });
    });
  }

  render() {
    return (
      <FlatList
        data={this.state.recentSearch}
        renderItem={({ item }) => (
          <SearchItem
            name={item.name}
            onPress={() =>
              this.props.navigation.navigate("Details", {
                lat: item.lat,
                lon: item.lon,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View>
            <SearchBar
              onSearch={() => {
                this.props.navigation.navigate("Details", {
                  zipcode: this.state.query,
                  units: this.state.unit,
                });
              }}
              searchButtonEnabled={this.state.query.length >= 5}
              placeholder="Zipcode"
              onChangeText={(query) => this.setState({ query })}
              selectedValue={this.state.unit}
              onValueChange={(unit) => {
                this.setState({ unit });
              }}
            />
            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 16,
                color: "#aaa",
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Recents
            </Text>
          </View>
        }
      />
    );
  }
}

export default Search;
