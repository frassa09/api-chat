import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const verifyJwt = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    if (decoded) {
      req.userId = decoded.userId;
      req.email = decoded.email;
      req.name = decoded.name;

      next();
    }
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "Não autorizado",
      error: err.message,
    });
  }
};
