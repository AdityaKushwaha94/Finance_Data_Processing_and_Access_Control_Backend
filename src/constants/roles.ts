export const ROLES = ["viewer", "analyst", "admin"] as const;

export type Role = (typeof ROLES)[number];


const check = 'check';