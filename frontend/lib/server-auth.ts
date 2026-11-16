import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
import { authOptions } from './auth';

export type ServerAuth = {
  userId: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
};

export async function getServerAuth(): Promise<ServerAuth | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = {
    id: session.user.id,
    email: session.user.email ?? '',
    role: session.user.role,
    first_name: session.user.first_name,
    last_name: session.user.last_name,
    phone: session.user.phone ?? '',
  };

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '15m' },
  );

  return { userId: session.user.id, token, user };
}
