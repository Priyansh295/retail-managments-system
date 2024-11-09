import db from "./db.js"

export const fetch_supplier_orders = (req, res) => {
    const q = "SELECT s.Supplier_ID, s.Part_ID, so.Quantity, Status, date_time, \
              DATE_ADD(so.date_time, INTERVAL (s.Restock_time * CEIL(so.Quantity/s.Quantity)) DAY) AS res_time \
              FROM Supplier_Orders so JOIN Supplier s ON s.Supplier_ID = so.Supplier_ID";

    db.query(q, [], (err, data) => {
        if(err) {
            console.error('Error fetching Supplier Orders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data);
    })
}

export const update_supplier_order_status = (req, res) => {
    const Supplier_ID = req.params.id;
    console.log(Supplier_ID);
    console.log(req.body)
    const status = req.body[0];
    const date_time = req.body[1];
    const originalDate = new Date(date_time);
    const localDateTime = originalDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const formattedDate = new Date(localDateTime).toISOString().slice(0, 19).replace('T', ' ');

    console.log(localDateTime);
    console.log(date_time, formattedDate)
    const q = "UPDATE Supplier_Orders SET Status = ? WHERE Supplier_ID = ? AND date_time = CONVERT_TZ(?, '+00:00', '+05:30') ";
    db.query(q, [status, Supplier_ID, formattedDate], (err, data) => {
        if(err) {
            console.error('Error fetching Supplier Orders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json('Order Status Updated Successfully.');
    })
}