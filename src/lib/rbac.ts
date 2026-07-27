import { auth } from './auth';
import { NextResponse } from 'next/server';

export type Role = 'STUDENT' | 'TUTOR' | 'ADMIN' | 'SUPER_ADMIN';
export type TutorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const getServerSession = async () => {
  return await auth();
};

export const requireAuth = async () => {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized'); // Can be caught by error boundary, or use a helper that returns NextResponse
  }
  return session;
};

export const requireRole = async (allowedRoles: Role[]) => {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role as Role)) {
    throw new Error('Forbidden');
  }
  return session;
};

export const requireTutorApproved = async () => {
  const session = await requireAuth();
  if (session.user.role !== 'TUTOR' || session.user.tutorStatus !== 'APPROVED') {
    throw new Error('Forbidden: Tutor access only');
  }
  return session;
};

export const requireOwnership = async (userId: string, resourceCreatorId: string) => {
  if (userId !== resourceCreatorId) {
    throw new Error('Forbidden: Not the owner');
  }
};

export const canAccess = (userRole: string, requiredRoles: Role[]): boolean => {
  return requiredRoles.includes(userRole as Role);
};

export const apiRequireAuth = async () => {
  const session = await getServerSession();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session, error: null };
};

export const apiRequireRole = async (allowedRoles: Role[]) => {
  const { session, error } = await apiRequireAuth();
  if (error || !session) return { session: null, error };

  if (!allowedRoles.includes(session.user.role as Role)) {
    return { session, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session, error: null };
};

export const apiRequireTutorApproved = async () => {
  const { session, error } = await apiRequireAuth();
  if (error || !session) return { session: null, error };

  if (session.user.role !== 'TUTOR' || session.user.tutorStatus !== 'APPROVED') {
    return { session, error: NextResponse.json({ error: 'Forbidden: Tutor access only' }, { status: 403 }) };
  }
  return { session, error: null };
};
