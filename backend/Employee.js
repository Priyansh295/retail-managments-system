// Get Employee Profile
export const get_employee_profile = (req, res) => {
    const employee_id = req.params.id;
    const query = 'SELECT * FROM Employee WHERE Employee_ID = ?';
    db.query(query, [employee_id], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!data.length) {
        return res.status(404).json('Employee not found');
      }
      return res.json(data[0]);  // Send the employee profile data
    });
  };
  
  // Get Deliveries
  export const get_employee_deliveries = (req, res) => {
    const query = 'SELECT * FROM Deliveries WHERE Employee_ID = ?';
    db.query(query, [req.params.employeeId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json(data);  // Send the deliveries data
    });
  };
  
  // Get Performance Data
  export const get_performance_data = (req, res) => {
    const query = 'SELECT * FROM Performance WHERE Employee_ID = ?';
    db.query(query, [req.params.employeeId], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json(data);  // Send the performance data
    });
  };
  