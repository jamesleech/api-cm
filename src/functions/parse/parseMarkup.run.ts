/* eslint-disable */
// import * as fs from 'fs';
import axios from 'axios';
import { parseMarkup } from './parseMarkup';
import { addCoords } from './addCoords';

const url = 'https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19/current-status/contact-tracing';

// const markup = fs.readFileSync('./sample.html','utf8');

axios.get(url).then((res) => {
  const { sites } = parseMarkup(res.data);
  const result = addCoords(sites);
  const unknown = result.filter(r=> r.data?.suburb==='Unmapped');
  console.log(result.filter(r=> r.data?.suburb==='Unmapped'));
  console.log(`${unknown.length} unmapped entries out of ${result.length}`);
});
