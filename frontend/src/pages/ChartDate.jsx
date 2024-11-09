import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
// import { Link } from 'react-router-dom';
import "../styles/Statistics.scss"
import LineChartProduct from '../Charts/LineChartProduct';
import Monthly from '../Charts/MonthlyChart';
import Product from '../Charts/ChartProduct';
const Statistics = () => {
    const {admin} = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState([])
    function handleClick(e) {
      const buttonName = e.target.name;
      setSelectedOption(buttonName);
    }
    const renderSelectedComponent = () => {
      switch (selectedOption) {
        case 'Date':
          return <LineChartProduct/>
        case 'Monthly':
          return <Monthly/>
        case 'Most':
          return <Product/>
        default:
          return null;
      }
    }
    useEffect( () => {
      setSelectedOption('Date');
    },[])
    if (admin) {
    return (
      <div className='chart-container'>
          <div className='options'>
            <div className='buttons'>
              <button name = "Date" onClick={handleClick}>Day Sales</button>
              <button name = "Monthly" onClick={handleClick}>Monthly Sales</button>
              <button name = "Most" onClick={handleClick}>Ordered Most</button>
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