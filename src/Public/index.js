import React, {Component} from 'react'
import {Link, Redirect} from "react-router-dom";

export default class Index extends Component {

    constructor(props) {
        super(props)
        this.state = props.state;
    }

    render() {

		var cleaningServicesPricing = this.state.app.config().services.map((item, key) =>
			<div className="price-content">
				<h3>{item.Name}</h3>
				<div className="price-text">
					<h4>&pound;{item.Price}</h4>
				</div>
				<h4>{item.Sessions} sessions of {item.Hours} hours</h4>
				<hr />
			</div>
		)

        return (
            <span>

							<div className="space-medium">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="section-title">

									<h1>{this.state.app.config().pages.homepage.title}</h1>
									<p>{this.state.app.config().pages.homepage.subtitle}</p>
								</div>

							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
								<div className="service-block">
									<div className="service-img"><a href="#"><img src={this.state.app.config().services[0].Image} alt="" className="img-responsive" /></a> </div>
									<div className="service-content">
										<h3><a href="#">{this.state.app.config().services[0].Name}</a></h3>
										<p>{this.state.app.config().services[0].Description}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
								<div className="service-block">
									<div className="service-img"><a href="#"><img src={this.state.app.config().services[1].Image} alt="" className="img-responsive" /> </a></div>
									<div className="service-content">
										<h3><a href="#">{this.state.app.config().services[1].Name}</a></h3>
										<p>{this.state.app.config().services[1].Description}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
								<div className="service-block">
									<div className="service-img"><a href="#"><img src={this.state.app.config().services[2].Image} alt="" className="img-responsive" /></a> </div>
									<div className="service-content">
										<h3><a href="#">{this.state.app.config().services[2].Name}</a></h3>
										<p>{this.state.app.config().services[2].Description}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

							<div className="space-medium bg-light">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="section-title">

									<h1>{this.state.app.config().pages.homepage.sections.whyUse.title}</h1>
									<p>{this.state.app.config().pages.homepage.sections.whyUse.subtitle}</p>
								</div>

							</div>
						</div>
						<div className="row">
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block mb30">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[0].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[0].content}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block mb30">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[1].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[1].content}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block mb30">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[2].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[2].content}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[3].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[3].content}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[4].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[4].content}</p>
									</div>
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
								<div className="feature-block">
									<div className="feature-icon"><i className="icon-round68"></i> </div>
									<div className="feature-content">
										<h4>{this.state.app.config().pages.homepage.sections.whyUse.reasons[5].title}</h4>
										<p>{this.state.app.config().pages.homepage.sections.whyUse.reasons[5].content}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

							<div className="space-medium bg-default">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="section-title">

									<h1 className="text-white">Pricing Plan </h1>
								</div>

							</div>
						</div>
						<div className="row">
							<div className="col-12 col-lg-8 center-block">
								<div className="price-head">
									<h3>{this.state.app.config().pages.homepage.sections.services.title}</h3>
								</div>
								<div className="price-block">

									{cleaningServicesPricing}

									<div className="text-center mt30"><a href="#" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalMakeABooking">book your order now</a></div>
								</div>
							</div>
						</div>
					</div>
				</div>

							<div className="space-medium bg-light">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="section-title">

									<h1>{this.state.app.config().pages.homepage.sections.testimonials.title}</h1>
								</div>

							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
								<div className="testimonial-block">
									<div className="testimonial-content">
										<p>“{this.state.app.config().pages.homepage.sections.testimonials.comments[0].content}”</p>
									</div>
									<div className="testimonial-meta">
										<h5>{this.state.app.config().pages.homepage.sections.testimonials.comments[0].author}</h5>
										<span>( {this.state.app.config().pages.homepage.sections.testimonials.comments[0].title} )</span>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
								<div className="testimonial-block">
									<div className="testimonial-content">
										<p>“{this.state.app.config().pages.homepage.sections.testimonials.comments[0].content}” </p>
									</div>
									<div className="testimonial-meta">
										<h5>{this.state.app.config().pages.homepage.sections.testimonials.comments[0].author}</h5>
										<span>( {this.state.app.config().pages.homepage.sections.testimonials.comments[0].title} )</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

							<div className="cta-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<h1>Any questions? Call Now: <a className="text-white" href={"tel:" + this.state.app.config().contact.mobile}>{this.state.app.config().contact.mobile}</a></h1>
							</div>
						</div>
					</div>
				</div>

				<div className="modal fade" id="modalMakeABooking" tabIndex="-1" role="dialog" aria-labelledby="modalMakeABooking" aria-hidden="true">
				  <div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
					  <div className="modal-header">
						<h3 className="modal-title" id="exampleModalLongTitle">Make A Booking</h3>
					  </div>
					  <div className="modal-body">
						<p>
							Thanks for your interest - to make a booking please contact me by phone or email.
						</p>
						<ul>
							<li><strong>Mobile:</strong><a href={"tel:" + this.state.app.config().contact.mobile}>{this.state.app.config().contact.mobile}</a></li>
							<li><strong>Email:</strong> <a href={"mailto:" + this.state.app.config().contact.email}>{this.state.app.config().contact.email}</a></li>
						</ul>
					  </div>
					</div>
				  </div>
				</div>

			</span>
        )
    }
}