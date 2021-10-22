import React from "react";
import Swiper from "./Swiper";
import LiveStats from "./LiveStats";
import PressArticles from "./PressArticles";
import CustomerFeedback from "./CustomerFeedback";
import ShopByType from "./ShopByType";
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActiveTab: 1
    }
  }

  render() {
    const { isActiveTab } = this.state
    return (

      <section id="maincontent">
        <div className="container-fluid">
          <Swiper />
          <div className="row py-4">
            <div className="col">
              <div className="section-title">
                <span>Shop by Categories</span>
                <p>Choose from authentic handmade product categories</p>
              </div>
              <div className="shop-categories">
                <ShopByType type='category' {...this.props} />
              </div>
            </div>
          </div>
          <div className="row py-5 section-bg">
            <div className="col shopby-product">
              <div className="section-title">
                <span>Shop by Product</span>
                <p>Choose from authentic handmade product categories</p>
              </div>
              <ul className="nav nav-tabs d-flex justify-content-center border-0 mb-4" role="tablist">
                <li className="nav-item">
                  <span className={`nav-link ${((isActiveTab === 1) ? 'active' : '')}`} id="home-tab" data-toggle="tab" href="#home" role="tab"
                    aria-controls="home" aria-selected="true" onClick={() => this.setState({ isActiveTab: 1 })}>Featured Products</span>
                </li>
                <li className="nav-item">
                  <span className={`nav-link ${((isActiveTab === 2) ? 'active' : '')}`} id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                    aria-controls="profile" aria-selected="false" onClick={() => this.setState({ isActiveTab: 2 })}>Latest Products</span>
                </li>
              </ul>
              {/* {isActiveTab &&  */}
              <ShopByType type='product' tabType={isActiveTab} {...this.props} {...this.state} />
              {/* } */}
            </div>
          </div>
          {/* <LiveStats /> */}
          <CustomerFeedback />
          {/* <PressArticles /> */}
        </div>
      </section>

    );
  }
}
