
export default function MatchTypeDropdown({ onChange }) {
  return (
    <select onChange={(e) => onChange(e.target.value)}>
      <option value="phrase">Phrase</option>
      <option value="exact">Exact</option>
      <option value="broad">Broad</option>
    </select>
  );
}
