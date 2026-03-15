import {
  registerAdmin,
  fetchAllAdmins,
  fetchAdminByEmail,
  fetchAdminData,
} from "../services/adminService.js";
import { adminValidationSchema } from "../validators/adminValidator.js";
import { generateAccessToken } from "../utils/jwtUtils.js";
import bcrypt from "bcrypt";

/**
 * Controller to handle admin registration.
 */
export const createAdminController = async (req, res) => {
  const { name, email, phone, password } = req.body;
  // const { error } = adminValidationSchema.validate(req.body);
  // if (error) {
  //     return res.status(400).json({ message: error.details[0].message });
  // }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await registerAdmin(name, email, phone, hashedPassword);
    res
      .status(201)
      .json({ message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create admin", error: error.message });
  }
};

/**
 * Controller to get an admin by ID.
 */
export const getAdminByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await fetchAdminData(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ data: [admin] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch admin", error: error.message });
  }
};

export const getAllAdminsController = async (req, res) => {
  try {
    const admins = await fetchAllAdmins();
    res.status(200).json({ data: admins });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch admins", error: error.message });
  }
};

export const loginAdminController = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const admin = await fetchAdminByEmail(email);
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    };

    // Clear all potentially conflicting cookies
    res.clearCookie("token", cookieOptions);
    res.clearCookie("admin_token", cookieOptions);
    res.clearCookie("user_token", cookieOptions);

    // Generate JWT token
    const token = generateAccessToken(admin);
    const cookieName = "admin_token";
    // Send the token in an HTTPOnly cookie
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({
      message: "admin logged in successfully",
      data: admin,
      status: "logged-in",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to log in admin", error: error.message });
  }
};

export const logoutAdminController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Admin Logged out successfully" });
};

export const getAdminDataController = async (req, res) => {
  try {
    const data = await fetchAdminData(req.user.userId);
    if (!data) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch admin data", error: error.message });
  }
};
