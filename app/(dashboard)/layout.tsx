import React from 'react'
import Navbar from '@/components/layout/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div>
        <header>
          <h1>My Dashboard</h1>
        </header>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
