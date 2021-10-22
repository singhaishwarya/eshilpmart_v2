import React from "react";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
export default class Footer extends React.Component {
  state = {
    footerItems: [
      <div className="swiper-slide">
        <img
          src={require("../public/india-gov.webp")}
          className="img-fluid"
          alt="India gov"
        />
      </div>,
      <div className="swiper-slide">
        <img
          src={require("../public/mot.webp")}
          className="img-fluid"
          alt="Ministry Textile"
        />
      </div>,
      <div className="swiper-slide">
        <img
          src={require("../public/di.webp")}
          className="img-fluid"
          alt="DIC"
        />
      </div>,
      <div className="swiper-slide">
        <img
          src={require("../public/india_post.webp")}
          className="img-fluid"
          alt="India Post"
        />
      </div>,
      <div className="swiper-slide">
        {" "}
        <img
          src={require("../public/csc.webp")}
          className="img-fluid"
          alt="CSC"
        />
      </div>,
      <div className="swiper-slide">
        {" "}
        <img
          src={require("../public/make-in-india.webp")}
          className="img-fluid"
          alt="make in india"
        />
      </div>,
    ],
    responsive: {
      0: { items: 2 },
      568: { items: 3 },
      1024: { items: 5 },
    },
  };

  render() {
    const { footerItems, responsive } = this.state;
    return (
      <>
        <footer>
          <div id="mainFooter">
            <div className="container-fluid">
              <div className="row py-5 border-bottom">
                <div className="col-md-8 col-lg-8 col-12">
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-6">
                      <h5>Information</h5>
                      <div className="footer-links">
                        <ul>
                          <li>
                            <Link to="/terms-of-use">Terms of use</Link>
                          </li>
                          <li>
                            <Link to="/seller-policy">Seller Policy </Link>
                          </li>
                          {/* <li><Link to="/">Right to Information</Link></li>
                          <li><Link to="/">Sitemap </Link></li>
                          <li><Link to="/">Subscribe Newsletter</Link></li> */}
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-6">
                      <h5>Resources</h5>
                      <div className="footer-links">
                        <ul>
                          <li>
                            <Link to="/terms-and-condition">
                              Terms &amp; Conditions
                            </Link>
                          </li>
                          <li>
                            <Link to="/buyer-policy">Buyer Policy</Link>
                          </li>

                          <li>
                            <Link to="/exchange-policy">Exchange Policy</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-6">
                      <h5>Partner with us</h5>
                      <div className="footer-links">
                        <ul>
                          <li>
                            <a href="https://seller.digitalindiacorporation.in/register">
                              {" "}
                              Weaver / Artisan Registration
                            </a>
                          </li>
                          <li>
                            <a href="https://seller.digitalindiacorporation.in/login">
                              Weaver / Artisan Login
                            </a>
                          </li>
                          <li>
                            <Link to="/corporate-enquiries">
                              Corporate Enquiries{" "}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-6">
                      <h5>Need Help?</h5>
                      <div className="footer-links">
                        <ul>
                          <li>
                            <Link to="/faq">FAQs</Link>
                          </li>
                          <li>
                            <Link to="/my-account/order">Raise a ticket</Link>
                          </li>
                          <li>
                            <Link to="/contact-us">Contact Us </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-12">
                  <h5>We Accept</h5>
                  <div className="payment_method">
                    <div className="paycard">
                      <img
                        src={require("../public/pm.webp")}
                        className="img-fluid"
                        alt="pay"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-5 logos">
                <AliceCarousel
                  animationType="slide"
                  autoPlayInterval={3000}
                  autoPlay={true}
                  disableDotsControls
                  //disableAutoPlayOnAction={true}
                  items={footerItems}
                  responsive={responsive}
                  mouseTracking
                  infinite
                  disableButtonsControls //can be enabled if arrows are needed
                  //touchTracking
                />
              </div>
            </div>
          </div>
          <div className="copyright-footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6 col-12">
                  {" "}
                  <small>
                    Ministry of Rural Development
                    <i className="fa fa-copyright" /> 2020. <br />
                    Designed &amp; Developed by Digital India Corporation
                  </small>
                </div>
                <div className="col-md-6 col-12 text-right">
                  {" "}
                  <a href="#">
                    <img
                      src={require("../public/gp-300x89.png")}
                      className="img-fluid"
                      alt="google play store"
                    />
                  </a>{" "}
                  &nbsp;&nbsp;{" "}
                  <a href="#">
                    <img
                      src={require("../public/as-300x89.png")}
                      className="img-fluid"
                      alt="itue"
                    />
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
}
