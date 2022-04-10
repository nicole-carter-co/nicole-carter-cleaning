import {Redirect} from "react-router-dom";
import React from "react";
import JWT from "./JWT";

export default function Session(props) {
    if(!props.state.app.isLoggedIn()) {
        // Logged out state
        if(window.location.pathname.includes("/my")) {
            return <Redirect to='/' />
        }
    } else {
        // Logged in state
        var userToken = props.state.app.get('user', 'token')
        var now = Math.round((new Date()).getTime() / 1000)
        if(userToken.end < now) {
            props.state.app.logout()
            return <Redirect to='/' />
        }

        if(now > (userToken.end - props.state.app.config().session.refreshTokenBeforeSeconds)) {
            fetch(props.state.app.config().api.endpoints.session.refresh, {
                method: 'GET',
                headers: {
                    "jwt": props.state.jwt
                },
            }).then(function(response) {
                return response.text();
            }).then(function(data) {
                var token = JWT(data)
                if(token.valid) {
                    token.content.User = JSON.parse(token.content.User)

                    this.state.app.set('jwt', data, 'user-credentials')
                    this.state.app.set('token', token, 'user-credentials')
                    this.state.app.set('user', token.content.User, 'user-credentials')
                }
            })
        }

        // Logout handler
        if(window.location.pathname == "/logout") {
            props.state.app.logout()
            return <Redirect to='/' />

        } else if(!window.location.pathname.includes("/my")) {
            return <Redirect to='/my/timesheets' />
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}