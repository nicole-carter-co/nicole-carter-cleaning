import React, { Component } from 'react'
import Application from '../Components/Application'

class TimeSheets extends Component {

    constructor(props) {
        super(props)
        var state = props.state;

        if(props.date == null) {
            var chosenDate = new Date()
        } else {
            var chosenDate = this.getMonday(new Date(props.date))
        }

        // Work out the start of the actual current week
        var monday = new Date(this.getISODate(this.getMonday(chosenDate)))

        if(this.getISODate(chosenDate) != this.getISODate(monday)) {
            chosenDate = monday
        }

        // What day are we modelling at the moment?
        state["chosenDate"] = chosenDate
        state["monday"] = monday

        var sunday = new Date(this.getISODate(monday))
        sunday.setDate(sunday.getDate() + 6)
        state['sunday'] = sunday

        state['thisActualWeek'] = this.getMonday(new Date())

        if(!state['timeSheet']) {
            state['timeSheet'] = {
                Monday: monday,
                UserID: state.User,
                Projects: {},
                Approval: {
                    Submitted: false
                }
            }
        }

        this.state = state

        this.jumpBackAWeek = this.jumpBackAWeek.bind(this);
        this.jumpForwardAWeek = this.jumpForwardAWeek.bind(this);
        this.addAnotherLine = this.addAnotherLine.bind(this);
        this.addProject = this.addProject.bind(this);
        this.submitTimesheet = this.submitTimesheet.bind(this);
        this.loadTimesheet = this.loadTimesheet.bind(this);
        this.clearTheGrid = this.clearTheGrid.bind(this);
        this.setWeek = this.setWeek.bind(this);
    }

    componentDidMount() {
        this.fetchTimeSheet(this.state.monday);
        this.timesheetPrefetch();
    }

    componentDidUpdate() {
        this.loadTimesheet()
    }

    setWeek(date) {
        this.setState({
            monday: this.getMonday(date),
            sunday: this.getMonday(date).setDate(this.getMonday(date) + 7)
        })
    }

    timesheetPrefetch() {
        var i
        var currentWeek = new Date(this.state.chosenDate)
        for(i = 2; i > 0; i--) {
            currentWeek.setDate(currentWeek.getDate() - 7)
            this.fetchTimeSheet(currentWeek)
        }
    }

    fetchTimeSheet(date) {
        date = this.getMonday(date)

        if(this.state.app.get(this.getISODate(date), 'timesheets') && this.getISODate(this.state.monday) == this.getISODate(date)) {
            this.setState({
                timesheet: this.state.app.get(this.getISODate(date), 'timesheets')
            }, () => {
                this.loadTimesheet()
            })
        }

        fetch(this.state.app.config().api.endpoints.timesheets.fetch + this.getISODate(date), {
            method: 'GET',
            headers: {
                "jwt": this.state.jwt
            }
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            var monday = new Date(data.Monday)
            this.state.app.set(this.getISODate(monday), data, 'timesheets')

            if(this.getISODate(monday) == this.getISODate(this.state.monday)) {
                this.setState({
                    timesheet: data,
                    ['timesheets_' + this.getISODate(monday)]: data
                }, () => {
                    this.loadTimesheet()
                })
            }
        }.bind(this))
    }

    getMonday(date) {

        var myDate = new Date(date)
        var today = date.getDay()
        var subtractDays = 0

        if(today == 0) {

            subtractDays = 6

        } else {

            subtractDays = myDate.getDay() - 1
        }

        if(subtractDays > 0) {

            myDate.setDate(myDate.getDate() - subtractDays)
        }

        return myDate
    }

    getISODate(date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        return yyyy + "-" + mm + "-" + dd
    }

    getHumanDate(date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        return dd + '/' + mm + '/' + yyyy;
    }

