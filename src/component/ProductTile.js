import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faRandom, faHeart, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import WishlistService from '../services/WishlistService';
import CartService from '../services/CartService';
import ProductService from '../services/ProductService';
import { connect } from 'react-redux';
import * as wishlistAction from '../actions/wishlist';
import * as compareAction from '../actions/compare';
import * as cartAction from '../actions/cart';
class ProductTile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wishlistS: props.wishlist,
      currentLocation: props.location.pathname
    }
  }
  getWishlist = () => {

    WishlistService.list().then((result) => {
      result && result.map((item) => (
        this.props.addToWishlist(item.product_id)
      ))
    })

  }

  deleteWishlist = (item) => {
    (Object.keys(this.props.userData).length > 0) ? this.deleteWishlistApi(item) : this.props.deleteWishlist({ product: item.id, variationIndex: 0 });
    this.props.errorAlert(item, 'wishlist');
  }

  deleteWishlistApi(item) {
    this.props.deleteWishlist({ product: item.id, variationIndex: 0 })
    WishlistService.addDelete({ wishlist_id: item.wishlist?.id, product_id: [item.id] }).then((result) => {
      if (result?.success) {
        this.getWishlist();
      }
    })
  }

  addToWishlist = (product) => {

    if (Object.keys(this.props.userData).length > 0) { this.addToWishlistApi(product) } else {
      this.props.addToWishlist({ product: product.id, variationIndex: 0 });
      this.props.successAlert(product, 'wishlist');
    }

  }

  addToWishlistApi = (product) => {
    this.props.addToWishlist({ product: product.id, variationIndex: 0 })
    WishlistService.addDelete({ product_id: [product.id] }).then((result) => {
      if (result?.success) {
        this.props.successAlert(product, 'wishlist');
        this.getWishlist();

      }
    });
  }

  addToCart = (product) => {
    if (Object.keys(this.props.userData).length > 0) {
      this.addToCartApi(product)
    }
    else {
      this.props.addToCart({ product: product.id, variationIndex: 0 });
      this.props.successAlert(product, 'cart');
    }
  }

  addToCartApi = (product) => {

    let cartToSync = [{
      "product_id": product.id,
      "quantity": 1,
      "variation_index": 0
    }], cartProductids = [];

    try {
      CartService.add({ products: cartToSync }).then((result) => {

        if (result?.success) {
          if (typeof result.data !== 'string') {
            result.data.length && result.data.map((item) => (
              cartProductids?.push(item.product_id)
            ));
            ProductService.fetchAllProducts({ product_ids: cartProductids }).then((result1) => {
              result1.data.map((item) => this.props.addToCart({ product: item.id, variationIndex: 0 }));
            })
            this.props.successAlert(product, 'cart');
          }
          else {
            this.props.errorAlert(product, 'cart');
          }
        }
        else { return }
      });
    } catch (err) {
      console.log(err);
    }
  }

  productDetail = (value) => {
    sessionStorage.setItem("scrollPosition", window.pageYOffset);
    this.props.history.push({
      pathname: '/product-detail',
      search: (value?.category ? "?cid=" + value?.category?.category_id : '') + "&pid=" + value?.content?.product_id
    });
  }

  render() {

    const { data, userData, wishlist, cart, gridLayout } = this.props
    const { currentLocation } = this.state
    const cellSize = {};
    if (gridLayout === '2X2') { cellSize.height = '200px' }
    else { cellSize.height = (gridLayout === '3X3' ? '297px' : '212px') }

    return (

      <div className="product-wrapper" key={data.id} >

        <div className="prodcut-img" onClick={() => this.productDetail(data)} style={cellSize}>
          <img src={data.images?.length > 0 ? data?.images[0]?.image_url : ""}
            className="img-fluid"
            onClick={() => this.productDetail(data)}
            alt={data.images?.length > 0 ? data.images[0]?.caption : ""}
            onError={e => { e.currentTarget.src = require('../public/No_Image_Available.jpeg') }}
          />

        </div>
        <div className="shop-wrapper">
          <div className="shopBtn">
            <div className="shop-btn"><span>
              <FontAwesomeIcon
                icon={(cart.find(({ product, variationIndex }) => (product === data.id && variationIndex === 0)) !== undefined) ? faCheck : faCartPlus}
                onClick={
                  () => (cart.find(({ product, variationIndex }) => (product === data.id && variationIndex === 0)) !== undefined) ? this.props.errorAlert(data, 'cart') : (data.variation_available ? this.productDetail(data) : this.addToCart(data))
                }
              /></span></div>
            <div className="shop-btn"><span>
              <FontAwesomeIcon icon={faRandom} onClick={() => (this.props.compare.length <= 5 ? (this.props.addToCompare({ product: data, variationIndex: 0 }), this.props.successAlert(data, 'compare')) : this.props.limitAlert())}
              />
            </span></div>
            {currentLocation !== '/wishlist' && <div className="shop-btn"><span>
              <FontAwesomeIcon
                icon={((wishlist.find(({ product, variationIndex }) => (product === data.id && variationIndex === 0)) !== undefined) || (Object.keys(userData).length > 0 && data?.wishlist?.id)) ? faHeart : farHeart}
                onClick={() => {
                  ((Object.keys(userData).length > 0 && data?.wishlist?.id) ||
                    wishlist.find(({ product, variationIndex }) => (product === data.id && variationIndex === 0))
                  ) ? this.deleteWishlist(data) : (data.variation_available ? this.productDetail(data) : this.addToWishlist(data))
                }}
              />
            </span>
            </div>}
          </div>
        </div>
        {data.discount && <div className="prdocut-dis-lable"><span>{data.discount}%</span></div>}
        <h5 className="product-title">
          {data.content ? data.content.title : '__'}
        </h5>
        <span className="product-price">
          <strike><span>₹</span> 1000</strike> <span>₹</span> {data?.price?.length > 0 ? data?.price : 0}
        </span>
      </div >);
  }
}


const mapStateToProps = state => {
  return {
    wishlist: state.wishlist,
    userData: state.userData,
    cart: state.cart,
    compare: state.compare
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToWishlist: wishlist => dispatch(wishlistAction.addToWishlist(wishlist)),
    deleteWishlist: wishlist => dispatch(wishlistAction.deleteWishlist(wishlist)),
    addToCompare: compare => dispatch(compareAction.addToCompare(compare)),
    addToCart: cart => dispatch(cartAction.addToCart(cart))
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductTile);
