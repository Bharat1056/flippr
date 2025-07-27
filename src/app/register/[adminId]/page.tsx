"use client"
import { RegisterPage } from '@/components/layout'
import { useParams } from 'next/navigation'

export default async function Page() {
  const params = useParams()
  // console.log(params,"pm");
  
  const adminId: string = params.adminId as string
  // console.log(adminId,"ad");
  

  return <RegisterPage adminId={adminId} />
}
