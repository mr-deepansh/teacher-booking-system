// middleware/validationMiddleware.js
import { ZodError } from "zod";

const validationMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({ errors: e.errors });
    }
    next(e);
  }
};

export default validationMiddleware;
