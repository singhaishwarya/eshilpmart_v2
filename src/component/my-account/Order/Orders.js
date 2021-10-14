import React from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../../../services/OrderService';
import Loader from "react-loader";
import { getOrderStatus, loaderOptions } from "../../../lib/utils";
import { format } from 'date-fns'

export default class Orders extends React.Component {

  constructor() {
    super();
    this.currentUrlParams = new URLSearchParams(window.location.search);
    this.state = {
      orderList: [],
      isLoaded: false,
      currentPage: 1, per_page: 10, searchQuery: ''
    };
  }

  componentDidUpdate(prevprops) {
    if (prevprops.history.location.search !== prevprops.location.search) {
      this.getOrders(this.getSetQueryParams())
    }
  }

  componentDidMount() {
    this.getOrders(this.getSetQueryParams());
  }

  searchOrder = (query) => {
    this.currentUrlParams.set('q', query)
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: "&" + this.currentUrlParams.toString()
    });
  }

  getSetQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let entries = urlParams.entries(),
      queryParams = {};
    for (const entry of entries) {

      switch (entry[0]) {

        case 'order_by':
          queryParams.order_by = urlParams.get('order_by');
          break
        case 'sort_by':
          queryParams.sort_by = ['price-asc', 'price-desc'].includes(urlParams.get('sort_by')) ? 'price' : urlParams.get('sort_by')
          this.setState({ sortBy: urlParams.get('sort_by') })
          break
        case 'per_page':
          queryParams.per_page = urlParams.get('per_page');
          this.setState({ per_page: queryParams.per_page * 1 })
          break
        case 'q':
          queryParams.q = urlParams.get('q');
          break
        case 'page':
          queryParams.per_page = urlParams.get('page') * (queryParams.per_page ? queryParams.per_page : 10);
          break
        default:
          return;
      }
    }
    return queryParams;
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

  fetchMoreData = () => {
    this.setState({
      currentPage: this.state.currentPage + 1
      , isLoaded: false
    });
    this.currentUrlParams.set('page', this.state.currentPage + 1)
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: "&" + this.currentUrlParams.toString()
    });
  };
  render() {

    const { orderList, isLoaded, searchQuery } = this.state;
    let totItems = 0;
    return (
      <div className="row">
        <div className='col-lg-3 col-12'>
          <div className='myaccout-sidebar'>
            <div className="card mb-4 shadow">
              <div className="card-body">
                <article className='filter-group'>
                  <h6 className='title'>ORDER STATUS </h6>
                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="ondaway" value="black" />
                    <label className="form-check-label " htmlFor="ondaway">On the way</label>
                  </div>
                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="Initiated" value="black" />
                    <label className="form-check-label " htmlFor="Initiated">Initiated</label>
                  </div>
                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="Confirmed" value="black" />
                    <label className="form-check-label " htmlFor="Confirmed">Confirmed</label>
                  </div>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="deliver" value="black" />
                    <label className="form-check-label " htmlFor="deliver">Delivered</label>
                  </div>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="cancel" value="black" />
                    <label className="form-check-label " htmlFor="cancel">Cancelled</label>
                  </div>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="returne" value="black" />
                    <label className="form-check-label " htmlFor="returne">Returned</label>
                  </div>

                  <h6 className='title'>ORDER TIME </h6>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="lastday" value="black" />
                    <label className="form-check-label " htmlFor="lastday">Last 30 days</label>
                  </div>
                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="lastyear" value="black" />
                    <label className="form-check-label " htmlFor="lastyear">2020</label>
                  </div>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="llyear" value="black" />
                    <label className="form-check-label " htmlFor="llyear">2019</label>
                  </div>

                  <div className="form-check shm-filter-checkbox"><input type="checkbox" className="form-check-input" id="older" value="black" />
                    <label className="form-check-label " htmlFor="older">Older</label>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-9 col-12'>
          <div className="input-group mb-4 shadow">
            <input type="text" className="form-control" onChange={(e) => this.setState({ searchQuery: e.target.value })} value={searchQuery} placeholder="Search your order here..." />
            <div className="input-group-append">
              <button className="btn btn-theme" type="button" onClick={() => this.searchOrder(searchQuery)}>
                <i className="fa fa-search"></i> Search Order
              </button>
            </div>
          </div>
          <Loader loaded={isLoaded} message='Loading...' options={loaderOptions} className="spinner" >
            {(orderList.data?.length > 0 && isLoaded) ?
              <> {orderList.data?.map((item, index) => (
                totItems = 0,
                <div className="card mb-3 shadow" key={index}>
                  <div className="card-body myorderList">
                    <Link to={{
                      pathname: '/my-account/order-detail',
                      state: { orderDetail: item }
                    }}  >
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="row">
                            <div className="col-3">
                              <div className="orderProductImg">
                                <div className="orderimg">
                                  <img src={item.product_details[0]?.awb_number?.product[0]?.images[0]?.image_url} className="img-fluid" alt="CSC" onError={e => { e.currentTarget.src = require('../../../public/No_Image_Available.jpeg') }} />
                                </div>{item.product_details.map((item, index) => {
                                  totItems += item.awb_number.product.length;
                                  return totItems > 1 ? <span key={index}>+{totItems - 1} More
                                    {totItems === 2 ? " Item" : " Items"}
                                  </span> : ''
                                })
                                }
                              </div>
                            </div>
                            <div className="col-9">
                              <div className="orderproductInfo">
                                <span className="title">{item.product_details[0]?.awb_number.product[0]?.title?.title}</span>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-4"><span>{item.created_at}
                          {/* format(new Date(item.created_at), 'dd-MM-yyyy')} */}
                        </span></div>
                        <div className="col-sm-2 col-4"><span>₹ {item.order_total}</span></div>
                        <div className="col-sm-2 col-4">
                          <div className="orderstatus">
                            <div className="statusColor deliver"> <span>{getOrderStatus(item.status)}</span></div>
                            {/* <div className="statusReq"><p>As per your request, your item has been cancelled</p></div> */}
                          </div>
                        </div>
                        <div className="col mt-3"><span className="viewmore">View More</span></div>
                      </div></Link>
                  </div>
                </div>
              ))}
                {orderList.next_page_url && <span className="loadMore" onClick={() => this.fetchMoreData()}><span>Load More</span></span>}
              </>
              : <div className="card shadow">
                <div className="card-body">
                  <div className="orderlist">
                    <div className="noOrder">
                      <h2>You have No Order Yet!</h2>
                      <Link to="/product-list">Start Shopping</Link>
                    </div>
                  </div>
                </div>
              </div>}
          </Loader>
        </div>
        <div>
        </div>
      </div>
    );
  }
}