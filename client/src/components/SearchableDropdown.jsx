// SearchableDropdown.jsx
/* eslint-disable react/prop-types */
import React, { useState } from "react";

export default function SearchableDropdown({ label, items, displayKey, onSelect }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    setFiltered(
      items.filter((item) =>
        item[displayKey].toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="relative w-full">
      {label && <div className="text-xs text-gray-600 mb-1">{label}</div>}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={`Search ${label || "item"}...`}
        className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {filtered.length > 0 && (
        <ul className="absolute bg-white border rounded-lg w-full mt-1 max-h-40 overflow-y-auto z-10">
          {filtered.map((item) => (
            <li
              key={item._id}
              onClick={() => {
                setQuery(item[displayKey]);
                setFiltered([]);
                onSelect(item);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
