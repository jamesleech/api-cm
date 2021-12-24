import { Site } from '@models/Site';
import { postCodes } from '@functions/parse/suburbPostCode';

export const addCoords = (sites: Site[], state = 'QLD'): Site[] => sites.map((site) => {
  const found = postCodes.find((pc) => pc.state === state && pc.suburb.includes(site.suburb));
  if (found) {
    return {
      ...site,
      data: found,
    };
  }

  const inverse = postCodes.find((pc) => pc.state === state && site.suburb.includes(pc.suburb));
  if (inverse) {
    return {
      ...site,
      data: inverse,
    };
  }

  // centre of QLD
  return {
    ...site,
    data: {
      postcode: '4xxx',
      suburb: 'Unmapped',
      state: 'QLD',
      latitude: -22.970,
      longitude: 145.250,
    },
  };
});
