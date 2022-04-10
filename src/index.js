import React, { Component } from 'react'
import { render } from 'react-snapshot'
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import ls from 'local-storage';

import App from './Components/Application'
import Page from './Components/Page'
import Session from './Components/Session'
import SiteRoot from './Public/index'
import AboutPage from './Public/about'

class Application extends Component {

    constructor(props) {
        super(props)

        this.state = {
            app: new App(),
        };
    }

    render() {
        var state = this.state;

        return (

            <Router>
                <Switch>

                    {/* Homepage */}
                    <Route exact path="/" render={routeProps => (

                        <Page state={this.state}>
                            <Session state={this.state}>
                                <SiteRoot state={this.state} />
                            </Session>
                        </Page>
                    )}/>

                    {/* About Page */}
                    <Route exact path="/about" render={routeProps => (

                        <Page state={this.state}>
                            <Session state={this.state}>
                                <AboutPage state={this.state} />
                            </Session>
                        </Page>
                    )}/>

                    {/* Catch All */}
                    <Route render={routeProps => (
                        <Redirect to="/" />
                    )}/>
                </Switch>
            </Router>
        )
    }
}



render(<Application />, document.getElementById('root'))
