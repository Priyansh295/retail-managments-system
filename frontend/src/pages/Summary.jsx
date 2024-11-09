import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "../styles/Summary.scss"

const Summary = () => {

    const [summaryStats, setSummaryStats] = useState([]);
    useEffect(() => {
        fetchSummaryStats();
    }, []);
    const fetchSummaryStats = async () => {
        try {
            const res = await axios.get("http://localhost:8800/summarystats");
            setSummaryStats(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='Summary'>
            <h1 className='SummaryTitle'>Summary</h1>
            <div className='SummaryOrders' id = "Ord">
                    <span className='StatLabel'>Total Orders</span>
                    <span className='StatValue'>{summaryStats.countAllOrders}</span>
                    <div className='OrderDetails'>
                        <div className='det'>
                            <span className='SubStatLabel'>Completed Orders</span>
                            <span className='SubStatValue'>{summaryStats.countCompletedAndShippedOrders}</span>
                        </div>
                        <div className='det'>
                            <span className='SubStatLabel'>Orders In Progress</span>
                            <span className='SubStatValue'>{summaryStats.countInProgressOrders}</span>
                        </div>
                    </div>
            </div>
            <div className='SummaryStats'>
                <div className='SummaryStatItem' id = "Prod">
                    <span className='StatLabel'>Total Products Sold</span>
                    <span className='StatValue'>{summaryStats.sumCompletedAndShippedOrdersQuantity}</span>
                </div>
                <div className='SummaryStatItem' id = "Client">
                    <span className='StatLabel'>Clients Catered To</span>
                    <span className='StatValue'>{summaryStats.countClients}</span>
                </div>
                <div className='SummaryStatItem' id = "Supplier">
                    <span className='StatLabel'>Suppliers</span>
                    <span className='StatValue'>{summaryStats.countSuppliers}</span>
                </div>
                <div className='SummaryStatItem' id = "SupOrd">
                    <span className='StatLabel'>Suppliers Orders</span>
                    <span className='StatValue'>{summaryStats.countInProgressSupplierOrders}</span>
                </div>
                <div className='SummaryStatItem' id  = "Emp">
                    <span className='StatLabel'>Employees</span>
                    <span className='StatValue'>{summaryStats.countEmployees}</span>
                </div>
            </div>
        </div>
    );
}

export default Summary