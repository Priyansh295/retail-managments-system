import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {ShowMonthlyModal} from './AddModal'

const LineChart = () => {
    const [data, setData] = useState(null);
    const [product, setProduct] = useState(null);
    const [isUpdate, setUpdate] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8800/products/monthly');
          const categories = response.data;
          setProduct(categories);
          console.log(categories)
  
          const chartData = {
            labels: categories.map((category) => category.Month),
            datasets: [
              {
                label: 'Monthly Products Sold',
                data: categories.map((category) => category?.TotalQuantity || 0),
                borderColor: 'black',
                borderWidth: 3,
              },
            ],
          };
  
          const chartOptions = {
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Month',
                  fontSize: 16,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total Quantity Sold',
                  fontSize: 16,
                },
              },
            },
            legend: {
              labels: {
                fontSize: 26,
              },
            },
          };
  
          setData({ chartData, chartOptions });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); // Run the effect only once when the component mounts
  
    if (!data) {
      // Data is still loading
      return <div>Loading...</div>;
    }
  
    const handleUpdate = () => {
      setUpdate(true);
    };
  
    const closeModal = () => {
      setUpdate(false);
    };
  
    return (
      <div className='chart'>
        <div>
          <Line data={data.chartData} options={data.chartOptions} height={500} width={1000} />
        </div>
        <button className="add-button" onClick={handleUpdate}>
          Show Details
        </button>
        {isUpdate && (
          <ShowMonthlyModal isOpen={isUpdate} onClose={closeModal} categoryDetails={product} />
        )}
      </div>
    );
  };
  
  export default LineChart;
  