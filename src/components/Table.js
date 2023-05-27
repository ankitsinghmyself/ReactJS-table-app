import React, { useEffect, useState } from 'react';
const Table = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json'
        );
        const jsonData = await response.json();

        // Aggregate data based on category, recipe ID, and name
        const aggregatedData = jsonData.reduce((result, item) => {
          const key = `${item['id']}|${item['category']}|${item['name']}`;

          if (!result[key]) {
            result[key] = { ...item, priceEditable: item.price };
          }

          return result;
        }, {});

        const sortedData = Object.values(aggregatedData).sort((a, b) => {
          // Sort by Price (numeric comparison)
          if (a.priceEditable < b.priceEditable) return -1;
          if (a.priceEditable > b.priceEditable) return 1;

          // If Prices are equal, sort by Name (string comparison)
          return a.name.localeCompare(b.name);
        });

        setData(sortedData);
        setOriginalData(JSON.parse(JSON.stringify(sortedData)));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePriceChange = (event, index) => {
    const newData = [...data];
    newData[index].priceEditable = event.target.value;
    setData(newData);
  };

  const handleSave = () => {
    setOriginalData(JSON.parse(JSON.stringify(data)));
  };

  const handleReset = () => {
    setData(JSON.parse(JSON.stringify(originalData)));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item['id']}</td>
              <td>{item['category']}</td>
              <td>{item['name']}</td>
              <td>
                <input
                  type="text"
                  value={item.priceEditable}
                  onChange={(event) => handlePriceChange(event, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Table;
