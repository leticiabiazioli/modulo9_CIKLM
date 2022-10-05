class ProductsDAO {
  constructor(conn) {
    this.db = conn;
  }

  findAll(callback) {
    this.db.all(`SELECT * FROM products`, callback);
  }

  findById(id, callback) {
    this.db.get(`SELECT * FROM products WHERE id = ?`, id, callback);
  }

  findbyCategoryId(categoryId, callback) {
    this.db.all(`SELECT * FROM products WHERE categoryId = ?`, categoryId, callback);
  }

  saveProduct(product, callback) {
    const { name, price, image, categoryId, description } = product;
    this.db.run(
      `INSERT INTO products (name, image, price, categoryId, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, image, price, categoryId, description],
      callback
    );
  }

  deleteProduct(product, callback) {
    this.db.run(`DELETE FROM products where id = ${product}`, callback);
  }

  editProduct(id, name, price, callback) {
    const sql = `UPDATE products SET name = ?, price = ? WHERE id = ?`;
    this.db.run(sql, [name, price, id], callback);
  }
};

module.exports = (conn) => {
  return new ProductsDAO(conn);
};