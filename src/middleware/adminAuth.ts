import jwt from 'jsonwebtoken';

export function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return { success: true, admin: decoded };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}