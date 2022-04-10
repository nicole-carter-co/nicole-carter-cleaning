import React, { Component } from 'react'
import ls from "local-storage";
import {Redirect} from "react-router-dom";

class Projects extends Component {

    constructor(props) {
        super(props)
        this.state = props.state;
        this.addProject = this.addProject.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.disableAutoFocus = this.disableAutoFocus.bind(this)
    }

    componentDidMount() {
        this.getProjects();
        document.addEventListener("keydown", function(event) {
            if(event.keyCode == 13) {
                switch(this.state.targetAction) {
                    case 'create':
                        document.getElementById('createButton').click()
                        break
                }

                this.setState({
                    targetAction: false,
                })
            }
        }.bind(this))
    }

    disableAutoFocus() {
        document.getElementById('searchTarget').innerText = '';
        setTimeout(() => {
            this.setState({
                targetAction: 'create'
            })

            var descriptionField = document.getElementById('description')
            if(descriptionField) {
                descriptionField.focus()
            }

        }, 400)
    }

    enableAutoFocus() {
        document.getElementById('searchTarget').innerText = 'search';
    }

    getProjects() {
        fetch(this.state.config.api.endpoints.projects.fetch, {
            method: 'GET',
            headers: {
                "jwt": this.state.jwt
            },
        }).then(function(response) {
            return response.json();
        }).then(function(instances) {
            var projects = this.state.projects
            if(!projects) {
                projects = Object()
            }

            for(var i = 0; i < instances.length; i++) {
                projects[instances[i].ID] = instances[i]
            }

            this.state.updateApp('projects', projects)
            this.setState({
                projects: projects
            })
        }.bind(this))
    }