    jumpBackAWeek() {
        var monday = new Date(this.state.monday)
        var sunday = new Date(this.state.sunday)
        monday.setDate(monday.getDate() - 7)
        sunday.setDate(sunday.getDate() - 7)

        this.setState({
            chosenDate: monday,
            monday: monday,
            sunday: sunday,
        }, () => {
            this.fetchTimeSheet(monday)
            this.timesheetPrefetch()
        })

        window.history.replaceState("", "", "/my/timesheets/" + this.getISODate(monday ))
    }

    jumpForwardAWeek() {
        var monday = new Date(this.state.monday)
        var sunday = new Date(this.state.sunday)
        monday.setDate(monday.getDate() + 7)
        sunday.setDate(sunday.getDate() + 7)

        this.setState({
            chosenDate: monday,
            monday: monday,
            sunday: sunday,
        }, () => {
            this.fetchTimeSheet(monday)
            this.timesheetPrefetch()
        })

        window.history.replaceState("", "", "/my/timesheets/" + this.getISODate(monday ))
    }

    cleanseTimesheet(timeSheet) {
        if(!timeSheet) {
            return
        }

        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        var keys = new Array();

        if(timeSheet && timeSheet.Projects) {
            keys = Object.keys(timeSheet.Projects)
        }

        var i
        for(i = 0; i < keys.length; i++) {
            var project = timeSheet.Projects[keys[i]]
            var totalTime = 0
            var n
            for(n = 0; n < days.length; n++) {

                totalTime += project[days[n]].Hours
                totalTime += project[days[n]].Minutes
            }

            if(totalTime < 1) {
                delete timeSheet.Projects[keys[i]]
            }
        }

        return timeSheet
    }

    loadTimesheet() {
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        var keys = new Array()
        if(this.state.timesheet && this.state.timesheet.Projects) {
            keys = Object.keys(this.state.timesheet.Projects)
        }
        var i
        for(i = 0; i < keys.length; i++) {

            var project = this.state.timesheet.Projects[keys[i]]
            var n
            var totalTime = 0
            for(n = 0; n < days.length; n++) {

                totalTime += project[days[n]].Hours
                totalTime += project[days[n]].Minutes
            }

            for(n = 0; n < days.length; n++) {

                var timeBox = document.getElementById(project.ID + "_" + days[n].toLowerCase())

                if(project[days[n]].Hours < 1 && project[days[n]].Minutes < 1) {

                    if(totalTime < 1) {

                        timeBox.value = ""

                    } else {

                        timeBox.value = "0"
                    }

                } else {

                    timeBox.value = project[days[n]].Hours

                    if(project[days[n]].Minutes > 0) {

                        timeBox.value = timeBox.value + ":" + project[days[n]].Minutes
                    }
                }
            }
        }
    }

    addProject() {

        var projectSelector = document.getElementById('addProject')
        var projectSpecs = projectSelector.options[projectSelector.selectedIndex].value.split(":")
        var projectName = projectSelector.options[projectSelector.selectedIndex].text

        if(!this.state.timesheet || !this.state.timesheet.Projects || !this.state.timesheet.Projects[projectSpecs[0]]) {

            var timeSheet = this.state.timesheet

            if(!timeSheet.Projects) {

                timeSheet.Projects = new Object();
            }

            timeSheet.Projects[projectSpecs[0]] = {

                ID: projectSpecs[0],
                Name: projectName,
                OwnerUserID: projectSpecs[1],

                Monday: {

                    Hours: 0,
                    Minutes: 0
                },
                Tuesday: {

                    Hours: 0,
                    Minutes: 0
                },
                Wednesday: {

                    Hours: 0,
                    Minutes: 0
                },
                Thursday: {

                    Hours: 0,
                    Minutes: 0
                },
                Friday: {

                    Hours: 0,
                    Minutes: 0
                },
                Saturday: {

                    Hours: 0,
                    Minutes: 0
                },
                Sunday: {

                    Hours: 0,
                    Minutes: 0
                }
            }
            this.setState({

                timeSheet: timeSheet
            })
        }

        this.state.updateApp('timesheet_' + this.getISODate(this.state.monday), JSON.stringify(timeSheet))
    }

