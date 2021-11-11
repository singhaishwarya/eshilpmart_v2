
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Registration from "./component/Registration";
import Header from "./component/Header";
import ProductList from "./component/ProductList";
import Footer from "./component/Footer";
import Dashboard from './component/Dashboard';
import ProductDetail from './component/ProductDetail';
import SellerProfile from './component/SellerProfile';
import Wishlist from './component/Wishlist';
import MyWishlist from './component/Wishlist';
import Compare from './component/Compare';
import Cart from './component/Cart';
import MyAccount from './component/my-account/MyAccount';
import Orders from './component/my-account/Order/Orders';
import OrderDetail from './component/my-account/Order/OrderDetail';
import Settings from './component/my-account/Settings';
import Address from './component/my-account/Address/Address';
import AddAddress from './component/my-account/Address/AddAddress';
import EditAddress from './component/my-account/Address/AddAddress';
import AccountDetails from './component/my-account/AccountDetails';
import Feedback from './component/my-account/Feedback';
import MyReviews from './component/my-account/MyReviews';
import Inquiry from './component/my-account/Inquiry';
import MyDashboard from './component/my-account/Dashboard';
import Checkout from './component/Checkout';
import CheckoutCallback from './component/CheckoutCallback';
import ForgotPassword from './component/ForgotPassword';
import CustomerService from './component/CustomerService';
import ContactUs from './component/CustomerService';
import AboutUs from './component/AboutUs';
import AddEditReview from './component/AddEditReview';
import SellerPolicy from './component/SellerPolicy';
import BuyerPolicy from './component/BuyerPolicy';
import ExchangePolicy from './component/ExchangePolicy';
import TermsConditon from './component/TermsConditon.js';
import TermsofUse from './component/TermsofUse.js';
import CorporateEnquiries from './component/CorporateEnquiries.js';
import Faq from './component/Faq.js';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';

class App extends Component {


  render() {

    const { userData } = this.props;
    return (
      <BrowserRouter>
        <header><Header /></header>
        <Switch>
          <Route isAuthenticated={userData} path='/' component={Dashboard} exact />
          <Route isAuthenticated={userData} path='/registration' component={Registration} exact />
          <Route isAuthenticated={userData} path='/product-list' component={ProductList} />
          <Route isAuthenticated={userData} path='/product-detail' component={ProductDetail} exact />
          <Route isAuthenticated={userData} path='/entrepreneur' component={SellerProfile} />
          <Route isAuthenticated={userData} path='/wishlist' component={Wishlist} exact />
          <Route isAuthenticated={userData} path='/compare' component={Compare} exact />
          <Route isAuthenticated={userData} path='/cart' component={Cart} exact />
          <Route isAuthenticated={userData} path='/forgot-password' component={ForgotPassword} exact />
          <Route isAuthenticated={userData} path='/checkout' component={Checkout} exact />
          <Route isAuthenticated={userData} path='/thankyou/for-payment' component={CheckoutCallback} exact />
          <Route path='/about-us' component={AboutUs} exact />
          <Route path='/customer-service' component={CustomerService} exact />
          <Route path='/contact-us' component={ContactUs} exact />
          <Route path='/seller-policy' component={SellerPolicy} exact />
          <Route path='/buyer-policy' component={BuyerPolicy} exact />
          <Route path='/exchange-policy' component={ExchangePolicy} exact />
          <Route path='/terms-and-condition' component={TermsConditon} exact />
          <Route path='/terms-of-use' component={TermsofUse} exact />
          <Route path='/faq' component={Faq} exact />
          <Route path='/corporate-enquiries' component={CorporateEnquiries} exact />
          <MyAccount>
            <Route component={({ match }) =>
              <>
                <PrivateRoute isAuthenticated={userData} path='/order-detail/:id/add-reviews' component={AddEditReview} />
                <PrivateRoute isAuthenticated={userData} path='/:id/edit-reviews/:rid' component={AddEditReview} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/dashboard' component={MyDashboard} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/order' component={Orders} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/order-detail' component={OrderDetail} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/settings' component={Settings} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/address' component={Address} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/add-address' component={AddAddress} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/edit-address' component={EditAddress} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/details' component={AccountDetails} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/feedback' component={Feedback} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/reviews' component={MyReviews} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/inquiry' component={Inquiry} />
                <PrivateRoute isAuthenticated={userData} path='/my-account/wishlist' component={MyWishlist} />
              </>
            } />
          </MyAccount>
        </Switch>
        <Footer />
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

export default connect(mapStateToProps, null)(App);

