import React from "react";
import Modal from "react-modal";
import ReactStars from 'react-stars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ShopByType from "./ShopByType";
import { faFacebook, faTwitter, faPinterest, faLinkedin, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faRandom, faCheck, faTimes, faQuestion, faEnvelope, faPhoneAlt, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart, } from '@fortawesome/free-regular-svg-icons'
import {
  FacebookShareButton, TwitterShareButton, PinterestShareButton, TelegramShareButton, LinkedinShareButton
} from "react-share";
import ProductService from '../services/ProductService';
import ToastService from '../services/ToastService';
import CartService from '../services/CartService';
import * as cartAction from '../actions/cart';
import * as wishlistAction from '../actions/wishlist';
import * as compareAction from '../actions/compare';
import { connect } from 'react-redux';
import WishlistService from '../services/WishlistService'
import ReactImageZoom from 'react-image-zoom';
import OrderService from '../services/OrderService';
import Form from "react-validation/build/form";
import Textarea from "react-validation/build/textarea";
class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.requiredBinded = this.required.bind(this);
    this.error = false;
    this.state = {
      combination: [], currentVariationIndex: null, variationSelected: false,
      isActiveTab: 0, productCatId: 0, _variationIndex: 0,
      filterParams: { product_ids: [props.match.params.productId] },
      wishlistStatus: false,
      shareUrl: window.location.href,
      title: 'eShilpmart',
      productDetailData: [],
      productQuantity: 1, currentvalue2: '', currentvalue1: '',
      visible: true,
      showModal: false, productDetailDataImages: [],
      notFountImage: [{
        original: require('../public/No_Image_Available.jpeg'),
        thumbnail: require('../public/No_Image_Available.jpeg'),
      }], imgProps: {},
      fields: {
        product_id: props.match.params.productId,
        msg: '', type: 3, name: '', email: ''
      }
    }
    this.currentUrlParams = new URLSearchParams(window.location.search);

  }
  required = (value, props) => {

    if (props.isUsed) {
      if (!value) {
        this.error = true;
        return (
          <div className="isaerror" role="alert">
            Please enter your {props.name}
          </div>
        );
      } else { this.error = false; }
    }
  }

  componentDidMount() {
    this.getProductDetails(this.getQueryParams());
  }
  componentDidUpdate(prevprops) {
    if (prevprops.history.location.search !== prevprops.location.search) {
      this.getProductDetails(this.getQueryParams());
    }
  }


  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });

  }
  deleteWishlist = (item) => {
    (Object.keys(this.props.userData).length > 0) ? this.deleteWishlistApi(item) : this.props.deleteWishlist({ product: item.id, variation_index: this.state.currentVariationIndex });
    this.errorAlert(item, 'wishlist');
  }

  deleteWishlistApi(item) {
    this.props.deleteWishlist({ product: item?.id, variation_index: this.state.currentVariationIndex })
    WishlistService.addDelete({ wishlist_id: item.wishlist?.id, product_id: [item.id], variation_index: [this.state.currentVariationIndex] }).then((result) => {
      if (result?.success) {
        this.setState(prevState => ({
          productDetailData: {
            ...prevState.productDetailData, wishlist: null
          }
        }));
      }
    })
  }

  errorAlert = (product, type) => {
    return ToastService.error(product?.content?.title + " is removed from wishlist");

  }

  addToWishlist = (product) => {
    if (this.selectValidVariation()) return
    else {
      if (Object.keys(this.props.userData).length > 0) { this.addToWishlistApi(product) } else {
        this.props.addToWishlist({ product: product?.id, variation_index: this.state.currentVariationIndex });
        this.successAlert(product, 'wishlist');
      }

    }
  }

  selectValidVariation = () => {
    if (!this.state.variationSelected && this.state.productDetailData.variation_available) {
      return ToastService.error("Please select variation.");
    }
  }

  addToWishlistApi = (product) => {
    this.props.addToWishlist({ product: product?.id, variation_index: this.state.currentVariationIndex })
    WishlistService.addDelete({ product_id: [product.id], variation_index: [this.state.currentVariationIndex] }).then((result) => {
      if (result?.success) {
        this.successAlert(product, 'wishlist');
        let objIndex = result.data.findIndex((obj => obj.product_id === product.id));
        this.setState(prevState => ({
          productDetailData: {
            ...prevState.productDetailData, wishlist: { id: result.data[objIndex].id }
          }
        }));
      }
    });
  }
  successAlert = (product, type) => {
    return ToastService.success(product?.content?.title + " is successfully added to " + type)
  }

  getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let entries = urlParams.entries(), queryParams = {};
    for (const entry of entries) {
      queryParams.product_ids = entry[0] === 'pid' ? [entry[1]] : '';
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          product_id: entry[1]
        }
      }))
    }
    return queryParams;
  }

  countInc = () => {
    this.setState({ productQuantity: this.state.productQuantity + 1 });
  }
  countDec = () => {
    this.setState({ productQuantity: this.state.productQuantity - 1 });
  }
  getProductDetails = (queryParams) => {
    try {
      let variation = [];
      ProductService.fetchAllProducts(queryParams).then((result) => {
        if (result.data?.length === 0) this.props.history.push({ pathname: '/product-list' })
        this.setState({
          productDetailData: result?.data[0], productDetailDataPrice: result?.data[0]?.price,
          productCatId: result?.data[0]?.category?.category_id
        });
        result?.data[0]?.images?.length > 0 && this.renderItemGallery();
        result?.data[0]?.variation_available && result.data[0].properties.map((item) => (
          item.veriation_value.indexOf(",") !== - 1 && variation.push({ key: item.variation_key, value: item.veriation_value.split(',') })
        ));
        this.setState({ variations: variation })

        window.scrollTo(0, 0);
      });

    } catch (err) {
      console.log(err);
    }
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.form.getChildContext()._errors.length > 0) {

      if (this.error) {
        return
      }
      else {
        return ToastService.error("Please fill form details")
      }
    } else {
      if (!this.error) {
        OrderService.raiseATicket(this.state.fields).then((result) => {
          if (result.success) this.setState({ showModal: !this.state.showModal })
          else return ToastService.error("Please fill form details")
        });
      }
    }
  }
  wishlistToggle = () => {
    this.setState({ wishlistStatus: !this.state.wishlistStatus });
  }

  handleSellerProfile = (brand) => {
    (brand !== null) &&
      this.props.history.push({
        pathname: '/entrepreneur/' + brand
      })

  }
  productQuantityManual = (event) => {

    this.setState({ productQuantity: event.target.value });
  }

  addToCart = (product) => {
    this.selectValidVariation()
    if (this.props.cart.find(({ cartProduct, variation_index }) => (cartProduct === product.id && variation_index === this.state.currentVariationIndex)) !== undefined) {
      this.errorAlert(product, 'cart');
    }
    else {
      Object.keys(this.props.userData).length > 0 ? this.addToCartApi(product) : this.props.addToCart({ product: product?.id, variation_index: this.state.currentVariationIndex || 0, quantity: this.state.productQuantity })

    }
  }

  errorAlert = (product, type) => {
    return ToastService.error(product?.content?.title + " is " +
      (type === "cart" ? "already in cart" : "removed from wishlist"));

  }

  addToCartApi = (product) => {

    let cartToSync = [{
      "product_id": product.id,
      "quantity": this.state.productQuantity,
      "variation_index": this.state.currentVariationIndex || 0
    }];
    try {
      CartService.add({ products: cartToSync }).then((result) => {

        if (result?.success) {
          if (typeof result.data !== 'string') {
            result.data.length && result.data.map((item) => (
              this.props.addToCart({ product: item.product_id, variation_index: item.variation_index, quantity: item.quantity })
            ));
            this.successAlert(product, 'cart')
          }
          else {
            this.errorAlert(product, 'cart');
          }
        }
        else { return }
      });
    } catch (err) {
      console.log(err);
    }
  }
  renderRightNav = (onClick, disabled) => {
    return (
      <button className='image-gallery-custom-right-nav' disabled={disabled} onClick={onClick} />
    )
  }
  renderLeftNav = (onClick, disabled) => {
    return (
      <button className='image-gallery-custom-left-nav' disabled={disabled} onClick={onClick} />
    )
  }



  addToCheckout = (product) => {
    product.quantity = this.state.productQuantity;
    product.variation_index = this.state.currentVariationIndex;
    this.props.history.push({
      pathname: '/checkout',
      state: { checkout: [product], totalCartCost: product?.price * this.state.productQuantity }
    })

  }
  makeCombo = (key, value) => {

    let combi = this.state.combination, objIndex;
    if (combi.length > 0) {
      objIndex = combi.findIndex((obj => obj.variation_id === key));

      if (objIndex !== -1) {
        combi.splice(objIndex, 1, { "variation_id": key, "variation_value": value });
        this.setState({ combination: combi });
      }
      else {
        this.setState(prevState => ({
          combination: [...prevState.combination, { "variation_id": key, "variation_value": value }]
        }));
      }
      this.getVariationIndex(this.state.combination);
    } else {
      this.setState({ combination: [{ "variation_id": key, "variation_value": value }] })
    }

  }
  getVariationIndex = (combi) => {
    this.state.productDetailData.variations.map((item, index) => {
      if (JSON.stringify(item.variation_index) === JSON.stringify(combi)) {
        this.setState({
          currentVariationIndex: index,
          productDetailDataPrice: this.state.productDetailData?.prices[index].price,
          variationSelected: true
        });
        this.renderItemGallery()
      }
    })
  }

  limitAlert = () => {
    return ToastService.error("Compare Cart is full(limit:5)")
  }
  renderItemGallery = (imgUrl) => {
    if (imgUrl) {
      this.setState({
        _variationIndex: 0, imgProps: {
          width: 534, zoomWidth:
            350, img: imgUrl, zoomPosition: 'right'
        }
      });
    }
    else {
      this.state.productDetailData.images.map((item, index) => {
        if (item.variation_index === this.state.currentVariationIndex) {
          this.setState({
            _variationIndex: index, imgProps: {
              width: 534, zoomWidth:
                350, img: item.image_url, zoomPosition: 'right'
            }
          });
        }
      })
    }

  }
  addToCompare = (product) => {
    if (this.selectValidVariation()) return
    else {
      this.props.addToCompare({ product: product?.id, variation_index: this.state.currentVariationIndex });
      this.successAlert(product, 'compare')
    }
  }
  render() {
    const { productDetailData, productQuantity, showModal, shareUrl, title, variations, productDetailDataPrice, currentvalue2, currentvalue1, productCatId, imgProps, currentVariationIndex, fields } = this.state;
    const { wishlist } = this.props;

    return (
      <>
        <section id="maincontent">
          <div className="container-fluid">
            <div className="row py-lg-5 py-2 ">
              <div className="col-lg-6 col-md-6 col-12 mb-2">

                <div className="product-gallery">

                  <div className="product-gallery-preview order-sm-2">
                    <div className="product-gallery-preview-item active" id="first">
                      {imgProps.img ? <ReactImageZoom {...imgProps} /> : ''}
                      <div className="image-zoom-pane" />
                    </div>
                  </div>
                  <div className="product-gallery-thumblist order-sm-1">
                    {productDetailData?.images?.length > 0 ? productDetailData?.images?.map((item, index) =>
                    (<a key={index} className="product-gallery-thumblist-item" ><img className="img-fluid" src={item.image_url}
                      onClick={() => this.renderItemGallery(item.image_url)}
                      alt="Product thumb" /></a>))
                      : <></>}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="product-summary-wrapper">
                  <div className="breadcrumb-section d-flex justify-content-between">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb bg-transparent">
                        <li className="breadcrumb-item"><span>Home</span></li>
                        <li className="breadcrumb-item"><span>Shop</span></li>
                        <li className="breadcrumb-item"><span>{productDetailData?.category?.parent_category[0].title}</span></li>
                        <li className="breadcrumb-item"><span>{productDetailData?.category?.cate_title}</span></li>
                      </ol>
                    </nav>
                  </div>
                  <h1>{productDetailData?.content?.title}</h1>
                  <p className="product-price">
                    <span>₹</span> {productDetailDataPrice || 0}</p>
                  {/* <p className="available">Availability: &nbsp;<span className="text-success">In Stock</span> */}
                  {/* <span className="text-danger">Out of Stock</span> */}
                  {/* </p> */}
                  {/* <div className="short-decription"><p>{productDetailData?.content?.product_description}</p></div> */}
                  <div className="addtocart d-flex justify-content-start">
                    <div className="product-qty">
                      <div className="input-group">
                        <input type="button" value="-" className="quantity-left-minus" disabled={productQuantity < 1} onClick={() => this.countDec()} />
                        <input type="number" value={productQuantity} onChange={this.productQuantityManual} />
                        <input type="button" value="+" onClick={() => this.countInc()} className="quantity-right-plus" />
                      </div>
                    </div>

                    <button type="submit" className="cart-btn buy-btn" onClick={() => {
                      this.selectValidVariation() || this.addToCheckout(productDetailData)
                    }}>Buy Now</button>
                    <button type="submit" className="cart-btn" onClick={() => this.addToCart(productDetailData)} >Add to cart</button>
                  </div>
                  {variations?.map((itemKey, index) => (
                    <div className="productVariation" key={index} >
                      <span>{itemKey.key} :</span>
                      <div className="productVariationList sizes">
                        {itemKey.value.map((itemValue, indexValue) => (itemKey.key === "Color" ?
                          <div className={`colors ${currentvalue1 === itemValue ? 'color-active' : ''}`} key={indexValue} style={{ backgroundColor: itemValue }}
                            onClick={() => {
                              setTimeout(
                                () => { this.makeCombo(itemKey.key, itemValue); this.setState({ currentvalue1: itemValue }) },
                                100
                              );
                            }}
                          /> :
                          <button key={indexValue} className={currentvalue2 === itemValue ? "sizeSelected" : ''}
                            onClick={() => {
                              setTimeout(
                                () => { this.makeCombo(itemKey.key, itemValue); this.setState({ currentvalue2: itemValue }) },
                                100
                              );
                            }}
                          >{itemValue}</button>))}
                      </div>
                    </div>
                  ))}

                  <div className="action-links">
                    <span onClick={() => (this.props.compare.length < 5 ? this.addToCompare(productDetailData) : this.limitAlert())}>
                      <FontAwesomeIcon icon={faRandom} /> Compare</span>
                    <span onClick={() => {
                      wishlist.find(({ product, variation_index }) => (product === productDetailData?.id && variation_index === currentVariationIndex)) !== undefined ? this.deleteWishlist(productDetailData) : this.addToWishlist(productDetailData)
                    }}>
                      <FontAwesomeIcon icon={wishlist.find(({ product, variation_index }) => (product === productDetailData?.id && variation_index === currentVariationIndex)) !== undefined ? faCheck : farHeart}
                      /> {(wishlist.length > 0 && wishlist.find(({ product, variation_index }) => (product === productDetailData?.id && variation_index === currentVariationIndex)) !== undefined
                      ) ? "Added to Wishlist" : "Add to Wishlist"}
                    </span>
                  </div>

                  <div className="add-question my-3 py-2">
                    <span onClick={this.toggleModal}><FontAwesomeIcon icon={faQuestion} /> Ask a Question</span>
                  </div>
                  <div className="social-share">
                    <span>Share:</span>
                    <span>
                      <FacebookShareButton url={shareUrl} quote={title}>
                        <FontAwesomeIcon icon={faFacebook} />
                      </FacebookShareButton>
                    </span>
                    <span>
                      <TwitterShareButton url={shareUrl} quote={title}>
                        <FontAwesomeIcon icon={faTwitter} />
                      </TwitterShareButton></span>
                    <span><PinterestShareButton url={shareUrl} quote={title}>
                      <FontAwesomeIcon icon={faPinterest} />
                    </PinterestShareButton></span>
                    <span><LinkedinShareButton url={shareUrl} quote={title}>
                      <FontAwesomeIcon icon={faLinkedin} />
                    </LinkedinShareButton></span>
                    <span>
                      <TelegramShareButton url={shareUrl} quote={title}>
                        <FontAwesomeIcon icon={faTelegram} />
                      </TelegramShareButton></span>
                  </div>
                  <Modal className='custom-modal-width'
                    isOpen={showModal}
                    onRequestClose={this.toggleModal}
                    contentLabel="AskQuestion"
                    //style={askForm}
                    shouldCloseOnOverlayClick={true}
                    ariaHideApp={false}
                  >
                    <span className="float-right"><FontAwesomeIcon className="text-right" icon={faTimes} /></span>
                    <Form ref={c => { this.form = c }} >

                      {/* <form onSubmit={this.handleSubmit}> */}
                      <h4 className="mb-4">Ask a Question</h4>
                      {Object.keys(this.props.userData).length > 0 ? '' : <><div className="form-group">
                        <label htmlFor="name" className="col-form-label">Name<span>*</span></label>

                        <input type="text" readonly className="form-control" id="name" value={fields.name} onChange={this.handleChange.bind(this, "msg")} />

                      </div>

                        <div className="form-group">
                          <label htmlFor="Email" className="col-form-label">Email<span>*</span></label>

                          <input type="text" readonly className="form-control" id="Email" value={fields.email} onChange={this.handleChange.bind(this, "msg")} />
                          <small>Your email address will not be published.</small>

                        </div></>}

                      <div className="form-group">
                        <label htmlFor="inquiry" className="col-form-label">Your inquiry<span>*</span></label>

                        <Textarea className="form-control" name="" rows="4" cols="50" name="Comment" placeholder="Type your Question..." value={fields.msg} validations={[this.required]} onChange={this.handleChange.bind(this, "msg")}>
                        </Textarea>


                      </div>

                      <button className="btn btn-theme" value="Submit" disabled={false} onClick={this.handleSubmit}> Submit
                      </button>

                      {/* // <button value="Submit" className="btn btn-theme float-right" type="submit" /> */}
                    </Form>
                  </Modal>
                </div>

                <div className="product-meta py-2">

                  <div className="seller-details-box my-3"
                  // onClick={() => this.handleSellerProfile(productDetailData?.vendor?.brand)}
                  >
                    {/* <div className="title-meta">Know your weaver</div> */}
                    <div className="seller-head"><strong>Sold by :</strong> </div>
                    <div className="seller-contact">
                      <div className="seller-logo" >

                        {productDetailData?.vendor ? (
                          <img src={productDetailData?.vendor.logo || "false"} className="img-fluid" onError={e => { e.currentTarget.src = require('../public/eShilpmart_logo_220.svg') }} />) : ''}
                      </div>
                      <div className="s-title"><span> {productDetailData ? (productDetailData?.vendor ? productDetailData?.vendor.brand : '') : ''}</span>
                        {/* <span><ReactStars count={5} edit={false} size={15} color2={'#e87f13'} /></span> */}
                      </div>
                      <div className="s-ratings"><span>
                        <ReactStars count={5} edit={false} size={15} color2={'#ffd700'} /></span>
                        <div className="contactinfo">
                          <small><FontAwesomeIcon icon={faPhoneAlt} /> &nbsp; {productDetailData ? (productDetailData?.vendor ? productDetailData?.vendor.mobile : '') : ''}</small>
                          <small><FontAwesomeIcon icon={faEnvelope} /> &nbsp; {productDetailData ? (productDetailData?.vendor ? productDetailData?.vendor.email : '') : ''}</small>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="clearfix"></div>
                  {/* <span className="sku">SKU: <span>-</span></span> */}
                  {/* <span className="sku">Categories: <span>{productDetailData?.category?.cate_title}</span></span> */}
                  {/* <span className="sku">Tags: <span>{productDetailData?.content?.product_tags}</span></span> */}
                </div>
                <div className="product-description-wrapper pb-5">
                  <div className="product-description">
                    <header>Description</header>
                    <p>{productDetailData?.content?.product_description}</p>
                  </div>

                  <div className="product-description">
                    <header>Product Specifications</header>
                    <ul className="specification">{productDetailData?.properties?.map((item, index) => (
                      <li key={index}><span>{item.variation_key} :</span> {item.veriation_value}</li>
                    ))}</ul>
                  </div>



                  <div className="product-description">
                    <header className="d-flex justify-content-between feedback">
                      <span>Reviews</span>
                    </header>
                    {/* <Bars data={this.state.testData} makeUppercase={true} /> */}
                    <div className="row">
                      <div className="col-sm-3">
                        <div className="avgratings">
                          <div className="avgrate">4.7<span>★</span></div>
                          <div className="avgstate">324 Ratings & 66 Reviews</div>
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <div className="barWrapper">
                          <ul className="rate">
                            <li className="rateNumbers"><span>5</span><span>★</span></li>
                            <li className="rateNumbers"><span>4</span><span>★</span></li>
                            <li className="rateNumbers"><span>3</span><span>★</span></li>
                            <li className="rateNumbers"><span>2</span><span>★</span></li>
                            <li className="rateNumbers"><span>1</span><span>★</span></li>
                          </ul>
                          <ul className="bars">
                            <li><div className="bar"><span className="bargreen"></span></div></li>
                            <li><div className="bar"><span className="bargreen pro4"></span></div></li>
                            <li><div className="bar"><span className="bargreen pro3"></span></div></li>
                            <li><div className="bar"><span className="barorange"></span></div></li>
                            <li><div className="bar"><span className="barred"></span></div></li>
                          </ul>
                          <ul className="result">
                            <li><span>225</span></li>
                            <li><span>125</span></li>
                            <li><span>15</span></li>
                            <li><span>05</span></li>
                            <li><span>10</span></li>
                          </ul>
                        </div>
                      </div>

                      <div className="col my-2">
                        <p>Images uploaded by Customer</p>
                        <div className="imgCustomer">
                          <span><img src={require('../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" /></span>
                          <span><img src={require('../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" /></span>
                        </div>

                        <div className="product-review pb-4 my-4 border-bottom">
                          <div className="d-flex mb-3">
                            <div className="d-flex align-items-center mr-4 pr-2"><img className="rounded-circle" src={require('../public/saree-2-300x300.jpeg')} width={50} alt="Sunil Aggrawal" />
                              <div className="pl-3">
                                <h6 className="fs-sm mb-0">Sunil Aggrawal</h6>
                                <small className="fs-ms text-muted">July 14, 2021</small>
                              </div>
                            </div>
                            <div>
                              <div className="star-rating">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStarHalfAlt} />
                              </div>
                              <small className="fs-ms text-muted">83% of users found this review helpful</small>
                            </div>
                          </div>
                          <p className="fs-md mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>

                          <div className="text-nowrap">
                            <button className="btn-like" type="button">15</button>
                            <button className="btn-dislike" type="button">3</button>
                          </div>
                        </div>

                        <div className="product-review my-4">
                          <div className="d-flex mb-3">
                            <div className="d-flex align-items-center mr-4 pr-2"><img className="rounded-circle" src={require('../public/saree-2-300x300.jpeg')} width={50} alt="Sunil Aggrawal" />
                              <div className="pl-3">
                                <h6 className="fs-sm mb-0">Sunil Aggrawal</h6>
                                <small className="fs-ms text-muted">July 12, 2021</small>
                              </div>
                            </div>
                            <div>
                              <div className="star-rating">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStarHalfAlt} />

                              </div>
                              <small className="fs-ms text-muted">83% of users found this review helpful</small>
                            </div>
                          </div>
                          <p className="fs-md mb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>

                          <div className="text-nowrap">
                            <button className="btn-like" type="button">15</button>
                            <button className="btn-dislike" type="button">3</button>
                          </div>
                        </div>



                      </div>

                    </div>

                  </div>

                  <div className="product-description">
                    <header>Inquiries</header>
                    <div className="question_ans_wrapper mb-3">
                      <div className="d-flex mb-2">
                        <div className="question_ans_title">Question :</div>
                        <div className="question_ans_text">When will blue saree will be restocked?</div>

                      </div>

                      <div className="d-flex">
                        <div className="question_ans_title">Answer :</div>
                        <div className="question_ans_text">It has been restocked. Please refresh the product page. By vardha SELLER  on 24 October, 2020</div>

                      </div>
                    </div>


                    <div className="question_ans_wrapper mb-3">
                      <div className="d-flex mb-2">
                        <div className="question_ans_title">Question :</div>
                        <div className="question_ans_text">When will blue saree will be restocked?</div>

                      </div>

                      <div className="d-flex">
                        <div className="question_ans_title">Answer :</div>
                        <div className="question_ans_text">It has been restocked. Please refresh the product page. By vardha SELLER  on 24 October, 2020</div>

                      </div>
                    </div>

                    {/* <p>{productDetailData?.content?.product_description}</p> */}
                  </div>

                </div>
              </div>
            </div>
            <div className="row py-5">
              <div className="col shopby-product">
                <div className="related-title">
                  <h3>Related Products</h3>
                </div>
                {productCatId && <ShopByType type='product'  {...this.props} catId={productCatId} />}
              </div>
            </div>
          </div>
        </section>

      </>
    )
  }
}


const mapStateToProps = state => {
  return {
    cart: state.cart,
    userData: state.userData,
    wishlist: state.wishlist,
    compare: state.compare
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: cart => dispatch(cartAction.addToCart(cart)),
    addToWishlist: wishlist => dispatch(wishlistAction.addToWishlist(wishlist)),
    deleteWishlist: index => dispatch(wishlistAction.deleteWishlist(index)),
    addToCompare: compare => dispatch(compareAction.addToCompare(compare)),

  }
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);

