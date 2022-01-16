import React, { Component, useState } from 'react';
import * as dateFns from 'date-fns';
import "../styles/calendar.scss";

class MergeImage extends Component {

    constructor() {
        super();
        this.state = {

            // Initially, no file is selected
            selectedFile: null,
            b64content: ''
        };
    }


    // On file select (from the pop up)
    onFileChange = event => {

        // Update the state
        this.setState({ selectedFile: event.target.files[0] });

        //can call the merge method, and set the b64content of merged media into state.  
    };

    // On file upload (click the upload button)
    onFileUpload = () => { };

    render() {
        return (
            <div className="container">

                <div className="row">
                    <div className="col-md-6">
                        <input type="file" onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload!
                        </button>
                    </div>
                    <div className="col-md-6">
                        <img src={this.state.b64content}>
                        </img>
                    </div>
                </div>

            </div>
        );
    }
}

export default MergeImage;