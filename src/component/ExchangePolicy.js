import React from 'react';
export default class ExchangePolicy extends React.Component {

  constructor() {
    super();
    this.state = {
    };
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <section id="maincontent">
        <div className="subpages-heading">
          <div className="container">
            <h1 className="text-center p-5">Exchange Policy</h1>

          </div>
        </div>
        <div className="container">
          <div className="row py-5">
            <div className="col">

              <div className="entry-content">

                <h4>Overview</h4>
                <p>As a Customer, if you’re considering a product return, please note the following:</p>
                <ul>
                  {/* <li> All hand-woven and hand-crafted products on the portal are produced by weavers and artisans in villages mostly at their homes.</li> */}
                  <li>Unevenness in weaves, prints, minor slubs in fabric and slight variation in color are expected outcome of an authentic craft process. These variations are typical characteristics of any hand-crafted product and are not to be considered as damage or defective.</li>
                </ul>
                <h4>Return Policy</h4>
                <p>We accepts returns only if a wrong product or damaged product is delivered. The product needs to be in unused and unsoiled condition with price tag intact.</p>
                <ul>
                  <li>Note: Within 10 days of receipt of the product which is being returned (7 days in case of Handcraft Jewellery), please email to support team with supporting photos of the product mentioning the reason for return.</li>
                  <li>Please mention your order number in the subject line to help us quickly process your returns, if you are sending return request through email.</li>
                  <li>Customer can also place return request through online portal and by calling our call centre.</li>
                </ul>
                <h4>Process of Return</h4>
                <p>When the return request is approved by our return team, Customer will get an email mentioning the details of return.</p>
                <ul>
                  <li>Once the return details have been received, Customers need to fold &amp; pack the product neatly in the package received, and keep it safe, including tags, bills, invoice etc. along with the item.</li>
                  <li>Return pick up will be arranged as per confirmation on date &amp; time by the Customer.
                    <ul>
                      <li>Alert: Return pick up will be attempted 3 times only.</li>
                    </ul>
                  </li>
                  <li>Customer may need to ship the product back on below address in case of failed attempts:( Default Address)</li>
                  <li>“Warehouse Shipping Address:</li>
                  <li>Eshilpmart.gov.in</li>
                  <li>Address1, Etc.”</li>
                  <li>Some of the pin codes are not feasible for reverse pick up, in such cases the Customer will need to mail the product back to us.</li>
                  <li>Note: We do not offer reverse pick up facility for international orders. International orders are shipped from after stringent quality check and this eliminates any quality or product related issues.</li>
                </ul>
                <h4>Refund Policy</h4>
                <p>Refunds will be processed within 7-10 business days of receipt of products in good condition.</p>
                <ul>
                  <li>Sellers will not be able to accept returns after the time period mentioned in the Returns Policy.</li>
                  <li>Note: We reserve the right to deny refund in case of soiled or damaged products.</li>
                </ul>
                <h4>Cancellation Policy</h4>
                <p>In order to cancel the items that are not dispatched:</p>
                <ul>
                  <li>Go to My Orders section.</li>
                  <li>Select the product and click on Cancel icon.</li>
                  <li>Note: Once the Customer cancel the item, the order will be cancelled</li>
                  <li>instantly and a refund will be processed to the original payment method, if the payment was already made.</li>
                  <li>If… Then…</li>
                  <li>Order has already been dispatched Select the Request cancellation option and the item(s) will be returned to us for a refund (if the payment is already made).</li>
                  <li>Note: In case Customer is still contacted for delivery, please refuse to accept it.</li>
                  <li>Order is already delivered Customer needs to return it.</li>
                </ul>
                <h4>Replacement Policy</h4>
                <p>Replacement is initiated after the originally delivered item is picked up.</p>
                <ul>
                  <li>Once a Customer raises a request for replacement, he/she will get an email and SMS confirming that the request is being processed.</li>
                  <li>Based on the item, request may be automatically approved or Customer may be contacted for more details.</li>
                  <li>If the request is approved, the item will be picked up after which Customer will get a replacement or refund.</li>
                  <li>Customers can also track the status of their return request instantly from the My Orders section of their account.</li>
                </ul>
                <h4>Product Delivery</h4>
                <p>Incorrect Address Failed Delivery Attempts Damaged During Transit Other Address Problems</p>
                <ul>
                  <li>If the address is incorrect or outdated, the package is usually returned to the seller by the courier service provider or the unintended recipient.</li>
                  <li>Customers should double-check their addresses carefully when placing a new order.</li>
                  <li>Go to My Account&gt;Addresses to remove outdated address. • Most of the seller’s partnered courier service providers make more than one attempt to deliver a package.</li>
                  <li>If nobody is available to accept the delivery after multiple attempts, the package is returned to the seller. If a package is damaged on its way to the Customer, the courier service provider will return it to the seller without attempting delivery. In rare cases, it is also possible that the address label was difficult to decipher during the shipping and handling process, or that the courier service left the package at a different address than what was printed on the label.</li>
                </ul>
                <h4>Contact to Customer Service</h4>
                <p>If Customers have any queries regarding any policies or delivery of their items, they can:</p>
                <ul>
                  <li>Go to Contact Us.</li>
                  <li>Click on Chat, Phone or Email to contact our Customer Service Representatives.</li>
                </ul>
              </div>

            </div>


          </div>
        </div>
      </section>
    );
  }
}