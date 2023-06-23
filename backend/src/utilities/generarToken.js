const jwt = require("jsonwebtoken");
const generarToken = (usuario, firmaToken, expiresIn) => {
  const { id, email,nombre } = usuario;

  return jwt.sign({ email, id,nombre}, firmaToken, { expiresIn });
};

module.exports = {
  generarToken,
};
