import { customer } from '../utils/adsClient.js';

const getSearchTerms = async (req, res) => {
  try {
    const query = `
      SELECT 
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        ad_group.name,
        segments.keyword.info.text,
        search_term_view.search_term,
        metrics.clicks,
        metrics.impressions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_micros,
        metrics.conversions
      FROM search_term_view
      WHERE 
        campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'SEARCH'
        AND metrics.clicks > 0
        AND segments.date DURING LAST_14_DAYS
    `;

    const stream = await customer.queryStream(query);

    const results = [];

    for await (const row of stream) {
      const microsToDollars = (micros) => (micros / 1_000_000).toFixed(2);

      results.push({
        campaign: row.campaign.name,
        adGroup: row.ad_group.name,
        keyword: row.segments.keyword.info.text || "(none)",
        searchTerm: row.search_term_view.search_term,
        clicks: row.metrics.clicks,
        impressions: row.metrics.impressions,
        ctr: parseFloat(row.metrics.ctr).toFixed(2),
        avgCpc: `$${microsToDollars(row.metrics.average_cpc)}`,
        cost: `$${microsToDollars(row.metrics.cost_micros)}`,
        conversions: row.metrics.conversions
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching search terms:", error.message);
    res.status(500).json({ error: "Failed to fetch search terms." });
  }
};

export default getSearchTerms;
