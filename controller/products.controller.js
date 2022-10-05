const conn = require("../infra/db-connection")("infra/lanchonete.db");
const productsDAO = require("../model/productsDAO")(conn);
const categoryDAO = require("../model/categoriesDAO")(conn);
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

exports.getProducts = (req, res) => {
  productsDAO.findAll((err, rows) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Houve um erro ao consultar os dados" });
    }
    res.render("cardapio", {
      products: rows, role: "products", category: false, links: [{
        href: "/",
        label: "Home"
      },
      {
        href: "/cardapio",
        label: "Cardápio"
      },
      {
        href: "/contato",
        label: "Contato"
      },
      {
        href: "/admin-login",
        label: "Admin"
      }]
    });
  });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  productsDAO.findById(id, (err, row) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Houve um erro ao consultar os dados" });
    }

    res.render("cardapio", {
      product: row, role: "detail", links: [{
        href: "/",
        label: "Home"
      },
      {
        href: "/cardapio",
        label: "Cardápio"
      },
      {
        href: "/contato",
        label: "Contato"
      },
      {
        href: "/admin-login",
        label: "Admin"
      }]
    });
  })
}

exports.getProductByCategoryId = (req, res) => {
  const categoryId = req.params.id;
  categoryDAO.findById(categoryId, (err, row) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Houve um erro ao consultar os dados", err });
    }
    productsDAO.findbyCategoryId(categoryId, (err, rows) => {
      if (err) {
        return res.render("not-found", { errorMessage: "Houve um erro ao consultar os dados", err });
      }
      if (!rows.length) {
        return res.render("not-found", { errorMessage: "Produto não encontrado" });
      }
      res.render("cardapio", {
        products: rows, role: "products", category: row, links: [{
          href: "/",
          label: "Home"
        },
        {
          href: "/cardapio",
          label: "Cardápio"
        },
        {
          href: "/contato",
          label: "Contato"
        },
        {
          href: "/admin-login",
          label: "Admin"
        }]
      });
    });
  });
};

exports.getAddProductsForm = (req, res) => {
  categoryDAO.findAll((err, rows) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Erro ao consultar os dados." });
    };
    res.render("add-product", {
      categories: rows, links: [{
        href: "/",
        label: "Home"
      },
      {
        href: "/cardapio",
        label: "Cardápio"
      },
      {
        href: "/contato",
        label: "Contato"
      },
      {
        href: "/admin-login",
        label: "Admin"
      }]
    });
  });
};

exports.saveProduct = (req, res) => {
  const formData = new formidable.IncomingForm();
  formData.parse(req, (err, fields, files) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Algo errado aconteceu." });

    };

    const imagesPath = path.join(__dirname, "../public/images", files.image.newFilename);

    const product = { ...fields, image: files.image.newFilename };

    productsDAO.saveProduct(product, (err) => {
      if (err) {
        return res.render("not-found", { errorMessage: "Erro ao salvar os dados." });

      }

      fs.renameSync(files.image.filepath, imagesPath);

      return res.redirect("/products");
    });
  });
};

exports.deleteProductsForm = (req, res) => {
  productsDAO.findAll((err, rows) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Erro ao consultar os dados." });

    };
    res.render("delete-product", {
      products: rows, links: [{
        href: "/",
        label: "Home"
      },
      {
        href: "/cardapio",
        label: "Cardápio"
      },
      {
        href: "/contato",
        label: "Contato"
      },
      {
        href: "/admin-login",
        label: "Admin"
      }]
    });
  });
};

exports.deleteProducts = (req, res) => {
  const produtoExcluir = req.query.productId;
  if (!produtoExcluir) {
    return res.render("not-found", { errorMessage: "Algo errado aconteceu." });
  };

  productsDAO.deleteProduct(produtoExcluir, (err) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Erro ao deletar o produto." });
    }
    return res.redirect("/products");
  })
}

exports.getEditProductsForm = (req, res) => {
  productsDAO.findAll((err, rows) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Erro ao consultar os dados." });
    };
    res.render("edit-product", {
      products: rows, links: [{
        href: "/",
        label: "Home"
      },
      {
        href: "/cardapio",
        label: "Cardápio"
      },
      {
        href: "/contato",
        label: "Contato"
      },
      {
        href: "/admin-login",
        label: "Admin"
      }]
    });
  });
};

exports.editProduct = (req, res) => {

  const idProdutoEditar = req.body.productId;
  const nameProdutoEditar = req.body.name;
  const priceProdutoEditar = req.body.price;

  if (!idProdutoEditar) {
    return res.render("not-found", { errorMessage: "Algo errado aconteceu." });
  };

  productsDAO.editProduct(idProdutoEditar, nameProdutoEditar, priceProdutoEditar, (err) => {
    if (err) {
      return res.render("not-found", { errorMessage: "Erro ao editar o produto." });
    }
    return res.redirect(`/products/${idProdutoEditar}`);
  })
}