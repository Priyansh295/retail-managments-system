import { useEffect, useState } from "react";
import "../styles/AdminOrdersPage.scss"
import SupplierOrders from "./SupplierOrders";
import AdminOrders from "./AdminOrders";

const AdminOrdersPage = () => {
    const [selectedOption, setSelectedOption] = useState([])
    function handleClick(e) {
      const buttonName = e.target.name;
      setSelectedOption(buttonName);
    }
    useEffect( () => {setSelectedOption('ClientOrders');}, [])

    const renderSelectedComponent = () => {
      switch (selectedOption) {
        case 'ClientOrders':
          return <AdminOrders/>;
        case 'SupplierOrders':
          return <SupplierOrders/>;
        default:
          return null;
      }
    }
    return (
        <div className='admin_orders_container'>
          <span className='division'></span>
            <div className='options'>
              <div className='buttons'>
                <button name = "ClientOrders" onClick={handleClick}>Client Orders</button>
                <button name = "SupplierOrders" onClick={handleClick}>Supplier Orders</button>
              </div>
              <div className='populate'>
              {renderSelectedComponent()}
              </div>
            </div>
        </div>
    )
}

export default AdminOrdersPage