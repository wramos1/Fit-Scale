import React, { Component } from "react";
import fitScaleApi from "../apis/fitScaleApi";

class BMI extends Component {
    state = {
        weight: '',
        height: '',
        bmi: '',
        health: '',
        hasSubmitted: false,
        filled: false
    };

    componentDidUpdate() {
        this.buttonActivator();
    }

    buttonActivator() {
        if (this.state.weight.length !== 0 && this.state.height.length !== 0) {
            document.querySelector('button').classList.add('activated');
        }
        else if (this.state.weight.length === 0 || this.state.height.length === 0) {
            document.querySelector('button').classList.remove('activated');
        }
    };

    onFormSubmit = async (e) => {
        e.preventDefault();
        await this.getMeasurements();
        this.calculateBMI();
    };

    getMeasurements() {
        const weightType = document.querySelector('#weightSelector').value;
        const heightType = document.querySelector('#heightSelector').value;


        const { weight, height } = this.state

        if (weightType === 'lb') {
            this.setState({ weight: weight / 2.2 });
        }
        if (heightType === 'in') {
            this.setState({ height: height * 2.54 });
        }
    };


    calculateBMI = async () => {
        const response = await fitScaleApi.get('/bmi', {
            params: {
                weight: this.state.weight,
                height: this.state.height,
            }
        });
        const { bmi, health } = response.data.info;
        this.setState({
            bmi,
            health,
            hasSubmitted: true
        })

        this.displayBMI();
    };

    restartToggle = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');
        const weightType = document.querySelector('#weightSelector').value;
        const heightType = document.querySelector('#heightSelector').value;

        const { weight, height } = this.state

        if (weightType === 'lb') {
            this.setState({ weight: weight * 2.2 });
        }
        if (heightType === 'in') {
            this.setState({ height: height / 2.54 });
        }

        this.setState({ hasSubmitted: false });

        form.classList.toggle('hide');
        results.classList.toggle('show');
    }

    displayBMI = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');

        if (this.state.hasSubmitted === false) {
            return null;
        };

        form.classList.toggle('hide');
        results.classList.toggle('show');

        return (
            <div>
                <h1>{`BMI: ${this.state.bmi}`}</h1>
                <h1>{this.state.health}</h1>
                <button className='activated' onClick={this.restartToggle}>Calculate Again</button>
            </div>
        );
    };

    render() {
        return (
            <div>

                <div className='titleAndSummaries'>
                    <h3>Body Mass Index(BMI)</h3>
                    <p>Body Mass Index (BMI) is a person's weight in kilograms (or pounds) divided by the square of height in meters (or feet). A high BMI can indicate high body fatness.
                        BMI screens for weight categories that may lead to health problems, but it does not diagnose the body fatness or health of an individual.
                    </p>
                </div>

                <div className='infoForms'>
                    <form onSubmit={this.onFormSubmit}>

                        <h4>Weight</h4>
                        <div>
                            <input
                                type='text'
                                placeholder='Enter Weight'
                                onChange={e => this.setState({ weight: e.target.value })}
                                required
                            />

                            <select id='weightSelector'>
                                <option value='kg'>Kg</option>
                                <option value='lb'>Lbs</option>
                            </select>
                        </div>

                        <h4>Height</h4>
                        <div>
                            <input
                                type='text'
                                placeholder='Enter Height'
                                onChange={e => this.setState({ height: e.target.value })}
                                required
                            />

                            <select id='heightSelector'>
                                <option value='cm'>Cm</option>
                                <option value='in'>In</option>
                            </select>
                        </div>

                        <button type='submit' onSubmit={this.onFormSubmit}>Calculate</button>
                    </form>
                </div>

                <div className='results'>
                    {this.displayBMI()}
                </div>

            </div>
        )
    };
};

export default BMI;