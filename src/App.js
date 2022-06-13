import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import RouterURLs from "./RouterURLs";
import './styles/App.css'

class App extends Component {
    render() {
        return (
            <div id='overallContent'>
                <BrowserRouter>
                    <h1 id='title'>Fit Scale</h1>
                    <div id='mainContent'>
                        <Navbar />
                        <div id='scaleContent'>
                            <RouterURLs />
                        </div>
                    </div>
                    <h2 id='subTitle'>Reach Your Fitness Goals</h2>
                </BrowserRouter>
            </div>
        )
    }
}

export default App; 