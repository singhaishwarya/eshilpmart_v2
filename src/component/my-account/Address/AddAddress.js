import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import MasterService from '../../../services/MasterService';
import AddressService from '../../../services/AddressService';
import ToastService from '../../../services/ToastService';

export default class AddEditAddress extends React.Component {

  constructor(props) {
    super(props);

    this.error = false;
    this.handleAddEditAddress = this.handleAddEditAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.requiredBinded = this.required.bind(this);
    this.patternBinded = this.pattern.bind(this);

    const savedAddress = props?.history?.location.state?.address || props?.address;

    this.state = {
      fields: {
        address_id: savedAddress?.id || '',
        name: savedAddress?.name || '',
        mobile: savedAddress?.mobile || '',
        city: savedAddress?.city || '',
        landmark: savedAddress?.landmark || '',
        pincode: savedAddress?.pincode || '',
        address1: savedAddress?.address1 || '',
        address2: savedAddress?.address2 || '',
        country: 1,
        state: savedAddress?.state?.state_id || '',
        district: savedAddress?.district?.district_id || '',
        sub_district: savedAddress?.sub_district?.sub_district_id || '',
        type: savedAddress?.type || ''
      },
      statesOptions: [],
      districtOptions: [],
      subDistrictOptions: []
    }
  }

  required = (value, props) => {

    if (props.isUsed) {
      if (!value) {
        this.error = true;
        return (
          <div className="isaerror" role="alert">
            Please enter your {props.name?.replace(/_/g, ' ') === 'c password' ? 'confirm password' : props.name?.replace(/_/g, ' ')}
          </div>
        );
      } else { this.error = false; }
    }
  }

  pattern = (value, props) => {
    let propsPattern = new RegExp(props.pattern);
    if (props.isUsed) {
      if (!propsPattern.test(value) || value.length < props.maxLength) {
        this.error = true;
        return <div className="isaerror" role="alert">
          Please enter a valid {props.name}.
        </div>
      }
    } else { this.error = false; }
  }

  componentDidMount() {
    this.getStates();
    if (this.state.fields.address_id) {
      this.getDistrict(this.state.fields.state);
      this.getSubDistrict(this.state.fields.state, this.state.fields.district)
    }
  }

  getStates = () => {
    MasterService.getStates().then((result) => {
      this.setState({ statesOptions: result?.data })
    });
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
    if (field === 'state') {
      this.getDistrict(e.target.value)
      this.setState({ sub_district: '', district: '' });
    }
    if (field === 'district') {
      this.getSubDistrict(this.state.fields.state, e.target.value)
      this.setState({ sub_district: '' });
    }
  }

