import React, { memo, useEffect, useState } from 'react';
import './App.css';

const ListItem = memo(({ item, isTyping }) => {
  console.log('Rendering ListItem:', item);
  return (
    <div className={isTyping ? 'typing-effect' : ''}>{item}</div>
  );
});

const App = () => {
  const [data, setData] = useState([]);
  const [typingIndex, setTypingIndex] = useState(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      const response = await fetch('http://localhost:5000/stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let count = 0;
      while (true) {
        const { done, value } = await reader.read();
        count += 1;
        if (done) {
          console.log('done reading the stream');
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData((prevData) => [...prevData, decoder.decode(value, { stream: true })]);
        setTypingIndex(count); 
      }
    };

    fetchStreamData();
  }, []);

  useEffect(() => {
    if (typingIndex !== null) {
      const timer = setTimeout(() => {
        setTypingIndex(null);
      }, 2000); // The duration should match the typing animation duration in CSS

      return () => clearTimeout(timer);
    }
  }, [typingIndex]);

  return (
    <div>
      <h1>Streamed Data</h1>
      <h2>{data.length}</h2>
      {data.map((item, index) => (
        <ListItem key={index} item={item} isTyping={index === typingIndex} />
      ))}
    </div>
  );
};

export default App;
