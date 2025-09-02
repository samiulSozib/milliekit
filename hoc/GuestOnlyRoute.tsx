// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@/types'
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const GuestOnlyRoute = async ({ children, lang }: ChildrenType & { lang: Locale }) => {
  const session = await getServerSession()

  if (session) {
    redirect(getLocalizedUrl('/', lang))
  }

  return <>{children}</>
}

export default GuestOnlyRoute
