import { customer } from '../utils/adsClient.js';

const postApplyNegatives = async (req, res) => {
  const { searchTerm, matchType, negativeListId } = req.body;

  // Validate input
  if (!searchTerm || !matchType || !negativeListId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Match type normalization
    const matchTypeFormatted = matchType.toUpperCase();
    if (!['BROAD', 'PHRASE', 'EXACT'].includes(matchTypeFormatted)) {
      return res.status(400).json({ error: "Invalid match type." });
    }

    const operations = [
      {
        create: {
          sharedSet: `customers/${customer.cid}/sharedSets/${negativeListId}`,
          keyword: {
            text: searchTerm,
            matchType: matchTypeFormatted
          }
        }
      }
    ];

    const response = await customer.sharedCriteria.create(operations);

    res.json({
      message: "Negative keyword successfully added.",
      details: response
    });
  } catch (error) {
    console.error("Error applying negative keyword:", error.message);
    res.status(500).json({ error: "Failed to apply negative keyword." });
  }
};

export default postApplyNegatives;

