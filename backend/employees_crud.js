import db from "./db.js"

export const update_employee = (req, res) => {
    console.log("here");
    const employee_id = req.params.id
    if (!employee_id || !req.body.Employee_name || !req.body.Email || !req.body.Phone_no || !req.body.Address) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const query = `
    UPDATE Employee
    SET Employee_name=?, Email=?, Phone_no=?, Address=? WHERE Employee_id=?;`;
    const v = [
      req.body.Employee_name,
      req.body.Email,
      req.body.Phone_no,
      req.body.Address,
      employee_id,
    ]
    console.log(employee_id, v);
    db.query(query, v, (err, data) => {
        if (err) {
          console.error('Error updating employee:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Employee Updated successfully.');
        return res.status(200).json('Employee Updated successfully.');
      });
}

export const add_employee = (req, res) => {
    console.log(req.body);
    const employee_id = req.body.Employee_id
    const query = "SELECT * FROM Employee WHERE Employee_id = ?";
    db.query(query, [employee_id], (err, data) => {
      if(err) return res.json(err)
      if(data.length) {
          console.log(data, data.length)
          return res.status(409).json("Employee already exists")
      }
      const q = "INSERT INTO Employee VALUES (?)"
      const v = [
          req.body.Employee_id,
          req.body.Employee_name,
          req.body.Phone_no,
          req.body.Email,
          req.body.Address,
      ]
      console.log(v)
      db.query(q, [v], (err, data) => {
          if(err) return res.json(err);
          return res.status(200).json("Employee has been created.");
      })
    })
}

export const fetch_employees = (req, res) => {
    const get_employees = 'SELECT * from Employee';

    db.query(get_employees, [], (err, data) => {
      if (err)
        return res.json(err);
      res.json(data);
    });
}

export const delete_employee = (req, res) => {
    const del_employee = 'DELETE FROM Employee WHERE Employee_id = ?';
    const employee_id = req.params.id
    db.query(del_employee, [employee_id], (err, data) => {
      if (err) {
        console.log(err)
        return res.json(err);
      }
      return res.json("Employee Deleted Successfully.")
    });
}