"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerRoutes = void 0;
const express_1 = require("express");
const partner_controller_1 = require("./partner.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.partnerRoutes = (0, express_1.Router)();
/**
 * @openapi
 * /api/partners/signup:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Partner self-registration (public signup)
 *     description: Allow partners to register with their details and service categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - businessName
 *               - description
 *               - serviceCategories
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@safari.com
 *               password:
 *                 type: string
 *                 description: Must contain uppercase, lowercase, and number (min 8 chars)
 *                 example: SecurePass123
 *               phone:
 *                 type: string
 *                 example: +254712345678
 *               businessName:
 *                 type: string
 *                 example: Safari Adventures Ltd
 *               website:
 *                 type: string
 *                 format: url
 *                 example: https://safariventures.com
 *               description:
 *                 type: string
 *                 example: Premium safari tours in Kenya
 *               serviceCategories:
 *                 type: array
 *                 description: Main service categories partner offers
 *                 items:
 *                   type: string
 *                   enum: [GET_AROUND, VERIFIED_STAYS, LIVE_LIKE_LOCAL, EXPERT_ACCESS, GEAR_UP, GET_ENTERTAINED]
 *               getAroundServices:
 *                 type: array
 *                 description: Specific services under Get Around (Airport transfers, Private drivers, Car rentals, EV charging, Scooter/Bike rentals, Tours, City transfers)
 *                 items:
 *                   type: string
 *                   enum: [AIRPORT_TRANSFERS, PRIVATE_DRIVERS, CAR_RENTALS, EV_CHARGING, SCOOTER_BIKE_RENTALS, TOURS, CITY_TRANSFERS]
 *               verifiedStaysServices:
 *                 type: array
 *                 description: Specific services under Verified Stays (Boutique hotels, Vetted rentals, Eco-lodges, Luxury camps)
 *                 items:
 *                   type: string
 *                   enum: [BOUTIQUE_HOTELS, VETTED_RENTALS, ECO_LODGES, LUXURY_CAMPS]
 *               liveLikeLocalServices:
 *                 type: array
 *                 description: Specific services under Live Like a Local (Home-cooked meals, Neighborhood walks, Language exchange, Cultural learning)
 *                 items:
 *                   type: string
 *                   enum: [HOME_COOKED_MEALS, NEIGHBORHOOD_WALKS, LANGUAGE_EXCHANGE, CULTURAL_LEARNING]
 *               expertAccessServices:
 *                 type: array
 *                 description: Specific services under Expert Access (Lawyers, Tour guides, Translators, Photographers, Medical assistants, Security, Business scouting, Interconnectivity experts, Delivery services, Cleaning services, Event planning)
 *                 items:
 *                   type: string
 *                   enum: [LAWYERS, TOUR_GUIDES, TRANSLATORS, PHOTOGRAPHERS, MEDICAL_ASSISTANTS, SECURITY, BUSINESS_SCOUTING, INTERCONNECTIVITY_EXPERTS, DELIVERY_SERVICES, CLEANING_SERVICES, EVENT_PLANNING]
 *               gearUpServices:
 *                 type: array
 *                 description: Specific services under Gear Up (Camping gear, Hiking equipment, Tech rentals)
 *                 items:
 *                   type: string
 *                   enum: [CAMPING_GEAR, HIKING_EQUIPMENT, TECH_RENTALS]
 *               getEntertainedServices:
 *                 type: array
 *                 description: Specific services under Get Entertained/Relax (Club, Dine out, Massage/Spa)
 *                 items:
 *                   type: string
 *                   enum: [CLUB, DINE_OUT, MASSAGE_SPA]
 *     responses:
 *       201:
 *         description: Partner registered successfully, pending admin approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     partner:
 *                       type: object
 *                     user:
 *                       type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
exports.partnerRoutes.post("/signup", partner_controller_1.partnerController.signup);
// All routes below require authentication
exports.partnerRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/partners:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Create a new partner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Safari Adventures Ltd
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contact@safariventures.com
 *               phone:
 *                 type: string
 *                 example: +254712345678
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Partner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.post("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.create);
/**
 * @openapi
 * /api/partners:
 *   get:
 *     tags:
 *       - Partners
 *     summary: List all partners with pagination and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: partnerType
 *         schema:
 *           type: string
 *           enum: [TOUR_OPERATOR, HOTEL, TRANSPORT]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search by partner name
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - in: query
 *         name: createdById
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: name:asc
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.partnerRoutes.get("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.list);
/**
 * @openapi
 * /api/partners/{id}:
 *   get:
 *     tags:
 *       - Partners
 *     summary: Get partner by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Partner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 *       404:
 *         description: Partner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.get("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.getById);
/**
 * @openapi
 * /api/partners/{id}:
 *   patch:
 *     tags:
 *       - Partners
 *     summary: Update partner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               approvalStatus:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *               rejectedReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.patch("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.update);
/**
 * @openapi
 * /api/partners/{id}/approve:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Approve partner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Partner approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.post("/:id/approve", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.approve);
/**
 * @openapi
 * /api/partners/{id}/reject:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Reject partner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.post("/:id/reject", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.reject);
/**
 * @openapi
 * /api/partners/{id}/events:
 *   get:
 *     tags:
 *       - Partners
 *     summary: List partner approval events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [APPROVED, REJECTED]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Partner events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.partnerRoutes.get("/:id/events", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.listEvents);
/**
 * @openapi
 * /api/partners/{id}:
 *   delete:
 *     tags:
 *       - Partners
 *     summary: Delete partner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Partner deleted successfully
 *       404:
 *         description: Partner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), partner_controller_1.partnerController.remove);
//# sourceMappingURL=partner.routes.js.map