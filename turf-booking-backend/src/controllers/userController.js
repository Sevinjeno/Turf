import {
  registerUser,
  fetchUserById,
  fetchUserByEmail,
  fetchAllUsers,
  updateUserProfileService,
} from "../services/userService.js";
import cloudinary from "../utils/Cloudinary.js";
import { generateAccessToken } from "../utils/jwtUtils.js";
import { userValidationSchema } from "../validators/userValidator.js";

/**
 * Controller to handle user registration.
 */
export const createUserController = async (req, res) => {
  const { name, email, action } = req.body;
  try {
    // Validate request data
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    let User = await fetchUserByEmail(email);

    if (!User) {
      try {
        User = await registerUser(name, email);
        res.clearCookie("admin_token", { path: "/" });
        res.clearCookie("user_token", { path: "/" });

        // Generate JWT token after user registration
        const user_token = generateAccessToken(User);

        // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
        res.cookie("user_token", user_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        // Respond with success
        res
          .status(201)
          .json({
            message: "User created successfully",
            data: User,
            status: "login",
          });
      } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(400).json({ message: error.message }); // Send a specific error message to the client
      }
    } else {

      // Generate JWT token for the existing user
      res.clearCookie("admin_token", { path: "/" });
      res.clearCookie("user_token", { path: "/" });
      const user_token = generateAccessToken(User);

      // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
      res.cookie("user_token", user_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      if (action == "register") {
        // Respond with success message and user data (existing user)
        return res.status(200).json({
          message: "User already exists",
          data: User,
          status: "existing", // Indicate this is an existing user
        });
      } else if (action == "login") {
        // Respond with success message and user data (existing user)
        return res.status(200).json({
          message: "User logged in",
          data: User,
          status: "login", // Indicate this is an existing user
        });
      }
    }

    if (User && action == "login") {
      // Generate JWT token for the existing user
      const user_token = generateAccessToken(User);

      // Send the JWT token to the client (stored in an HTTPOnly cookie for security)
      res.cookie("user_token", user_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Respond with success message and user data (existing user)
      return res.status(200).json({
        message: "User already exists",
        data: User,
        status: "existing", // Indicate this is an existing user
      });
    }
  } catch (error) {
    console.error("Error in createUserController:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
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
    // Check if the user already exists
    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    // Register a new user
    const newUser = await registerUser(name, email);

    // Generate JWT token
    const user_token = generateAccessToken(newUser);

    // Send the token in an HTTPOnly cookie
    res.cookie("user_token", user_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(201)
      .json({
        message: "User registered successfully",
        data: newUser,
        status: "registered",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user exists
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register." });
    }

   // Define consistent cookie options
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    };

    // Clear all potentially conflicting cookies
    res.clearCookie('admin_token', cookieOptions);
    res.clearCookie('user_token', cookieOptions);

    // Generate JWT token
    const user_token = generateAccessToken(user);

    const cookieName = "user_token";

    // Send the token in an HTTPOnly cookie
    res.cookie(cookieName, user_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res
      .status(200)
      .json({
        message: "User logged in successfully",
        data: user,
        status: "logged-in",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to log in user", error: error.message });
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
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

export const getUserSelfController = async (req, res) => {
  try {
    const user = await fetchUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // assuming you have auth middleware
    console.log("userId",userId)
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const updatedUser = await updateUserProfileService(userId, req.body);

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


export const UploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Convert file buffer → Base64
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'user_avatars',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};
