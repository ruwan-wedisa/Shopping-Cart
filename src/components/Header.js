import React, { Component } from "react";
import CartScrollBar from "./CartScrollBar";
import Counter from "./Counter";
import EmptyCart from "../empty-states/EmptyCart";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { findDOMNode } from "react-dom";
import logo from '../animal-shop.png' 
import axios from "axios";


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCart: false,
      cart: this.props.cartItems,
      mobileSearch: false,
      totalUnitPriceItem1:0,
      totalUnitPriceItem2:0,
      itemPrice: {
          id: {
            totalUnitPrice:0
          }
      }
    };

    this.getProductUnitPrice = this.getProductUnitPrice.bind(this)
   // this.setTotalUnitPrice = this.setTotalUnitPrice.bind(this)
    this.setTotalUnitPriceItem1 = this.setTotalUnitPriceItem1.bind(this)
    this.setTotalUnitPriceItem1 = this.setTotalUnitPriceItem1.bind(this)
  }
  
  handleCart(e) {
    e.preventDefault();
    this.setState({
      showCart: !this.state.showCart
    });
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  handleMobileSearch(e) {
    e.preventDefault();
    this.setState({
      mobileSearch: true
    });
  }
  handleSearchNav(e) {
    e.preventDefault();
    this.setState(
      {
        mobileSearch: false
      },
      function() {
        this.refs.searchBox.value = "";
        this.props.handleMobileSearch();
      }
    );
  }


  handleClickOutside(event) {
    const cartNode = findDOMNode(this.refs.cartPreview);
    const buttonNode = findDOMNode(this.refs.cartButton);
    if (cartNode.classList.contains("active")) {
      if (!cartNode || !cartNode.contains(event.target)) {
        this.setState({
          showCart: false
        });
        event.stopPropagation();
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.cartItems != undefined) {
    nextProps.cartItems.map(product => {
      this.getProductUnitPrice(product)

      console.log('this.itemPriceArr ',this.state.itemPrice.id.totalUnitPrice)
    })
  }
  }

  // getProductUnitPrice(product) {
  //   var id = product.id;
  //   var qty = product.quantity;
  //   //let url = "https://res.cloudinary.com/ruwanwedisa/raw/upload/v1601034805/json/products_rcu34w.json";
  //   let url = "http://localhost:8080/items/calculate_price/single/"+id+"/"+qty
  //   axios.get(url).then(response => {
  //     console.log('test ruwan',response.data.price)
    
  //   }, function(response){
  //     console.log(response,'response')
  //   });

  // }


  getProductUnitPrice(product){
    var id = product.id;
    console.log('cid',id)
    var qty = product.quantity;
    console.log('cqty',qty)
    axios({
      url: "http://localhost:8080/items/calculate_price/single/"+id+"/"+qty,
      method: 'get'
    })
    .then(response => {
        console.log(response.data ,'ggx');
        if(id == 1){
          this.setTotalUnitPriceItem1(response.data.price)
        }else{
          this.setTotalUnitPriceItem2(response.data.price)
        }
    });

  }



  setTotalUnitPriceItem1(amount){
    console.log('current price ',amount)

    this.setState(prevState => {
      return {totalUnitPriceItem1: amount}
    });

  }

  setTotalUnitPriceItem2(amount){
    console.log('current price ',amount)

    this.setState(prevState => {
      return {totalUnitPriceItem2: amount}
    });

  }

  componentDidMount() {
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true,
      0
    );
  }
  componentWillUnmount() {
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true,
      0
    );
  }
  render() {
    let cartItems;
    let unitPriceProduct;

    cartItems = this.state.cart.map(product => {
      // this.getProductUnitPrice.bind(product.id,product.quantity)

      // console.log(productUnitPrice,'gg')

      unitPriceProduct =  this.state.productUnitPrice;
      console.log(unitPriceProduct,'gg')
      return (
        <li className="cart-item" key={product.itemName}>
          <img className="product-image" src={product.imageUrl} />
          <div className="product-info">
            <p className="product-name">{product.itemName}</p>
            <p className="product-price">{this.props.total}</p>
          </div>
          <div className="product-total">
            <p className="quantity">
              {product.quantity} {product.quantity > 1 ? "Nos." : "No."}{" "}
            </p>
            <p className="amount">{
              //this.state.itemPrice
              //product.quantity * product.priceOFSingleCartoon
              product.id == 1 ? this.state.totalUnitPriceItem1 : this.state.totalUnitPriceItem2


            }
            </p>
          </div>
          <a
            className="product-remove"
            href="#"
            onClick={this.props.removeProduct.bind(this, product.id)}
          >
            ×
          </a>
        </li>
      );
    });
    let view;
    if (cartItems.length <= 0) {
      view = <EmptyCart />;
    } else {
      view = (
        <CSSTransitionGroup
          transitionName="fadeIn"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component="ul"
          className="cart-items"
        >
          {cartItems}
        </CSSTransitionGroup>
      );
    }
    return (
      <header>
        <div className="container">
          <div className="brand">
            <img
              className="logo"
              src={logo}
              alt="Veggy Brand Logo"
            />
          </div>

          <div className="search">
            <a
              className="mobile-search"
              href="#"
              onClick={this.handleMobileSearch.bind(this)}
            >
              <img
                src="https://res.cloudinary.com/sivadass/image/upload/v1494756966/icons/search-green.png"
                alt="search"
              />
            </a>
            <form
              action="#"
              method="get"
              className={
                this.state.mobileSearch ? "search-form active" : "search-form"
              }
            >
              <a
                className="back-button"
                href="#"
                onClick={this.handleSearchNav.bind(this)}
              >
                <img
                  src="https://res.cloudinary.com/sivadass/image/upload/v1494756030/icons/back.png"
                  alt="back"
                />
              </a>
              <input
                type="search"
                ref="searchBox"
                placeholder="Search for Animal Accessories"
                className="search-keyword"
                onChange={this.props.handleSearch}
              />
              <button
                className="search-button"
                type="submit"
                onClick={this.handleSubmit.bind(this)}
              />
            </form>
          </div>

          <div className="cart">
            <div className="cart-info">
              <table>
                <tbody>
                  <tr>
                    <td>Total No. of items</td>
                    <td>:</td>
                    <td>
                      <strong>{this.props.totalItems}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Sub Total</td>
                    <td>:</td>
                    <td>
                      <strong>{this.props.total}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a
              className="cart-icon"
              href="#"
              onClick={this.handleCart.bind(this)}
              ref="cartButton"
            >
              <img
                className={this.props.cartBounce ? "tada" : " "}
                src="https://res.cloudinary.com/sivadass/image/upload/v1493548928/icons/bag.png"
                alt="Cart"
              />
              {this.props.totalItems ? (
                <span className="cart-count">{this.props.totalItems}</span>
              ) : (
                ""
              )}
            </a>
            <div
              className={
                this.state.showCart ? "cart-preview active" : "cart-preview"
              }
              ref="cartPreview"
            >
              <CartScrollBar>{view}</CartScrollBar>
              <div className="action-block">
                <button
                  type="button"
                  className={this.state.cart.length > 0 ? " " : "disabled"}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
