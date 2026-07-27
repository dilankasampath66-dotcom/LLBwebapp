import { prisma } from '@/lib/db';

export interface AuditLogData {
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
}

export const logAudit = async (data: AuditLogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        details: data.details || {},
      },
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};
