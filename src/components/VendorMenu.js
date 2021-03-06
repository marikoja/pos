import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import VendorMenuItem from './VendorMenuItem'

export default class VendorMenu extends Component {
  static propTypes = {
    // items: PropTypes.array.isRequired,
    // onItemPress: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      menu: [],
    };
  }

  componentDidMount = () => {
    axios.get('https://capstone-backend-java-spark.herokuapp.com/menu')
      .then( (response) => {
        this.setState({menu: response.data});
    })
      .catch( (error) => {
        console.log(error);
    });
  }

  renderVendorMenuItems = () => {
    let parent = this;
    const menuList = this.state.menu.map((item, index) => {
      return (
        <VendorMenuItem
          key={index}
          itemName={item.name}
          menu_id={item.menu_id}
          description={item.description}
          menu_item_id={item.menu_item_id}
          price={item.price}
          img={item.img}
          quantity={item.quantity}
          menu={parent}
          add={()=>{}}
          />
      );
    });
    return menuList;
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => Actions.orderQueue()}>
            <Text style={styles.button}>Order Queue</Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => Actions.newItem()}>
            <Text style={styles.button}>Add Item to Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsContainer}>
          {this.renderVendorMenuItems()}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flexWrap: 'wrap',
    // flex: 1,
    // backgroundColor: '#fff',
    // // width: '100%',
    // // height: '100%',
    // margin: 10,
    padding: 30,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'

  },
  buttons: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    marginVertical: 10,
    fontWeight: '200',
    fontSize: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    textAlign: 'center',
  }
});
