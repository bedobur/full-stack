import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{display: "flex", flexWrap: "wrap", justifyContent: "right"}}>
      <input className='form-control'
        style={{width: "50%"}}
        type="text"
        placeholder="Aid Title"
        name="description" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button className='btn pull-xs-right' type="submit">Search</button>
    </form>
  );
  
}

export default SearchBar;
