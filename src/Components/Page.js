import React, { Component } from 'react'
import {Link, Redirect} from "react-router-dom";

function Page(props) {

    if(props.headTitle) {

        document.title = props.headTitle
    }

    return (

        <>
            <div className="top-bar">
                <div className="container">
                    <div className="row pb-3 pb-md-0">
                        <div className="col-md-6 hidden-sm hidden-xs">
                            {(() => {

                                if(props.state.app.config().global.header.socialMedia) {
                                    return (
                                        <div className="social">
                                            <ul>
                                                <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                                <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                                <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                                                <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                                <li><a href="#"><i className="fa fa-pinterest"></i></a></li>
                                            </ul>
                                        </div>
                                    )
                                }

                            })()}
                        </div>
                        <div className="col-8 col-md-3">
                            <div className="call-info">
                                <p className="call-text"><i
                                    className="fa fa-envelope-open-o"></i><strong><a href={"mailto:" + props.state.app.config().contact.email}>{props.state.app.config().contact.email}</a></strong></p>
                            </div>
                        </div>
                        <div className="col-4 col-md-3">
                            <div className="call-info d-none d-md-block">
                                <p className="call-text"><i
                                    className="fa fa-phone"></i><strong><a href={"tel:" + props.state.app.config().contact.mobile}>{props.state.app.config().contact.mobile}</a></strong></p>
                            </div>
                            <div className="call-info d-md-none">
                                <p className="call-text text-right">
                                    <i className="fa fa-phone"></i>
                                    <strong><a href={"tel:" + props.state.app.config().contact.mobile}>{props.state.app.config().contact.mobile}</a></strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <h3 style={{paddingTop: 10+'px'}} className="hidden visible-sm visible-md visible-lg">
                                <Link to="/">{props.state.app.config().pages.homepage.menu.title}</Link>
                            </h3>
                            <h3 style={{paddingTop: 10+'px'}} className="hidden visible-xs text-center">
                                <Link to="/">{props.state.app.config().pages.homepage.menu.title}</Link>
                            </h3>
                        </div>
                        <div className="col-lg-9 col-md-6 col-sm-6 col-xs-12">
                            <div className="navigation">
                                <div id="navigation">
                                    <ul>
                                        <li className="active"><Link to="/" title="Home">Home</Link></li>
                                        <li><Link to="/about">About Me</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {props.children}

            <div className="footer pt-5 pb-5">
                <div className="container">
                    <div className="row pt-4">

                        <div className="col-12">
                            <div className="footer-widget">
                                <h3 className="footer-title mb-4">About Nicole Carter</h3>
                                <p>
                                    {props.state.app.config().global.footer.aboutMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tiny-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">Created in 2022 by <a className="text-white" href="https://jdriscoll.pro/" target="_blank">John Driscoll</a> for Nicole Carter</div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default Page;