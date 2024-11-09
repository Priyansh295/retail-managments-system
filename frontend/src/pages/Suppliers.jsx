// Suppliers.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/Suppliers.scss'; // Import your SCSS file
import {SupplierModal, SupplierAddModal} from './SupplierModal'; // Import the SupplierModal component

const Suppliers = () => {
  const { admin } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for the add modal

  useEffect(() => {
    fetchSuppliers();
  }, []);
  const [err, setError] = useState([])
  const [msg, setMsg] = useState([])
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/suppliers`);
      setSuppliers(res.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleAdd = () => {
    setMsg(null)
    setIsAddModalOpen(true);
  };

  const handleDelete = async (supplier) => {
    try {
      const Supplier_id = supplier.Supplier_id;
      console.log(Supplier_id);
      const res = await axios.delete("http://localhost:8800/suppliers/"+Supplier_id)
      console.log(res)
      fetchSuppliers();
      setMsg(res.data)
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  const openUpdateModal = (supplier) => {
    setMsg(null)
    setSelectedSupplier(supplier);
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setIsUpdateModalOpen(false);
    setIsAddModalOpen(false); // Close the add modal
    fetchSuppliers();
  };

  if (admin) {
    return (
      <div className='supplier_container'>
        <h1>Suppliers</h1>
        <div className="supplier-table">
          <button className="add-button" onClick={handleAdd}>
            Add Supplier
          </button>
          {err && <p> {err}</p>}
          {msg && <p> {msg}</p>}
          <table>
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Supplier Name</th>
                <th>Quantity</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Restock Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr className="supplier_row" key={supplier.Supplier_id}>
                  <td>{supplier.Supplier_id}</td>
                  <td>{supplier.Supplier_name}</td>
                  <td>{supplier.Quantity}</td>
                  <td>{supplier.Email}</td>
                  <td>{supplier.Phone_no}</td>
                  <td>{supplier.Address}</td>
                  <td>{supplier.Restock_time}</td>
                  <td className='supplier-buttons'>
                    <button className="update-button" onClick={() => openUpdateModal(supplier)}>
                      Update
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(supplier)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Conditionally render the modals */}
          {isUpdateModalOpen && (
            <SupplierModal isOpen={isUpdateModalOpen} onClose={closeModal} supplier={selectedSupplier} />
          )}
          {isAddModalOpen && (
            <SupplierAddModal isOpen={isAddModalOpen} onClose={closeModal} />
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Suppliers;
