import React from 'react';
export default class AboutUs extends React.Component {

  constructor() {
    super();
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <section id="maincontent">
        <div className="subpages-heading">
          <div className="container">
            <h1 className="text-center p-5">About Us</h1>

          </div>
        </div>
        <div className="container-fluid">
          <div className="row pb-5">
            <div className="col">
              <div className="aboutWrapper">
                <div className="aboutbgoverlay"></div>
                <div className="aboutContents">
                  {/* <h2>About Us</h2>
                  <span></span> */}

                  <p>#Vocal4handmade #Vocalforlocal #ilovehandloom</p>

                  <p>Eshilpmart is a brain child of Digital India & Ministry of Rural Development. It is like a true manifestation of our digitally aided vision for Indian handlooms & handicrafts. At Eshilpmart, we thrive to celebrate, promote & recreate the richness & diversity of Indian handicrafts.</p>

                  <p>We are committed to recognise, nurture and amplify the unique craft & talented artisans by giving them a space to exhibit their work, a technical hand to thrive in the digital world, backed by consistent industrial training & workshops. The aim is to revive the vibrantly creative spirit of Indian handicrafts in the global arena. This designated space will become the outlet for not just to “sell the craft “but to become the source to initiate many meaningful conversations & unheard stories about the lives of Indian artisans.</p>

                  <p>Eshilpmart is all about providing the centre stage to the “Remote-To-Renowned” artisans; here, they can directly exhibit & sell their work. This is a conscious effort to build a sustainable and woke community of people with conscience, people who value the craft and are proud to adorn this unmatchable workmanship.Eshilpmart is the face of the new, minimal & conscious India. Indian handloom partnered with Eshilpmart is ready to cause an ecologically balanced paradigm shift in the craft & consumption ecosystem.</p>

                  <p>#Eshilpmart is a pledge to be the change that we want to see in our lifestyle and society as a whole!</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
    );
  }
}