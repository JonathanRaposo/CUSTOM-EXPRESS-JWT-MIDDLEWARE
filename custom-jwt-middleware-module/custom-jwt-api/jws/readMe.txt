JWS stands for JSON Web Signature

Breaking Down jws.decode(jwt, options)
The method jws.decode(jwt, options) is part of the jws submodule within jsonwebtoken. It is used to decode a JWT (JSON Web Token) without verifying its signature.

jwt – The JSON Web Token string to be decoded.

options (optional) – An object with possible configurations (e.g., json: true to parse the payload as a JSON object).


When you pass the option complete: true to the decode() function in the jsonwebtoken module, it will return the complete JWT structure, including the header, payload, and signature as separate components, all parsed into JavaScript objects.

What Does complete: true Do?
When you use complete: true, the result includes the following:

header: The JWT header, parsed as an object.

payload: The decoded JWT payload, also parsed as an object (if json: true is not specified).

signature: The JWT signature (Base64-encoded string).

This gives you the full decoded JWT object, so you can directly access the header, payload, and signature in an easy-to-use format.


const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNjk4MDAwMDB9.5wAOBLjoG7oKDl_OrBl1UxlC6w9_wVZ03kx8pKy4vXk";

const decoded = jwt.decode(token, { complete: true });

What Will It Return?

{
  header: { 
    alg: "HS256",  // JWT signing algorithm
    typ: "JWT"     // JWT type
  },
  payload: {
    userId: 123,  // Data encoded in the payload
    iat: 1698000000
  },
  signature: "5wAOBLjoG7oKDl_OrBl1UxlC6w9_wVZ03kx8pKy4vXk"  // The signature part of the JWT
}
