import React from 'react';
import AddressService from '../services/AddressService';
import OrderService from '../services/OrderService';
import Modal from 'react-modal';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import ToastService from '../services/ToastService';
import Login from "./Login";
import { CheckoutProvider, Checkout } from 'paytm-blink-checkout-react';
import Loader from "react-loader";
import * as cartAction from '../actions/cart';
import { loaderOptions, customLoginStyles, paymentConfig } from "../lib/utils";
import AddAddress from "./my-account/Address/AddAddress";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
class CheckoutComp extends React.Component {
  constructor(props) {
    super(props);
    this.changeQuantity = this.changeQuantity.bind(this);

    if (typeof props?.location?.state !== 'undefined') {
      localStorage.setItem('checkOutData', JSON.stringify(props?.location?.state?.checkout));
      localStorage.setItem('totalCartCost', props?.location?.state?.totalCartCost * 1)
    }

    this.state = {
      addressList: [],
      sectionToggle: { shipping: false, billing: false, orderSummary: false },
      selectedShippingAddress: {},
      selectedBillingAddress: {},
      showModal: false,
      checkOutData: JSON.parse(localStorage.getItem('checkOutData')) || [],
      totalCartCost: localStorage.getItem('totalCartCost') * 1 || 0,
      paymentType: '', paytmConfig: {},
      txnResponse: {},
      isCheckoutClick: false,
      checksumResponse: {},
      isLoaded: false,
      isBillingAddressSame: true,
      addressType: '', addeditAddress: false, productQuantity: 1
    };

  }

  componentDidMount() {
    if (this.props.userData?.token) {
      this.setState({ isLoaded: false });
      this.getAddress();
    } else {
      this.setState({ isLoaded: true });
      this.dismissModal('login')
    }

  }

  getAddress = () => {
    AddressService.list().then((result) => {
      if (result.data.length > 0) {
        this.setState({
          selectedShippingAddress: result.data.find(({ is_default }) => is_default === 1) || result.data[0],
          selectedBillingAddress: result.data.find(({ is_default }) => is_default === 1) || result.data[0], addressList: result.data, isLoaded: true
        });
      }
      else {
        this.props.history.push({
          pathname: '/my-account/add-address'
        });
      }
    }).catch((err) => {
      this.setState({ isLoaded: true });
      console.log(err);
    });
  }

  orderValidate = (txnResponse, online_type) => {
    var txnObj = {
      txn_response: txnResponse,
      online_type: online_type,
    }
    OrderService.orderValidate(txnObj).then(async (result) => {
      this.setState({ isLoaded: true })
      if (!result) return
      this.props.history.push({
        pathname: '/thankyou/for-payment/',
        state: { paymentType: this.state.paymentType, result: result.data }
      });
      localStorage.removeItem("checkOutData");
      localStorage.removeItem("totalCartCost");
      this.props.emptyCart();
    })
  }

  dismissModal = (type, addressType) => {
    if (type === 'address') {
      this.setState({
        addressType: addressType
      });
      if (addressType === "billing") {

        this.setState({
          showModal: !this.state.showModal, overlayType: type
        });
      }
    } else {
      this.setState({
        showModal: !this.state.showModal, overlayType: type
      });
    }

  };

  changeAddress = (type) => {
    this.setState({
      showModal: !this.state.showModal, overlayType: 'address', addressType: type
    });
  }

