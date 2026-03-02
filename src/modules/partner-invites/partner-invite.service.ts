import { ApiError } from "../../utils/ApiError";

export const partnerInviteService = {
  create: async () => {
    throw ApiError.badRequest(
      "Partner invitations have been deprecated. Please use the direct signup endpoint at POST /api/partners/signup instead."
    );
  },

  list: async () => {
    throw ApiError.badRequest(
      "Partner invitations have been deprecated. Please use the direct signup endpoint instead."
    );
  },

  accept: async () => {
    throw ApiError.badRequest(
      "Partner invitations have been deprecated. Please use the direct signup endpoint instead."
    );
  },
};
