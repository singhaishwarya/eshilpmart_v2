import React from 'react';
import ReviewService from '../../services/ReviewService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
export default class MyReviews extends React.Component {

  constructor() {
    super();
    this.state = {
      reviews: []
    };
  }

  componentDidMount() {
    this.getReviews()
  }
  getReviews = () => {
    try {
      ReviewService.getReviews().then((result) => {
        this.setState({ reviews: result.data[0] })
      });
    }
    catch (err) {
      console.log(err);
    }
  }
  render() {
    const { reviews } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">

          </div>
          <div className="col-sm-9">
            <div className="card">
              <div className="card-header" style={{ backgroundColor: '#fff' }}><h6>My Reviews <span>{reviews.length}</span></h6></div>
              <div className="card-body">
                <div className="review_listing">
                  {/* <div className="review_prouct_img">
                    <img src={require('../../public/saree-2-300x300.jpeg')} className="img-fluid" alt="Saree" />
                  </div> */}
                  <div className="review_product_info  w-100">
                    <p>{reviews.product_review_title}</p>
                    <div class="allreview mb-2"><span>3★</span></div>
                    <p className="review_message">{reviews.product_review_description}</p>
                    <div className="review_auth d-flex">
                      <p>{reviews?.user_id?.first_name} {reviews?.user_id?.last_name}</p>
                      {/* <p>{format(new Date(reviews?.created_at), 'dd-MM-yyyy')}</p> */}
                      <div className="like-dislike">
                        <span><FontAwesomeIcon icon={faThumbsUp} /> {reviews?.likes?.like_count} </span>
                        <span><FontAwesomeIcon icon={faThumbsDown} /> {reviews?.likes?.dislike_count} </span>
                      </div>
                    </div>
                    <Link className="mt-3 d-block" to="/reviews">Edit</Link>

                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">rating</th>
                <th scope="col">date</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product_review_title}</td>
                  <td>{item.product_review_description}</td>
                  <td>{item.product_rating}</td>
                  <td>  {format(new Date(item.created_at), 'dd-MM-yyyy')}</td>
                </tr>
              ))}



            </tbody>
          </table>

        </div> */}
        </div>
      </div>
    );
  }
}