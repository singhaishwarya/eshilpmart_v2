import React from "react";
import AliceCarousel from 'react-alice-carousel';
export default class Swiper extends React.Component {

  constructor() {
    super();
    this.state = {
      galleryItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      galleryItems: [
        <img key='0' src={require("../public/bannr1.webp")} className="img-fluid" style={{ width: 1395 }} alt="" />,
        <img key='1' src={require("../public/bannr2.webp")} className="img-fluid" style={{ width: 1395 }} alt="" />,
        <img key='2' src={require("../public/bannr3.webp")} className="img-fluid" style={{ width: 1395 }} alt="" />,
        <img key='3' src={require("../public/bannr4.webp")} className="img-fluid" style={{ width: 1395 }} alt="" />]
    });

  }

  render() {
    return (
      <div className="row">
        
        <div className="col">
         
                <AliceCarousel
                  animationType='fadeout'
                  autoPlayInterval={3000}
                  autoPlay={true}
                  autoPlayStrategy="all"
                  animationEasingFunction="ease"
                  // controlsStrategy="responsive"
                  disableDotsControls
                  disableAutoPlayOnAction={true}
                  fadeOutAnimation={true}
                  items={this.state.galleryItems}
                  infinite
                  mouseTrackingEnabled={true}
                  // autoHeight={true}
                  autoWidth
                  disableButtonsControls //can be enabled if arrows are needed
                  // responsive='responsive'
                  touchTracking
                />
              </div>
              </div>
       
    );
  }
}