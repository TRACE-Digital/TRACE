// Made by Chris Cohen
// <PrivacyBadge service="facebook"/>

import axios from 'axios';
import { useState } from 'react';

import a from './privacy_badges/a.png';
import b from './privacy_badges/b.png';
import c from './privacy_badges/c.png';
import d from './privacy_badges/d.png';
import e from './privacy_badges/e.png';
import none from './privacy_badges/false.png';


export default function PrivacyBadge(props) {
  const [grade, setGrade] = useState("none")

  const serviceUrl = "https://tosdr.org/en/service/" + props.service

  let url = "https://tosdr.org/api/v1/service/" + props.service

  axios.get(url)
    .then(data => {
      setGrade(data.data.class.toLowerCase())
    })
    .catch(() => {
      setGrade("none")
    })
  return (
    getLogo(serviceUrl, grade)
  );
}


const getLogo = (serviceUrl, grade) => {
  if (grade === "a") {
    return <a href={serviceUrl} title="Privacy Rating A" target="_blank" rel="noreferrer"><img src={a} alt="Privacy Rating A" /></a>
  }
  else if (grade === "b") {
    return <a href={serviceUrl} title="Privacy Rating B" target="_blank" rel="noreferrer"><img src={b} alt="Privacy Rating B" /></a>
  }
  else if (grade === "c") {
    return <a href={serviceUrl} title="Privacy Rating C" target="_blank" rel="noreferrer"><img src={c} alt="Privacy Rating C" /></a>
  }
  else if (grade === "d") {
    return <a href={serviceUrl} title="Privacy Rating D" target="_blank" rel="noreferrer"><img src={d} alt="Privacy Rating D" /></a>
  }
  else if (grade === "e") {
    return <a href={serviceUrl} title="Privacy Rating E" target="_blank" rel="noreferrer"><img src={e} alt="Privacy Rating E" /></a>
  }
  else {
    return <img src={none} alt="No Privacy Rating Yet" title="No Privacy Rating Yet"/>
  }
}