import { customer } from '../utils/adsClient.js';

const getNegativeLists = async (req, res) => {
  try {
    const query = `
      SELECT
        shared_criterion.keyword.text,
        shared_set.id,
        shared_set.name,
        shared_set.status
      FROM shared_criterion
      WHERE shared_set.type = 'NEGATIVE_KEYWORDS'
    `;

    const results = new Map();

    const stream = await customer.queryStream(query);

    for await (const row of stream) {
      const listId = row.shared_set.id;
      const listName = row.shared_set.name;

      if (!results.has(listId)) {
        results.set(listId, {
          id: listId,
          name: listName,
          keywords: []
        });
      }

      results.get(listId).keywords.push(row.shared_criterion.keyword.text);
    }

    // Flatten and return the lists
    const lists = Array.from(results.values()).map(list => ({
      id: list.id,
      name: list.name,
      keywordCount: list.keywords.length
    }));

    res.json(lists);
  } catch (error) {
    console.error("Error fetching negative keyword lists:", error.message);
    res.status(500).json({ error: "Failed to fetch negative keyword lists." });
  }
};

export default getNegativeLists;

