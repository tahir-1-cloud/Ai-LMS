// app/page.tsx
'use client';

import Navbar from "@/components/pages/Navbar"
import Header from "@/components/pages/Header"
import CardSection from "@/components/pages/CardSection"
import MockTests from "@/components/pages/MockTests"
import Instructors from "@/components/pages/Instructors"
import Testimonials from "@/components/pages/Testimonials"
import Footer from "@/components/pages/Footer"
import SessionList from "@/components/pages/SessionList"



export default function LandingPage() {
  return (
    <>
      <Navbar/>
      <Header />
      <SessionList />

      <CardSection />
      <MockTests/>
      <Testimonials />
      <Instructors/>
      <Footer/>
      </>
  )
}
