import db from "./db.js"
import path from 'path';

export const add_product = (req, res) => {
    try {
      const { Product_ID, Product_Name, Product_Description, Category, Price, parts_str } = req.body;
      console.log({ Product_ID, Product_Name, Product_Description, Category, Price, parts_str });
      const image = req.files && req.files.Image;
      // Parse the parts_str as JSON
      const parts = JSON.parse(parts_str);
      console.log(parts)
      if (!Product_ID || !Product_Name || !Product_Description || !Category || !Price || !image) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
      const q = 'SELECT * FROM Product WHERE Product_ID = ?';
      db.query(q, [Product_ID], (err, data) => {
        if (err) return res.json(err);
        if (data.length) {
          return res.status(409).json("Product already exists");
        }

        db.beginTransaction((err) => {
          if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          const sqlProduct = `
            INSERT INTO Product (Product_ID, Product_Name, Product_Description, Category, Price, Image)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const valuesProduct = [Product_ID, Product_Name, Product_Description, Category, Price, image.name];

          db.query(sqlProduct, valuesProduct, (err, resultProduct) => {
            if (err) {
              console.error('Error adding product to the database:', err);
              return db.rollback(() => res.status(500).json({ error: 'Internal server error' }));
            }
            const uploadPath = path.resolve("../frontend/public/images", image.name);
            console.log(uploadPath);
            image.mv(uploadPath, (err) => {
              if (err) {
                console.error('Error saving image:', err);
                return db.rollback(() => res.status(500).json({ error: 'Internal server error' }));
              }
              console.log('Product added successfully with image');
              const sqlPart = `
                INSERT INTO assembled_by (Product_ID, Part_id, Number_of_Parts)
                VALUES (?, ?, ?)
              `;
              console.log("here0");

              // Validate parts array
              if (Array.isArray(parts) && parts.every(part => part && part.id && part.quantity)) {
                console.log("here1");
  
                parts.forEach((part) => {
                  const valuesPart = [Product_ID, part.id, part.quantity];
                  console.log(valuesPart);
                  db.query(sqlPart, valuesPart, (err, resultPart) => {
                    if (err) {
                      console.error('Error adding part to the database:', err);
                      // Rollback the transaction
                      return db.rollback(() => res.status(500).json({ error: 'Internal server error' }));
                    }
                  });
                });
  
                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                  }
                  return res.json("Product Added Successfully");
                });
              } else {
                console.error('Invalid parts array format');
                // Rollback the transaction
                return db.rollback(() => res.status(400).json({ error: 'Invalid parts array format' }));
              }
            });
          });
        });
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

export const delete_product = (req, res) => {
  const del_product = 'DELETE FROM Product WHERE Product_ID = ?';
  const product_id = req.params.id
  db.query(del_product, [product_id], (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err);
    }
    return res.json("Product Deleted Successfully.")
  });
}

export const get_product_parts = (req, res) => {
  const prod_id = req.params.id;
  console.log(prod_id);
  const query = `SELECT Part.Part_id, Part_name, Weight, Number_of_Parts  FROM Part JOIN assembled_by ON Part.Part_id
  = assembled_by.Part_id WHERE assembled_by.Product_ID = ?;`
  const values = [prod_id];
  db.query(query, values, (err, data) => {
    if(err) {
      console.log(err)
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!data.length) {
      return res.status(404).json('Invalid Product ID');
    }
    console.log(data)
    return res.json(data);
  })
}