import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faStar, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { getOrderStatus } from "../../../lib/utils";
import { format } from 'date-fns';
import OrderService from '../../../services/OrderService';
import Modal from "react-modal";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import { Link } from "react-router-dom";
import ToastService from '../../../services/ToastService';
export default class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.error = false;
    this.handleChange = this.handleChange.bind(this);
    this.requiredBinded = this.required.bind(this);

    this.state = {
      orderDetail: props?.location?.state?.orderDetail, base64Doc: '', showModal: false,
      fields: {
        order_id: props?.location?.state?.orderDetail.id,
        first_name: '', last_name: '', email: '', msg: '',
        type: 2
      }
    };
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

    if (this.state.orderDetail === undefined) {
      this.props.history.push({
        pathname: '/my-account/order'
      })
    }
  }
  onDocumentLoad({ numPages }) {
    this.setState({ numPages });
  }

  getInvoidePdf(order_id, awb) {
    OrderService.orderInvoice({ order_id: order_id, awb: awb }).then((result) => {
      this.setState({ base64Doc: result?.data, showModal: !this.state.showModal })
    });
  }
  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };
  handleNeedHelp = (e) => {
    e.preventDefault();
    if (this.form.getChildContext()._errors.length === 0) {
      if (!this.error) {
        OrderService.raiseATicket(this.state.fields).then((result) => {
          this.setState({ showModal: !this.state.showModal })
        });
      }
    }
  }
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });

  }
  cancelOrder = (order, product) => {
    OrderService.orderCancel({ order_id: order, product_id: product.product_id, variation_index: product.variation_index }).then((result) => {
      // ToastService.success(result?.data);
      this.setState(prevState => ({
        orderDetail: {
          ...prevState.orderDetail, product_details: result?.data?.product_details
        }
      }))
    }).catch((err) => {
      console.log(err);
    });
  }
  productDetail = (value) => {

    this.props.history.push({
      pathname: '/product-detail',
      search: "?pid=" + value.product_id
    });
  }

  render() {

    const { orderDetail, base64Doc, showModal, fields } = this.state;
    var report = "data:application/pdf;base64," + base64Doc;
    return (
      <div className="row">
        <div className="col">
          <div className="card mb-4 shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 border-right">
                  <div className="deladd">
                    <h5>Shipping Address</h5>
                    <p>{orderDetail?.address[0]?.address1}<br /> {orderDetail?.address[0]?.address2} ,{orderDetail?.address[0]?.city}-{orderDetail?.address[0]?.pincode}
                    </p>
                  </div>
                </div> <div className="col-sm-6">
                  <div className="actionBtn">
                    <div className="deladd">
                      <h5>Billing Address</h5>
                      <p>{orderDetail?.address[1]?.address1}<br /> {orderDetail?.address[1]?.address2} ,{orderDetail?.address[1]?.city}-{orderDetail?.address[1]?.pincode}
                      </p>
                    </div>
                    <Modal className='custom-modal-width'
                      isOpen={showModal}
                      onRequestClose={this.toggleModal}
                      shouldCloseOnOverlayClick={true}
                      ariaHideApp={false}>
                      <span className="modalClose">
                        <FontAwesomeIcon className="text-left" icon={faTimes} onClick={this.toggleModal} />
                      </span>
                      {base64Doc ?
                        <object aria-labelledby="label1" width="100%" height="100%" type="application/pdf" data={report} />
                        :
                        <Form ref={(c) => { this.form = c; }} onSubmit={(e) => this.handleNeedHelp(e)} >
                          <h1> Support Ticket</h1>
                          {/* <div className="form-row">
                            <div className="form-group col-md-6">
                              <label htmlFor="fname">First Name*</label>
                              <Input type="text" className="form-control" id="fname" name="first name" value={fields.first_name} validations={[this.required]} onChange={this.handleChange.bind(this, "first_name")} placeholder="" />
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor="lName">Last Name*</label>
                              <Input type="text" className="form-control" id="lName" name="last name" value={fields.last_name} validations={[this.required]} onChange={this.handleChange.bind(this, "last_name")} placeholder="" />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="email">Email*</label>
                            <Input type="email" className="form-control" id="email" placeholder="Email" name="email" value={fields.email} validations={[this.required]} onChange={this.handleChange.bind(this, "email")} />
                          </div> */}
                          <div className="form-group">
                            <label htmlFor="InputAddress2">Issues you are having * </label>
                            <Textarea className="form-control" name="" rows="14" cols="50" name="Comment" value={fields.msg} validations={[this.required]} onChange={this.handleChange.bind(this, "msg")}>
                            </Textarea>
                          </div>


                          <button value="Submit" className="btn btn-theme">Submit</button>
                        </Form>
                      } </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {orderDetail?.product_details?.map((productItem, index) => (

            <div className="card mb-3 shadow" key={index}>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="row">
                      <div className="col-12">
                        <span className="d-block mb-2"><strong>Order No. : {productItem.order_id}</strong></span>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-sm-3 col-4">
                        <div className="orderProductImg">
                          <div className="orderimg">
                            <img src={productItem.awb_number.product[0].images[0].image_url} className="img-fluid" alt="CSC" onError={e => { e.currentTarget.src = require('../../../public/No_Image_Available.jpeg') }} />
                          </div>
                          {(productItem.awb_number.product.length - 1) > 0 ? <span>+{productItem.awb_number.product.length - 1} More{(productItem.awb_number.product.length - 1) > 1 ? " Items" : " Item"}</span> : ''}

                        </div>
                      </div>
                      <div className="col-sm-9 col-8">
                        <div className="orderproductInfo">
                          <span className="title">{productItem?.awb_number?.product[0].title.title}
                          </span>
                          {productItem?.awb_number?.product[0]?.variation_index.detail?.map((variations, index) => (<span key={index}> {variations.variation_id}:{variations.variation_value} </span>))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="orderRangewrap">
                      <div className="orderRange">
                        <span className="orderd"><small>Orderd</small><p className="rangeDate"><small>
                          {/* {format(new Date(orderDetail.created_at), 'dd-MM-yyyy')} */}
                          {orderDetail.created_at}
                        </small></p></span>
                        {/* <span className="packed"><small>Packed</small><p className="rangeDate"><small>Sat, 15 June 21</small></p></span>
                      <span className="shipped"><small>Shipped</small><p className="rangeDate"><small>Sat, 15 June 21</small></p></span>
                      <span className="delivered"><small>Delivered</small><p className="rangeDate"><small>Sat, 15 June 21</small></p></span>
                      <span className="cancelledRange"><small>Cancelled</small><p className="rangeDate"><small>Sat, 15 June 21</small></p></span> */}
                      </div>
                    </div>
                    <p><small>Your Order is {getOrderStatus(orderDetail.status)}</small></p>
                  </div>

                  <div className="col-sm-2 mb-3">
                    <span className="viewInvoice" onClick={() => this.getInvoidePdf(productItem.order_id, productItem.awb_number.number)}>View Invoice</span>
                  </div>

                </div>

                {productItem.awb_number?.product?.map((product, productIndex) => (<div key={productIndex} className="row">
                  <div className="col-md-6 offset-md-4">
                    <div className="row mb-2">
                      <div className="col-sm-2 col-4">
                        <div className="orderProductImg">
                          <div className="orderimg" onClick={() => this.productDetail(product)}>
                            <img src={product.images[0]?.image_url} className="img-fluid" alt="CSC" onError={e => { e.currentTarget.src = require('../../../public/No_Image_Available.jpeg') }} />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-6">
                        <div className="orderproductInfo">
                          <span className="title">{product?.title?.title}</span>
                          <span>₹ {product.price} </span>
                          {product?.variation_index.detail?.map((variations, index) => (<span key={index}> {variations.variation_id}:{variations.variation_value} </span>))
                          }
                        </div>
                      </div>
                      <div className="col-sm-4 col">
                        <div className="orderstatus">
                          <div className="orderstate"> <span>{product.is_cancel ? "Cancelled" : getOrderStatus(orderDetail.status)}</span></div>
                          <div className="needhlep" onClick={this.toggleModal}>
                            <Link to={`/order-detail/${product.product_id}/add-reviews`}>
                              <FontAwesomeIcon icon={faStar} /> Rate & Review Product</Link><br />
                            <span><FontAwesomeIcon icon={faQuestionCircle} /> Need Help</span>
                            {product.is_cancel === 0 && <button className="cancelled" onClick={() => (productItem.awb_number.number === null ? this.cancelOrder(productItem.order_id, product) : this.toggleModal)}><FontAwesomeIcon icon={faTimesCircle} /> {productItem.awb_number.number === null ? "Cancel Order" : "Request Cancellation"}</button>}
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-sm-2 col">
                        <div className="orderstatus">
                          {product.is_cancel === 0 && <button className="cancelled" onClick={() => (productItem.awb_number.number === null ? this.cancelOrder(productItem.order_id, product) : this.toggleModal)}>{productItem.awb_number.number === null ? "Cancel Order" : "Request Cancellation"}</button>}
                        </div>
                      </div> */}

                      {/* <div className="col-sm-2 col">
                        <Link to={`/order-detail/${product.product_id}/reviews`}>Feedback</Link>
                      </div> */}

                    </div>
                  </div>
                </div>))}

                <div className="row">
                  <div className="col">
                    {/* <span className="viewAllItems"><strong>View more detail</strong></span> */}
                  </div>
                </div>


                {/* <div className="card">
                <div className="card-body">
                  <div className="refundComplete"><span>Refund Completed  <span>(Refund ID: SM454545454)</span></span>
                    <ul>
                      <li>₹ 2500.0 has been refunded to your Account on June 15</li>
                    </ul>
                  </div>
                </div>
              </div> */}
                <span className="return_policy">Return Policy <Link to="/exchange-policy">Know More</Link></span>
              </div>
            </div>

          ))}

        </div>
      </div >
    );
  }
}