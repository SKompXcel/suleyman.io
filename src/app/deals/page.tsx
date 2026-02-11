import { Metadata } from 'next'
import DealsClient from './DealsClient'

export const metadata: Metadata = {
  title: 'Deal Board - MHCCA',
  description: 'Corporate leasing deal management board',
}

export default function DealsPage() {
  return <DealsClient />
}