  handleCheckout = async (e) => {
    this.setState({ isCheckoutClick: true })
    const { paymentType } = this.state;
    e.preventDefault();
    let checkoutObj = {}, prodObj = [];
    if (!this.state.selectedShippingAddress?.id) return ToastService.error("Please select shipping address");
    if (!paymentType) return ToastService.error("Please select payment type");

    if (this.props.userData?.token) {
      this.setState({ isLoaded: false });
      checkoutObj = {
        is_checkout: true,
        coupan_code: "",
        isBillingAddressSame: this.state.isBillingAddressSame,
        billing_address: {
          address_id: this.state.isBillingAddressSame ? this.state.selectedShippingAddress?.id : this.state.selectedBillingAddress?.id
        },
        shipping_address: {
          address_id: this.state.selectedShippingAddress?.id
        },
        is_payment_online: paymentType === 'cod' ? false : true,
        payment_detail: {
          online_type: paymentType,
          callback: '',
          website: "WEBSTAGING",
          channel_id: "WEB"
        }
      };
      this.state.checkOutData.map((item) => {
        prodObj.push({
          "product_id": item.product_details?.id || item.id,
          "quantity": item.quantity,
          "variation_index": item.variation_index
        })
      });
      checkoutObj.products = prodObj;

      OrderService.orderPlace(checkoutObj).then(async (result) => {
        if (!result) return
        if (paymentType === 'paytm') {

          let _this = this;
          _this.setState({
            paytmConfig: {
              root: "",
              flow: "DEFAULT",
              data: {
                orderId: result.data.order_details.id,
                token: result.data.checksum.body.txnToken,
                tokenType: "TXN_TOKEN",
                amount: result.data.order_details.order_total
              },
              handler: {
                notifyMerchant: function (eventName, data) {
                  console.log("notifyMerchant handler function called", eventName, data);
                  if (eventName === 'APP_CLOSED') window.location.reload();
                },
                transactionStatus: function (data) {
                  window.Paytm.CheckoutJS.close();
                  _this.orderValidate(data, paymentType);
                }
              },
              merchant: {
                mid: paymentConfig.paytmMid,
                callbackUrl: "",
                name: "E-Shilpmart",
                logo: "https://main.digitalindiacorporation.in/static/media/logo-eshilp.dffc449c.svg",
                redirect: false,
              },
              mapClientMessage: {},
              labels: {},
              payMode: {
                labels: {},
                filter: { exclude: [] },
                order: ["NB", "CARD", "LOGIN"]
              }
            }
          });
        }
        if (paymentType === 'airpay') {
          this.setState({ isLoaded: false });
          var information = {
            action: "https://payments.airpay.co.in/pay/index.php",
            params: result.data.checksum
          };
          this.post(information)
          localStorage.setItem('paymentType', 'airpay');
          localStorage.setItem('orderId', result.data.order_details.id);
        }
        if (paymentType === 'cod') {

          localStorage.setItem('paymentType', 'cod');
          localStorage.setItem('orderId', result.data.order_details.id);
          localStorage.removeItem("checkOutData");
          localStorage.removeItem("totalCartCost");
          this.props.emptyCart();
          this.props.history.push({
            pathname: '/thankyou/for-payment/',
            state: { paymentType: this.state.paymentType }
          });
        }
        this.setState({ isLoaded: true });
      }).catch((err) => {
        console.log(err);
      })
    }
    else {
      this.dismissModal('login')
    }
  }

  post(details) {
    const form = this.buildForm(details)
    document.body.appendChild(form)
    form.submit()
    form.remove()
  }

