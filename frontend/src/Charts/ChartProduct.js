import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BarChart = () => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/productDetails');
        const categories = response.data;
        setCategory(categories);
        console.log(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Run the effect only once when the component mounts

  return (
    <div className='supplier_orders_container'>
      <h2>Popular Products</h2>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Number Of Clients</th>
            </tr>
          </thead>
          <tbody>
            {category?.map((category, index) => (
              <tr key={index}>
                <td>{category.Product_ID}</td>
                <td>{category.Product_Name}</td>
                <td>{category.NumberOfClients}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BarChart;
