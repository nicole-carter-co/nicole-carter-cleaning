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
            <>
				<div className="space-medium">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<div className="row">
									<div className="col-12">
										<div className="post-block">

											<div className="post-img">
												<img src="img/nicole.jpg" alt=""className="img-responsive" />
											</div>

											<div className="meta-date">
												<span className="meta-date-number">{this.state.app.config().pages.about.photo.title}</span>
												<span className="meta-date-text">{this.state.app.config().pages.about.photo.caption}</span>
											</div>
											<div className="post-content">

												<div className="post-header">

													<h2 className="post-title">{this.state.app.config().pages.about.title}</h2>
												</div>

												<p>
													{this.state.app.config().pages.about.caption}
												</p>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</>
        )
    }
}