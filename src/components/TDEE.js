import React, { Component } from "react";
import fitScaleApi from "../apis/fitScaleApi";

class TDEE extends Component {
    state = {
        weight: '',
        height: '',
        age: '0',
        gender: 'male',
        activityLevel: 'se',
        tdee: '',
        hasSubmitted: false
    };

    componentDidUpdate() {
        this.buttonActivator();
        this.ageFormulator();
    };

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
        }
    };

    onFormSubmit = async (e) => {
        e.preventDefault();
        await this.getMeasurements();
        this.calculateTdee();
    };

    getMeasurements() {
        const weightType = document.querySelector('#weightSelector').value;
        const heightType = document.querySelector('#heightSelector').value;

        const { weight, height } = this.state;

        if (weightType === 'lb') {
            this.setState({ weight: weight / 2.2 });
        }
        if (heightType === 'in') {
            this.setState({ height: height * 2.54 });
        }
    };


    calculateTdee = async () => {
        const response = await fitScaleApi.get('/tdee', {
            params: {
                weight: this.state.weight,
                height: this.state.height,
                age: this.state.age,
                gender: this.state.gender,
                activitylevel: this.state.activityLevel
            }
        });

        const { tdee } = response.data.info;
        this.setState({ tdee, hasSubmitted: true });

        this.displayTdee();
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

        this.setState({ hasSubmitted: false });

        form.classList.toggle('hide');
        results.classList.toggle('show');
    };

    displayTdee = () => {
        const form = document.querySelector('.infoForms');
        const results = document.querySelector('.results');

        if (this.state.hasSubmitted === false) {
            return null;
        }

        form.classList.toggle('hide');
        results.classList.toggle('show');

        return (
            <div>
                <h1>{`TDEE: ${Math.ceil(this.state.tdee)} Calories`}</h1>

                <div id='tdeeCaloricMeasures'>
                    <div>

                        <h2>Caloric Surplus</h2>
                        <p>You would need to eat around {`${Math.ceil(this.state.tdee)}`} to
                            {`${Math.ceil(this.state.tdee) + 200} Calories`} to gain weight.
                        </p>

                    </div>

                    <div>

                        <h2>Caloric Deficit</h2>
                        <p>You would need to eat around {`${Math.ceil(this.state.tdee) - 200}`} to
                            {`${Math.ceil(this.state.tdee)} Calories`} to lose weight.
                        </p>

                    </div>
                </div>

                <button className='activated' onClick={this.restartToggle}>Calculate Again</button>
            </div>
        )
    };



    render() {
        return (
            <div>
                <div className='titleAndSummaries'>
                    <h3>Total Daily Energy Expenditure</h3>
                    <p>TDEE is an estimate of how many calories you burn through your bodily functions and physical activity in a day.
                        Calculating your TDEE not only gives you an idea of if you are moving around enough,
                        but it also could impact your weight management plans, too, because it creates an estimate of your current calorie burn.
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


                        <h4>Activity Level</h4>
                        <div>
                            <select onChange={e => this.setState({ activityLevel: e.target.value })}>
                                <option value='se'>Sedentary</option>
                                <option value='la'>Lightly Active</option>
                                <option value='ma'>Moderately Active</option>
                                <option value='va'>Very Active</option>
                            </select>
                        </div>

                        <button type='submit' onSubmit={this.onFormSubmit}>Calculate</button>
                    </form>

                </div>

                <div className='results'>
                    {this.displayTdee()}
                </div>

            </div>
        )
    };
};

export default TDEE;