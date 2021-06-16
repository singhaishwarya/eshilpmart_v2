import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
export default class OrderDetail extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <div className="card mb-4 shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-7">
                  <div className="deladd">
                    <h5>Delivery Address</h5>
                    <h6>Persone Name</h6>
                    <p>Plot No 7, M G Road, Opp Saibaba Temple, Borivli(e)<br/> Mumbai,  Maharashtra - 46000545                   
                    </p>
                    <p><strong>Phone Number :</strong> +919811148709</p>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3 shadow">
            <div className="card-body">
            <div className="row">
                      <div className="col-sm-3">
                        <div className="row">
                          <div className="col-sm-3">
                            <div className="orderProductImg">
                              <div className="orderimg">
                                <img src={require("../../../public/saree.jpg")} className="img-fluid" alt="CSC" />
                              </div>
                              {/* {item.product_details.length > 1 && <span>+{item.product_details.length - 1} More Items</span>} */}
                            </div>
                          </div>
                          <div className="col-sm-9">
                            <div className="orderproductInfo">
                              <span className="title">Cotton Saree For Product Title</span>
                              <span> <span>Seller: xyz</span></span>
                              <span>₹ 2500</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-5">
                      <div className="orderRangewrap">
                        <div className="orderRange">
                          <span className="orderd"><small>Orderd</small><p className="rangeDate"><small>Sat, 15 June 21</small></p></span>
                          <span className="packed"><small>Packed</small><p class="rangeDate"><small>Sat, 15 June 21</small></p></span>
                          <span className="shipped"><small>Shipped</small><p class="rangeDate"><small>Sat, 15 June 21</small></p></span>
                          <span className="delivered"><small>Delivered</small><p class="rangeDate"><small>Sat, 15 June 21</small></p></span>
                          <span className="cancelledRange"><small>Cancelled</small><p class="rangeDate"><small>Sat, 15 June 21</small></p></span>
                        </div>                      
                    

                        </div>  
                        <p><small>Your item has been delivered</small></p>
                      </div>

                      <div className="col-sm-4">
                        <div className="orderstatus">
                          <div className="orderstate"> <span>Cancelled</span></div>
                          <div className="needhlep"><Link to="\"><FontAwesomeIcon icon={faQuestionCircle}/> Need Help</Link></div>
                        </div>
                      </div>
                    </div>

      <div className="card">
        <div className="card-body">
          <div className="refundComplete"><span>Refund Completed  <span>(Refund ID: SM454545454)</span></span>
          <ul>
            <li>₹ 2500.0 has been refunded to your Account on June 15</li>
          </ul>
          </div>
        </div>
      </div>


            </div>
          </div>





        </div>
      </div>
    );
  }
}