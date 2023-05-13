import React, { useState } from 'react';
import './app.css';
export default function App() {
  const [keyword, setKeyword] = useState('');

  const [ads, setAds] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/search?keyword=${keyword}`);
      const data = await response.json();
      console.log(data)
      setAds(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter keyword" onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div className="grid">
        {ads.map((ad) => (
          <div key={ad._id} className="ad-card">
            <img src={ad.imageUrl} alt={ad.company_name} />
            <h3><a href={ad.url}>{ad.company_name}</a></h3>
            <span>{ad.CTA}</span>

          </div>
        ))}
      </div>
    </div>
  );
};

