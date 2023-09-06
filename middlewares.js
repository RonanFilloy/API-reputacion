function validateRequestBody(req, res, next) {
  const { field } = req.params;
  const validFields = ["field_1", "author", "description"];
  if (!validFields.includes(field)) {
    return res.status(400).json({ error: "Invalid field" });
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
    !isNaN(field_1) ||
    !isNaN(author) ||
    !isNaN(description) ||
    isNaN(my_numeric_field)
  ) {
    return res.status(400).json({ error: "Invalid field types" });
  }
  next();
}

module.exports = { validateRequestBody, checkRequestBody, validateFields };