    addProject() {
        this.setState({
            creating: true
        })

        this.enableAutoFocus()
        var myProject = {
            Description: document.getElementById('description').value,
            TeamID: document.getElementById('team').value
        }

        fetch(this.state.config.api.endpoints.projects.create, {
            method: 'POST',
            body: JSON.stringify(myProject),
            headers: {
                "jwt": this.state.jwt
            },
        }).then(function(response) {
            return response.json();
        }).then(function(instances) {
            document.getElementById('description').value = '';
            var projects = this.state.projects
            if(!projects) {
                projects = Object()
            }

            projects[instances.ID] = instances
            JSON.stringify(projects)
            this.state.updateApp('projects', projects)

            this.setState({
                projects: projects,
                creating: false,
                targetAction: false
            })

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

    filterProjects() {
        var searchString = document.getElementById(document.getElementById('searchTarget').innerText).value;
        var searchStyle = document.getElementById('search_style');

        if(searchString.length > 2) {
            searchStyle.innerHTML = ".searchable:not([data-index*=\"" + searchString.toLowerCase() + "\"]) { display: none; }";
        } else {
            searchStyle.innerHTML = "";
        }
    }

    render() {
        if(this.state.destination) {
            return <Redirect to={this.state.destination} />
        }

        var teamRows
        if(this.state.teams) {
            teamRows = Object.keys(this.state.teams).map((item, key) =>
                <option value={this.state.teams[item].ID}>{this.state.teams[item].Description}</option>

            )
        }

        var tableRows
        if(this.state.projects) {
            var projects = new Object()
            var i
            for (i = 0; i < Object.keys(this.state.projects).length; i++) {

                var project = this.state.projects[Object.keys(this.state.projects)[i]]

                if(this.state.teams && this.state.teams[project.TeamID]) {

                    projects[project.ID] = project
                }
            }

            tableRows = Object.keys(projects).map((item, key) =>

                <tr className="data-row searchable" key={projects[item].ID} onMouseDown={this.doMouseDown} onMouseMove={this.doMouseMove} onClick={this.doMouseUp} data-index={projects[item].Description.toLowerCase()} data-href={"/projects/" + projects[item].ID} data-id={projects[item].ID}>

                    <td>{projects[item].Description}</td>
                    <td>{this.state.teams[projects[item].TeamID].Description}</td>

                    {(() => {

                        if(projects[item].Members) {

                            return (

                                <td>{Object.keys(projects[item].Members).length}</td>
                            )

                        } else {

                            return (

                                <td>0</td>
                            )
                        }

                    })()}

                    {(() => {

                        if(new Date(projects[item].Start).getFullYear() == 0) {

                            return (

                                <td>--</td>
                            )

                        } else {

                            var startDate = new Date(projects[item].Start)
                            var startDateStr = String(startDate.getDate()).padStart(2, '0');
                            startDateStr = startDateStr + "/" + String(startDate.getMonth() + 1).padStart(2, '0'); //January is 0!
                            startDateStr = startDateStr + "/" + startDate.getFullYear();

                            return (

                                <td>{startDateStr}</td>
                            )
                        }

                    })()}

                    {(() => {

                        if(new Date(projects[item].End).getFullYear() == 0) {

                            return (

                                <td>--</td>
                            )

                        } else {

                            var endDate = new Date(projects[item].End)
                            var endDateStr = String(endDate.getDate()).padStart(2, '0');
                            endDateStr = endDateStr + "/" + String(endDate.getMonth() + 1).padStart(2, '0'); //January is 0!
                            endDateStr = endDateStr + "/" + endDate.getFullYear();

                            return (

                                <td>{endDateStr}</td>
                            )
                        }

                    })()}
                </tr>

            )
        }

        return (

            <>

                <span hidden id="searchTarget">search</span>

                {(() => {

                    if(projects && Object.keys(projects).length > 0) {

                        return (

                            <span>

                                 <div className="row mb-3">
                                    <div className="col-12">

                                        {(() => {

                                            if(this.state.creating) {

                                                return (

                                                    <button className="btn btn-primary fa-pull-right">
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Creating ...
                                                    </button>
                                                )

                                            } else {

                                                return (

                                                    <button className="btn btn-primary fa-pull-right" data-toggle="modal" data-target="#addProject" onClick={this.disableAutoFocus}>
                                                        Create A New Project
                                                    </button>
                                                )
                                            }
                                        })()}

                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <div className="card-body">
                                        <input className="form-control" type="text" id="search" placeholder="Search your projects" onChange={this.filterProjects} autoFocus />
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body pb-0">
                                        <table id="userTable" className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th scope="col" className="d-none d-md-table-cell">Project</th>
                                                <th scope="col" className="d-none d-md-table-cell">Team</th>
                                                <th scope="col" className="d-none d-md-table-cell">Members</th>
                                                <th scope="col" className="d-none d-md-table-cell">Start</th>
                                                <th scope="col" className="d-none d-md-table-cell">End</th>
                                            </tr>
                                            </thead>
                                            <tbody id="tableBody">{tableRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </span>
                        )

                    } else {

                        if(!this.state.teams || Object.keys(this.state.teams).length < 1) {

                            return (

                                <span>
                                    <div className="alert alert-danger mt-4" role="alert">
                                        <strong>No Teams</strong> - You must create or join a team before you create a project
                                    </div>
                                </span>
                            )

                        } else {

                            return (

                                <span>
                                    <div className="alert alert-primary mt-4" role="alert">
                                        <div className="row">
                                            <div className="col-6 mt-2">
                                                <strong>No Projects</strong> - You have no projects - create your first one now.
                                            </div>
                                            <div className="col-6">
                                                {(() => {

                                                    if(this.state.creating) {

                                                        return (

                                                            <button className="btn btn-primary fa-pull-right">
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Creating ...
                                                            </button>
                                                        )

                                                    } else {

                                                        return (

                                                            <button className="btn btn-primary fa-pull-right" data-toggle="modal" data-target="#addProject" onClick={this.disableAutoFocus}>
                                                                Create A New Project
                                                            </button>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            )
                        }
                    }

                })()}

                <div className="modal fade" id="addProject" tabIndex="-1" role="dialog" aria-labelledby="addProjectTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addProjectTitle">Create A Project</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Enter a description and choose a team for your project
                                </p>
                                <hr />
                                <div className="form-group">
                                    <label htmlFor="description" className="col-form-label">Description:</label>
                                    <input type="text" className="form-control" id="description" />
                                </div>

                                <hr />

                                <div className="form-group">
                                    <label htmlFor="team" className="col-form-label">Team:</label>
                                    <select className="form-control" id="team">
                                        {teamRows}
                                    </select>
                                </div>

                            </div>
                            <div className="modal-footer">

                                <button className="btn btn-primary text-right" data-dismiss="modal" id="createButton" onClick={this.addProject}>Create A Project</button>

                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Projects;