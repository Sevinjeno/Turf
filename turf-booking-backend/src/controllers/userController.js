import { validateOTP } from '../services/AuthServices/emailService.js';
import { registerUser, fetchUserById , fetchUserByEmail, fetchAllUsers } from '../services/userService.js';
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




export const registerUserController = async (req, res) => {
    const { name, email } = req.body;
   
    try {
        // Validate input data
        const { error } = userValidationSchema.validate({ name, email });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
       console.log("req.body",req.body)
        // Check if the user already exists
        const existingUser = await fetchUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please log in.' });
        }

        // Register a new user
        const newUser = await registerUser(name, email);

        // Generate JWT token
        const token = generateToken(newUser);

        // Send the token in an HTTPOnly cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

        return res.status(201).json({ message: 'User registered successfully', data: newUser, status: 'registered' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
};


export const loginUserController = async (req, res) => {
    console.log("req.body",req.body)
    const { email } = req.body;
    try {
        // Check if the user exists
        const user = await fetchUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register.' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Send the token in an HTTPOnly cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        return res.status(200).json({ message: 'User logged in successfully', data: user, status: 'logged-in' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to log in user', error: error.message });
    }
};

/**
 * Controller to get a user by ID.
 */
export const getUserController = async (req, res) => {
    const { id } = req.params;
    console.log("ID",id)
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


export const getAllUsersController = async (req, res) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};



