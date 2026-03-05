"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const auth_1 = require("../../middleware/auth");
exports.authRoutes = (0, express_1.Router)();
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePass123
 *               phone:
 *                 type: string
 *                 minLength: 7
 *                 example: "+254712345678"
 *               idNumber:
 *                 type: string
 *                 example: "12345678"
 *               idType:
 *                 type: string
 *                 example: NATIONAL_ID
 *               profilePicUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/pic.jpg"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, AGENT, MANAGER]
 *                 example: AGENT
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.post("/register", rateLimiter_1.authLimiter, auth_controller_1.authController.register);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Initiate password + OTP login
 *     description: Validates email/password, sends OTP to the user's phone, and returns OTP metadata for the verification step.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: OTP dispatched — pass `phone` to /verify-otp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to your phone
 *                 otpRequired:
 *                   type: boolean
 *                   example: true
 *                 phone:
 *                   type: string
 *                   description: Normalized phone number — use this in /verify-otp
 *                   example: "254712345678"
 *                 maskedPhone:
 *                   type: string
 *                   description: Partially hidden phone for display
 *                   example: "**********78"
 *                 otpExpiresAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Invalid credentials or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.post("/login", rateLimiter_1.authLimiter, auth_controller_1.authController.login);
/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify login OTP and issue tokens
 *     description: Use the `phone` value returned by /login together with the OTP sent to that number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The normalized phone returned by /login (e.g. 254712345678)
 *                 example: "254712345678"
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "482913"
 *           example:
 *             phone: "254712345678"
 *             otp: "482913"
 *     responses:
 *       200:
 *         description: OTP verified — access and refresh tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid, expired, or missing OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.post("/verify-otp", rateLimiter_1.authLimiter, auth_controller_1.authController.verifyLoginOtp);
/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.post("/refresh", auth_controller_1.authController.refresh);
/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
exports.authRoutes.post("/logout", auth_controller_1.authController.logout);
/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password-reset OTP
 *     description: Sends a 6-digit OTP to the registered phone number. Always returns 200 to prevent phone enumeration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "254712345678"
 *           example:
 *             phone: "254712345678"
 *     responses:
 *       200:
 *         description: OTP dispatched — pass `phone` to /reset-password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to your phone
 *                 phone:
 *                   type: string
 *                   description: Normalized phone — use this in /reset-password
 *                   example: "254712345678"
 *                 maskedPhone:
 *                   type: string
 *                   example: "**********78"
 *                 otpExpiresAt:
 *                   type: string
 *                   format: date-time
 */
exports.authRoutes.post("/forgot-password", rateLimiter_1.authLimiter, auth_controller_1.authController.forgotPassword);
/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password using OTP
 *     description: Verifies the OTP sent to the phone and sets a new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *               - newPassword
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone value returned by /forgot-password
 *                 example: "254712345678"
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "482913"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "NewSecurePass123"
 *           example:
 *             phone: "254712345678"
 *             otp: "482913"
 *             newPassword: "NewSecurePass123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully. You can now log in.
 *       400:
 *         description: Invalid, expired, or missing OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.post("/reset-password", rateLimiter_1.authLimiter, auth_controller_1.authController.resetPassword);
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.authRoutes.get("/me", auth_1.authenticate, auth_controller_1.authController.me);
//# sourceMappingURL=auth.routes.js.map