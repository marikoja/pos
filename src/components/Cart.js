import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import OrderItems from './OrderItems'

export default class Cart extends Component {
  static propTypes = {
    numInCart: PropTypes.number,
    orderId: PropTypes.number,
  }

  constructor(props) {
    super();

    this.state = {
      order: [],
      orderId: props.orderId,
      numInCart: props.numInCart
    };
  }

  componentDidMount = () => {
    axios.get(`https://capstone-backend-java-spark.herokuapp.com/order/${this.state.orderId}`)
      .then( (response) => {
        let orderItems = response.data;
        for (let a = 0; a < orderItems.length; a++) {
          orderItems[a].count = 1;
          for (let b = (a+1); b < orderItems.length; b++) {
            if (orderItems[a].menu_item_id === orderItems[b].menu_item_id) {
              orderItems[a].count++;
              orderItems.splice(b,1);
            }
          }
        }
        this.setState({order: orderItems});
        console.log("made it to the cart get request");
        console.log(JSON.stringify(orderItems));
    })
      .catch( (error) => {
        console.log(error);
    });
  }

  renderOrderItems = () => {
    let parent = this;
    console.log(parent);
    const orderList = this.state.order.map((item, index) => {
      return (
        <OrderItems
          key={index}
          order_menu_id={item.order_menu_id}
          menu_item_id={item.menu_item_id}
          quantity={item.quantity}
          order_id={item.order_id}
          itemName={item.name}
          price={item.price}
          order={parent}
          count={item.count}
        />
      );
    });
    return orderList;
  }

  render() {

    const orderSubmit = () => {
        axios.put( `https://capstone-backend-java-spark.herokuapp.com/order/${this.state.orderId}`, {
          orderId: this.state.orderId,
          customer_id: this.state.customer_id,
          company_id: this.state.company_id,
          status: 'PAID'})
          .then((response) => {
            this.setState({order: response.data});
            console.log("made it to the cart put request");
            console.log(response.data);
        })
          .catch( (error) => {
            console.log(error);
        });
        this.setState({orderId: null});
        this.setState({numInCart: null});
        Actions.customerMenu();

      };

    return (
      <View style={styles.container}>
        <View style={styles.itemsContainer}>
          {this.renderOrderItems()}
        </View>

        <TouchableOpacity onPress={orderSubmit}>
          <Text style={styles.button}>Complete Order</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: 30,
  },
    itemsContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 30,
    fontSize: 30,
    padding: 5,
    borderWidth: .5,
    borderRadius: 15,
    textAlign: 'center',
    fontWeight: '200',
  }
});
