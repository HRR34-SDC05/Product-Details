require('newrelic');

import React from "react";
import axios from "axios";
import Details from "./Details.jsx";
import styles from "../style.css.js";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    const url = window.location.href.split("/");
    const id = Math.floor(Math.random() * 10000);
    console.log('id --->', id);
    console.log('isLoading state -->', this.state.isLoading);
    axios
      .get(`/data`) // <---- change this back to ${id}
      .then((res) => {
        const data = res.data;
        console.log('data --->', data);
        this.setState({
          product: data,
          isLoading: true,
        });
      })
      .catch((err) => {
        console.log("Error at GET request", err);
      });
  }

  render() {
    const { product, isLoading } = this.state;
    let view;
    if (isLoading) {
      view = <Details product={product} />;
    }
    return <div>{view}</div>;
  }
}

export default App;
