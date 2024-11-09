import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import '../styles/ClientUpdate.scss'; // Import the CSS file
import { ChangePasswordModal, AddAdminModal} from './AdminModal';

const NavbarAdmin = () => {
  const { admin } = useContext(AuthContext);
  const [clientDetails, setClientDetails] = useState(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
        console.log("hello",admin)
      try {
        const res = await axios.get(`http://localhost:8800/admin/${admin.Admin_ID}`);
        setClientDetails(res.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    if (admin) {
      fetchClientDetails();
    }
  }, [admin]);

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const openAddAdminModal = () => {
    setIsAddAdminModalOpen(true);
  };

  const closeModal = () => {
    setIsChangePasswordModalOpen(false);
    window.location.reload();
  };

  return (
    <div className='client-update'>
    <div className="client-container">
      
      <h2>Admin Details</h2>
      {admin && clientDetails && clientDetails.length > 0 ? (
        <div>
          <p><strong>Admin ID:</strong> {clientDetails[0].Admin_ID}</p>
          <button className="change-password-button" onClick={openChangePasswordModal}>
            Change Password
          </button>
          <button className="addAdmin" onClick={openAddAdminModal}>Add Admin</button>
          {isChangePasswordModalOpen && (
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={closeModal} />
          )}
          {isAddAdminModalOpen && (
            <AddAdminModal isOpen={isAddAdminModalOpen} onClose={closeModal} />
          )}
        </div>
      ) : (
        <p>Loading client details...</p>
      )}
    </div>
    </div>
  );  
};

export default NavbarAdmin;

