import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TruncatedInsights from './TruncIns';

const RecentInsights = ({ userId }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    // Fetch all books
    fetch('http://localhost:5000/api/all-books')
      .then(res => res.json())
      .then(data => setAllBooks(data))
      .catch(err => console.error('Error fetching all books:', err));
    }, []);

  // Fetch recent insights
  useEffect(() => {
    if (userId) {
        fetch(`http://localhost:5000/api/insights/recent-insights/${userId}`)
            .then(res => res.json())
            .then(data => setInsights(data))
            .catch(err => console.error('Error fetching recent insights:', err))
            .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) return <p>Loading your recent insights...</p>;

  function removeSubstring(str) {
    const lastColon = str.lastIndexOf(':');
    const lastSpace = str.lastIndexOf(' ');
    if (lastColon !== -1 && lastSpace !== -1 && lastColon < lastSpace)
      return str.slice(0, lastColon) + str.slice(lastSpace);
    return str;
  }

  return (
    <div className="recent-insights">
      <h2 className='recentinsightshead'>Your Recent Insights</h2>
      <hr className='recinshr'/>
      {insights.length === 0 ? (
        <p className='noins'>You haven't added any insights yet.</p>
      ) : (
        <ul className='recinslist'>
          {insights.map(insight => {
            const book = allBooks.find(b => b.book_title === insight.bookId);
            return (
              <li key={insight._id} className='eachrecins'>
                {book && (<img src={book.image} alt={book.book_title} className='eachrecinsimg'/>)}
                <div className='eachrecinsinfo'>
                  {book ? <p className='eachrecinsbooktitle'>{book.book_title}</p> : <p className='eachrecinsbooktitle'>Unknown Book</p>}
                  <p className='recinscontent'><TruncatedInsights text={insight.content}/></p>
                  <p><strong className='strongrecins'>Upvotes: </strong>{insight.upvotes}</p>
                  <p><strong className='strongrecins'>Created at: </strong>{removeSubstring(new Date(insight.createdAt).toLocaleString())}</p>
                  <Link to={`/book/${encodeURIComponent(book?.book_title || 'unknown')}`}><p className='openbookfromrecins'>Open this book</p></Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentInsights;