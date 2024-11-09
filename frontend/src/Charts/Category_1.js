import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BarChart = () => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/categoryDetails');
        const categories = response.data;
        setCategory(categories);
        console.log("hello",categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Run the effect only once when the component mounts

  return (
    <div className='supplier_orders_container'>
      <h2>List clients who have ordered the maximum quantity of products in each category</h2>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Category</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {category?.map((category, index) => (
              <tr key={index}>
                <td>{category.Client_ID}</td>
                <td>{category.Client_Name}</td>
                <td>{category.Category}</td>
                <td>{category.TotalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BarChart;
