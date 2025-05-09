
import React, { useEffect, useState } from 'react';
import api from '../api';
import MatchTypeDropdown from './MatchTypeDropdown';
import NegListDropdown from './NegListDropdown';

export default function SearchTermTable() {
  const [terms, setTerms] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const termRes = await api.get('/search-terms');
      const listRes = await api.get('/negative-lists');
      setTerms(termRes.data);
      setLists(listRes.data);
    }
    fetchData();
  }, []);

  const handleApply = async (term, matchType, listId) => {
    await api.post('/apply-negatives', {
      searchTerm: term,
      matchType,
      negativeListId: listId,
    });
    alert(`Applied ${term} as ${matchType} to list ${listId}`);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Search Term</th>
          <th>Clicks</th>
          <th>CTR</th>
          <th>Cost</th>
          <th>Match Type</th>
          <th>Neg List</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {terms.map((row, i) => (
          <tr key={i}>
            <td>{row.searchTerm}</td>
            <td>{row.clicks}</td>
            <td>{row.ctr}%</td>
            <td>{row.cost}</td>
            <td>
              <MatchTypeDropdown onChange={(val) => row._match = val} />
            </td>
            <td>
              <NegListDropdown lists={lists} onChange={(val) => row._list = val} />
            </td>
            <td>
              <button onClick={() => handleApply(row.searchTerm, row._match, row._list)}>
                Apply
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
