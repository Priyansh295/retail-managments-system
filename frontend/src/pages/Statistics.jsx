import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
// import { Link } from 'react-router-dom';
import "../styles/Statistics.scss"
import Category from './ChartCategory';
import Client from "./ChartClient"
import Date from "./ChartDate"
import "../styles/Chart.scss"
import Summary from './Summary';

const Statistics = () => {
    const {admin} = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState([])
    function handleClick(e) {
      const buttonName = e.target.name;
      setSelectedOption(buttonName);
    }
    useEffect(()=> {
      setSelectedOption('Summary');
    }, [])
    const renderSelectedComponent = () => {
      switch (selectedOption) {
        case 'Summary':
          return <Summary/>
        case 'Category':
          return <Category/>;
        case 'Client':
          return <Client/>
        case 'Date':
          return <Date/>
        // Add other cases for different components
        default:
          return null;
      }
    }
    if (admin) {
    return (
      <div className='statistic_container'>
          <span className='division'></span>
          {/* <h1>Dashboard</h1> */}
          {/* <span className='division'></span> */}
          <div className='options'>
            <div className='buttons'>
              <button name = "Summary" onClick={handleClick}>Summary</button>
              <button name = "Category" onClick={handleClick}>Category</button>
              <button name = "Client" onClick={handleClick}>Client</button>
              <button name = "Date" onClick={handleClick}>Product</button>
            </div>
            <div className='populate-stats'>
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