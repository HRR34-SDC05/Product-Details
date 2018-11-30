import React from "react";
import axios from "axios";
import Details from "./Details.jsx";
import styles from "../style.css.js";

var port = 3030;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    const url = window.location.href.split('/');
    const id = url[url.length - 1];
    console.log('id --->', id);
    console.log('isLoading state -->', this.state.isLoading);
    const instance = axios.create({ baseURL: `ec2-18-223-237-77.us-east-2.compute.amazonaws.com:${port}` });
    instance
      .get(`/product/data/${id}`) // <---- change this back to ${id}
      .then((res) => {
        const data = res.data;
        console.log('res.data in did mount --->', data);
        this.setState({
          product: data,
          isLoading: true,
        });
      })
      .catch((err) => {
        console.log('Error at GET request', err);
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
