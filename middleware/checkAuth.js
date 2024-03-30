import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error en su autenticacion" });
    }
  }

  if (!token) {
    const error = new Error("Token no válido");
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
/*

This code is a middleware function called checkAuth for an ExpressJS application that is used to protect routes or endpoints that require authentication. The function checks for the presence of a JSON Web Token (JWT) in the request headers and verifies its validity before allowing access to the requested route. Here's a breakdown of what the code does:

Import necessary modules: jwt for handling JSON Web Tokens and Usuario (User) model for querying user data from the database.
Define the checkAuth middleware function that takes three arguments: req (request), res (response), and next (callback to execute the next middleware function or route handler).
Check if the request headers contain an authorization property and if it starts with the string "Bearer". If it does, split the string to extract the token.
If the token is present, verify it using the jwt.verify method. The method then decodes the token and returns the decoded data.
Find the user in the database by the id provided in the decoded token. Select only the necessary fields, excluding sensitive data such as the password and token.
Attach the user object to the request object (req.usuario) for use in the next middleware function or route handler.
If the token is not present or invalid, return a 401 Unauthorized error with the message "Token no válido" (Invalid token).
If an error occurs during the verification process, return a 404 Not Found error with the message "Hubo un error" (There was an error).
If no token is present, return a 401 Unauthorized error with the message "Token no válido" (Invalid token).
If all checks pass, execute the next middleware function or route handler using the next callback.
*/