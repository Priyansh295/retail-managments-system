import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import '../styles/EmployeePage.scss';

const EmployeePage = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);

  // Hardcoded performance data
  const performanceData = [
    { month: "January", count: 10 },
    { month: "February", count: 15 },
    { month: "March", count: 12 },
    { month: "April", count: 20 },
    { month: "May", count: 18 },
    { month: "June", count: 25 },
    { month: "July", count: 30 },
    { month: "August", count: 28 },
    { month: "September", count: 22 },
    { month: "October", count: 35 },
    { month: "November", count: 40 },
    { month: "December", count: 45 },
  ];

  // Hardcoded deliveries
  const deliveries = [
    {
      Order_ID: "ORD001",
      Client_Name: "John Doe",
      Delivery_Address: "123 Main Street, Cityville",
      Status: "In Transit",
    },
    {
      Order_ID: "ORD002",
      Client_Name: "Jane Smith",
      Delivery_Address: "456 Elm Street, Townsville",
      Status: "Delivered",
    },
    {
      Order_ID: "ORD003",
      Client_Name: "Tom Johnson",
      Delivery_Address: "789 Oak Avenue, Villagetown",
      Status: "Pending",
    },
  ];

  useEffect(() => {
    // Replace `E0001` with the actual employee ID you want to fetch
    const fetchEmployeeInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/employees/E0001" // Replace with actual backend endpoint
        );
        setEmployeeInfo(response.data);
      } catch (error) {
        console.error("Error fetching employee info:", error);
      }
    };

    fetchEmployeeInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Profile Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
          {employeeInfo ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p>
                <strong>ID:</strong> {employeeInfo.Employee_id}
              </p>
              <p>
                <strong>Name:</strong> {employeeInfo.Employee_name}
              </p>
              <p>
                <strong>Email:</strong> {employeeInfo.Email}
              </p>
              <p>
                <strong>Phone:</strong> {employeeInfo.Phone_no}
              </p>
              <p>
                <strong>Address:</strong> {employeeInfo.Address}
              </p>
            </div>
          ) : (
            <p>Loading employee details...</p>
          )}
        </section>

        {/* Performance Chart Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Monthly Performance
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Delivery List Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Pending Deliveries
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {deliveries.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Client</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2">{delivery.Order_ID}</td>
                      <td className="px-4 py-2">{delivery.Client_Name}</td>
                      <td className="px-4 py-2">{delivery.Delivery_Address}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            delivery.Status === "Delivered"
                              ? "bg-green-500"
                              : delivery.Status === "In Transit"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {delivery.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending deliveries</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeePage;
