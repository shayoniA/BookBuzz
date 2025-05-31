import React, { useEffect, useRef, useState } from 'react';

const TruncText = ({ text }) => {
  const pRef = useRef(null);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const element = pRef.current;
    let truncatedText = text;

    while (element.scrollWidth > element.clientWidth && truncatedText.length > 0) {
      truncatedText = truncatedText.slice(0, -1);
      element.textContent = truncatedText + '...';
    }

    setDisplayText(truncatedText + (truncatedText.length < text.length ? '...' : ''));
  }, [text]);

  return (
    <p ref={pRef} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {displayText}
    </p>
  );
};

export default TruncText;