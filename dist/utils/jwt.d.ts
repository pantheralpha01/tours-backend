export type JwtPayload = {
    sub: string;
    role: "ADMIN" | "AGENT" | "MANAGER";
};
export declare const signToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export declare const signAccessToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const signRefreshToken: (payload: {
    sub: string;
}) => string;
export declare const verifyRefreshToken: (token: string) => {
    sub: string;
};
//# sourceMappingURL=jwt.d.ts.map