import { Role, TutorStatus } from "@prisma/client";

export interface UserSessionData {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  tutorStatus: TutorStatus;
  studyYear: number;
}
