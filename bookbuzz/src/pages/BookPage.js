import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../components/FavoritesContext';
import TruncText from './TruncText';

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [insights, setInsights] = useState([]);
  const [newInsight, setNewInsight] = useState('');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const { favorites, addToFavorites } = useContext(FavoritesContext);

  useEffect(() => {
    fetch('https://bookbuzz.onrender.com/api/all-books')
      .then(res => res.json())
      .then(data => {
        const foundBook = data.find(b => b.book_title === id);
        setBook(foundBook);
      })
      .catch(err => console.error('Error fetching book data:', err));
  }, [id]);

  useEffect(() => {
    if (book) {
      fetch(`https://bookbuzz.onrender.com/api/insights/get-insights/${book.book_title}`)
        .then(res => res.json())
        .then(data => setInsights(data))
        .catch(err => console.error('Error fetching insights:', err));
    }
  }, [book]);

  const handleAddInsight = async () => {
    if (!newInsight.trim()) return alert('Insight cannot be empty');
    if (newInsight.length > 1000) return alert('Insight too long');

    try {
      const response = await fetch('https://bookbuzz.onrender.com/api/insights/add-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.book_title, userId, username, content: newInsight })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Insight added');
        setInsights([data.insight, ...insights]);
        setNewInsight('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding insight');
    }
  };

  const handleUpvote = async (insightId) => {
    try {
      const response = await fetch('https://bookbuzz.onrender.com/api/insights/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insightId, userId })
      });
      const data = await response.json();
      if (response.ok) {
        setInsights(prev => prev.map(i => i._id === insightId ? { ...i, upvotes: i.upvotes + 1 } : i));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error upvoting');
    }
  };

  if (!book) return <p className='bookpageloading'>Loading...</p>;
  const isFavorite = favorites.some(fav => fav.book_title === book.book_title);

  return (
    <div>
      <div className='bookpagebooktotalinfodiv'>
      <div className='bookpagebookinfodiv'>
        <h2 className='bookpagebooktitle'>{book.book_title}</h2>
        <p><strong className='bookpagestrong'>Author:&nbsp;&nbsp;&nbsp;</strong>{book.author}</p>
        <p><strong className='bookpagestrong'>Genre:&nbsp;&nbsp;&nbsp;</strong>{book.categories}</p>
        <p><strong className='bookpagestrong'>Rating:&nbsp;&nbsp;&nbsp;</strong>{book.currentScore}</p>
        <p className='bookpagebookdesc'><strong className='bookpagestrong'>About the book:&nbsp;&nbsp;&nbsp;</strong>{book.description || 'No description available.'}</p>
        <button onClick={() => isFavorite ? navigate(`/${userId}/favorites`) : addToFavorites(book)} className='bookpageaddfavbtn'>
          {isFavorite ? 'Go To Favorites' : 'Add to Favorites'}
        </button>
      </div>
      <img src={book.image || 'https://via.placeholder.com/150'} alt={book.book_title} className='bookpagebookimg'/>
      </div>

      {/* Insights Section */}
      <div>
        <h3 className='bookpageinsightshead'>Insights</h3>
        <hr className='bookpageinsightshr'/>
        {insights.length === 0 ? <p className='bookpagenoins'>No insights yet.</p> : insights.map(insight => (
          <div key={insight._id} className='eachinsight'>
            <p className='insightwhosays'><strong className='bookpagestrong'>{insight.username}</strong>&nbsp;&nbsp;says:</p>
            <p className='insightcontent'><TruncText text={insight.content} /></p>
            <p className='insighthowmanyupvotes'>{insight.upvotes} upvotes</p>
            {insight.userId !== userId && (<button onClick={() => handleUpvote(insight._id)} className='upvotebtn'>Upvote</button>)}
          </div>
        ))}
      </div>

      {/* Add Insight Section */}
      <div className='addinsdiv'>
        <h3 className='addinshead'>Write Your Insight</h3>
        <hr className='addinshr'/>
        <textarea value={newInsight} onChange={e => setNewInsight(e.target.value)} maxLength={1000} rows={4} cols={50} />
        <br/>
        <button onClick={handleAddInsight} className='submitinsbtn'>Submit Insight</button>
      </div>
    </div>
  );
}

export default BookPage;