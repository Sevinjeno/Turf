import { validateOTP } from '../services/AuthServices/emailService.js';
import { registerUser, fetchUserById , fetchUserByEmail } from '../services/userService.js';
import { generateToken } from '../utils/jwtUtils.js';
import { userValidationSchema } from '../validators/userValidator.js';

/**
 * Controller to handle user registration.
 */
export const createUserController = async (req, res) => {
    const { name, email, action } = req.body;
    console.log(req.body)
    try {
        
        console.log("Inside ")
        // if (!otp) {
        //     return res.status(400).json({ message: 'OTP is required' });
        // }
       
        // // Validate OTP
        // try {
        //     const isOTPValid = validateOTP(email, otp);
        //     console.log("otp validation result:", isOTPValid);
        // } catch (error) {
        //     console.error("Error validating OTP:", error.message);
        //     return res.status(400).json({ message: error.message });
        // }

        // Validate request data
        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }
        
        // Check if user already exists
        let User = await fetchUserByEmail(email);
        console.log("User fetched from DB:", User);

        if (!User) {
            try {
                console.log("User not found, registering new user...");
                User = await registerUser(name, email);
                console.log("User registered:", User);
                // Generate JWT token after user registration
                const token = generateToken(User);
                console.log("Generated JWT token:", token);
        
                // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production',sameSite: 'Strict'  });
                console.log("Token sent in cookie");
        
                // Respond with success
                res.status(201).json({ message: 'User created successfully', data: User ,status: 'login' });
            } catch (error) {
                console.error("Error registering user:", error.message);
                return res.status(400).json({ message: error.message }); // Send a specific error message to the client
            }
        } else {
            console.log("User already exists:", User);

            // Generate JWT token for the existing user
            const token = generateToken(User);  
            console.log("JWT token reused:", token);
        
            // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
            console.log("Token sent in cookie");
        
             if(action=="register"){
                 
                 // Respond with success message and user data (existing user)
                 return res.status(200).json({ 
                     message: 'User already exists', 
                     data: User, 
                     status: 'existing' // Indicate this is an existing user
                 });

             } else if (action=="login"){
                   // Respond with success message and user data (existing user)
                   return res.status(200).json({ 
                    message: 'User logged in', 
                    data: User, 
                    status: 'login' // Indicate this is an existing user
                });

             }

        }

        if(User && action=="login"){
            console.log("User already exists:", User);
            // Generate JWT token for the existing user
            const token = generateToken(User);  
            console.log("JWT token reused:", token);
        
            // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
            console.log("Token sent in cookie");
        
            // Respond with success message and user data (existing user)
            return res.status(200).json({ 
                message: 'User already exists', 
                data: User, 
                status: 'existing' // Indicate this is an existing user
            });
        }

    } catch (error) {
        console.error("Error in createUserController:", error.message);
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

/**
 * Controller to get a user by ID.
 */
export const getUserController = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await fetchUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};



