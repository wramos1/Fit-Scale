import React, { Component } from "react";
import fitScaleApi from "../apis/fitScaleApi";

class IdealBodyWeight extends Component {
    state = {
        weight: '',
        height: '',
        robinson: '',
        miller: '',
        devine: '',
        hamwi: '',
        gender: 'male',
        hasSubmitted: false,
        metricUnit: false
    };

    componentDidUpdate() {
        this.buttonActivator();
    }

    buttonActivator() {
        if (this.state.weight.length !== 0 && this.state.height.length !== 0) {
            document.querySelector('button').classList.add('activated');
        } else if (this.state.weight.length === 0 || this.state.height.length === 0) {
            document.querySelector('button').classList.remove('activated');
        }
    };

    onFormSubmit = async (e) => {
        e.preventDefault();
        await this.getMeasurements();
        this.calculateIdealBW();
    };

    getMeasurements() {
        const weightType = document.querySelector('#weightSelector').value;
        const heightType = document.querySelector('#heightSelector').value;

        const { weight, height } = this.state;

        if (weightType === 'lb') {
            this.setState({
                weight: weight / 2.2,
                metricUnit: true
            });
        }
        if (heightType === 'in') {
            this.setState({ height: height * 2.54 });
        }
    };

    calculateIdealBW = async () => {
        const response = await fitScaleApi.get('/ibw', {
            params: {
                weight: this.state.weight,
                height: this.state.height,
                gender: this.state.gender
            }
        });
        const { robinson, miller, devine, hamwi } = response.data.info

        this.setState({
            robinson,
            miller,
            devine,
            hamwi,
            hasSubmitted: true
        });

        this.displayIdealBW();
    };

    restartToggle = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');
        const weightType = document.querySelector('#weightSelector').value;
        const heightType = document.querySelector('#heightSelector').value;

        const { weight, height } = this.state;

        if (weightType === 'lb') {
            this.setState({ weight: weight * 2.2 });
        }
        if (heightType === 'in') {
            this.setState({ height: height / 2.54 });
        }

        this.setState({
            metricUnit: false,
            hasSubmitted: false
        });

        form.classList.toggle('hide')
        results.classList.toggle('show')
    }

    displayIdealBW = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');

        if (this.state.hasSubmitted === false) {
            return null
        }

        form.classList.toggle('hide');
        results.classList.toggle('show');

        if (this.state.metricUnit === true) {
            return (
                <div>
                    <h1>Ideal Body Weight:</h1>
                    <h1>{`Robinson: ${Math.ceil(this.state.robinson * 2.2)} lbs`}</h1>
                    <h1>{`Miller: ${Math.ceil(this.state.miller * 2.2)} lbs`}</h1>
                    <h1>{`Devine: ${Math.ceil(this.state.devine * 2.2)} lbs`}</h1>
                    <h1>{`Hamwi: ${Math.ceil(this.state.hamwi * 2.2)} lbs`}</h1>

                    <button className='activated' onClick={this.restartToggle}>Calculate Again</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>Ideal Body Weight:</h1>
                    <h1>{`Robinson: ${Math.ceil(this.state.robinson)} kgs`}</h1>
                    <h1>{`Miller: ${Math.ceil(this.state.miller)} kgs`}</h1>
                    <h1>{`Devine: ${Math.ceil(this.state.devine)} kgs`}</h1>
                    <h1>{`Hamwi: ${Math.ceil(this.state.hamwi)} kgs`}</h1>

                    <button className='activated' onClick={this.restartToggle}>Calculate Again</button>
                </div>
            )
        }
    };

    render() {
        return (
            <div>
                <div className='titleAndSummaries'>
                    <h3>Ideal Body Weight</h3>
                    <p>Ideal body weight (IBW) is defined as weight for height at the lowest risk of mortality.
                        This definition results from a century's research on the association between anatomical characteristics and health.
                        Employing weight, height, and frame size, IBW is calculated via height-weight tables.
                        The 4 most famous formulas to calculate ideal body weight are named after the creators: Robinson, Miller, Devine, and Hamwi.
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

                        <h4>Gender</h4>
                        <div>
                            <select onChange={e => this.setState({ gender: e.target.value })}>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </select>
                        </div>

                        <button type='submit' onSubmit={this.onFormSubmit}>Calculate</button>
                    </form>
                </div>

                <div className='results'>
                    {this.displayIdealBW()}
                </div>

            </div>
        )
    };
};

export default IdealBodyWeight;