  getDistrict = (stateCode) => {
    MasterService.getDistrict({ state_id: stateCode }).then((result) => {
      this.setState({ districtOptions: result?.data })
    })
  }
  getSubDistrict = (stateCode, districtCode) => {
    MasterService.getSubDistrict({ state_id: stateCode, district_id: districtCode }).then((result) => {
      this.setState({ subDistrictOptions: result?.data })
    })
  }
  handleAddEditAddress(e) {
    e.preventDefault();
    if (this.form.getChildContext()._errors.length === 0) {
      if (!this.error) {
        AddressService.addEdit(this.state.fields)
          .then((result) => {

            if (!result) return ToastService.error("Please fill form details")
            if (result.data.success || result.success) {
              if (window.location.pathname === '/checkout') { this.props.selectedAddress(this.state.fields) }
              else {
                ToastService.success(result.message);
                setTimeout(
                  () => { window.history.back() },
                  100
                )
              }
            }
            else {
              return ToastService.error(Object.values(result.data.data)[0][0])
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    }
  }
  cancel = (e) => {
    e.preventDefault();
    window.location.pathname === '/checkout' ? this.props.selectedAddress(this.state.fields) : window.history.back()
  }
  render() {
    const { fields, statesOptions, districtOptions, subDistrictOptions } = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-7 login-card py-3 px-5 bg-light shadow">

            <h4 className="mb-4 text-left">{fields?.address_id ? "Edit Address" : "Add New Address"}</h4>
            <Form ref={(c) => { this.form = c; }} >

              <div className="form-row">
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="fname">Full Name<span>*</span></label>
                  <Input type="text" className="form-control" name="name" value={fields.name}
                    onChange={this.handleChange.bind(this, "name")}
                    validations={[this.required]}
                  />
                </div>
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="fname">Mobile<span>*</span></label>
                  <Input type="text" maxLength="10" pattern="^(0|[1-9][0-9]*)$" className="form-control" name="mobile" value={fields.mobile}
                    onChange={this.handleChange.bind(this, "mobile")}
                    validations={[this.required, this.pattern]}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col"><label htmlFor="fname">Pin Code<span>*</span></label>
                  <Input
                    type="text"
                    maxLength="6"
                    pattern="^(0|[1-9][0-9]*)$"
                    className="form-control"
                    name="pincode"
                    value={fields.pincode}
                    onChange={this.handleChange.bind(this, "pincode")}
                    validations={[this.required, this.pattern]}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col"><label htmlFor="fname">Flat, House no., Building, Company, Apartment<span>*</span></label>
                  <Input type="text" className="form-control" name="address1" value={fields.address1}
                    onChange={this.handleChange.bind(this, "address1")}
                    validations={[this.required]}
                  /></div>
              </div>
              <div className="form-row">
                <div className="form-group col"><label htmlFor="fname">
                  Area, Colony, Street, Sector, Village<span>*</span></label>
                  <Input
                    type="text"
                    className="form-control"
                    name="address2"
                    value={fields.address2}
                    onChange={this.handleChange.bind(this, "address2")}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="fname">Landmark</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="landmark"
                    value={fields.landmark}
                    onChange={this.handleChange.bind(this, "landmark")}
                  />

                </div>
                <div className="form-group col-lg-6 col-12">
                  <label htmlFor="fname">Town/City<span>*</span></label>
                  <Input
                    type="text"
                    className="form-control"
                    name="city"
                    value={fields.city}
                    onChange={this.handleChange.bind(this, "city")}
                    validations={[this.required]}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="fname">Country<span>*</span></label>
                  <Select name='country'
                    className="form-control">
                    <option >India</option>
                  </Select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="fname">State<span>*</span></label>
                  <Select name='state' value={fields.state}
                    onChange={this.handleChange.bind(this, "state")}
                    validations={[this.required]} className="form-control">
                    <option  >Select States</option>

                    {statesOptions?.length > 0
                      && statesOptions.map((item, i) => {
                        return (
                          <option key={i} value={item.state_id}>{item.state_name}</option>
                        )
                      })}
                  </Select>

                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="fname">District<span>*</span></label>
                  <Select name='district' value={fields.district}
                    onChange={this.handleChange.bind(this, "district")}
                    validations={[this.required]} className="form-control">
                    <option  >Select District</option>

                    {districtOptions?.length > 0
                      && districtOptions.map((item, i) => {
                        return (
                          <option key={i} value={item.district_id}>{item.district_name}</option>
                        )
                      })}
                  </Select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="fname">Sub-District<span>*</span></label>
                  <Select name='subDistrict' value={fields.sub_district}
                    onChange={this.handleChange.bind(this, "sub_district")}
                    className="form-control">
                    <option  >Select Sub-District</option>

                    {subDistrictOptions?.length > 0
                      && subDistrictOptions.map((item, i) => {
                        return (
                          <option key={i} value={item.sub_district_id}>{item.sub_district_name}</option>
                        )
                      })}
                  </Select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="fname">Address Type<span>*</span></label>
                  <Select name='type' value={fields.type}
                    onChange={this.handleChange.bind(this, "type")}
                    validations={[this.required]} className="form-control">
                    <option value='' defaultValue='selected'>Select Type</option>
                    <option value='1'>Home</option>
                    <option value='2'>Office</option>
                  </Select>
                </div>
              </div>
              <button className="btn login-btn mr-2" value="Submit" onClick={(e) => this.handleAddEditAddress(e)}>Submit</button>
              <button className="btn login-btn" value="Cancel" onClick={(e) => this.cancel(e)}>Cancel</button>
            </Form>
          </div>



          <div className="col-5 d-none d-sm-block">
            <div className="product-img-wrapper">
              <img src={require("../../../public/address.svg")} className="img-fluid" alt="address" />
            </div>
          </div>

        </div >
      </div >
    )
  }
}