
import React, { memo, useEffect, useState } from 'react';

const ListItem = memo(({ item }) => {
  console.log('Rendering ListItem:', item);
  return <div>{item}</div>;
});

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStreamData = async () => {
      const response = await fetch('http://localhost:5000/stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let count = 0;
      while (true) {
        const { done, value } = await reader.read();
        count+=1;
        if (done){
          console.log('done reading the stream');
          return;
        }
  
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        setData((p) => [...p, decoder.decode(value, { stream: true })]);
      }
    };

    fetchStreamData();

  }, []);

  return (
    <div>
      <h1>Streamed Data</h1>
      <h2>{data.length}</h2>
      {data.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
    </div>
  );
};

export default App;