import React, { Component } from 'react';
// import CaloriesInfo from './CaloriesInfo';
import Userlogin from './Userlogin';
import FoodInfo from './FoodInfo';
import Uploads from './Uploads';
import Cookies from 'universal-cookie';




export default class Main extends React.Component {


  render() {
    return (
      <div>
        <h1> Estimate My Daily Intake! </h1>
        <Uploads/>
      </div>
    )
  }
}
