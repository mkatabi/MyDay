import React, { Component } from 'react';
import { View, Text, StyleSheet, Card } from 'react-native';
import AgendaView from '../react-native-calendars-master/src/agenda/index'
import { db } from '../config'

// let thoughtRef = db.ref('/thought');
// let tagsRef = db.ref('/tag');
let infoRef = db.ref('/person/info');
let fitRef = db.ref('/fit');
let weather = db.ref('/weather');

var d = "";

class Home extends Component {

    static navigationOptions = {
        title: 'Home'
    };

    constructor(props) {
        super(props);
        this.d = "";
        this.state = {items: {},info:{}};
    }

    componentDidMount() {
        infoRef.on('value', snapshot => {
          let data = snapshot.val();
          this.state.info["name"] = data.Name;
          this.state.info["age"] = data.Age;
          this.state.info["fp"] = data.Food_Preference;
          this.state.info["fr"] = data.Food_Restriction;
          this.state.info["gender"] = data.Gender;
          this.state.info["height"] = data.Height;
          this.state.info["weight"] = data.Weight;
        });

        fitRef.once("value", snapshot => {
          snapshot.forEach(childSnapshot => {
            var date = childSnapshot.key;
            var childData = childSnapshot.val();
            if (!this.state.items[date]) {
              this.state.items[date] = [];
            }
            this.state.items[date].push({
              name: 'Exercise: ' + childData.exercise + "\n" + 'Step: ' + childData.step.toString(),
              height: 50
            })
          })
          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        });

        weather.once("value", snapshot => {
          snapshot.forEach(childSnapshot => {
            var date = childSnapshot.key;
            var childData = childSnapshot.val();
            if (!this.state.items[date]) {
              this.state.items[date] = [];
            }
            this.state.items[date].push({
              name: 'Mood: ' + childData.mood + "\nTemperature: " + childData.temperature.toString() + "\nWeather" + childData.weather,
              height: 100
            })
          })
          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        });
      }

    render() {
        return(
                <AgendaView
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                />
                
        );
    }
    loadItems(day) {
        setTimeout(() => {
          for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
              this.state.items[strTime] = [];
            }
          }
          //console.log(this.state.items);
          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        }, 1000);
        // console.log(`Load Items for ${day.year}-${day.month}`);
      }
    
      renderItem(item) {
        return (
          <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
        );
      }
    
      renderEmptyDate() {
        return (
          <View style={styles.emptyDate}>
                <Text><Text style={{fontWeight: "bold"}}> Name: </Text>{this.state.info.name}<Text style={{fontWeight: "bold"}}> Age: </Text>{this.state.info.age}</Text>
                <Text><Text style={{fontWeight: "bold"}}> Gender: </Text>{this.state.info.gender}</Text>
                <Text><Text style={{fontWeight: "bold"}}> Height: </Text>{this.state.info.height}<Text style={{fontWeight: "bold"}}> Weight: </Text>{this.state.info.weight}</Text>
                <Text><Text style={{fontWeight: "bold"}}> Food Preference: </Text>{this.state.info.fp}</Text>
                <Text><Text style={{fontWeight: "bold"}}> Food Restriction: </Text>{this.state.info.fr}</Text>
          </View>
        );
      }
    
      rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
      }
    
      timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
      }
   
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 120,
      flex:1,
      paddingTop: 30
    }
  });


export default Home;