  buildForm({ action, params }) {
    var form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)
    for (const [key, value] of Object.entries(params)) {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', value)
      form.appendChild(input)
    }
    return form
  }

  toggleSection = (type) => {
    let sectionToggle = this.state.sectionToggle;
    sectionToggle[type] = !this.state.sectionToggle[type];
    this.setState({ sectionToggle });
  }

  changeQuantity = (product, quantity, type) => {
    const { totalCartCost, checkOutData } = this.state;
    let objIndex, checkOutDataLoc, cartProduct, cartCost;
    if (quantity === 0) {
      cartProduct = checkOutData.filter((item) => item.id !== product.id);
      cartCost = totalCartCost - (product.product_details?.prices[0]?.price * product.quantity);
      this.setState({
        checkOutData: cartProduct,
        totalCartCost: cartCost
      });
      localStorage.setItem('checkOutData', JSON.stringify(cartProduct));
      localStorage.setItem('totalCartCost', totalCartCost - (product.product_details?.prices[0]?.price * product.quantity));
    } else {
      objIndex = checkOutData.findIndex((obj => obj.id === product.id));
      checkOutDataLoc = [...checkOutData];
      checkOutDataLoc[objIndex] = { ...checkOutDataLoc[objIndex], quantity: quantity };

      cartCost = type === 'inc' ? totalCartCost + (product.product_details?.prices[0]?.price * 1) :
        totalCartCost - (product.product_details?.prices[0]?.price * 1)
      this.setState({
        checkOutData: checkOutDataLoc, totalCartCost: cartCost
      });
      localStorage.setItem('checkOutData', JSON.stringify(checkOutDataLoc));
      localStorage.setItem('totalCartCost', cartCost);
    }

  }

  render() {
    const { checkOutData, totalCartCost, selectedShippingAddress, selectedBillingAddress, showModal, addressList, paymentType, overlayType, paytmConfig, isCheckoutClick, isLoaded, isBillingAddressSame, addressType, addeditAddress, sectionToggle } = this.state;
    let finItem, _variationIndex = 0;

    return (
      <section>
        <CheckoutProvider config={paytmConfig} env='STAGE'>
          <Checkout />
        </CheckoutProvider>
        <div>
          <Modal
            isOpen={showModal}
            style={overlayType === 'login' ? customLoginStyles : {}}
            shouldCloseOnOverlayClick={false}
            ariaHideApp={false}
          > {overlayType === 'login' ? <Login
            dismissModal={() => this.dismissModal(overlayType)} {...this.state} /> :
            <div className="changeadd">
              <span><FontAwesomeIcon className="text-left" icon={faTimes} onClick={() => this.setState({
                showModal: false, selectedBillingAddress: selectedBillingAddress ? selectedBillingAddress : {}
              })} /></span>
              <h1 className="border-bottom mb-3"> Select Address</h1>

              <div className="row">
                {addressList?.map((item, index) => (
                  <div key={index} className="col-sm-3 col-12">
                    <div className="card shadow mb-3">
                      <div className="card-body"
                        onClick={() => {
                          addressType === 'shipping' ? this.setState({ selectedShippingAddress: item }) :
                            this.setState({ selectedBillingAddress: item, isBillingAddressSame: false })
                        }}
                      >
                        <address className="selectAdd"><strong>{item.name}</strong>
                          <br />{item.address1} <br />{item.address2} <br /> {item.sub_district.sub_district_name}
                          <br /> {item.district?.district_name},  {item.state.state_name} - {item.pincode}<br />
                          <strong>Mobile No.</strong>: {item.mobile}<br />
                          <strong>Email</strong> : {item?.email}
                        </address>
                        <div className="form-check radioPos">
                          <input className="form-check-input" type="radio" name="selectAdd" checked={item.id === selectedShippingAddress?.id} defaultValue={selectedShippingAddress?.id} onChange={() => this.setState({ showModal: false })} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))} </div> <Link to='/my-account/add-address' className="btn btn-dark btn-theme" > Add New Address</Link></div>}
          </Modal>
        </div>

        {this.props.userData?.token && <Loader loaded={isLoaded} message='Loading...' options={loaderOptions} className="spinner" >
          <div className="container-fluid">
            <div className="row py-5">

              <div className="col-md-8 order-md-1">
                <div className="card mb-3">
                  <div className="changeHead">
                    <h3>
                      <span className="srno">1</span>
                      <span>Shipping Address</span>
                    </h3>
                  </div>
                  {sectionToggle.shipping ? <div className="changewrapper">
                    <div className="row">
                      {addeditAddress ? <AddAddress
                        address={selectedShippingAddress}
                        selectedAddress={(e) => { this.setState({ selectedShippingAddress: e, addeditAddress: false }); this.getAddress() }} /> :
                        <>
                          <div className="col">
                            <div className="addresswraper">
                              <p className="d-flex addressTop">
                                <span><strong><FontAwesomeIcon icon={faCheck} /> {selectedShippingAddress?.name}</strong></span>
                                <span className="type">{selectedShippingAddress?.type === 1 ? "Home" : "Work"}</span>
                                < span > <strong>Mobile No.</strong>: <strong>{selectedShippingAddress?.mobile}</strong></span>
                              </p>
                              <p>{selectedShippingAddress?.address1}<br />
                                {selectedShippingAddress?.address2}<br />
                                <strong>Pincode</strong>: {selectedShippingAddress?.pincode}</p>
                              <div className="d-flex address_btn"><button onClick={() => this.setState({ sectionToggle: { shipping: false } })}>Procced</button>
                                <button onClick={() => { this.changeAddress('shipping') }}>Select Address</button></div>
                            </div>
                            <div className="form-group form-check">
                              <input type="checkbox" className="form-check-input" checked={isBillingAddressSame}
                                onChange={() => { this.setState({ isBillingAddressSame: !isBillingAddressSame }); (isBillingAddressSame && this.dismissModal('address', "billing")) }} />
                              <label className="form-check-label" htmlFor="same-address">Shipping address is the same as my billing address</label>
                            </div>
                          </div>
                          <div className="col">
                            <span className="checkEdit" onClick={() => { this.setState({ addeditAddress: true }) }}>Edit</span>
                          </div></>
                      }
                    </div>
                  </div> :
                    <div className="card-body">
                      <div className="checkoutSteps">
                        {/* <div className="checkoutSrno">1</div> */}
                        <div className="checkoutinfo">
                          {/* <span>Shipping Addressinside <FontAwesomeIcon icon={faCheck} /></span> */}
                          <span className="bottominfo">{selectedShippingAddress?.name},{selectedShippingAddress?.address1},{selectedShippingAddress?.address2}</span>
                          <span className="bottominfo">{selectedShippingAddress?.mobile}</span>
                          <span className="bottominfo">{selectedShippingAddress?.state?.state_name}</span>
                          <span className="bottominfo"> <strong>Pincode</strong>: {selectedShippingAddress?.pincode}</span>
                        </div>
                        <button onClick={() => this.setState({ sectionToggle: { shipping: true } })}>Change</button>
                      </div>
                    </div>}
                </div>
                <div className="card mb-3">
                  <div className="changeHead">
                    <h3>
                      <span className="srno">2</span>
                      <span>Billing Address</span>
                    </h3>
                  </div>
                  {sectionToggle.billing ? <div className="changewrapper">
                    <div className="row">
                      {addeditAddress ? <AddAddress
                        address={selectedBillingAddress}
                        selectedAddress={(e) => { this.setState({ selectedBillingAddress: e, addeditAddress: false }); this.getAddress() }} /> :
                        <>
                          <div className="col">
                            <div className="addresswraper">
                              <p className="d-flex addressTop">
                                <span><strong><FontAwesomeIcon icon={faCheck} /> {selectedBillingAddress?.name}</strong></span>
                                <span className="type">{selectedBillingAddress?.type === 1 ? "Home" : "Work"}</span>
                                < span > <strong>Mobile No.</strong>: <strong>{selectedBillingAddress?.mobile}</strong></span>
                              </p>
                              <p>{selectedBillingAddress?.address1}<br />{selectedBillingAddress?.address2}<br />               <strong>Pincode</strong>: {selectedBillingAddress?.pincode}</p>
                              <div className="d-flex address_btn">
                                <button onClick={() => this.setState({ sectionToggle: { billing: false } })}>Procced</button>
                                <button onClick={() => { this.changeAddress('billing') }}>Select Address</button>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <span className="checkEdit" onClick={() => { this.setState({ addeditAddress: true }) }}>Edit</span>
                          </div></>
                      }
                    </div>
                  </div> :
                    <div className="card-body">
                      <div className="checkoutSteps">
                        {/* <div className="checkoutSrno">2</div> */}
                        <div className="checkoutinfo">
                          {/* <span>Billing Address <FontAwesomeIcon icon={faCheck} /></span> */}
                          <span className="bottominfo">{selectedBillingAddress?.name},{selectedBillingAddress?.address1},{selectedBillingAddress?.address2}</span>
                          <span className="bottominfo">{selectedBillingAddress?.mobile}</span>
                          <span className="bottominfo">{selectedBillingAddress?.state?.state_name}</span>
                          <span className="bottominfo"> <strong>Pincode</strong>: {selectedBillingAddress?.pincode}</span>
                        </div>
                        <button onClick={() => this.setState({ sectionToggle: { billing: true } })}>Change</button>
                      </div>
                    </div>}
                </div>
                <div className="changeHead">
                  <h3>
                    <span className="srno">3</span>
                    <span>Order Summary</span>
                  </h3>
                </div>
                {checkOutData.length === 0 ? <div className="card mb-3">
                  <div className="card-body">
                    <div className="checkoutSteps">
                      <div className="checkoutinfo">
                        <span>Sorry, your checkout session has expired.</span>
                      </div></div>
                  </div>
                </div>

                  :

                  sectionToggle.orderSummary ?
                    <div className="card mb-3">

                      <div className="changewrapper">
                        <div className="row">
                          <div className="col">

                            {checkOutData.map((item, index) => (
                              finItem = item?.product_details || item?.product || item,
                              finItem.images.forEach((imageItem, imageIndex) => {
                                if (imageItem.variation_index === item.variation_index) {
                                  _variationIndex = imageIndex;
                                }
                              }),
                              <div className="orderSummaryWrapper" key={index}>
                                <div className="row">
                                  <div className="col-sm-9 col-12"><div className="orderSummary">
                                    <div className="orderImg">
                                      <img src={(finItem?.images[_variationIndex || 0]?.image_url) || "false"} className="img-fluid" onError={e => { e.currentTarget.src = require('../public/No_Image_Available.jpeg') }} /></div>
                                    <div className="orderInfo">
                                      <p className="producthead">{finItem?.content?.title}</p>
                                      <span className="productprice"><span>₹</span> {finItem?.prices[item.variation_index]?.price || finItem?.prices[0]?.price} X {item?.quantity ? item?.quantity : 1}</span>
                                    </div>
                                  </div></div>
                                  <div className="col-sm-3 col-12"><div className="orderaction">
                                    <div className="product-qty">
                                      <div className="input-group">
                                        <input type="button" className="quantity-left-minus" value="-" onClick={() => this.changeQuantity(item, item?.quantity - 1, 'dec')} />
                                        <input type="number" value={item.quantity} onChange={(e) => this.changeQuantity(item, e.target.value)} />
                                        <input type="button" className="quantity-right-plus" value="+" onClick={() => this.changeQuantity(item, item?.quantity + 1, 'inc')} />
                                      </div>
                                    </div>
                                    <span onClick={() => this.changeQuantity(item, 0, 'dec')}><FontAwesomeIcon icon={faTrashAlt} /></span>
                                  </div></div>
                                </div>



                              </div>))}
                            {/* </div> */}
                            <div className="d-flex address_btn my-2 float-right"><button onClick={() => this.setState({ sectionToggle: { orderSummary: false } })}>Procced</button></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    : <div className="card mb-3">
                      <div className="card-body">
                        <div className="checkoutSteps">
                          <div className="checkoutinfo orderSummary">
                            <div className="checkoutInfo_img">
                              <div className="orderImgs">
                                <img src={checkOutData[0].product?.images[checkOutData[0]?.variation_index]?.image_url || checkOutData[0]?.product_details?.images[checkOutData[0]?.variation_index]?.image_url || checkOutData[0]?.images[checkOutData[0]?.variation_index]?.image_url || checkOutData[0]?.images[0].image_url || "false"} className="img-fluid" onError={e => { e.currentTarget.src = require('../public/No_Image_Available.jpeg') }} />

                              </div>
                              {checkOutData.length > 1 && <span>+{checkOutData.length - 1} {(checkOutData.length - 1) > 1 ? "Items" : "Item"}</span>}
                            </div>
                            <div className="checkoutInfo_title">{checkOutData[0]?.content?.title || checkOutData[0]?.product_details?.content.title || checkOutData[0]?.product?.content.title}</div>


                          </div>
                          <button onClick={() => this.setState({ sectionToggle: { orderSummary: true } })}>Change</button>
                        </div>

                      </div>
                    </div>}
                {checkOutData.length > 0 && <div className="card mb-3">
                  <div className="changeHead">
                    <h3>
                      <span className="srno">4</span>
                      <span>Payment Options</span>
                    </h3>
                  </div>
                  <div className="changewrapper">
                    <div className="row">
                      <div className="paymentOption">
                        <div className="form-check">
                          <input id="credit" name="paymentMethod" type="radio" className="form-check-input" value='cod'
                            checked={paymentType === 'cod'} disabled={totalCartCost > 5000}
                            onChange={() => this.setState({ paymentType: 'cod', isCheckoutClick: false })} />

                          <label className="form-check-label" htmlFor="credit">
                            Cash On Delivery  {totalCartCost > 5000 && <span className="float-right">Cash On Delivery is unavailable for current order</span>}
                          </label>
                        </div>

                        <div className="form-check">
                          <input id="debit" name="paymentMethod" type="radio" className="form-check-input" value='paytm'
                            checked={paymentType === 'paytm'}
                            onChange={() => this.setState({ paymentType: 'paytm', isCheckoutClick: false })} />
                          <label className="form-check-label" htmlFor="debit">
                            Paytm  <img src="https://app.digitalindiacorporation.in/v1/digi/wp-content/plugins/paytm-payments/images/paytm.png" width="55px" alt="Paytm"></img>
                          </label>
                        </div>
                        <div className="form-check">

                          <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" value='airpay'
                            checked={paymentType === 'airpay'}
                            onChange={() => this.setState({ paymentType: 'airpay', isCheckoutClick: false })} />
                          <label className="form-check-label" htmlFor="paypal">
                            Online Payments <img src="https://app.digitalindiacorporation.in/v1/digi/wp-content/plugins/woocommerce-gateway-airpay/assets/img/logo_airpay.png" alt="Online Payments"></img>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>}

                <div className="card">
                  <div className="card-body">
                    <form className="needs-validation login-card" >
                      <button className="btn login-btn" type="button" disabled={isCheckoutClick || checkOutData.length === 0} onClick={(e) => this.handleCheckout(e)}> Continue to checkout
                      </button>
                    </form>
                  </div>
                </div>

              </div>


              {checkOutData.length > 0 && <div className="col-md-4 order-md-2 mb-4">
                <div className="card product-img-wrapper">
                  <div className="card-header">
                    <h6 className="text-dark text-uppercase mb-0">Price Details</h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {checkOutData.map((item, index) => (
                        finItem = item?.product_details || item?.product || item,
                        <li key={index} className="d-flex justify-content-between border-bottom py-3">

                          <span className="my-0">{finItem?.content?.title}</span>
                          {/* <span>Store: <small className="text-muted">{finItem?.store_name}</small></span> */}

                          <span className="text-muted"><span>₹</span> {finItem?.prices[item.variation_index || 0]?.price || finItem?.prices[0]?.price} X {item?.quantity ? item?.quantity : 1}</span>

                        </li>
                      ))}

                      <li className="d-flex justify-content-between border-bottom py-3">
                        <h5 className="text-dark">Shipping Charges</h5>
                        <span className="text-success text-uppercase">Free</span>
                      </li>

                      <li className="d-flex justify-content-between pt-3">
                        <h5><span className="text-dark">Total Payable</span></h5>
                        <span className="text-dark h6"><span>₹</span> {totalCartCost}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>}
            </div>
          </div >
        </Loader >}
      </section >
    );
  }
}
const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    emptyCart: index => dispatch(cartAction.emptyCart(index))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutComp);

