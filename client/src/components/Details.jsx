import React from "react";
import ProductInfo from "./ProductInfo.jsx";
import Quantity from "./Quantity.jsx";
import Buttons from "./Buttons.jsx";
import Images from "./Images.jsx";
import Labels from "./Labels.jsx";
import styles from "../style.css.js";

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: this.props.product.colors[0],
      mainImage: this.props.product.main_image
    };
    this.changeColor = this.changeColor.bind(this);
    this.changeImage = this.changeImage.bind(this);
  }

  changeColor(img) {
    const images = this.props.product.images;
    for (let i = 0; i < images.length; i++) {
      if (images[i] === img.src) {
        this.setState({
          color: colors[i]
        });
      }
    }
  }

  changeImage(img) {
    const image = img.src;
    this.setState({
      mainImage: image
    });
  }

  render() {
    console.log(this.state.mainImage)
    const { product } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.mainImageWrapper}>
            <img style={styles.mainImage} src={this.state.main_image} alt="" />
          </div>
          <div style={styles.Details}>
            <div style={styles.brand}>Trailblazer</div>
            <div style={styles.name}>Trailblazer {product.name}</div>
            <ProductInfo product={product} />
            <div style={styles.price}>{`$${product.price}.00`}</div>
            <div style={styles.color}>Color: {this.state.color}</div>
            <Images
              product={product}
              handleChange={img => {
                this.changeColor(img);
              }}
              handleClick={img => {
                this.changeImage(img);
              }}
            />
            <Quantity />
            <Labels />
            <Buttons />
            <div style={styles.returnPolicy}>Trailblazer return policy</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
