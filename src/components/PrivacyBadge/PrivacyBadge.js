// Made by Chris Cohen
// <PrivacyBadge service="facebook"/>

import axios from 'axios';
import { useEffect, useState } from 'react';

import a from './privacy_badges/a.png';
import b from './privacy_badges/b.png';
import c from './privacy_badges/c.png';
import d from './privacy_badges/d.png';
import e from './privacy_badges/e.png';
import none from './privacy_badges/false.png';


export default function PrivacyBadge(props) {

  const [siteId, setSiteId] = useState(props.account.site.name);
  const [grade, setGrade] = useState('Loading...')

  useEffect(() => {
    (async () => {
      try {
        const siteUrl = new URL(props.account.site.urlMain || props.account.site.url || props.account.site.urlProbe);
        const baseDomain = siteUrl.hostname.split('.').slice(-2).join('.');

        // Query the loosely documented ElasticSearch API
        // https://docs.tosdr.org/pages/viewpage.action?pageId=1572892
        // Could also use the v2 API, but it matches on less fields (can't search by URL)
        // https://docs.tosdr.org/pages/viewpage.action?pageId=360490
        // Example responses:
        //  v1: https://api.tosdr.org/v1/service/facebook.json
        //  v2: https://api.tosdr.org/search/v2/?query=facebook
        //  v3: https://api.tosdr.org/search/v3/?query=facebook.com
        const apiUrl = `https://api.tosdr.org/search/v3/?query=${baseDomain}`;

        const response = await axios.get(apiUrl);

        let chosen;
        for (const hit of response.data.parameters?.services?.hits) {
          // Break immediately if we encounter a reviewed site
          if (hit._source?.is_comprehensively_reviewed) {
            chosen = hit;
            break;
          }

          // Best shot might be something that's not deleted
          // Fall through to the last one
          if (hit._source?.status === null) {
            chosen = hit;
          }
        }

        const info = chosen?._source;
        if (info) {
          setSiteId(prev => info.id || chosen._id || prev);
          setGrade(info.rating || 'N/A');
        } else {
          throw new Error('Could not process API response. Format may have changed.');
        }
      } catch(e) {
        console.debug('ToSDR API call failed:');
        console.debug(e);

        // Leave state at the default values
        setGrade('N/A');
      }
    })();
  }, [props.account.site.url, props.account.site.urlMain, props.account.site.urlProbe]);

  return (
    <>
      {/* <a href={`https://tosdr.org/en/service/${siteId}`} target="_blank" rel="noreferrer">{grade}</a> */}
      {getLogo(`https://tosdr.org/en/service/${siteId}`, grade.toLowerCase())}
    </>
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
    return <a href={serviceUrl} title="No Privacy Rating Yet" target="_blank" rel="noreferrer"><img src={none} alt="No Privacy Rating Yet" /></a>
  }
}
