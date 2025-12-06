export const addToCart = (req, res) => {
  return res.json({
    message: "POST received",
    body: req.body
  });
};

export const getCart = (req, res) => {
  return res.json({
    message: "GET received",
    userId: req.params.userId
  });
};

