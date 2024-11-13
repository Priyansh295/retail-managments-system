import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/EmployeePage.scss";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { MdTrendingUp, MdDeliveryDining } from "react-icons/md";

const EmployeePage = ({ employeeId = "E0004" }) => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Hardcoded performance data
  const performanceData = [
    { month: "January", count: 40 },
    { month: "February", count: 60 },
    { month: "March", count: 50 },
    { month: "April", count: 70 },
    { month: "May", count: 65 },
    { month: "June", count: 55 },
  ];

  // Fetch Employee Profile
  const fetchEmployeeInfo = async () => {
    try {
      setErr("");
      const response = await axios.get(`http://localhost:8800/api/employees/${employeeId}`);
      setEmployeeInfo(response.data);
      setMsg("Employee data fetched successfully!");
    } catch (error) {
      console.error("Error fetching employee info:", error);
      setErr("Failed to fetch employee details. Please try again.");
    }
  };

  // Fetch Orders Assigned to Employee
  const fetchEmployeeOrders = async () => {
    try {
      setErr("");
      const response = await axios.get(`http://localhost:8800/api/employees/${employeeId}/orders`);
      setOrders(response.data);
      setMsg("Orders fetched successfully!");
    } catch (error) {
      console.error("Error fetching employee orders:", error);
      setErr("Failed to fetch employee orders. Please try again.");
    }
  };

  useEffect(() => {
    fetchEmployeeInfo();
    fetchEmployeeOrders();
  }, [employeeId]);

  return (
    <div className="employee-page">
      {/* Header */}
      <header className="employee-header">
        <h1>Employee Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="employee-main">
        {/* Employee Profile Section */}
        <div className="card profile-card">
          <h2>
            <FaUserCircle /> Employee Profile
          </h2>
          {employeeInfo ? (
            <>
              <p>
                <FaUserCircle />
                <strong>Employee ID:</strong> {employeeInfo.Employee_id}
              </p>
              <p>
                <FaEnvelope />
                <strong>Email:</strong> {employeeInfo.Email}
              </p>
              <p>
                <FaPhone />
                <strong>Phone:</strong> {employeeInfo.Phone_no}
              </p>
              <p>
                <FaMapMarkerAlt />
                <strong>Address:</strong> {employeeInfo.Address}
              </p>
            </>
          ) : (
            <p>Loading employee details...</p>
          )}
        </div>

        {/* Performance Chart Section */}
        <div className="card chart-card">
          <h2>
            <MdTrendingUp /> Delivery Performance
          </h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4caf50" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Section */}
        <div className="card deliveries-card">
          <h2>
            <MdDeliveryDining /> Assigned Orders
          </h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client ID</th>
                <th>Total Payment</th>
                <th>Shipment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.Order_ID}>
                      <td>{order.Order_ID}</td>
                      <td>{order.Client_ID}</td>
                      <td>${order.Total_Payment ? parseFloat(order.Total_Payment).toFixed(2) : "N/A"}</td>
                      <td>{order.Shipment_Date ? new Date(order.Shipment_Date).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.Status === "In Progress"
                              ? "status-pending"
                              : order.Status === "Shipped"
                              ? "status-shipped"
                              : order.Status === "Complete"
                              ? "status-complete"
                              : "status-cancelled"
                          }`}
                        >
                          {order.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders assigned to this employee.</td>
                  </tr>
                )}
              </tbody>
              
          </table>
        </div>
      </main>
    </div>
  );
};

export default EmployeePage;
