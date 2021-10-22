import React, { Component } from "react";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";
import { connect } from "react-redux";
import * as wishlistAction from "../actions/wishlist";
import * as compareAction from "../actions/compare";
import * as cartAction from "../actions/cart";
import ProductTile from "./ProductTile";
import ToastService from "../services/ToastService";
class ShopByType extends Component {
  constructor(props) {
    super(props);

    this.currentUrlParams = new URLSearchParams(window.location.search);
    this.state = {
      type: this.props.type,
      tabType: this.props.tabType,
      responsive: {
        0: { items: 2 },
        568: { items: 3 },
        1024: { items: 5 },
      },
      shopByCategoryItems: [],
      shopByProductItems: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.tabType !== prevProps.tabType) {
      this.getProductsList(this.getSetQueryParams());
    }
  }

  componentDidMount() {
    this.state.type === "product"
      ? this.getProductsList(this.getSetQueryParams())
      : this.getCateroryList();
  }
  getSetQueryParams() {
    let queryParams = {};
    if (this.props.tabType) {
      queryParams =
        this.props.tabType === 2
          ? { order_by: "desc", sort_by: "created_at" }
          : {};
    }
    if (this.props.catId) {
      queryParams = { cat_ids: [this.props.catId] };
    }
    return queryParams;
  }

  getCateroryList = () => {
    let catImages = [      
      {
        icon: require("../public/icons/eshilp-floor-covering.svg"),
        bgImage: require("../public/floorcovering.jpg"),
      },
      {
        icon: require("../public/icons/eshilp-travel-ass.svg"),
        bgImage: require("../public/clothing_accessories.jpg"),
      },
      {
        icon: require("../public/icons/eshilp-office-supplies.svg"),
        bgImage: require("../public/officeSupplies.jpg"),
      },
    ];
    CategoryService.fetchAllCategory({ parent_id: 0 }).then(result => {
      this.setState({
        shopByCategoryItems: result?.map((item, index) => (
          <div className="flip-container" key={index}>
            <div
              className="categorie-img"
              onClick={() => this.productList(item.id)}
            >
              {/* <div className="cat-overlay"></div> */}
              <div
                className="categorie-img-front"
                style={{ backgroundImage: catImages[index]?.bgImage }}
              >
                <div className="more-products">
                  <Link to="/product-list">
                    225
                    <br />
                    More Products
                  </Link>
                </div>
              </div>
              <div
                className="categorie-img-Back"
                style={{ backgroundImage: catImages[index]?.bgImage }}
              >
                <div className="categorie-img-title">
                  <div className="cat_icon">
                    <img
                      src={catImages[index]?.icon}
                      className="img-fluid"
                      alt="pay"
                    />
                  </div>
                  <h3>{item.title}</h3>
                </div>
              </div>
            </div>
          </div>
        )),
      });
    });
  };

  getProductsList = filterparams => {
    ProductService.fetchAllProducts(filterparams).then(result => {
      this.setState({
        shopByProductItems: result?.data?.map(item => (
          <ProductTile
            data={item}
            {...this.props}
            errorAlert={this.errorAlert}
            successAlert={this.successAlert}
            limitAlert={this.limitAlert}
          />
        )),
      });
    });
  };

  productList = value => {
    this.props.history.push({
      pathname: "/product-list",
      search: "?cat_ids=" + value,
    });
  };

  errorAlert = (product, type) => {
    return ToastService.error(
      product?.content?.title +
        " is " +
        (type === "cart" ? "already in cart" : "removed from wishlist"),
    );
  };
  successAlert = (product, type) => {
    return ToastService.success(
      product?.content?.title + " is successfully added to " + type,
    );
  };
  limitAlert = () => {
    return ToastService.error("Compare Cart is full(limit :5)");
  };
  render() {
    const {
      type,
      shopByCategoryItems,
      shopByProductItems,
      responsive,
    } = this.state;
    return (
      <>
        <AliceCarousel
          autoPlayInterval={3000}
          autoPlay={true}
          autoPlayStrategy="all"
          disableDotsControls
          items={type === "product" ? shopByProductItems : shopByCategoryItems}
          responsive={responsive}
          mouseTracking
          infinite
          disableButtonsControls
          touchTracking
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    wishlist: state.wishlist,
    userData: state.userData,
    cart: state.cart,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToWishlist: wishlist => dispatch(wishlistAction.addToWishlist(wishlist)),
    deleteWishlist: index => dispatch(wishlistAction.deleteWishlist(index)),
    addToCompare: compare => dispatch(compareAction.addToCompare(compare)),
    addToCart: cart => dispatch(cartAction.addToCart(cart)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopByType);
