import React, { Component } from "react";
import { Link } from "react-router-dom";
import './styles/Navbar.css'

class Navbar extends Component {

    tabSelecting = () => {
        const tabs = document.getElementsByClassName('tab');
        tabs[0].classList.add('active');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', () => {
                const previousSelects = document.getElementsByClassName('active');
                if (previousSelects.length > 0) {
                    previousSelects[0].className = previousSelects[0].className.replace('active', '')
                }
                tabs[i].classList.add('active')
            })
        }
    }

    componentDidMount() {
        this.tabSelecting();
    }

    render() {
        return (
            <div id='navbar'>

                <Link to={(process.env.PUBLIC_URL)} className='tab'>
                    <h3>BMI</h3>
                </Link>

                <Link to='/daily-energy-expenditure' className='tab'>
                    <h3>TDEE</h3>
                </Link>

                <Link to='/ideal-body-weight' className='tab'>
                    <h3>IDEAL BW</h3>
                </Link>

                <Link to='/body-fat' className='tab'>
                    <h3>BF</h3>
                </Link>

            </div>
        )
    }
}

export default Navbar;