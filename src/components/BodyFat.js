import React, { Component } from "react";
import fitScaleApi from "../apis/fitScaleApi";

class BodyFat extends Component {
    state = {
        weight: '',
        height: '',
        age: '',
        gender: 'male',
        health: '',
        bfp: '',
        hasSubmitted: false
    };

    componentDidUpdate() {
        this.buttonActivator();
        this.ageFormulator();
    }

    buttonActivator() {
        if (this.state.weight.length !== 0 && this.state.height.length !== 0) {
            document.querySelector('button').classList.add('activated');
        } else if (this.state.weight.length === 0 || this.state.height.length === 0) {
            document.querySelector('button').classList.remove('activated');
        }
    };

    ageFormulator() {
        const selectAge = document.querySelector('#ageSelector');
        for (let i = 0; i < 100; i++) {
            const age = document.createElement('option');
            age.text = [i];
            age.setAttribute('value', [i]);
            selectAge.appendChild(age);
        };
    };

    onFormSubmit = async (e) => {
        e.preventDefault();
        await this.getMeasurements();
        this.calculateBodyFat();
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


    calculateBodyFat = async () => {
        const response = await fitScaleApi.get('/bfp', {
            params: {
                weight: this.state.weight,
                height: this.state.height,
                age: this.state.age,
                gender: this.state.gender
            }
        });
        const { bfp, description } = response.data.info;

        this.setState({
            bfp,
            health: description,
            hasSubmitted: true
        })

        this.displayBodyFat();
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
    };

    displayBodyFat = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');

        if (this.state.hasSubmitted === false) {
            return null;
        }

        form.classList.toggle('hide');
        results.classList.toggle('show');

        return (
            <div>
                <h1>{`Body Fat: ${Math.ceil(this.state.bfp)}%`}</h1>
                <h1>{this.state.health}</h1>

                <button className='activated' onClick={this.restartToggle}>Calculate Again</button>
            </div>
        )
    };



    render() {
        return (
            <div>
                <div className='titleAndSummaries'>
                    <h3>Body Fat Percentage</h3>
                    <p>Body fat percentage is not the same as Body Mass Index (BMI),
                        which is often used as an indicator of your overall health based on your height and weight and doesn’t take your total body composition into account.
                        Body fat percentage is the percent of fat that makes up your total body weight.
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

                        <h4>Gender & Age</h4>
                        <div>
                            <select onChange={e => this.setState({ gender: e.target.value })}>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </select>

                            <select id='ageSelector' onChange={e => this.setState({ age: e.target.value })} required>
                                <option value=''>Age</option>
                            </select>
                        </div>

                        <button type='submit' onSubmit={this.onFormSubmit}>Calculate</button>
                    </form>

                </div>

                <div className='results'>
                    {this.displayBodyFat()}
                </div>

            </div>
        )
    };
};

export default BodyFat;