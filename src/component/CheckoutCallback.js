import { faAngleLeft, faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import OrderService from '../services/OrderService';
export default class CheckoutCallback extends React.Component {

  constructor(props) {
    super(props); this.state = {
      orderPlacedData: {}, orderList: [],
      isLoaded: false
    };
    // this.props.location?.state?.paymentType !== 'paytm' &&
    //   this.orderValidate(localStorage.getItem('paymentType'), localStorage.getItem('orderId'))
  }
  componentDidMount() {
    this.getOrders(localStorage.getItem('orderId'));
  }
  getOrders = (queryParams) => {
    OrderService.list(queryParams).then((result) => {
      if (!result) return
      this.setState({ orderList: result, isLoaded: true });
    }).catch((err) => {
      console.log(err);
      this.setState({ isLoaded: true })
    });
  }
  // orderValidate = (paymentType, orderId) => {

  //   OrderService.orderValidate({
  //     online_type: paymentType, order_id: orderId
  //   }).then(async (result) => {
  //     this.setState({ isLoaded: true })
  //     if (!result) return
  //     this.setState({ orderPlacedData: result?.data?.order_details || {} })
  //     localStorage.removeItem("checkOutData");
  //     localStorage.removeItem("totalCartCost");
  //     localStorage.removeItem("paymentType");
  //     this.props.emptyCart();
  //   })
  // }

  render() {
    const { orderList } = this.state;
    console.log("demo====", orderList)
    return (
      // <div className="empty-wishlist">
      //   <h2>Thank you for shopping with us.</h2>
      // </div>

      <div className="col-lg-7 py-5 offset-3">
        <div className="success-screen">
          <div className="thank-you text-center">
            <FontAwesomeIcon icon={faCheckCircle} />

            <h1 className="text-white">Thank You</h1>
            <span className="text-white">Success! We received your payment. Your order will be processed soon.</span><br />
            <strong className="text-white">Transaction ID: <span>1234567890</span></strong></div>
          <div className="delivery p-4 p-md-5 bg-light text-center"><span className="h5">Expected Date Of Delivery</span>
            <h2 className="mb-0 mt-2"> August 5, 2021 </h2>
          </div>
          <div className="pt-4 px-4 pt-md-5 px-md-5 pb-3">
            <div className="row">
              <div className="col-lg-6">
                <h6>Ship To</h6>
                <ul className="list-unstyled mb-0">

                  {/* <li>{orderPlacedData?.address[0]?.name}</li>
                  <li>{orderPlacedData?.address[0]?.address1}, </li>
                  <li>{orderPlacedData?.address[0]?.address2},</li>
                  <li>{orderPlacedData?.address[0]?.sub_district.name},{orderPlacedData?.address[0]?.district.name}</li>
                  <li>{orderPlacedData?.address[0]?.state.name}</li> */}
                </ul>
              </div>
              <div className="text-lg-right mt-4 mt-lg-0 col-lg-6">
                <h6>Summary</h6>
                <ul className="list-unstyled mb-0">
                  <li><span>Order ID:</span> <strong>1234567890</strong></li>
                  <li><span>Order Date:</span> <strong> August 3, 2021</strong></li>
                  <li><span>Order Total:</span> <strong>₹ 2600.00 </strong></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="ordered-detail">
            <h5 className="mb-4">Your Ordered Details</h5>
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr className="ordered-item">
                    <td className="ordered-image"><img src={require('../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" /></td>
                    <td className="ordered-name"><h6 className="mb-0">Product Name</h6>
                      <span>Handloom Cotton Saree</span></td>
                    <td className="ordered-quantity"><h6 className="mb-0">Quantity</h6>
                      <span>1</span></td>
                    <td className="ordered-price"><h6 className="mb-0">Price</h6>
                      <span>₹ 1300.00</span></td>
                  </tr>
                  <tr className="ordered-item">
                    <td className="ordered-image"><img src={require('../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" /></td>
                    <td className="ordered-name"><h6 className="mb-0">Product Name</h6>
                      <span>Handloom Cotton Saree</span></td>
                    <td className="ordered-quantity"><h6 className="mb-0">Quantity</h6>
                      <span>1</span></td>
                    <td className="ordered-price"><h6 className="mb-0">Price</h6>
                      <span>₹ 1300.00</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="table-responsive">
              <table className="table total-table table-borderless mt-4 mb-0">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-right">₹ 2600.00</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-right text-success">FREE</td>
                  </tr>
                  <tr className="border-top">
                    <td><strong className="h5">Total</strong></td>
                    <td className="text-right h5"><strong>₹ 2600.00</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-sm-flex px-4 pb-4 px-md-5 pb-md-5"><a className="button ml-auto" href="/"><FontAwesomeIcon icon={faAngleLeft} /> Go to home</a></div>
        </div>
      </div>
    );
  }
}