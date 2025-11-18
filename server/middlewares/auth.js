
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// // middleware to protect routes
// export const protect = async (req, res, next) => {
//     let token = req.headers.authorization;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         const user = await User.findById(userId);

//         if (!user) {
//             return resizeBy.json({success: false, message: 'Not Authorized - user not found'})
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({success: false, message: 'Not Authorized - invalid token'})
//     }
// }





// server/middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized - user not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized - invalid token' });
  }
};
