import React, { useState } from 'react';

const TruncatedText = ({ text }) => {
  const maxChars = 350;
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  if (text.length <= maxChars)
    return <p>{text}</p>;

  return (
    <p>
      {isTruncated ? (
        <>
          {text.slice(0, maxChars)}...{' '}
          <span onClick={toggleTruncate} style={{ color: '#ffb999', cursor: 'pointer', textDecoration: 'underline' }}>Read more</span>
        </>
      ) : (
        <>
          {text}{' '}
          <span onClick={toggleTruncate} style={{ color: '#ffb999', cursor: 'pointer', textDecoration: 'underline' }}>Read less</span>
        </>
      )}
    </p>
  );
};

export default TruncatedText;