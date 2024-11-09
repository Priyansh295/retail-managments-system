import db from "./db.js";

const fetchSummary = (req, res) => {
    const query1 = "SELECT COUNT(DISTINCT Client_ID) FROM Orders";
    const query2 = "SELECT COUNT(Product_ID) FROM Product";
    const query3 = "SELECT COUNT(Order_ID) FROM Orders WHERE Status = 'In Progress'";
    const query4 = "SELECT COUNT(Order_ID) FROM Orders WHERE Status = 'Complete' OR Orders.Status = 'Shipped'";
    const query5 = "SELECT COUNT(Order_ID) FROM Orders";
    const query6 = "SELECT COUNT(*) FROM Supplier";
    const query7 = "SELECT COUNT(*) FROM Supplier_Orders WHERE Status = 'In Progress'";
    const query8 = "SELECT SUM(Quantity) FROM Order_Line JOIN Orders WHERE Orders.Order_ID = Order_Line.Order_ID \
    AND (Orders.Status = 'Complete' OR Orders.Status = 'Shipped')";
    const query9 = "SELECT COUNT(*) FROM Employee";

    const executeQuery = (query) => {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    Promise.all([
        executeQuery(query1),
        executeQuery(query2),
        executeQuery(query3),
        executeQuery(query4),
        executeQuery(query5),
        executeQuery(query6),
        executeQuery(query7),
        executeQuery(query8),
        executeQuery(query9),
    ])
    .then((results) => {
        const responseData = {
            countClients: results[0][0]['COUNT(DISTINCT Client_ID)'],
            countProducts: results[1][0]['COUNT(Product_ID)'],
            countInProgressOrders: results[2][0]['COUNT(Order_ID)'],
            countCompletedAndShippedOrders: results[3][0]['COUNT(Order_ID)'],
            countAllOrders: results[4][0]['COUNT(Order_ID)'],
            countSuppliers: results[5][0]['COUNT(*)'],
            countInProgressSupplierOrders: results[6][0]['COUNT(*)'],
            sumCompletedAndShippedOrdersQuantity: results[7][0]['SUM(Quantity)'],
            countEmployees: results[8][0]['COUNT(*)'],
        };
        res.json(responseData);
    })
    .catch((error) => {
        console.error("Error executing queries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    });
};

export default fetchSummary;
