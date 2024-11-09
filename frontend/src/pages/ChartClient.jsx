import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
// import { Link } from 'react-router-dom';
import "../styles/Statistics.scss"
import BarChartClient from '../Charts/BarChartClient';
import Chart1 from '../Charts/Chart';
import Chart2 from '../Charts/ChartClient';

const Statistics = () => {
    const {admin} = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState([])
    function handleClick(e) {
      const buttonName = e.target.name;
      setSelectedOption(buttonName);
    }
    const renderSelectedComponent = () => {
      switch (selectedOption) {
        case 'Orders':
          return <BarChartClient/>
        case 'Client_Category':
            return <Chart1/>
        case 'No-orders':
          return <Chart2/>
        // Add other cases for different components
        default:
          return null;
      }
    }
    useEffect( () => {
      setSelectedOption('Orders');
    },[])
    if (admin) {
    return (
      <div className='chart-container'>
          <div className='options'>
            <div className='buttons'>
              <button name = "Orders" onClick={handleClick}>Client</button>
              <button name = "Client_Category" onClick={handleClick}>Most Category</button>
              <button name = "No-orders" onClick={handleClick}>No Orders</button>
            </div>
            <div className='populate'>
            {renderSelectedComponent()}
            </div>
          </div>
      </div>

    )
    } else {
      return (
        <div></div>
      )
    }
}

export default Statistics