import React, { Component } from 'react'
import Configuration from '../config'
import Yaml from "js-yaml";
import Cookies from 'universal-cookie';
import Crypto from 'crypto-js';
import ls from 'local-storage';

export default class Application extends Component {
    constructor(props) {
        super(props)
        this.state = {
            config: Yaml.load(Configuration)
        };
    }

    getSessionKey() {
        if(this.state.config.application.id.length < 1) {
            return
        }

        var cookies = new Cookies();
        var sessionKey = cookies.get(this.state.config.application.id + ":" + 'session.key');
        if(!sessionKey || sessionKey.length < 1) {
            return false
        }
        return sessionKey
    }

    setSessionKey(key, expireInHours) {
        if(this.state.config.application.id.length < 1) {
            return
        }

        var cookies = new Cookies();
        var expiry = new Date()
        expiry.setHours(expiry.getHours() + expireInHours)
        cookies.set(this.state.config.application.id + ":" + 'session.key', key, { expires: expiry})
    }

    login() {
        if(this.state.config.application.id.length < 1) {
            return
        }

        this.setState({
            isLoggedIn: true
        })
    }

    logout() {
        this.setState({
            isLoggedIn: false
        })
    }

    get(area, key) {
        if(this.state.config.application.id.length < 1) {
            return
        }

        if(this.state && this.state[area + ":" + key]) {
            return this.state[area + ":" + key];
        }

        if(!this.getSessionKey()) {
            return
        }

        var cookies = new Cookies();
        var sessionKey = this.getSessionKey();
        var rawContent = ls.get(this.state.config.application.id + ":" + area + ":" + key);
        var content = {}
        if(sessionKey && rawContent && sessionKey.length > 0 && rawContent.length > 0) {
            var encryptedRawContent = Crypto.AES.decrypt(rawContent, sessionKey).toString(Crypto.enc.Utf8)
            if(encryptedRawContent.length > 0) {
                content = JSON.parse(encryptedRawContent)
            }
        }
        return content
    }

    set(area, key, content) {
        if(this.state.config.application.id.length < 1) {
            return
        }

        this.setState({
            [area + ":" + key]: content
        })

        if(!this.getSessionKey()) {
            return
        }
        ls.set(this.state.config.application.id + ":" + area + ":" + key, Crypto.AES.encrypt(JSON.stringify(content), this.getSessionKey()).toString())
    }

    isLoggedIn() {
        if(this.state.config.application.id.length < 1) {
            return false
        }

        return this.state.isLoggedIn;
    }

    config() {
        return this.state.config
    }
}