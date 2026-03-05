"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.bookingRoutes = (0, express_1.Router)();
exports.bookingRoutes.use(auth_1.authenticate);
exports.bookingRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - serviceTitle
 *               - amount
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Jane Smith
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               customerPhoneNumber:
 *                 type: string
 *                 example: "+254712345678"
 *               serviceTitle:
 *                 type: string
 *                 example: Kenya Safari Package
 *               pickupLocation:
 *                 type: string
 *                 example: JKIA Terminal 1
 *               destination:
 *                 type: string
 *                 example: Maasai Mara National Reserve
 *               numberOfGuests:
 *                 type: integer
 *                 example: 4
 *               numberOfChildren:
 *                 type: integer
 *                 example: 1
 *                 default: 0
 *               numberOfPets:
 *                 type: integer
 *                 example: 0
 *                 default: 0
 *               notes:
 *                 type: string
 *                 example: Client prefers window seat on the safari vehicle
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *                 example: USD
 *               status:
 *                 type: string
 *                 enum: [DRAFT, CONFIRMED, CANCELLED]
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               paymentType:
 *                 type: string
 *                 enum: [FULL_PAYMENT, PARTIAL_PAYMENT]
 *               costAtBooking:
 *                 type: number
 *                 example: 100.00
 *               costPostEvent:
 *                 type: number
 *                 example: 50.00
 *               payPostEventDueDate:
 *                 type: string
 *                 format: date-time
 *               agentId:
 *                 type: string
 *                 format: uuid
 *               serviceStartAt:
 *                 type: string
 *                 format: date-time
 *               serviceEndAt:
 *                 type: string
 *                 format: date-time
 *               serviceTimezone:
 *                 type: string
 *               bookingPartners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - partnerId
 *                     - partnerName
 *                     - costAtBooking
 *                     - costPostEvent
 *                   properties:
 *                     partnerId:
 *                       type: string
 *                       format: uuid
 *                     partnerName:
 *                       type: string
 *                     partnerPhoneNumber:
 *                       type: string
 *                     description:
 *                       type: string
 *                     costAtBooking:
 *                       type: number
 *                     costPostEvent:
 *                       type: number
 *               splitPaymentEnabled:
 *                 type: boolean
 *               depositPercentage:
 *                 type: number
 *                 minimum: 0.1
 *                 maximum: 1
 *               depositAmount:
 *                 type: number
 *               depositDueDate:
 *                 type: string
 *                 format: date-time
 *               balanceDueDate:
 *                 type: string
 *                 format: date-time
 *               splitPaymentNotes:
 *                 type: string
 *           example:
 *             customerName: Jane Smith
 *             customerEmail: jane@example.com
 *             customerPhoneNumber: "+254712345678"
 *             serviceTitle: Kenya Safari Package
 *             pickupLocation: JKIA Terminal 1
 *             destination: Maasai Mara National Reserve
 *             numberOfGuests: 4
 *             numberOfChildren: 1
 *             numberOfPets: 0
 *             notes: Client prefers window seat
 *             amount: 1500.00
 *             currency: USD
 *             status: CONFIRMED
 *             paymentType: PARTIAL_PAYMENT
 *             costAtBooking: 750.00
 *             costPostEvent: 750.00
 *             payPostEventDueDate: "2026-04-01T00:00:00.000Z"
 *             agentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *             serviceStartAt: "2026-04-15T08:00:00.000Z"
 *             serviceEndAt: "2026-04-18T17:00:00.000Z"
 *             serviceTimezone: Africa/Nairobi
 *             bookingPartners:
 *               - partnerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 partnerName: Acacia Safaris
 *                 partnerPhoneNumber: "+254798765432"
 *                 description: Airport transfer + 3-day game drive
 *                 costAtBooking: 500.00
 *                 costPostEvent: 0
 *     responses:
 *       201:
 *         description: Booking created — response includes auto-generated referenceNumber (e.g. TF-202603-00042)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.post("/", booking_controller_1.bookingController.create);
/**
 * @openapi
 * /api/bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List all bookings with pagination and filters
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, CONFIRMED, CANCELLED]
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
 *         name: serviceStartFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: serviceStartTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.get("/", booking_controller_1.bookingController.list);
/**
 * @openapi
 * /api/bookings/calendar:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List bookings for calendar view
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: serviceStartFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: serviceStartTo
 *         schema:
 *           type: string
 *           format: date-time
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
 *         name: sort
 *         schema:
 *           type: string
 *           example: serviceStartAt:asc
 *     responses:
 *       200:
 *         description: Calendar bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.bookingRoutes.get("/calendar", booking_controller_1.bookingController.calendar);
/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get booking by ID
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
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.get("/:id", booking_controller_1.bookingController.getById);
/**
 * @openapi
 * /api/bookings/{id}/events:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List booking event timeline
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
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Booking events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.get("/:id/events", booking_controller_1.bookingController.events);
/**
 * @openapi
 * /api/bookings/{id}:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Update booking
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
 *               customerName:
 *                 type: string
 *               customerPhoneNumber:
 *                 type: string
 *               serviceTitle:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, CONFIRMED, CANCELLED]
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               paymentType:
 *                 type: string
 *                 enum: [FULL_PAYMENT, PARTIAL_PAYMENT]
 *               costAtBooking:
 *                 type: number
 *               costPostEvent:
 *                 type: number
 *               payPostEventDueDate:
 *                 type: string
 *                 format: date-time
 *               agentId:
 *                 type: string
 *                 format: uuid
 *               serviceStartAt:
 *                 type: string
 *                 format: date-time
 *               serviceEndAt:
 *                 type: string
 *                 format: date-time
 *               serviceTimezone:
 *                 type: string
 *               transitionReason:
 *                 type: string
 *               bookingPartners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     partnerId:
 *                       type: string
 *                       format: uuid
 *                     partnerName:
 *                       type: string
 *                     partnerPhoneNumber:
 *                       type: string
 *                     description:
 *                       type: string
 *                     costAtBooking:
 *                       type: number
 *                     costPostEvent:
 *                       type: number
 *               splitPaymentEnabled:
 *                 type: boolean
 *               depositPercentage:
 *                 type: number
 *               depositAmount:
 *                 type: number
 *               depositDueDate:
 *                 type: string
 *                 format: date-time
 *               balanceDueDate:
 *                 type: string
 *                 format: date-time
 *               splitPaymentNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.patch("/:id", booking_controller_1.bookingController.update);
/**
 * @openapi
 * /api/bookings/{id}/transition:
 *   put:
 *     tags:
 *       - Bookings
 *     summary: Transition booking status
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
 *             required:
 *               - toStatus
 *             properties:
 *               toStatus:
 *                 type: string
 *                 enum: [DRAFT, CONFIRMED, CANCELLED]
 *               transitionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status transitioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.put("/:id/transition", booking_controller_1.bookingController.transition);
/**
 * @openapi
 * /api/bookings/{id}:
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Delete booking
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
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.bookingRoutes.delete("/:id", booking_controller_1.bookingController.remove);
//# sourceMappingURL=booking.routes.js.map