-- The category which the client bought the most
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


-- For each category which client has bought most
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
        -- Return Max
        SELECT
            MAX(TotalQuantityInner)
        FROM (
            -- Return For one category all the quantity which a client have boought it.
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

-- Clients who have not ordered yet
SELECT
    c.Client_Name,
    c.Email
FROM
    Client c
WHERE
    NOT EXISTS (
        SELECT 1
        FROM Orders o
        WHERE o.Client_ID = c.Client_ID
    );