import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import BMI from "./components/BMI";
import IdealBodyWeight from "./components/IdealBodyWeight";
import BodyFat from "./components/BodyFat";
import TDEE from "./components/TDEE";

class RouterURLs extends Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<BMI />} />
                <Route path='/ideal-body-weight' element={<IdealBodyWeight />} />
                <Route path='/body-fat' element={<BodyFat />} />
                <Route path='/daily-energy-expenditure' element={<TDEE />} />
            </Routes>
        )
    }
}



export default RouterURLs;