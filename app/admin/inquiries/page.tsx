'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, RotateCcw, ArrowLeft, LogOut, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Login } from '../login'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function InquiriesPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(false)
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setAuthenticated(true)
        setUser(session.user)
        loadInquiries()
      } else {
        setAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthenticated(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLoginSuccess = () => {
    checkAuth()
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setAuthenticated(false)
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error(error.message || 'Failed to logout')
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthenticated(true)
        setUser(session.user)
      } else {
        setAuthenticated(false)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadInquiries = async () => {
    try {
      setLoadingInquiries(true)
      const { data, error } = await supabase
        .from('customer_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error('Error loading inquiries:', error)
      toast.error('Failed to load customer inquiries')
    } finally {
      setLoadingInquiries(false)
    }
  }

  const deleteInquiry = async (inquiryId: string) => {
    try {
      setDeletingInquiryId(inquiryId)
      const { error } = await supabase
        .from('customer_inquiries')
        .delete()
        .eq('id', inquiryId)

      if (error) throw error

      toast.success('Inquiry deleted successfully')
      // Remove from local state
      setInquiries(inquiries.filter((inq) => inq.id !== inquiryId))
    } catch (error: any) {
      console.error('Error deleting inquiry:', error)
      toast.error(error.message || 'Failed to delete inquiry')
    } finally {
      setDeletingInquiryId(null)
    }
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
            <p className="text-gray-600">
              View and manage all customer inquiries from the contact form
              {user && <span className="ml-2 text-sm text-gray-500">• Logged in as {user.email}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Customer Inquiries
              {inquiries.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-pink-500 text-white">
                  {inquiries.length}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              View and manage all customer inquiries from the contact form
            </CardDescription>
            <CardAction>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInquiries}
                disabled={loadingInquiries}
              >
                {loadingInquiries ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {loadingInquiries ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No inquiries yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Customer inquiries will appear here when they submit the contact form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="border-l-4 border-l-pink-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {inquiry.name}
                          </h3>
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(inquiry.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                disabled={deletingInquiryId === inquiry.id}
                              >
                                {deletingInquiryId === inquiry.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this inquiry from{' '}
                                  <strong>{inquiry.name}</strong>? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteInquiry(inquiry.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Fitness Goal
                          </p>
                          <p className="text-gray-900 font-medium">{inquiry.fitness_goal}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Message
                          </p>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

