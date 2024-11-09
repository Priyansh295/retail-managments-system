import db from "./db.js"

export const fetch_stats_category = (req, res) => {
    const query = `
    SELECT
      p.Category,
      SUM(ol.Quantity) AS ProductsSold
    FROM
      Order_Line ol
    JOIN
      Product p ON ol.Product_ID = p.Product_ID
    GROUP BY
      p.Category;
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error('Error fetching product categories:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(data);
  });
}

export const fetch_stats_client_order = (req, res) => {
    const query = `
    SELECT client_id, COUNT(order_id) AS total_orders
    FROM orders
    GROUP BY client_id
    ORDER BY total_orders;
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error('Error fetching orders clients:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(data);
  });
}

export const fetch_stats_client_product = (req, res) => {
    const query = `
    select client_id,count(product_id) AS total_products
    from orders 
    join order_line ON orders.order_id = order_line.order_id
    group by client_id 
    order by count(product_id);
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error('Error fetching orders clients:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(data);
  });
}

export const fetch_stats_products_date = (req, res) => {
    const query = `
    SELECT DATE(SUBSTRING_INDEX(Order_ID, '_', -1)) AS OrderDate, 
       SUM(Quantity) AS TotalQuantity
    FROM order_line
    GROUP BY OrderDate
    ORDER BY OrderDate;
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error('Error fetching orders clients:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(data);
  });
}

export const fetch_stats_most_category = (req, res) => {
  const query = `
  SELECT
    c.Client_ID,
    c.Client_Name,
    p.Category,
    SUM(ol.Quantity) AS TotalQuantity
FROM
    Client c
    LEFT JOIN Orders o ON c.Client_ID = o.Client_ID
    LEFT JOIN Order_Line ol ON o.Order_ID = ol.Order_ID
    LEFT JOIN Product p ON ol.Product_ID = p.Product_ID
WHERE
    p.Category IS NOT NULL
GROUP BY
    c.Client_ID,
    c.Client_Name,
    p.Category
HAVING
    SUM(ol.Quantity) = (
        SELECT
            MAX(TotalQuantityInner)
        FROM (
            SELECT
                SUM(ol_inner.Quantity) AS TotalQuantityInner
            FROM
                Orders o_inner
                LEFT JOIN Order_Line ol_inner ON o_inner.Order_ID = ol_inner.Order_ID
                LEFT JOIN Product p_inner ON ol_inner.Product_ID = p_inner.Product_ID
                LEFT JOIN Client c_inner ON o_inner.Client_ID = c_inner.Client_ID 
            WHERE
                c.Client_ID = o_inner.Client_ID
            GROUP BY
                p_inner.Category
        ) AS InnerQuery
    );
`;

db.query(query, (err, data) => {
  if (err) {
    console.error('Error fetching product categories:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json(data);
});
}


export const fetch_stats_monthly_products = (req, res) => {
  const query = `
  SELECT
    DATE_FORMAT(Orders.Order_Placement_Date, '%M') AS Month,
    SUM(Order_Line.Quantity) AS TotalQuantity
FROM
    Orders
    JOIN Order_Line ON Orders.Order_ID = Order_Line.Order_ID
GROUP BY
    Month
ORDER BY
    Month;
`;

db.query(query, (err, data) => {
  if (err) {
    console.error('Error fetching orders clients:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json(data);
});
}

export const fetch_stats_category_details = (req, res) => {
  const query = `
  SELECT
    c.Client_ID,
    c.Client_Name,
    p.Category,
    SUM(ol.Quantity) AS TotalQuantity
FROM
    Client c
    LEFT JOIN Orders o ON c.Client_ID = o.Client_ID
    LEFT JOIN Order_Line ol ON o.Order_ID = ol.Order_ID
    LEFT JOIN Product p ON ol.Product_ID = p.Product_ID
WHERE
    p.Category IS NOT NULL
GROUP BY
    c.Client_ID,
    c.Client_Name,
    p.Category
HAVING
    SUM(ol.Quantity) = (
        SELECT
            MAX(TotalQuantityInner)
        FROM (
            SELECT
                SUM(ol_inner.Quantity) AS TotalQuantityInner
            FROM
                Orders o_inner
                LEFT JOIN Order_Line ol_inner ON o_inner.Order_ID = ol_inner.Order_ID
                LEFT JOIN Product p_inner ON ol_inner.Product_ID = p_inner.Product_ID
                LEFT JOIN Client c_inner ON o_inner.Client_ID = c_inner.Client_ID 
            WHERE
                p.Category = p_inner.Category
            GROUP BY
                c_inner.Client_ID
        ) AS InnerQuery
    );

`;

db.query(query, (err, data) => {
  if (err) {
    console.error('Error fetching product categories:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json(data);
});
}


export const fetch_stats_no_orders = (req, res) => {
  const query = `
  SELECT
  c.Client_ID,
  c.Client_Name,
  c.Email,
  c.phone_no
    FROM
      Client c
    WHERE
      NOT EXISTS (
          SELECT 1
          FROM Orders o
          WHERE o.Client_ID = c.Client_ID
  );

`;

db.query(query, (err, data) => {
  if (err) {
    console.error('Error fetching product categories:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json(data);
});
}

export const fetch_stats_most_products = (req, res) => {
  const query = `
  SELECT
    p.Product_ID,
    p.Product_Name,
    COUNT(DISTINCT o.Client_ID) AS NumberOfClients
FROM
    Product p
    JOIN Order_Line ol ON p.Product_ID = ol.Product_ID
    JOIN Orders o ON ol.Order_ID = o.Order_ID
GROUP BY
    p.Product_ID,
    p.Product_Name
ORDER BY
    NumberOfClients DESC;
`;

db.query(query, (err, data) => {
  if (err) {
    console.error('Error fetching product categories:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.json(data);
});
}