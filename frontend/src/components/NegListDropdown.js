export default function NegListDropdown({ lists, onChange }) {
  return (
    <select onChange={(e) => onChange(e.target.value)}>
      <option value="">Select List</option>
      {lists.map(list => (
        <option key={list.id} value={list.id}>
          {list.name} ({list.keywordCount})
        </option>
      ))}
    </select>
  );
}

