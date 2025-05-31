import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecentInsights from '../components/RecentInsights';
import './styles.css';
import logo from '../Screenshot 2025-05-30 120746.png';
import TruncatedText from './TruncatedText';

function Dashboard() {
  const [topBooks, setTopBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  console.log(userId);

  useEffect(() => {
    // Fetch top books
    fetch('http://localhost:5000/api/top-books')
      .then(res => res.json())
      .then(data => setTopBooks(data))
      .catch(err => console.error('Error fetching top books:', err));

    // Fetch all books for search and recommendations
    fetch('http://localhost:5000/api/all-books')
      .then(res => res.json())
      .then(data => setAllBooks(data))
      .catch(err => console.error('Error fetching all books:', err));

    if (userId) {
      fetch(`http://localhost:5000/api/users/${userId}/favorites`)
        .then(res => res.json())
        .then(data => setFavorites(data))
        .catch(err => console.error('Error fetching favorites:', err));
    }
  }, [userId]);


  useEffect(() => {
    if (favorites.length > 0) {
      const favoriteTitles = favorites.map(fav => fav.book_title);
      fetch('http://localhost:5001/api/recommend-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_titles: favoriteTitles }),
      })
        .then(res => res.json())
        .then(data => setRecommendedBooks(data))
        .catch(err => console.error('Error fetching recommended books:', err));
    } else {
      setRecommendedBooks([]);
    }
  }, [favorites]);


  // Filter allBooks based on searchTerm
  const filteredBooks = allBooks.filter(book => {
    const term = searchTerm.toLowerCase();
    return (
      (book.book_title && book.book_title.toLowerCase().includes(term)) ||
      (book.author && book.author.toLowerCase().includes(term)) ||
      (book.categories && book.categories.toLowerCase().includes(term))
    );
  })
  .sort((a, b) => parseFloat(b.currentScore) - parseFloat(a.currentScore))  // sort descending
  .slice(0, 4);  // get top 4


  return (
    <div>
      <div className='navdashboard'></div>
      <img src={logo} alt='Logo' className='logo'/>
      <button onClick={() => navigate(`/${userId}/favorites`)} className='favbtndashboard'><img className='favbtnimagedashboard' src='https://static-00.iconduck.com/assets.00/heart-circle-icon-256x256-zqul2psr.png'/></button>

      <input className='searchbar'
        type="text" placeholder="Search by title, author, or categories" value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Search results */}
      {searchTerm && (
        filteredBooks.length > 0 ? (
          <div className="searchbookslist">
            {filteredBooks.map((book, index) => (
              <Link to={`/book/${encodeURIComponent(book.book_title)}`} key={index} className="eachsearchbook">
                <img src={book.image || 'https://via.placeholder.com/150'} alt={book.book_title} className='eachsearchbookimg' />
                <div className='eachsearchbookinfo'>
                  {/* <h3 className='eachsearchbooktitle'>{book.book_title}</h3> */}
                  <h3 className='eachsearchbooktitle'><TruncatedText text={book.book_title}/></h3>
                  <p><strong className='searchstrong'>Author: </strong>{book.author.replace(/[\[\]']/g, "")}</p>
                  <p className='lastlineeachseachbook'><strong className='searchstrong'>Genre: </strong>{book.categories}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className='nosearch'>No books found.</p>
        )
      )}

      {/* Top 10 books */}
      <h2 className='topbookshead'>Top 10 Books</h2>
      <hr className='topbookshr'/>
      {topBooks.length > 0 ? (
        <div className="topbooksgrid">
          {topBooks.map((book, index) => (
            <Link to={`/book/${encodeURIComponent(book.book_title)}`} key={index} className="topbookscard">
              <div className='eachtopbook'>
                <img src={book.image || 'https://via.placeholder.com/150'} alt={book.book_title} className='eachtopbookimg'/>
                <div className='eachtopbookinfo'>
                  <h3 className='eachtopbooktitle'>{book.book_title}</h3>
                  <p><strong>Author:</strong> {book.author.replace(/[\[\]']/g, "")}</p>
                  <p><strong>Rating:</strong> {book.currentScore}</p>
                  <p><strong>Genre:</strong> {book.categories}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='topbooksloading'>Loading books...</p>
      )}

      <h2 className='recbookshead'>Recommended Books</h2>
      <hr className='recbookshr'/>
      {recommendedBooks.length === 0 ? (
        <p className='norec'>No recommendations yet. Add favorites to get personalized suggestions!</p>
      ) : (
        <ul className='recbooksgrid'>
          {recommendedBooks.map(rec => {
            const book = allBooks.find(b => b.book_title === rec.book_title);
            return (
              <Link to={`/book/${encodeURIComponent(rec.book_title)}`} key={rec.id} className='recbookscard'>
                <div className='eachrecbook'>
                  {book && (<img src={book.image} alt={book.book_title} className='eachrecbookimg'/>)}
                  {/* {book ? <p className='eachrecinsbooktitle'>{book.book_title}</p> : <p className='eachrecinsbooktitle'>Unknown Book</p>} */}
                  <div className='eachrecbookinfo'>
                    <h3 className='eachrecbooktitle'>{rec.book_title}</h3>
                    <p><strong>Author:</strong> {rec.author.replace(/[\[\]']/g, "")}</p>
                    <p><strong>Rating:</strong> {rec.currentScore}</p>
                    <p><strong>Genre:</strong> {rec.categories}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </ul>
      )}
      
      <RecentInsights userId={userId} />
    </div>
  );
}

export default Dashboard;