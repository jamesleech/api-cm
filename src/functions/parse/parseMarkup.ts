import * as cheerio from 'cheerio';
import { Site } from '@models/Site';
import { DateTime } from 'luxon';
import Log from '@dazn/lambda-powertools-logger';

export const parseMarkup = (markup: string, latestAdded?: string): { sites: Site[]; newLatestAdded: string | undefined } => {
  const places = cheerio.load(markup, null, false);
  const tables = places('.qh-table-wide');
  // find the qld table
  const qldTable = tables.filter((_, table) => !!table.attribs.id?.startsWith('qld'));

  if (qldTable.length !== 1) {
    Log.error('couldn\'t find qld table of sites');
  }

  const tidyDataString = (dataString: string | undefined): string => decodeURIComponent(dataString || '').trim();

  // we have the qldTable
  // get all the tr's within tbody
  const rows = places('table tbody', qldTable);

  const sites: Site[] = [];

  // only get newly added sites
  const addAfter = latestAdded ? DateTime.fromISO(latestAdded) : DateTime.fromISO('2000-01-01');

  let old = 0;
  let newLatestAdded = latestAdded || '2000-01-01';
  rows.children().each((_, child) => {
    const added = tidyDataString(child.attribs['data-added']);
    if (DateTime.fromISO(added) > addAfter) {
      newLatestAdded = added > newLatestAdded ? added : newLatestAdded;
      sites.push({
        date: tidyDataString(child.attribs['data-date']),
        lgas: tidyDataString(child.attribs['data-lgas']),
        advice: tidyDataString(child.attribs['data-advice']),
        location: tidyDataString(child.attribs['data-location']),
        address: tidyDataString(child.attribs['data-address']),
        suburb: tidyDataString(child.attribs['data-suburb']),
        dateText: tidyDataString(child.attribs['data-datetext']),
        timeText: tidyDataString(child.attribs['data-timetext']),
        added: tidyDataString(child.attribs['data-added']),
      });
    } else {
      old += 1;
    }
  });

  Log.info(`ignored ${old} previously loaded sites`);

  return {
    sites,
    newLatestAdded,
  };
};
