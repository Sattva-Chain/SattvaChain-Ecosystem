import { createToken } from "../auth/user.js";
import Laboratory from "../model/lab.js";
import bcrypt from "bcrypt";

// Register Laboratory
export const register = async (req, res) => {
  console.log(req.body)
  try {
    const { laboratoryName, licenseId, email, password, location } = req.body;

    if (!email || !password || !laboratoryName || !licenseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Laboratory.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLab = await Laboratory.create({
      laboratoryName,
      licenseId,
      email,
      password: hashedPassword,
      location,
    });

    const Tokenlab = createToken(newLab);

    res.cookie("Tokenlab", Tokenlab, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      lab: {
        id: newLab._id,
        laboratoryName: newLab.laboratoryName,
        licenseId: newLab.licenseId,
        email: newLab.email,
        location: newLab.location,
      },
      token: Tokenlab,
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};


// Login Laboratory
export const loginlab = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await Laboratory.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const Tokenlab = createToken(user);

    res.cookie("Tokenlab", Tokenlab, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        laboratoryName: user.laboratoryName,
        email: user.email,
      },
      token: Tokenlab,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Logout Laboratory
export const logout = async (req, res) => {
  try {
    res.clearCookie("Tokenlab").json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Issue during logout",
    });
  }
};
