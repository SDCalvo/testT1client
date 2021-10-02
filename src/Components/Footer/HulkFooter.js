import React from "react";

export default function HulkFooter() {

    return (
        <div 
            className="container-fluid py-4"
            style={{ backgroundColor: "#212529" }}
        >
            <div className="row">
                <div className="col-md-12 text-white d-flex justify-content-between px-5 align-items-center">
                    <p className="m-0" style={{ fontSize: '1rem'}}>© 2021 Copyright Text</p>
                    <p className="m-0" style={{ fontSize: '1rem'}}>Challenge para T1 de Santiago Calvo</p>
                </div>
            </div>
        </div>
    );
}