import jsonwebtoken from 'jsonwebtoken'
import StudentModel from '../models/Student.js';
import InstructorModel from '../models/Instructors.js';
import organizationModel from '../models/Organization.js';

//authorize user request
export const Protect = async (req, res, next) => {
    const token = req.cookies.edtechafric;
    console.log('PROTECT TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.user = user;
  
      const { id, userType } = user;
      let isUser
      
      if(userType === 'student'){
        isUser = await StudentModel.findById(id);
      }
      if(userType === 'instructor'){
        isUser = await InstructorModel.findById(id);
      }
      if(userType === 'organization'){
        isUser = await organizationModel.findById(id);
      }

      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (isUser.verified === false) {
        return res.status(404).json({ success: false, data: 'User Account is not verified' });
      }
      if (isUser.blocked === true) {
        return res.status(404).json({ success: false, data: 'User Account has been blocked' });
      }

      req.user = isUser
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };