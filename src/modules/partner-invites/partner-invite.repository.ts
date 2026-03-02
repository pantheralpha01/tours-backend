// Partner invites have been deprecated
// Partners now sign up directly via /api/partners/signup
// This file is kept for backward compatibility but is no longer used

export const partnerInviteRepository = {
  create: () => {
    throw new Error("Partner invites are no longer supported. Use /api/partners/signup instead.");
  },
  findMany: () => Promise.resolve([]),
  count: () => Promise.resolve(0),
  findByToken: () => Promise.resolve(null),
  findActiveByEmail: () => Promise.resolve(null),
  update: () => {
    throw new Error("Partner invites are no longer supported. Use /api/partners/signup instead.");
  },
};
