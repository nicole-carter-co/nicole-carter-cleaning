import React, { Component } from 'react'
import ls from "local-storage";
import {Redirect} from "react-router-dom";

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = props.state;

        this.doMouseUp = this.doMouseUp.bind(this);
        this.enableAutoFocus = this.enableAutoFocus.bind(this)
        this.shiftFocus = this.shiftFocus.bind(this)
        this.addTeam = this.addTeam.bind(this);
        this.joinTeam = this.joinTeam.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", function(event)
        {
            if(event.keyCode == 13) {
                switch(this.state.targetAction) {
                    case 'join':
                        document.getElementById('joinTeamButton').click()
                        break

                    case 'create':
                        document.getElementById('createTeamButton').click()
                        break
                }

                this.setState({
                    targetAction: false
                })
            }
        }.bind(this))
    }

    doMouseDown(e) {
        window[e.currentTarget.dataset.id] = false
    }

    doMouseMove(e) {
        window[e.currentTarget.dataset.id] = true
    }

    doMouseUp(e) {
        if(!window[e.currentTarget.dataset.id]) {
            this.setState({
                destination: e.currentTarget.dataset.href
            })
        }
    }

    shiftFocus = (event) => {
        var field
        var searchTargetField = document.getElementById('searchTarget');
        searchTargetField.innerText = '';

        switch(event.target.id) {

            case "joinButton":
                field = "joinCode";
                this.setState({
                    targetAction: 'join'
                })
                break;

            case "createButton":
                field = "team";
                this.setState({
                    targetAction: 'create'
                })

                break;
        }

        setTimeout(() => {
            var targetField = document.getElementById(field)
            if(targetField) {
                targetField.value = '';
                targetField.focus()
            }

        }, 400)
    }

    enableAutoFocus() {
        document.getElementById('searchTarget').innerText = 'search';
    }

    joinTeam() {
        var joinCode = document.getElementById('joinCode').value

        fetch(JSON.parse(ls.get('config')).Backend + 'teams/join/' + joinCode, {
            method: 'GET',
            headers: {

                "X-MYHOURS-SESSION": this.state.session.ID
            }
        }).then(function(response) {

            return response.json();
        }).then(function(team) {

            var teams = JSON.parse(ls.get('teams'))

            if(!teams) {

                teams = new Object()
            }

            teams[team.ID] = team
            ls.set('teams', JSON.stringify(teams))

            this.setState({

                teams: teams
            })

        }.bind(this))
    }

    addTeam() {
        var description = document.getElementById('team').value
        if(description.length < 1) {
            this.setState({
                creating: false,
                targetAction: false
            })

            return
        }

        this.setState({
            creating: true
        })

        fetch(this.state.config.api.endpoints.teams.create, {
            method: 'POST',
            headers: {
                "jwt": this.state.jwt
            },
            body: JSON.stringify({
                Description: description
            })
        }).then(function(response) {
            return response.json();
        }).then(function(team) {
            var teams = this.state.teams
            if(!teams) {
                teams = new Object()
            }

            teams[team.ID] = team
            this.state.updateApp('teams', teams)

            document.getElementById('team').value = '';
            this.setState({
                creating: false,
                teams: teams
            })
        }.bind(this))
    }

    filterTeams() {

        var searchString = document.getElementById(document.getElementById('searchTarget').innerText).value;
        var searchStyle = document.getElementById('search_style');

        if(searchString.length > 2)
        {
            searchStyle.innerHTML = ".searchable:not([data-index*=\"" + searchString.toLowerCase() + "\"]) { display: none; }";
        }
        else
        {
            searchStyle.innerHTML = "";
        }
    }

    render() {
        var tableRows;
        if(this.state.teams) {

            tableRows = Object.keys(this.state.teams).map((item, key) =>

                <tr className="data-row searchable" key={this.state.teams[item].ID} onMouseDown={this.doMouseDown} onMouseMove={this.doMouseMove} onClick={this.doMouseUp} data-index={this.state.teams[item].Description.toLowerCase()} data-href={"/teams/" + this.state.teams[item].ID} data-id={this.state.teams[item].ID}>
                    <td>{this.state.teams[item].Description}</td>

                    {(() => {

                        if(this.state.teams[item].Members) {

                            var keys = Object.keys(this.state.teams[item].Members)
                            var length = 0

                            if(keys) {

                                length = keys.length
                            }

                            return (

                                <td>{length}</td>
                            )

                        } else {

                            return (

                                <td>0</td>
                            )
                        }

                    })()}
                </tr>
            )
        }

        return (

            <>
                <span>

                    <span hidden id="searchTarget">search</span>
                    <span hidden id="createWait">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Creating ...
                    </span>

                    {(() => {

                        if(!this.state.teams || Object.keys(this.state.teams).length < 1) {

                            return (

                                <span>
                                <div className="alert alert-primary mt-4" role="alert">
                                    <div className="row">
                                        <div className="col-2">
                                            <button className="btn btn-primary" id="joinButton" data-toggle="modal" data-target="#joinTeam" onClick={this.shiftFocus}>Join A Team</button>
                                        </div>
                                        <div className="col-8 mt-2 text-center">
                                            <strong>No Teams</strong> - You have no teams - create your first one now.
                                        </div>
                                        <div className="col-2">
                                            {(() => {

                                                if(this.state.creating) {

                                                    return (

                                                        <button className="btn btn-primary fa-pull-right" disabled>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Creating ...
                                                        </button>
                                                    )

                                                } else {

                                                    return (

                                                        <button className="btn btn-primary fa-pull-right" id="createButton" data-toggle="modal" data-target="#addTeam" onClick={this.shiftFocus}>Create A New Team</button>
                                                    )
                                                }

                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </span>
                            )

                        } else {

                            return (

                                <span>

                                 <div className="row mb-3">
                                    <div className="col-12">
                                        <button className="btn btn-primary fa-pull-left" id="joinButton" data-toggle="modal" data-target="#joinTeam" onClick={this.shiftFocus}>Join A Team</button>
                                        {(() => {

                                            if(this.state.creating) {

                                                return (

                                                    <button className="btn btn-primary fa-pull-right" disabled>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Creating ...
                                                    </button>
                                                )

                                            } else {

                                                return (

                                                    <button className="btn btn-primary fa-pull-right" id="createButton" data-toggle="modal" data-target="#addTeam" onClick={this.shiftFocus}>Create A New Team</button>
                                                )
                                            }

                                        })()}
                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <div className="card-body">
                                        <input className="form-control" type="text" id="search" placeholder="Search your teams" onChange={this.filterTeams} autoFocus />
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body pb-0">
                                        <table id="userTable" className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th scope="col" className="d-none d-md-table-cell">Team</th>
                                                <th scope="col" className="d-none d-md-table-cell">Members</th>
                                            </tr>
                                            </thead>
                                            <tbody id="tableBody">{tableRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </span>
                            )
                        }

                    })()}

                </span>

                <div className="modal fade" id="addTeam" tabIndex="-1" role="dialog" aria-labelledby="addTeamTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addTeamTitle">Create A Team</h5>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="team" className="col-form-label">Name:</label>
                                    <input type="text" className="form-control" id="team" />
                                </div>
                            </div>
                            <div className="modal-footer">

                                <button className="btn btn-primary text-right" data-dismiss="modal" id="createTeamButton" onClick={this.addTeam}>Create A Team</button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="joinTeam" tabIndex="-1" role="dialog" aria-labelledby="joinTeamTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="joinTeamTitle">Join A Team</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="team" className="col-form-label">Join Code:</label>
                                        <input type="text" className="form-control" id="joinCode" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">

                                <button className="btn btn-primary text-right" data-dismiss="modal" id="joinTeamButton" onClick={this.joinTeam}>Join Team</button>

                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Teams