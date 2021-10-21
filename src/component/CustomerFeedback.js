import React from "react";
import AliceCarousel from 'react-alice-carousel';
import ReactStars from 'react-stars';
export default class CustomerFeedback extends React.Component {
  constructor() {
    super();
    window.scrollTo(0, 0);
    this.state = {
      responsive: {
        0: { items: 1 },
        568: { items: 1 },
        1024: { items: 4 },
      },
      customerFeedbackData: [], customerFeedbackItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      customerFeedbackItems: [
        <div className="testimonials-block">
          <div className="testimonial-avatar"><img src={require('../public/anu.png')} className="img-fluid"
            alt="user Dp" /></div>
          <div className="testimonial-ratings">
            <span>  <ReactStars count={5} size={10} /></span>
          </div>
          <div className="testimonial-text">
            <p>I am a big fan of Handloom and Handicraft items. Thanks to the Ministry of Rural Development for giving us a platform to shop our favourite handloom and
              handicraft product from a single stop shop.​​</p>
            <h5>Anuradha Mitra</h5>

          </div>


        </div>,
        <div className="testimonials-block">

          <div className="testimonial-avatar"><img src={require('../public/anu.png')} className="img-fluid"
            alt="user Dp" /></div>
          <div className="testimonial-ratings">
            <span>  <ReactStars count={5} size={10} /></span>
          </div>
          <div className="testimonial-text">
            <p>I am a big fan of Handloom and Handicraft items. Thanks to the Ministry of
              Rural Development for giving us a platform to shop our favourite handloom and
              handicraft product from a single stop shop.​​</p>
            <h5>Anuradha Mitra</h5>

          </div>


        </div>,
        <div className="testimonials-block">

          <div className="testimonial-avatar"><img src={require('../public/anu.png')} className="img-fluid"
            alt="user Dp" /></div>
          <div className="testimonial-ratings">
            <span>  <ReactStars count={5} size={10} /></span>
          </div>
          <div className="testimonial-text">
            <p>I am a big fan of Handloom and Handicraft items. Thanks to the Ministry of
              Rural Development for giving us a platform to shop our favourite handloom and
              handicraft product from a single stop shop.​​</p>
            <h5>Anuradha Mitra</h5>

          </div>


        </div>,
        <div className="testimonials-block">

          <div className="testimonial-avatar"><img src={require('../public/anu.png')} className="img-fluid"
            alt="user Dp" /></div>
          <div className="testimonial-ratings">
            <span>  <ReactStars count={5} size={10} /></span>
          </div>
          <div className="testimonial-text">
            <p>I am a big fan of Handloom and Handicraft items. Thanks to the Ministry of
              Rural Development for giving us a platform to shop our favourite handloom and
              handicraft product from a single stop shop.​​</p>
            <h5>Anuradha Mitra</h5>

          </div>


        </div>
      ]
    });
  }
  render() {

    const { customerFeedbackItems, responsive } = this.state;
    return (
      <>
        {/* //    < !--From Our Customers-- > */}
        <div className="row py-5 section-bg">
          <div className="section-title">
            <span>From Our Customers</span>
            <p>Customer reviews are important to us</p>
          </div>
          <div className="col">

            {/* <!-- Swiper --> */}
            <div className="testimonials">

              <AliceCarousel
                animationType='slide'
                autoPlayInterval={3000}
                autoPlay={true}
                autoPlayStrategy="all"
                controlsStrategy="responsive"
                disableDotsControls
                disableAutoPlayOnAction={true}
                items={customerFeedbackItems}
                responsive={responsive}
                mouseTracking
                infinite
                mouseTrackingEnabled={true}
                autoHeight={true}
                //autoWidth
                disableButtonsControls //can be enabled if arrows are needed
                touchTracking
              />



            </div>



          </div>
        </div>
      </>
    )
  }
}