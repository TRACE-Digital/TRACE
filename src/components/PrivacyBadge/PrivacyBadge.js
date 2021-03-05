// Made by Chris Cohen
// <PrivacyBadge service="facebook"/>

import axios from 'axios';
import { useState } from 'react';

function PrivacyBadge(props) {
  const [id, setID] = useState("")

  // GET https://tosdr.org/api/v1/service/<props.service> and parse ID from JSON
  let url = "https://tosdr.org/api/v1/service/" + props.service
  axios.get(url)
    .then(data => setID(data.data.id))

  // Display badge, around which is a link to the ToS;DR webpage for that service
  //       badge    - https://tosdr.org/api/badge/en_<id>.svg
  //       ToS page - https://tosdr.org/en/service/<id>

  let service_url = "https://tosdr.org/en/service/" + id
  let badge = "https://tosdr.org/api/badge/en_" + id + ".svg"

  return (
      <a href={service_url} target="blank" >
        <img src={badge} alt="Privacy Badge"/>
      </a>
  );
}

export default PrivacyBadge;
