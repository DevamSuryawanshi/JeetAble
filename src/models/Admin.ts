export interface AdminProfile {
  _id?: string;
  adminId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: Date;
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminSchema = {
  adminId: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  phone: { type: 'string', required: true },
  department: { type: 'string', required: true },
  role: { type: 'string', required: true },
  joinDate: { type: 'date', required: true },
  permissions: { type: 'array', required: true },
  lastLogin: { type: 'date', required: true },
  createdAt: { type: 'date', default: () => new Date() },
  updatedAt: { type: 'date', default: () => new Date() }
};