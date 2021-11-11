import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Rating from 'react-rating';
import ReviewService from '../services/ReviewService';
import ToastService from '../services/ToastService';
export default class AddEditReview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ratingExpession: ["", "Bad", "Satisfied", "Good", "Very Good", "Best"],
      fields: {
        product_id: props.match.params.id,
        review_id: props.match.params.rid,
        product_rating: this.props.location?.state?.reviewData.product_rating || 0,
        product_review_title: this.props.location?.state?.reviewData.product_review_title || '',
        product_review_description: this.props.location?.state?.reviewData.product_review_description || '',
        images: []
      }
    }
    window.scrollTo(0, 0);
  }
  handleRatingChange = (value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields, product_rating: value
      }
    }));
    if ([1, 2].includes(value)) { this.setState({ ratingClass: 'ml-1 bad-text-danger' }) }
    else if ([3, 4].includes(value)) { this.setState({ ratingClass: 'ml-1 text-warning' }) }
    else { this.setState({ ratingClass: 'ml-1 text-success' }) }
  }
  onFileChange = e => {
    e.preventDefault();
    const file = e.target.files;
    let fileArray = [];
    if (!file) return;

    for (let [key, value] of Object.entries(file)) {
      fileArray.push({
        uri: URL.createObjectURL(value),
        type: value.type,
        name: value.name
      })
    }

    this.setState(prevState => ({
      fields: {
        ...prevState.fields, images: fileArray
      }
    }));

  };
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  handleSubmitReview(e) {
    e.preventDefault();
    if (this.state.fields.product_rating) {
      const data = new FormData();
      data.append('product_rating', this.state.fields.product_rating);
      data.append('product_id', this.state.fields.product_id);
      data.append('product_review_title', this.state.fields.product_review_title);
      data.append('product_review_description', this.state.fields.product_review_description);
      data.append('images', this.state.fields.images);
      ReviewService.addEdit(data)
        .then((result) => {
          if (result.success) {
            ToastService.success(result.message);
            window.history.back();
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ToastService.error("Please rate the product");
    }
  }

  removeImage = (item, index) => {
    let selectedImg = this.state.fields.images;
    selectedImg = selectedImg.filter((_, i) => i !== index)
    this.setState({
      fields: { images: selectedImg }
    });
  }

  render() {
    const { fields, ratingExpession, ratingClass } = this.state
    return (
      <section id="maincontent">

        <div className="container-fluid">
          <div className="row py-3">
            <div className="col-12 mb-4">
              <div className="card card-body shadow">
                <div className="d-flex justify-content-between">
                  <div><h5>Ratings & Reviews</h5></div>
                  <div className="review_product d-flex">
                    <div className="text-right d-flex flex-column">
                      <span>Handloom Cotton Saree</span>
                      <div className="allreview"><span>4.7★</span><small>(2,525)</small></div>
                    </div>
                    <div className="reviewpro_img">
                      <img src={require('../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#fff' }}>
                  <h5>What makes a good review</h5>
                </div>
                <div className="card-body">
                  <div className="reviewFaqs">
                    <h6>Have you used this product?</h6>
                    <p>Your review should be about your experience with the product.</p>
                  </div>

                  <div className="reviewFaqs">
                    <h6>Why review a product?</h6>
                    <p>Your valuable feedback will help fellow shoppers decide!</p>
                  </div>

                  <div className="reviewFaqs">
                    <h6>How to review a product?</h6>
                    <p>Your review should include facts. An honest opinion is always appreciated. If you have an issue with the product or service please contact us from the help centre.</p>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-sm-9">
              <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#fff' }}><h6>Rate This Product</h6>
                  <Rating className="reviewStar" emptySymbol="fa fa-star-o" initialRating={fields.product_rating} fullSymbol="fa fa-star" onChange={(e) => this.handleRatingChange(e)} />
                  {/* classes to use for bad-text-danger, satisfy and good - text-warning and for remain text-success */}
                  <span className={ratingClass}>{ratingExpession[fields.product_rating]}</span>

                </div>
                <div className="card-body">
                  <h5>Review This Product</h5>
                  {/* <form className="login-card"> */}
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" rows="7" name="product_review_description" value={fields.product_review_description} onChange={this.handleChange.bind(this, "product_review_description")} ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Title</label>
                    <input type="text" className="form-control" name="product_review_title" value={fields.product_review_title} onChange={this.handleChange.bind(this, "product_review_title")} placeholder="Review Title..." />
                  </div>

                  <div className="form-group">
                    <div className="photoUpload">
                      <div className="uploaded">
                        {fields.images.map((item, index) =>
                          <span>
                            <img key={index} src={item.uri} alt={item.uri} />
                            <span onClick={() => this.removeImage(item, index)}>
                              <FontAwesomeIcon icon={faTimes} /></span>
                          </span>
                        )}</div>
                      <input ref="file" type="file" id="uploadpic" onChange={(e) => this.onFileChange(e)} className="form-control" multiple />

                      <label htmlFor="uploadpic" className="photoBg"><FontAwesomeIcon icon={faCamera} /></label>
                    </div>
                  </div>
                  <button type="submit" onClick={(e) => this.handleSubmitReview(e)} className="btn btn-theme" >Submit Review</button>

                </div>

                {/* <div className="cart-empty py-5">
                  <h2>Haven't purchased this product?</h2>
                  <span>Sorry! You are not allowed to review this product since you haven't bought it on eshilpmart.</span>

                </div> */}

              </div>


            </div>

          </div>
        </div>
      </section>
    );
  }
}