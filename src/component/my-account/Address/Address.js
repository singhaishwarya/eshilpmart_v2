import React from 'react';
import { Link } from "react-router-dom";
import AddressService from '../../../services/AddressService';
import ToastService from '../../../services/ToastService';
export default class Address extends React.Component {

  constructor() {
    super();
    this.state = {
      addressList: []
    };
  }

  componentDidMount() {
    this.getAddress();
  }
  getAddress = () => {
    AddressService.list().then((result) => {
      if (!result) return
      this.setState({ addressList: result.data })
    }).catch((err) => {
      console.log(err);
    });
  }
  setDefaultOrDeleteAddress = (id, type) => {

    AddressService.delete({ address_id: id, action: type }).then((result) => {

      if (!result) return
      if (result.success) {
        ToastService.success(result.message);
      }
      this.getAddress();
    }).catch((err) => {
      console.log(err);
    });

  }
  render() {
    const { addressList } = this.state;

    return (
      <div className="container">
        <p> The following addresses will be used on the checkout page by default.</p>
        <div className="flexi">
          <div className="coloumn-2">
            <div className="ad-address-wrapper mb-3">
              <Link to='/my-account/add-address' > Add Address</Link>
            </div>
          </div>
          <div className="coloumn-2">
            {/* <h4>  Address</h4> */}
            <div className="row">
              {addressList?.map((item, index) => (
                <div className="col-4" key={index}>
                  <div className="card shadow mb-4">
                    <div className="card-body">
                      <strong>{item.name}</strong>
                      <strong >{item.is_default === 1 ? ' Default' : ''}</strong>
                      <br />{item.address1} <br />{item.address2} <br />
                      {item.sub_district.sub_district_name}
                      <br /> {item.district?.district_name},  {item.state?.state_name} - {item.pincode}<br />
                      <strong>Mobile No.</strong>: {item.mobile}<br />
                      <strong>Email</strong> : {item?.email} <br /><br />
                      <p className="d-flex addAction mb-0">
                        {item.is_default !== 1 && <span onClick={() => {
                          this.setDefaultOrDeleteAddress(item.id, 'def')
                        }}>Set As Default</span>}
                        <Link to={{
                          pathname: '/my-account/edit-address',
                          state: { address: item }
                        }} >Edit</Link>

                      </p>
                      <span className="remove" onClick={() => {
                        this.setDefaultOrDeleteAddress(item.id, 'del')
                      }}></span>
                    </div>
                  </div>


                </div>))}
            </div>

          </div>
        </div>


      </div>
    );
  }
}