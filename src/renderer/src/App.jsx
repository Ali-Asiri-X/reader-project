import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api").then(response => response.json()).then(data => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {data.length === 0 ? (
        <p>Loading ...</p>
      ) : (
        data.map((item, index) => (
          <div key={index}>
            <p>X: {item.x}</p>
            <p>Y: {item.y}</p>
            <p>Shape Size: {item.shapesize}</p>
            <p>Color: {item.color}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;