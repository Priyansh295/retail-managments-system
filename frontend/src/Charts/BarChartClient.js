import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {ShowClientModal, ShowClientProductModal} from './AddModal'
ChartJS.register(CategoryScale, LinearScale, BarElement);

const BarChart = () => {
  const [data, setData] = useState(null);
  const [product,setProduct] = useState(null);
  const [order,setOrder] =useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdate,setUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the first bar chart
        const response1 = await axios.get('http://localhost:8800/products/clients');
        const clients_product = response1.data;
        setProduct(clients_product)
        console.log("bye",clients_product)
        const chartData1 = {
          labels: clients_product.map((client_prod) => client_prod.client_id),
          datasets: [
            {
              label: 'Products Sold',
              data: clients_product.map((client_prod) => client_prod?.total_products || 0),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderWidth: 1,
            },
          ],
        };

        // Fetch data for the second bar chart
        const response2 = await axios.get('http://localhost:8800/orders/clients');
        const clients = response2.data;
        setOrder(clients)
        const chartData2 = {
          labels: clients.map((client) => client.client_id),
          datasets: [
            {
              label: 'Total Orders',
              data: clients.map((client) => client?.total_orders || 0),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderWidth: 1,
            },
          ],
        };

        setData({ chartData1, chartData2 });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const closeModal = () => {
    setIsAddModalOpen(false);
    setUpdate(false);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleUpdate = () => {
    setUpdate(true);
  };

  if (!data) {
    // Data is still loading
    return <div>Loading...</div>;
  }

  const chartOptions2 = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Client ID', // Set the label for the X-axis
          fontSize: 16,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Orders', // Set the label for the Y-axis
          fontSize: 16,
        },
      },
    },
    legend: {
      labels: {
        fontSize: 16,
      },
    },
  };

  const chartOptions1 = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Client ID', // Set the label for the X-axis
          fontSize: 16,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Products Ordered', // Set the label for the Y-axis
          fontSize: 16,
        },
      },
    },
    legend: {
      labels: {
        fontSize: 16,
      },
    },
  };

  return (
    <div className='chart'>
      <div className='charts' style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '170px' }}>
          <div>
          <Bar data={data.chartData2} options={chartOptions2} height={500} width={500} />
          </div>
          <button className="add-button" onClick={handleAdd}>
            Show Details
          </button>
          {isAddModalOpen && (
            <ShowClientModal isOpen={isAddModalOpen} onClose={closeModal} categoryDetails={order} />
      )}
        </div>
        
        <div style={{ flex: 1 }}>
          <div>
          <Bar data={data.chartData1} options={chartOptions1} height={500} width={500} />
          </div>
          <button className="add-button" onClick={handleUpdate}>
            Show Details
          </button>
          {isUpdate && (
            <ShowClientProductModal isOpen={isUpdate} onClose={closeModal} categoryDetails={product} />
      )}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