    addAnotherLine() {

        this.setState({

            lines: this.state.lines + 1
        })
    }

    restoreValue = (event) => {

        if(document.activeElement == document.getElementById(event.target.id)) {

            return
        }

        var projectParts = event.target.id.split("_")
        var projectID = projectParts[0]
        var editedDay = projectParts[1]
        var timeSheet = this.state['timesheet_' + this.getISODate(this.state.monday)]
        if(timeSheet.length < 1 || !timeSheet.Projects || !timeSheet.Projects[projectID] || !timeSheet.Projects[projectID]['Monday']) {
            return
        }

        var hours = timeSheet.Projects[projectID][editedDay.charAt(0).toUpperCase() + editedDay.slice(1)].Hours
        var minutes = timeSheet.Projects[projectID][editedDay.charAt(0).toUpperCase() + editedDay.slice(1)].Minutes

        if(hours < 1 && minutes < 1) {

            document.getElementById(event.target.id).value = '0';
            return
        }

        var newVal = hours

        if(minutes > 0) {

            newVal = newVal + ":" + minutes
        }

        document.getElementById(event.target.id).value = newVal
    }

    resetField = (event) => {

        event.target.value = ""
    }

    analyseContent = (event) => {

        this.parseTimeBox(event.target.id)
    }

    getPreviousDay(day) {

        switch(day) {
            case "monday":
                return ""
                break
            case "tuesday":
                return "monday"
                break
            case "wednesday":
                return "tuesday"
                break
            case "thursday":
                return "wednesday"
                break
            case "friday":
                return "thursday"
                break
            case "saturday":
                return "friday"
                break
            case "sunday":
                return "saturday"
                break
        }
    }

    getNextDay(day) {

        switch(day) {

            case "monday":

                return "tuesday"
                break

            case "tuesday":

                return "wednesday"
                break

            case "wednesday":

                return "thursday"
                break

            case "thursday":

                return "friday"
                break

            case "friday":

                return "saturday"
                break

            case "saturday":

                return "sunday"
                break

            case "sunday":

                return ""
                break
        }
    }

    parseTimeBox(boxID) {
        var box = document.getElementById(boxID)
        var newValue = document.getElementById(boxID).value
        var oldValue = document.getElementById(boxID).value = newValue.substring(0,newValue.length - 1)
        var latestCharacter = newValue.substring(newValue.length - 1, newValue.length)
        var hasSeparator = false
        var hours = parseInt(newValue.split(":")[0])
        var minutes = 0
        var doShunt = false

        var projectParts = boxID.split("_")
        var projectID = projectParts[0]
        var editedDay = projectParts[1]

        if(isNaN(hours)) {
            hours = 0

            if(latestCharacter != "0" && latestCharacter != ":") {
                box.value = oldValue
                return
            }
        }

        if(hours > 23) {
            doShunt = true
        }

        if(newValue.length > 1 && oldValue == "0") {
            doShunt = true
        }

        if(oldValue != "" && (newValue == "0" || newValue == "00")) {
            box.value = ""
            doShunt = true
        }

        if(newValue.indexOf(":") > -1) {
            hasSeparator = true
            minutes = parseInt(newValue.split(":")[1])
            if(minutes > 59) {
                doShunt = true
            }
        }

        if(!doShunt) {
            box.value = newValue;

            if(latestCharacter != ":") {
                this.updateTimeSheet(boxID)
            }
            return
        }

        if(this.getNextDay(editedDay).length > 0) {
            document.getElementById(projectID + "_" + this.getNextDay(editedDay)).value = latestCharacter
            document.getElementById(projectID + "_" + this.getNextDay(editedDay)).focus()
            this.updateTimeSheet(projectID + "_" + this.getNextDay(editedDay))
            return
        }

        var projects = new Array();
        if(this.state.timesheet && this.state.timesheet.Projects) {
            projects = Object.keys(this.state.timesheet.Projects)
        }

        var i;
        var foundUs = false
        var nextProject = ""
        for(i = 0; i < projects.length; i++) {
            if(this.state.timesheet.Projects[projects[i]].ID == projectID) {
                foundUs = true
                continue
            }
            if(foundUs) {
                nextProject = this.state.timesheet.Projects[projects[i]].ID
                break
            }
        }

        if(nextProject.length < 1) {
            return
        }

        document.getElementById(nextProject + "_monday").value = latestCharacter
        document.getElementById(nextProject + "_monday").focus()
        this.updateTimeSheet(nextProject + "_monday")
        return
    }

