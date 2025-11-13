'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, RotateCcw, ArrowLeft, LogOut, Trash2, Search, Copy, Clock, User, MessageSquare, Target, ChevronDown, ChevronUp, Mail as MailIcon } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Login } from '../login'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedInquiries, setExpandedInquiries] = useState<Set<string>>(new Set())

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
      
      // Verify user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error('You must be logged in to delete inquiries')
      }

      // First, verify the inquiry exists
      const { data: existing, error: checkError } = await supabase
        .from('customer_inquiries')
        .select('id')
        .eq('id', inquiryId)
        .single()

      if (checkError) {
        throw new Error(`Inquiry not found: ${checkError.message}`)
      }

      console.log('Attempting to delete inquiry:', inquiryId)
      
      // Delete the inquiry with select to get confirmation
      const { data, error } = await supabase
        .from('customer_inquiries')
        .delete()
        .eq('id', inquiryId)
        .select()

      if (error) {
        console.error('Supabase delete error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        
        // Check for RLS policy errors
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy') || error.message?.includes('RLS')) {
          throw new Error(
            'Permission denied. The Row Level Security (RLS) policy may not be set up correctly.\n\n' +
            'Please run this SQL in your Supabase SQL Editor:\n\n' +
            'CREATE POLICY "Allow authenticated users to delete customer_inquiries" ON customer_inquiries\n' +
            'FOR DELETE\n' +
            'USING (auth.uid() IS NOT NULL);'
          )
        }
        throw error
      }

      // Verify deletion was successful
      if (!data || data.length === 0) {
        // This might happen if RLS prevents seeing the deleted row, but deletion might still have worked
        console.warn('Delete returned no data, but this might be due to RLS. Verifying deletion...')
        
        // Check if inquiry still exists
        const { data: verifyData } = await supabase
          .from('customer_inquiries')
          .select('id')
          .eq('id', inquiryId)
          .single()
        
        if (verifyData) {
          throw new Error('Inquiry still exists after delete operation. RLS policy may be blocking deletion.')
        }
      }

      console.log('Inquiry deleted successfully:', data)
      toast.success('Inquiry deleted successfully')
      
      // Remove from local state
      setInquiries(inquiries.filter((inq) => inq.id !== inquiryId))
      setExpandedInquiries(prev => {
        const next = new Set(prev)
        next.delete(inquiryId)
        return next
      })
      
      // Reload inquiries to ensure sync
      await loadInquiries()
    } catch (error: any) {
      console.error('Error deleting inquiry:', error)
      const errorMessage = error?.message || error?.error?.message || 'Failed to delete inquiry'
      toast.error(errorMessage)
    } finally {
      setDeletingInquiryId(null)
    }
  }

  const toggleExpand = (inquiryId: string) => {
    setExpandedInquiries(prev => {
      const next = new Set(prev)
      if (next.has(inquiryId)) {
        next.delete(inquiryId)
      } else {
        next.add(inquiryId)
      }
      return next
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isNew = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    return diffInHours < 24
  }

  // Filter and search inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = searchQuery === '' || 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.fitness_goal.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20">
        <div className="flex flex-col items-center gap-4 animate-fade-in-scale">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-20 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 animate-slide-in-up">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 tracking-tight">
              Customer Inquiries
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              View and manage all customer inquiries from the contact form
              {user && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-xs font-medium text-slate-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {user.email}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/admin">
              <Button 
                variant="outline" 
                className="gap-2 hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:scale-105 hover:shadow-md transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 animate-fade-in-scale">
          <CardHeader className="border-b border-slate-100/50">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900 mb-1">
                  <Mail className="w-5 h-5 text-pink-500" />
              Customer Inquiries
              {inquiries.length > 0 && (
                    <span className="ml-2 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30">
                  {inquiries.length}
                </span>
              )}
            </CardTitle>
                <CardDescription className="text-slate-600">
              View and manage all customer inquiries from the contact form
            </CardDescription>
              </div>
              <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadInquiries}
                disabled={loadingInquiries}
                  className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
              >
                {loadingInquiries ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                  </>
                )}
              </Button>
              </div>
            </div>

            {/* Search */}
            {inquiries.length > 0 && (
              <div className="mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, email, message, or goal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-pink-200 transition-all duration-300"
                  />
                </div>
                {filteredInquiries.length !== inquiries.length && (
                  <p className="text-sm text-slate-500 mt-2">
                    Showing {filteredInquiries.length} of {inquiries.length} inquiries
                  </p>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loadingInquiries ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 animate-fade-in-scale">
                <div className="relative inline-block mb-4">
                  <Mail className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-pink-200/20 rounded-full blur-2xl -z-10"></div>
                </div>
                <p className="text-slate-600 text-lg font-medium mb-2">No inquiries yet</p>
                <p className="text-slate-400 text-sm">
                  Customer inquiries will appear here when they submit the contact form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inquiry, index) => {
                  const isExpanded = expandedInquiries.has(inquiry.id)
                  const isNewInquiry = isNew(inquiry.created_at)
                  
                  return (
                    <Card 
                      key={inquiry.id} 
                      className={`border-l-4 ${
                        isNewInquiry 
                          ? 'border-l-pink-500 bg-gradient-to-r from-pink-50/30 to-white' 
                          : 'border-l-slate-300 bg-white/80'
                      } backdrop-blur-sm hover:shadow-xl hover:scale-[1.005] transition-all duration-300 animate-slide-in-up`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                    <CardContent className="p-6">
                        {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-pink-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">
                            {inquiry.name}
                          </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`mailto:${inquiry.email}`}
                                    className="text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors duration-300 hover:underline flex items-center gap-1 group"
                          >
                                    <MailIcon className="w-3 h-3" />
                            {inquiry.email}
                          </a>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(inquiry.email, 'Email')}
                                    title="Copy email"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Info */}
                            <div className="flex items-center gap-3 flex-wrap mt-3">
                              <Badge 
                                variant="outline" 
                                className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 text-pink-700"
                              >
                                <Target className="w-3 h-3 mr-1" />
                                {inquiry.fitness_goal}
                              </Badge>
                              {isNewInquiry && (
                                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse">
                                  <Clock className="w-3 h-3 mr-1" />
                                  New
                                </Badge>
                              )}
                            </div>
                        </div>
                          
                          <div className="flex items-start gap-3 ml-4">
                          <div className="text-right">
                              <p className="text-xs text-slate-400 mb-1">
                                {getRelativeTime(inquiry.created_at)}
                              </p>
                              <p className="text-xs text-slate-500">
                              {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                  year: 'numeric',
                              })}
                            </p>
                          </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpand(inquiry.id)}
                                className="h-8 w-8 p-0 hover:bg-slate-100"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:scale-105 hover:shadow-md transition-all duration-300 group h-8"
                                    disabled={deletingInquiryId === inquiry.id}
                                  >
                                    {deletingInquiryId === inquiry.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
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
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="space-y-4 pt-4 border-t border-slate-100 animate-slide-in-up">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-pink-100/50 hover:shadow-md transition-all duration-300">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Fitness Goal
                                </p>
                              </div>
                              <p className="text-slate-900 font-medium">{inquiry.fitness_goal}</p>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50/50 to-gray-50/50 border border-slate-100/50 hover:shadow-md transition-all duration-300">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                            Message
                          </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => copyToClipboard(inquiry.message, 'Message')}
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                              </div>
                              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {inquiry.message}
                          </p>
                        </div>

                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `mailto:${inquiry.email}?subject=Re: Your Inquiry`}
                                className="flex-1 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-all duration-300"
                              >
                                <MailIcon className="w-4 h-4 mr-2" />
                                Reply via Email
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(`${inquiry.name}\n${inquiry.email}\n\nGoal: ${inquiry.fitness_goal}\n\nMessage:\n${inquiry.message}`, 'Inquiry details')}
                                className="hover:bg-slate-50 transition-all duration-300"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy All
                              </Button>
                            </div>
                      </div>
                        )}
                    </CardContent>
                  </Card>
                  )
                })}
                
                {filteredInquiries.length === 0 && inquiries.length > 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-2">No inquiries match your search</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

