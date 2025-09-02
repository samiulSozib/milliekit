'use server';

// Third-party Imports
// import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers';

// Component Imports
import AuthRedirect from '@/components/AuthRedirect';

// Type Imports
import type { Locale } from '@configs/i18n';
import type { ChildrenType } from '@/types';


export async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const cookieStore = await cookies();

  const tokenInCookie = cookieStore.get('token')?.value ?? '';
  
  return <>{tokenInCookie !== '' ? children : <AuthRedirect lang={locale} />}</>
}