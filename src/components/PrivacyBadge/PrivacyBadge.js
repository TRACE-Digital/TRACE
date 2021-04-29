// Made by Chris Cohen
// <PrivacyBadge site={SiteObject}/>

import { privacyRatings } from 'trace-search'

import a from './privacy_badges/a.png';
import b from './privacy_badges/b.png';
import c from './privacy_badges/c.png';
import d from './privacy_badges/d.png';
import e from './privacy_badges/e.png';
import none from './privacy_badges/false.png';

export default function PrivacyBadge(props) {
  return (
    <>
      {getLogo(`https://tosdr.org/en/service/${props.account.site.name}`, getPrivacyRating(props.account))}
    </>
  );
}

const getPrivacyRating = (account) => {
  let rating = "none";

  try {
    rating = privacyRatings[account.site.name]["privacyRating"]
  } catch (e) {
    rating = "none"
  }

  return rating;
}

const getLogo = (serviceUrl, grade) => {
  if (grade === "A") {
    return <a href={serviceUrl} title="Privacy Rating A" target="_blank" rel="noreferrer"><img src={a} alt="Privacy Rating A" /></a>
  }
  else if (grade === "B") {
    return <a href={serviceUrl} title="Privacy Rating B" target="_blank" rel="noreferrer"><img src={b} alt="Privacy Rating B" /></a>
  }
  else if (grade === "C") {
    return <a href={serviceUrl} title="Privacy Rating C" target="_blank" rel="noreferrer"><img src={c} alt="Privacy Rating C" /></a>
  }
  else if (grade === "D") {
    return <a href={serviceUrl} title="Privacy Rating D" target="_blank" rel="noreferrer"><img src={d} alt="Privacy Rating D" /></a>
  }
  else if (grade === "E") {
    return <a href={serviceUrl} title="Privacy Rating E" target="_blank" rel="noreferrer"><img src={e} alt="Privacy Rating E" /></a>
  }
  else {
    return <a href={serviceUrl} title="No Privacy Rating Yet" target="_blank" rel="noreferrer"><img src={none} alt="No Privacy Rating Yet" /></a>
  }
}
