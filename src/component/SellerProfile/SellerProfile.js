import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMailBulk, faPhone, faMapMarker, faUserPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { MultilevelMenu } from 'react-multilevel-menu';
import ReactStars from 'react-stars'

export default class SellerProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActiveTab: 0,
            config: {
                paddingAtStart: true,
                // classname: 'my-custom-class',
                listBackgroundColor: ``,
                fontColor: `rgb(8, 54, 71)`,
                backgroundColor: ``,
                selectedListFontColor: ``,
                highlightOnSelect: true,
                useDividers: false,
            },
            categories: [
                {
                    label: 'Travel Accessories',
                    items: [
                        {
                            label: 'Bag',
                            onSelected: function () { }
                        },
                        {
                            label: 'Luggage',
                            onSelected: function () { }
                        }, {
                            label: 'Cover',
                            onSelected: function () { }
                        },
                        {
                            label: 'Mask',
                            onSelected: function () { }
                        }
                    ]
                }
            ],
        }
    }

    componentDidMount() {
    }

    render() {
        const { isActiveTab, categories, config } = this.state;
        return (
            <div className="container-fluid">
                <div className="row pt-5">
                    <div className="col">
                        <div className="seller-cover-wrapper">
                            <div className="cover-area"></div>
                            <div className="seller-info-band">
                                <div className="seller-info">
                                    <div className="seller-brand">
                                        <div className="s-logo">
                                            <img src={require("../../public/eShilpmart_logo_220.svg")} className="img-fluid" alt="logo" /></div>
                                        <div className="ratings d-flex"><span>
                                            <ReactStars count={5} size={15} /></span></div>
                                    </div>
                                    <div className="seller-details">
                                        <h1>Seller Title</h1>
                                        <p> <FontAwesomeIcon icon={faMapMarker} />  Seller address</p>
                                        <div className="seller-contact-info">
                                            <p>
                                                <FontAwesomeIcon icon={faPhone} />  Mobile No.</p><p>
                                                <FontAwesomeIcon icon={faMailBulk} />  Email</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="action-btn"><a href="#"><FontAwesomeIcon icon={faQuestion} /> Inquiry</a><a href="#"><FontAwesomeIcon icon={faUserPlus} /> Follow</a></div>

                            </div>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col-lg-3 col-md-3 col-12">
                        <div className="sidebar">
                            <h4>Search</h4>
                            <div className="mb-3">
                                <input type="search" className="search-field" placeholder="Search products…" value="" name="s" />
                            </div>
                            <h4>Categories</h4>
                            <div className="mb-3">
                                <div className="filter-content collapse show" id="collapse_aside1" >
                                    <div className="categories-list">
                                        <MultilevelMenu
                                            list={categories}
                                            configuration={config}
                                            selectedListItem={this.selectedItem}
                                            selectedLabel={this.selectedItem}
                                        />
                                    </div>
                                </div>
                            </div>
                            <h4>Store Location</h4>
                            <div className="mt-3">
                                Google Map
	                        </div>
                        </div>
                    </div>
                    <div className="row product-description pb-5">
                        <ul className="nav nav-tabs" >
                            <li className="nav-item">
                                <a className={`nav-link  ${((isActiveTab === 0) ? 'active' : '')}`}
                                    data-toggle="tab" href="#des" role="tab" aria-controls="home" aria-selected="true"
                                    onClick={() => this.setState({ isActiveTab: 0 })} >DESCRIPTION</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${((isActiveTab === 1) ? 'active' : '')}`} data-toggle="tab" href="#del" role="tab" aria-controls="profile" aria-selected="false" onClick={() => this.setState({ isActiveTab: 1 })} >REVIEWS</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${((isActiveTab === 2) ? 'active' : '')}`} data-toggle="tab" href="#store" role="tab" aria-controls="contact" aria-selected="false" onClick={() => this.setState({ isActiveTab: 2 })} >STORE POLICIES</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${((isActiveTab === 3) ? 'active' : '')}`} data-toggle="tab" href="#inq" role="tab" aria-controls="contact" aria-selected="false" onClick={() => this.setState({ isActiveTab: 3 })}>INQUIRIES</a>
                            </li>
                        </ul>
                        <div className="tab-content" >
                            <div className={`tab-pane fade ${((isActiveTab === 0) ? 'show active' : '')}`}
                                role="tabpanel" aria-labelledby="home-tab">No description available </div>
                            <div className={`tab-pane fade ${((isActiveTab === 1) ? 'show active' : '')}`} role="tabpanel" aria-labelledby="profile-tab">
                                There are no reviews yet. </div>
                            <div className={`tab-pane fade ${((isActiveTab === 2) ? 'show active' : '')}`} role="tabpanel" aria-labelledby="contact-tab">Lorem Ipsum  printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </div>
                            <div className={`tab-pane fade ${((isActiveTab === 3) ? 'show active' : '')}`} role="tabpanel" aria-labelledby="contact-tab"> GENERAL INQUIRIES
                            There are no inquiries yet.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    };
}