import React, { useState } from 'react';

const TruncatedInsights = ({ text }) => {
  const maxChars = 150;
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
          <span onClick={toggleTruncate} style={{ color: '#058589', cursor: 'pointer', textDecoration: 'underline' }}>Read more</span>
        </>
      ) : (
        <>
          {text}{' '}
          <span onClick={toggleTruncate} style={{ color: '#058589', cursor: 'pointer', textDecoration: 'underline' }}>Read less</span>
        </>
      )}
    </p>
  );
};

export default TruncatedInsights;