    clearTheGrid() {
        if(!this.state.timesheet || !this.state.timesheet.Projects) {
            return
        }

        alert(JSON.stringify(this.state.timesheet))

        var i;
        for(i = 0; i < this.state.timesheet.Projects.length; i++) {
            alert(this.state.timesheet.Projects[i].ID + "_monday")
            document.getElementById(this.state.timesheet.Projects[i].ID + "_monday").value = ""
        }
    }

    updateTimeSheet(boxID) {

        var projectParts = boxID.split("_")
        var projectID = projectParts[0]
        var editedDay = projectParts[1]
        var newValue = document.getElementById(boxID).value
        var timeSheet = this.state.timesheet
        var hours = parseInt(newValue.split(":")[0])
        var minutes = 0

        if(newValue.indexOf(":") > -1) {
            minutes = parseInt(newValue.split(":")[1])
        }

        timeSheet.Projects[projectID][editedDay.charAt(0).toUpperCase() + editedDay.slice(1)] = {
            Hours: hours,
            Minutes: minutes
        }

        this.state.updateApp('timesheet_' + this.getISODate(this.state.monday), JSON.stringify(timeSheet))
        this.setState({
            ['timesheet_' + this.getISODate(this.state.monday)]: JSON.stringify(timeSheet)
        })
    }

    getDayTotal(day) {

        var i
        var hours = 0
        var minutes = 0
        var projects = Object.keys(this.state.timesheet.Projects)
        for(i = 0; i < projects.length; i++) {

            var projectAmount = document.getElementById(projects[i] + '_' + day).value
            var parts = projectAmount.split(":")
            hours = parseInt(hours) + parseInt(parts[0])

            if(parts[1] && parts[1].length > 0) {

                minutes = parseInt(minutes) + parseInt(parts[1].padEnd(2, '0'))

                if(minutes >= 60) {

                    hours = parseInt(hours) + 1
                    minutes = parseInt(minutes) - 60
                }
            }
        }

        return hours + ":" + minutes
    }

    submitTimesheet() {
        this.setState({
            creating: true
        })

        fetch(this.state.app.config().api.endpoints.timesheets.create, {
            method: 'POST',
            headers: {
                "jwt": this.state.jwt
            },
            body: JSON.stringify(this.state.timesheet),
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            this.state.updateApp('timesheet_' + this.getISODate(new Date(data.Monday)), data)
            this.setState({
                timesheet: data,
                ['timesheets_' + this.getISODate(new Date(data.Monday))]: data,
                creating: false
            })
        }.bind(this))
    }

    render() {

        // Sort out the date display
        var getSuffix = function(d) {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1:  return "st";
                case 2:  return "nd";
                case 3:  return "rd";
                default: return "th";
            }
        }

        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        var bannerStart = String(this.state.chosenDate.getDate()) + getSuffix(this.state.chosenDate.getDate()) + " " + month[this.state.chosenDate.getMonth()]
        var endDate = new Date(this.state.chosenDate)
        endDate.setDate(this.state.chosenDate.getDate() + 6)
        var bannerEnd = String(endDate.getDate()) + getSuffix(endDate.getDate()) + " " + month[endDate.getMonth()]

