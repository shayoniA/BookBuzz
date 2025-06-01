import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function FavoritesPage() {
  const { userId } = useParams();
  console.log(userId);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`https://bookbuzz.onrender.com/api/users/${userId}/favorites`)
      .then(response => response.json())
      .then(data => {
        // Reverse the favorites array before setting state
        const reversedData = data.slice().reverse();
        setFavorites(reversedData);
      })
      .catch(error => console.error('Error fetching favorites:', error));
  }, [userId]);

  const handleRemoveFavorite = async (bookTitle) => {
    const username = localStorage.getItem('username');
    try {
      const response = await fetch('https://bookbuzz.onrender.com/api/users/remove-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, book_title: bookTitle }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Book removed from favorites.');
        // Update local state to reflect removal
        setFavorites(prev => prev.filter(book => book.book_title !== bookTitle));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing favorite.');
    }
  };


  return (
    <div>
      <h1 className='favoriteshead'>Favorites</h1>
      <hr className='favoriteshr'/>
      {favorites.length === 0 ? (
        <p className='nofav'>No favorites yet!</p>
      ) : (
        <ul className='favbookslist'>
          {favorites.map(book => (
            <li key={book.id} className='eachfavbook'>
              <img src={book.image} alt={book.book_title} className='eachfavbookimg'/>
              <div className='eachfavbookinfo'>
                <p className='eachrecinsbooktitle'>{book.book_title}</p>
                <p><strong className='strongfavs'>Author: </strong>{book.author.replace(/[\[\]']/g, "")}</p>
                <p><strong className='strongfavs'>Genre: </strong>{book.categories}</p>
                <Link to={`/book/${encodeURIComponent(book.book_title)}`}><p className='openbookfromfav'>Open this book</p></Link>
              </div>
              <button onClick={() => handleRemoveFavorite(book.book_title)} className='removefavbtn'>X</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesPage;