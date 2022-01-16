import React, { Component, useState } from 'react';
import * as dateFns from 'date-fns';
import "../styles/calendar.scss";
import Jimp from 'jimp';

class MergeImage extends Component {

    constructor() {
        super();
        this.state = {

            // Initially, no file is selected
            f1: null,
            f2: null,
            f3: null,
            f4: null,
            b64content: ''
        };
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }


    // On file select (from the pop up)
    onFileChange = event => {

        this.getBase64(event.target.files[0]).then(
            data => this.setState({ f1: data })
          );
        // Update the state
        

        //can call the merge method, and set the b64content of merged media into state.  
    };

    onFileChange2 = event => {

        this.getBase64(event.target.files[0]).then(
            data => this.setState({ f2: data })
          );
        // Update the state
        

        //can call the merge method, and set the b64content of merged media into state.  
    };

    onFileChange3 = event => {

        // Update the state
        this.setState({ f2: event.target.files[0] });

        //can call the merge method, and set the b64content of merged media into state.  
    };

    // On file upload (click the upload button)
    onFileUpload2 = () => {
        debugger;
        var images = [this.state.f1, this.state.f2];


        var jimps = [];

        //Read the images and push the promises into the jimps array 
        for (var i = 0; i < images.length; i++) {
            jimps.push(Jimp.read(images[i]));
        }

        var me = this;

        //Merge two images
        Promise.all(jimps).then(function (data) {
            return Promise.all(jimps);
        }).then(function (data) {
            data[1]
                .resize(756, 756)
                .quality(90)
                .getBase64(Jimp.MIME_JPEG, function (err, src) {
                    console.log("rb1 is \n")
                    console.log(src);
                    me.setState({ f3: src });

                   })


                   Jimp.read(me.state.f3).then(image => {
                    data[0].composite(image, 150, 50);
                    data[0].getBase64(Jimp.MIME_JPEG, function (err, src) {
                        console.log("rb2 is \n")
                        console.log(src);

                        me.setState({ f4: src });
                    });
                });
        })

    };

    render() {
        return (
            <div className="container">

                <div className="row">
                    <div className="col-md-4">
                        <input type="file" onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload!
                        </button>
                    </div>
                    <div className="col-md-4">
                        <input type="file" onChange={this.onFileChange2} />
                        <button onClick={this.onFileUpload2}>
                            Upload!
                        </button>
                    </div>
                    <div className="col-md-6">
                        <img src={this.state.f4}>
                        </img>
                    </div>
                </div>

            </div>
        );
    }
}

export default MergeImage;