'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import emailjs from '@emailjs/browser'

interface ContactFormProps {
  primaryColor: string
  secondaryColor: string
  primaryRgb: { r: number; g: number; b: number }
}

export function ContactForm({ primaryColor, secondaryColor, primaryRgb }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.goal || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('customer_inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            fitness_goal: formData.goal,
            message: formData.message,
          },
        ])

      if (error) {
        throw error
      }

      // Send email notification to admin via EmailJS
      try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (serviceId && templateId && publicKey) {
          // Get the admin dashboard URL (use environment variable or construct from current origin)
          const adminDashboardUrl = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 
            (typeof window !== 'undefined' ? `${window.location.origin}/admin` : '/admin')

          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: formData.name,
              from_email: formData.email,
              fitness_goal: formData.goal,
              message: formData.message,
              to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
              admin_dashboard_url: adminDashboardUrl,
            },
            publicKey
          )
        }
      } catch (emailError) {
        // Log email error but don't fail the form submission
        console.error('Failed to send email notification:', emailError)
      }

      // Success!
      setIsSuccess(true)
      toast.success('Thank you! Your message has been sent successfully.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        goal: '',
        message: '',
      })

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md border-0 rounded-[3rem] shadow-2xl ring-1 ring-gray-900/5">
      <CardContent className="p-12 md:p-14">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-600 text-lg">
              Thank you for reaching out. We'll get back to you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-900 mb-3 tracking-wide"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="h-16 rounded-2xl border-gray-200 focus:ring-pink-400/20 text-base shadow-sm"
                style={{
                  borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
                }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-900 mb-3 tracking-wide"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-16 rounded-2xl border-gray-200 focus:ring-pink-400/20 text-base shadow-sm"
                style={{
                  borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
                }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="goal"
                className="block text-sm font-bold text-gray-900 mb-3 tracking-wide"
              >
                Fitness Goal
              </label>
              <Input
                id="goal"
                name="goal"
                type="text"
                placeholder="What would you like to achieve?"
                value={formData.goal}
                onChange={handleChange}
                className="h-16 rounded-2xl border-gray-200 focus:ring-pink-400/20 text-base shadow-sm"
                style={{
                  borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
                }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-bold text-gray-900 mb-3 tracking-wide"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me a bit more about yourself and your goals..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="rounded-2xl border-gray-200 focus:ring-pink-400/20 text-base resize-none shadow-sm"
                style={{
                  borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
                }}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="group w-full text-white rounded-2xl h-16 text-lg font-bold shadow-2xl transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 20px 25px -5px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Let's Talk
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

