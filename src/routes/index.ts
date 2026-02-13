import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { bookingRoutes } from "../modules/bookings/booking.routes";
import { partnerRoutes } from "../modules/partners/partner.routes";
import { inventoryRoutes } from "../modules/inventory/inventory.routes";
import { paymentRoutes } from "../modules/payments/payment.routes";
import { quoteRoutes } from "../modules/quotes/quote.routes";
import { contractRoutes } from "../modules/contracts/contract.routes";
import { receiptRoutes } from "../modules/receipts/receipt.routes";
import { disputeRoutes } from "../modules/disputes/dispute.routes";
import { refundRoutes } from "../modules/refunds/refund.routes";
import { integrationRoutes } from "../modules/integrations/integration.routes";
import { dispatchRoutes } from "../modules/dispatch/dispatch.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/bookings", bookingRoutes);
apiRouter.use("/partners", partnerRoutes);
apiRouter.use("/inventory", inventoryRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/quotes", quoteRoutes);
apiRouter.use("/contracts", contractRoutes);
apiRouter.use("/receipts", receiptRoutes);
apiRouter.use("/disputes", disputeRoutes);
apiRouter.use("/refunds", refundRoutes);
apiRouter.use("/integrations", integrationRoutes);
apiRouter.use("/dispatches", dispatchRoutes);
