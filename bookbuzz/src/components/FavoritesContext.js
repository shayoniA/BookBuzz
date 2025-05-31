import React, { createContext, useState, useEffect } from 'react';
export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:5000/api/users/favorites/${username}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setFavorites(data))
        .catch(err => console.error('Error fetching favorites:', err));
    } else {
      setFavorites([]);
    }
  }, [username]);

  const addToFavorites = (book) => {
  console.log('Sending book to add-favorite:', book);
  fetch(`http://localhost:5000/api/users/add-favorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, book })
  })
    .then(res => res.json())
    .then(() => {
      fetch(`http://localhost:5000/api/users/favorites/${username}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setFavorites(data));
    })
    .catch(err => console.error('Error adding favorite:', err));
};

  const removeFromFavorites = (book_title) => {
    fetch(`http://localhost:5000/api/users/remove-favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book_title })
    })
      .then(res => res.json())
      .then(() => setFavorites(prev => prev.filter(book => book.book_title !== book_title)))
      .catch(err => console.error('Error removing favorite:', err));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, username, setUsername }}>
      {children}
    </FavoritesContext.Provider>
  );
}