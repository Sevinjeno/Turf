import { registerUser, fetchUserById , fetchUserByEmail } from '../services/userService.js';
import { userValidationSchema } from '../validators/userValidator.js';

/**
 * Controller to handle user registration.
 */
export const createUserController = async (req, res) => {
    console.log("Inside ")
    const { name, email, otp } = req.body;
    console.log(req.body)
    try {

        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        // Validate OTP
        const isOTPValid = validateOTP(email, otp);
        if (!isOTPValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Validate request data
        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if user already exists
        const User = await fetchUserByEmail(email);

        if (!User) {
            try{
                User = await registerUser(name, email);
            }
         catch (error) {
            return res.status(400).json({ message: error.message });  // Send a specific error message to the client
          }
        }
         // Generate JWT token after OTP verification
         const token = generateToken(User);

         // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
         res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });


        res.status(201).json({ message: 'User created successfully', data: User });
    } catch (error) {
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



