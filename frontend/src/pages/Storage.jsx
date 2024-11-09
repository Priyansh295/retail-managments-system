import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/Storage.scss';
import { StoreModal, StoreAddModal } from './StorageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Storage = () => {
  const { admin } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [err, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/stores`);
      setStores(res.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Failed to fetch stores. Please try again.');
    }
  };

  const handleAdd = () => {
    setMsg(null);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (store) => {
    try {
      const res = await axios.delete(`http://localhost:8800/stores/${store.Store_id}`);
      fetchStores();
      setMsg(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data);
    }
  };

  const openUpdateModal = (store) => {
    setMsg(null);
    setSelectedStore(store);
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStore(null);
    setIsUpdateModalOpen(false);
    setIsAddModalOpen(false);
    fetchStores();
  };

  if (!admin) return null;

  return (
    <div className='store_container'>
      <h1>Storage Management</h1>
      <div className="store-table">
        <button className="add-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Add Store
        </button>
        {err && <p className="error-message">{err}</p>}
        {msg && <p className="success-message">{msg}</p>}
        <table>
          <thead>
            <tr>
              <th>Store ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Park No</th>
              <th>Block No</th>
              <th>Threshold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.Store_id}>
                <td>{store.Store_id}</td>
                <td>{store.Product_ID}</td>
                <td>{store.Quantity}</td>
                <td>{store.Park_no}</td>
                <td>{store.Block_no}</td>
                <td>{store.Threshold}</td>
                <td className='store-buttons'>
                  <button className="update-button" onClick={() => openUpdateModal(store)}>
                    <FontAwesomeIcon icon={faPencilAlt} /> Update
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(store)}>
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isUpdateModalOpen && (
          <StoreModal isOpen={isUpdateModalOpen} onClose={closeModal} store={selectedStore} />
        )}
        {isAddModalOpen && (
          <StoreAddModal isOpen={isAddModalOpen} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Storage;