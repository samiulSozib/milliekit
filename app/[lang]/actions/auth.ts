'use server';

import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();

  // Set the cookie to expire in 3 months
  const expiryDate = new Date();
  
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: expiryDate.setMonth(expiryDate.getMonth() + 3), // 3 Month
  });
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: -1, // Expire immediately
  });
}
