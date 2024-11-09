import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/ClientUpdate.scss';
import { ClientModal, ChangePasswordModal } from './ClientModal';
import { FiEdit2, FiLock } from 'react-icons/fi';

const ClientUpdate = () => {
  const { currentUser } = useContext(AuthContext);
  const [clientDetails, setClientDetails] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/client/${currentUser.Client_ID}`);
        setClientDetails(res.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    if (currentUser) {
      fetchClientDetails();
    }
  }, [currentUser]);

  const openUpdateModal = (client) => {
    setSelectedClient(client);
    setIsUpdateModalOpen(true);
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsUpdateModalOpen(false);
    setIsChangePasswordModalOpen(false);
    window.location.reload();
  };

  return (
    <div className='client-update'>
      <div className="client-container">
        <h2 className='update-title'>Your Profile</h2>
        {clientDetails ? (
          <div className="client-details">
            <div className="detail-row">
              <span className="detail-label">Client ID:</span>
              <span className="detail-value">{clientDetails[0].Client_ID}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{clientDetails[0].Client_Name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{clientDetails[0].Email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{clientDetails[0].phone_no}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">City:</span>
              <span className="detail-value">{clientDetails[0].City}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">PIN Code:</span>
              <span className="detail-value">{clientDetails[0].PINCODE}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Building:</span>
              <span className="detail-value">{clientDetails[0].Building}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Floor:</span>
              <span className="detail-value">{clientDetails[0].Floor_no}</span>
            </div>
            <div className="button-group">
              <button className="update-button" onClick={() => openUpdateModal(clientDetails[0])}>
                <FiEdit2 /> Update Profile
              </button>
              <button className="change-password-button" onClick={openChangePasswordModal}>
                <FiLock /> Change Password
              </button>
            </div>
          </div>
        ) : (
          <p className="loading-message">Loading your profile details...</p>
        )}
      </div>
      {isUpdateModalOpen && (
        <ClientModal isOpen={isUpdateModalOpen} onClose={closeModal} client={selectedClient} />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default ClientUpdate;