const basicAuth = require("basic-auth");

function validateRequestBody(req, res, next) {
  const { field } = req.params;
  const validFields = ["field_1", "author", "description"];
  if (!validFields.includes(field)) {
    return res
      .status(400)
      .json({ error: `${field} is not a valid field to uppercase` });
  }
  next();
}

function checkRequestBody(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is empty" });
  }
  next();
}

function validateFields(req, res, next) {
  let { field_1, author, description, my_numeric_field } = req.body;
  if (
    typeof field_1 !== "string" ||
    typeof author !== "string" ||
    typeof description !== "string" ||
    isNaN(my_numeric_field)
  ) {
    return res.status(400).json({ error: "Invalid field types" });
  }
  next();
}

const authorizedUser = "Ronan";
const authorizedPassword = "Filloy";

const authenticateUser = (req, res, next) => {
  const user = basicAuth(req);

  if (
    !user ||
    user.name !== authorizedUser ||
    user.pass !== authorizedPassword
  ) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

module.exports = {
  validateRequestBody,
  checkRequestBody,
  validateFields,
  authenticateUser,
};
