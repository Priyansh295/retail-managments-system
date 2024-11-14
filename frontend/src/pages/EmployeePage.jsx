import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../styles/EmployeePage.scss";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { MdTrendingUp, MdDeliveryDining } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EmployeePage = () => {
  const { employee } = useContext(AuthContext); // Access current logged-in employee
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Hardcoded performance data
  const performanceData = [
    { month: "January", count: 40 },
    { month: "February", count: 50 },
    { month: "March", count: 30 },
    { month: "April", count: 60 },
  ];

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employee || !employee.Employee_id) return;

      try {
        const res = await axios.get(`http://localhost:8800/api/employees/${employee.Employee_id}`);
        setEmployeeDetails(res.data);
      } catch (err) {
        setError("Failed to fetch employee details.");
      }
    };

    const fetchOrders = async () => {
      if (!employee || !employee.Employee_id) return;

      try {
        const res = await axios.get(`http://localhost:8800/api/employees/${employee.Employee_id}/orders`);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      }
    };

    fetchEmployeeDetails();
    fetchOrders();
  }, [employee]);

  return (
    <div className="employee-page">
      <header className="employee-header">
        <h1>Employee Dashboard</h1>
      </header>

      <main className="employee-main">
        {/* Employee Profile Section */}
        <div className="card profile-card">
          <h2>
            <FaUserCircle /> Employee Profile
          </h2>
          {employeeDetails ? (
            <>
              <p>
                <strong>ID:</strong> {employeeDetails.Employee_id}
              </p>
              <p>
                <FaEnvelope />
                <strong>Email:</strong> {employeeDetails.Email}
              </p>
              <p>
                <FaPhone />
                <strong>Phone:</strong> {employeeDetails.Phone_no}
              </p>
              <p>
                <FaMapMarkerAlt />
                <strong>Address:</strong> {employeeDetails.Address}
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assigned Orders Section */}
        <div className="card orders-card">
          <h2>
            <MdDeliveryDining /> Assigned Orders
          </h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total Payment</th>
                <th>Shipment Date</th>
              </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.Order_ID}>
                      <td>{order.Order_ID}</td>
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
                      <td>${order.Total_Payment ? parseFloat(order.Total_Payment).toFixed(2) : "N/A"}</td>
                      <td>
                        {order.Shipment_Date ? new Date(order.Shipment_Date).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No orders assigned to this employee.</td>
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