        var availableProjects = Object()
        if(this.state.projects && Object.keys(this.state.projects).length > 0) {

            Object.keys(this.state.projects).map((item, key) =>

                {(() => {

                    if(!this.state.timesheet || !this.state.timesheet.Projects || !this.state.timesheet.Projects[this.state.projects[item].ID]) {

                        availableProjects[item] = this.state.projects[item]
                    }

                })()}
            )
        }

        var projectRows = Object.keys(availableProjects).map((item, key) =>

            <option value={this.state.projects[item].ID + ":" + this.state.projects[item].OwnerUserID}>{this.state.projects[item].Description}</option>
        )

        return (

            <>

                <div className="row mb-3 mt-4">
                    <div className="col-2">
                        <a onClick={this.jumpBackAWeek} className="btn btn-primary fa-pull-left text-white">&lt;&lt;</a>
                    </div>
                    <div className="col-8">
                        <h5>{this.getHumanDate(this.state.monday)} &nbsp; &mdash; &nbsp; {this.getHumanDate(this.state.sunday)}</h5>
                    </div>
                    <div className="col-2">
                        {(() => {

                            if(new Date(this.getISODate(this.state.monday) + " 00:00:00") < new Date(this.getISODate(this.state.thisActualWeek) + " 00:00:00")) {

                                return (

                                    <a onClick={this.jumpForwardAWeek} className="btn btn-primary fa-pull-right text-white">&gt;&gt;</a>
                                )
                            }

                        })()}
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <strong>Your Hours</strong>
                    </div>

                    <div className="card-body bg-white">
                        <div className="row mb-3">
                            <div className="col-12 text-right">
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 7+'px', width: 70+'px'}}>
                                    Mon
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 10+'px', width: 77+'px'}}>
                                    Tue
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 7+'px', width: 77+'px'}}>
                                    Wed
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 10+'px', width: 77+'px'}}>
                                    Thu
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 13+'px', width: 80+'px'}}>
                                    Fri
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{paddingRight: 10+'px', width: 77+'px'}}>
                                    Sat
                                </p>
                                <p className="d-inline-block mr-4 mb-0 pb-0" style={{paddingRight: 10+'px', width: 75+'px'}}>
                                    Sun
                                </p>
                            </div>
                            <div className="col-5">

                            </div>
                            <div className="col-7 text-right">
                                <p className="d-inline-block mb-0 pb-0" style={{width: 70+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                    )

                                    })()}
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{width: 77+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 1)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{width: 77+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 2)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{width: 77+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 3)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{width: 80+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 4)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                                <p className="d-inline-block mb-0 pb-0" style={{width: 77+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 5)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                                <p className="d-inline-block mr-4 mb-0 pb-0" style={{width: 75+'px'}}>
                                    {(() => {

                                        var thisDate = new Date(this.state.chosenDate)
                                        thisDate.setDate(thisDate.getDate() + 6)
                                        var dd = String(thisDate.getDate()).padStart(2, '0');
                                        var mm = String(thisDate.getMonth() + 1).padStart(2, '0'); //January is 0!

                                        return (
                                            <span>
                                                {dd}/{mm}
                                            </span>
                                        )

                                    })()}
                                </p>
                            </div>
                        </div>

                        <hr/>

                        {(() => {



                            var i;
                            var output = new Array();
                            var projects = new Array();

                            if(this.state.timesheet && this.state.timesheet.Projects) {

                                projects = Object.keys(this.state.timesheet.Projects)
                            }

                            for(i = 0; i < projects.length; i++) {

                                var thisProject = this.state.timesheet.Projects[projects[i]]
                                output.push(

                                    <>
                                    <div key={thisProject.ID} className="row">
                                    <div className="col-5">
                                        <strong>{thisProject.Name}</strong>
                                    </div>
                                    <div className="col-7">
                                        <form className="form-inline fa-pull-right">
                                            {(() => {

                                                if(this.state.timesheet.Approval && this.state.timesheet.Approval.Submitted && !this.state.timesheet.Approval.Approved) {

                                                    return (

                                                        <span>
                                                        <input type="text" id={thisProject.ID + "_monday"} disabled className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="monday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} autoFocus />
                                                        <input type="text" id={thisProject.ID + "_tuesday"} disabled className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="tuesday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_wednesday"} disabled className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="wednesday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_thursday"} disabled className="form-control mr-2 text-center font-weight-bold bg-orange-light text-white" placeholder="BH" maxLength="6" style={{width: 70+'px'}} name="thursday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_friday"} disabled className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="friday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_saturday"} disabled className="form-control mr-2 text-center font-weight-bold bg-gray-light text-white" maxLength="6" style={{width: 70+'px'}} name="saturday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_sunday"} disabled className="form-control mr-2 text-center font-weight-bold bg-gray-light text-white" maxLength="6" style={{width: 70+'px'}} name="sunday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        </span>
                                                    )

                                                } else {

                                                    return (

                                                        <span>
                                                        <input type="text" id={thisProject.ID + "_monday"} className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="monday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} autoFocus />
                                                        <input type="text" id={thisProject.ID + "_tuesday"} className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="tuesday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_wednesday"} className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="wednesday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_thursday"} className="form-control mr-2 text-center font-weight-bold bg-orange-light text-white" placeholder="BH" maxLength="6" style={{width: 70+'px'}} name="thursday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_friday"} className="form-control mr-2 text-center font-weight-bold" maxLength="6" style={{width: 70+'px'}} name="friday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_saturday"} className="form-control mr-2 text-center font-weight-bold bg-gray-light text-white" maxLength="6" style={{width: 70+'px'}} name="saturday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        <input type="text" id={thisProject.ID + "_sunday"} className="form-control mr-2 text-center font-weight-bold bg-gray-light text-white" maxLength="6" style={{width: 70+'px'}} name="sunday" onClick={this.resetField} onBlur={this.restoreValue} onChange={this.analyseContent} />
                                                        </span>
                                                    )
                                                }

                                            })()}
                                        </form>
                                    </div>
                                </div>
                                    {(() => {

                                        if(i < projects.length - 1) {
                                            return (
                                                <hr />
                                            )
                                        }

                                    })()}

                                    </>
                                )
                            }

                            return output

                        })()}

                    </div>

                    {(() => {

                        if(this.state.projects && Object.keys(this.state.projects).length > 0 && (!this.state.timesheet.Approval || !this.state.timesheet.Approval.Submitted)) {

                            return (

                                <div className="card-footer">
                                    <div className="form-row">
                                        <div className="col-2">
                                            <button className="btn btn-primary" onClick={this.addProject}>Add Project</button>
                                        </div>

                                        <div className="col-10">
                                            <select id="addProject" className="form-control font-weight-bold" name="project">
                                                {projectRows}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    })()}
                </div>

                {(() => {

                    if(!this.state.timesheet || !this.state.timesheet.Approval || !this.state.timesheet.Approval.Submitted) {

                        if(this.state.creating) {

                            return (

                                <div className="pb-4">
                                    <button className="btn btn-success fa-pull-right" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Submitting ...
                                    </button>
                                </div>
                            )

                        } else {

                            if(this.state.projects && Object.keys(this.state.projects).length > 0) {

                                return (

                                    <div className="pb-4">
                                        <button className="btn btn-success fa-pull-right" onClick={this.submitTimesheet}>Submit For Approval</button>
                                    </div>
                                )
                            }
                        }
                    } else {
                        return (

                            <div className="alert alert-primary" role="alert">
                                This timesheet is pending approval
                            </div>
                        )
                    }

                })()}

                {(() => {

                    if(!this.state.projects || Object.keys(this.state.projects).length < 1) {

                        return (

                            <div className="alert alert-primary mt-4" role="alert">
                                <strong>No Projects</strong> - You must be enrolled in one or more projects to file a timesheet
                            </div>
                        )

                    }

                })()}

            </>
        )
    }
}

export default TimeSheets;