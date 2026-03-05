"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerServiceRoutes = void 0;
const express_1 = require("express");
const partner_service_controller_1 = require("./partner-service.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.partnerServiceRoutes = (0, express_1.Router)();
// All routes require authentication
exports.partnerServiceRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/partner-services:
 *   post:
 *     tags:
 *       - Partner Services
 *     summary: Create a service listing (partner only)
 *     description: An approved partner adds a service they offer (e.g. a specific car, boat, guide).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePartnerServiceRequest'
 *           example:
 *             serviceCategory: GET_AROUND
 *             serviceType: CAR
 *             description: Toyota Axio Hybrid
 *             carType: Compact Sedan
 *             selfDrive: true
 *             cities:
 *               - NAIROBI
 *               - MOMBASA
 *             priceFrom: 5000
 *             currency: KES
 *     responses:
 *       201:
 *         description: Service listing created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnerServiceResponse'
 *       403:
 *         description: Partner account not approved yet
 */
exports.partnerServiceRoutes.post("/", (0, role_1.requireRoles)("PARTNER"), partner_service_controller_1.partnerServiceController.create);
/**
 * @openapi
 * /api/partner-services:
 *   get:
 *     tags:
 *       - Partner Services
 *     summary: List / browse partner service listings
 *     description: Agents browse available partner services filtered by type, city, self-drive, etc.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [CAR, DRIVER, GUIDE, PARK, MOTO, BOAT, MASSAGE, RESTAURANT, SHOP, LAUNDRY]
 *       - in: query
 *         name: serviceCategory
 *         schema:
 *           type: string
 *           enum: [GET_AROUND, VERIFIED_STAYS, LIVE_LIKE_LOCAL, EXPERT_ACCESS, GEAR_UP, GET_ENTERTAINED]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           enum: [NAIROBI, MOMBASA, DIANI_BEACH, MALINDI, KISUMU, NAKURU, ELDORET, LAMU, NANYUKI, AMBOSELI, WATAMU, ZANZIBAR, ARUSHA, DAR_ES_SALAAM]
 *       - in: query
 *         name: selfDrive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: partnerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of partner services
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: a1b2c3d4-0000-0000-0000-000000000001
 *                   serviceType: CAR
 *                   serviceCategory: GET_AROUND
 *                   description: Toyota Axio Hybrid
 *                   carType: Compact Sedan
 *                   selfDrive: true
 *                   priceFrom: 5000
 *                   currency: KES
 *                   cities:
 *                     - city: NAIROBI
 *                     - city: MOMBASA
 *                   partner:
 *                     businessName: Nomad Drives
 *                     user:
 *                       name: Joan Mwangi
 *                       phone: "+254712345678"
 *               meta:
 *                 total: 1
 *                 skip: 0
 *                 take: 20
 */
exports.partnerServiceRoutes.get("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT", "PARTNER"), partner_service_controller_1.partnerServiceController.list);
/**
 * @openapi
 * /api/partner-services/{id}:
 *   get:
 *     tags:
 *       - Partner Services
 *     summary: Get a single partner service listing
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
 *         description: Partner service detail
 *       404:
 *         description: Not found
 */
exports.partnerServiceRoutes.get("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT", "PARTNER"), partner_service_controller_1.partnerServiceController.getOne);
/**
 * @openapi
 * /api/partner-services/{id}:
 *   patch:
 *     tags:
 *       - Partner Services
 *     summary: Update own service listing (partner only)
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
 *             $ref: '#/components/schemas/CreatePartnerServiceRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Not your listing
 */
exports.partnerServiceRoutes.patch("/:id", (0, role_1.requireRoles)("PARTNER"), partner_service_controller_1.partnerServiceController.update);
/**
 * @openapi
 * /api/partner-services/{id}:
 *   delete:
 *     tags:
 *       - Partner Services
 *     summary: Delete own service listing (partner only)
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
 *         description: Deleted
 */
exports.partnerServiceRoutes.delete("/:id", (0, role_1.requireRoles)("PARTNER"), partner_service_controller_1.partnerServiceController.remove);
/**
 * @openapi
 * /api/partner-services/{id}/admin:
 *   patch:
 *     tags:
 *       - Partner Services
 *     summary: Admin override — update any service listing
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
 *             $ref: '#/components/schemas/CreatePartnerServiceRequest'
 *     responses:
 *       200:
 *         description: Updated by admin
 */
exports.partnerServiceRoutes.patch("/:id/admin", (0, role_1.requireRoles)("ADMIN"), partner_service_controller_1.partnerServiceController.adminUpdate);
//# sourceMappingURL=partner-service.routes.js.map