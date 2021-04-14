
import React, { Component, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useCookie } from 'react-cookie';
import FoodInfo from './FoodInfo';
import Nutrient from './Nutrient';
import {
S3Client
} from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container, Row, Col, setConfiguration  } from 'react-grid-system';
import ClipLoader from "react-spinners/ClipLoader";

import { API, Storage  } from 'aws-amplify';
import { AWS } from 'aws-sdk';

const UserFileUpload = ({ image }) => {
  let [uploadFile, setUploadFile] = useState("");

  var reader = new FileReader();

  reader.readAsDataURL(image);

  reader.onloadend = function (e) {
      setUploadFile(reader.result);
    }.bind(this);
  return (
    <div><img style={{width:"400px", height:"300px"}} src={uploadFile} alt={image.name} /></div>);
};

const FoodName = ({foodName}) => {
  return (
    <div>
      <p style={{fontWeight: "bold"}}> FoodName: {foodName} </p>
    </div>
  )
}
const NutrientsList = ({nutrients}) => {

  let nutrientsList = nutrients.foodNutrients;
  setConfiguration({ defaultScreenClass: 'xxl', gridColumns: 20 });
  return (
    <div>

    <Container fluid style={{width: "600px"}} >
      {nutrients && <FoodName foodName={nutrients.description} /> }
      <NutrientHeader style={{fontWeight: "bold"}} />
      {nutrients && nutrientsList.map((i,j) => <NutrientFact nutrient={i} /> )}
    </Container>
    </div>
  )
}

const NutrientHeader = () => {
  return (
    <div style={{fontWeight: "bold"}}>
      <Row className="justify-content-md-center" style={{border: "1px solid #e0e0e0"}}>
        <Col md={10}>
          Name
        </Col>
        <Col md={4}>
          Amount
        </Col>
        <Col md={4}>
          Unit
        </Col>
      </Row>
    </div>
  )
}

const NutrientFact = ({nutrient}) => {
  let nutrientName = nutrient.nutrientName.trim();
  // <VariableWidthGrid>{nutrientName} : {nutrient.value} {nutrient.unitName}</VariableWidthGrid>
  return(
    <div>

        <Row className="justify-content-md-center" style={{border: "1px solid #e0e0e0"}}>
          <Col md={10}>
            {nutrientName}
          </Col>
          <Col md={4}>
            {nutrient.value}
          </Col>
          <Col md={4}>
            {nutrient.unitName}
          </Col>
        </Row>


    </div>
  )
}
// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;`;
export default function Uploads() {
  let [file, setFile] = useState("");
  let [nutrient, setNutrients] = useState(null);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  const fetchRecognize = async () => {
    const apiData = await API.get('smartfood', '/smartfood');
    setNutrients(apiData);
  }

  useEffect(() => {
    setLoading(nutrient)
  }, []);



  let handleFileUpload = async (event) => {
    let fileUpload = event.target.files[0];
    setFile(fileUpload);

    try {

      await Storage.put("userUpload.png", fileUpload, {
        contentType: 'image/png' // contentType is optional

      });
      await fetchRecognize();

    } catch (err) {
      console.log('Error uploading file: ', err);
    }

  }


  let onUploadCompleted = () => {
  var reader = new FileReader();
  var url = reader.readAsDataURL(file);
  }
  // {nutrient && nutrient.map(i => <FoodName foodName={i.description} />)}
  // {nutrient && nutrient.map(i => <NutrientsList nutrients={i.foodNutrients}/>) }

  return(
    <div>
      <input type="file" onChange={handleFileUpload}/>
      {file && <UserFileUpload image={file} />}
      {nutrient && nutrient.map(i => <NutrientsList nutrients={i}/>) }


    </div>
  )

};
