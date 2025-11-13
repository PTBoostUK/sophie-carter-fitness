'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Save, Image as ImageIcon, Palette, Type, Loader2, RotateCcw, ArrowLeft, LogOut, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Login } from './login'
import { AIEditor } from '@/components/ai-editor'

// Default values for each section
const DEFAULT_VALUES = {
  hero: {
    tagline: "Empowering Women Through Fitness",
    title: "Strong. Confident. Empowered.",
    subtitle: "Reach your fitness goals without stress or confusion. I'm here to guide you every step of the way with personalized training that fits your lifestyle.",
    buttonText: "Start Your Journey",
  },
  about: {
    title: "Meet Your Personal Trainer",
    description: "Hi, I'm Sophie! I'm a 27-year-old personal trainer passionate about helping women feel empowered through fitness. I believe fitness should be enjoyable, not intimidating. Whether you're just starting out or looking to level up, I'll create a plan that works for you—no stress, no confusion, just results and confidence.",
    image: "/professional-female-personal-trainer-smiling-confi.jpg",
    statsNumber: "500+",
    statsLabel: "Women Empowered",
  },
  services: {
    title: "How I Can Help",
    subtitle: "Choose the service that fits your lifestyle and goals",
    service1Title: "1-on-1 Training",
    service1Description: "Personalized in-person sessions tailored to your goals, fitness level, and schedule. Get hands-on guidance and motivation.",
    service2Title: "Online Coaching",
    service2Description: "Train anywhere with custom workout plans, video demonstrations, and ongoing support through our app.",
    service3Title: "Nutrition Guidance",
    service3Description: "Simple, sustainable nutrition advice that complements your training and helps you feel your best inside and out.",
  },
  testimonials: {
    title: "Success Stories",
    subtitle: "Real transformations from real women",
    testimonial1Text: '"Sophie completely transformed my relationship with fitness. I went from dreading workouts to actually looking forward to them! Down 2 dress sizes and feeling stronger than ever."',
    testimonial1Name: "Emma",
    testimonial1Age: "Age 34",
    testimonial2Text: '"Best decision I ever made! Sophie\'s approach is so refreshing—no judgment, just genuine support. I\'ve gained so much confidence and strength in just 3 months."',
    testimonial2Name: "Rachel",
    testimonial2Age: "Age 29",
    testimonial3Text: '"I was so intimidated by gyms before working with Sophie. She made everything feel achievable and fun. Now I\'m lifting weights I never thought possible and feeling amazing!"',
    testimonial3Name: "Jessica",
    testimonial3Age: "Age 42",
  },
  theme: {
    primaryColor: "#ec4899",
    secondaryColor: "#a855f7",
    accentColor: "#10b981",
    fontFamily: "Montserrat",
  },
}

interface SectionContent {
  id: string
  section: string
  field: string
  value: string
  image_url?: string
}

interface ThemeSettings {
  id: string
  key: string
  value: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [theme, setTheme] = useState({
    primaryColor: '#ec4899',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    fontFamily: 'Montserrat',
  })
  const [uploading, setUploading] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [inquiryCount, setInquiryCount] = useState(0)
  const [hasVisitedInquiries, setHasVisitedInquiries] = useState(false)

  useEffect(() => {
    checkAuth()
    // Check if user has visited inquiries page
    const visited = localStorage.getItem('admin_visited_inquiries')
    setHasVisitedInquiries(visited === 'true')
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setAuthenticated(true)
        setUser(session.user)
        loadContent()
        loadTheme()
        loadInquiryCount()
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

  // Refresh inquiry count periodically
  useEffect(() => {
    if (!authenticated) return

    const refreshCount = async () => {
      const { count, error } = await supabase
        .from('customer_inquiries')
        .select('*', { count: 'exact', head: true })

      if (!error && count !== null) {
        setInquiryCount(count)
      }
    }

    // Refresh every 30 seconds
    const interval = setInterval(refreshCount, 30000)
    
    // Also refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshCount()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [authenticated])

  const loadContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('section_content')
        .select('*')
        .order('section')

      if (error) throw error

      const grouped: Record<string, Record<string, string>> = {}
      data?.forEach((item: SectionContent) => {
        if (!grouped[item.section]) {
          grouped[item.section] = {}
        }
        grouped[item.section][item.field] = item.value
      })

      // Merge with default values so all fields are populated
      const mergedContent: Record<string, Record<string, string>> = {}
      for (const [section, defaults] of Object.entries(DEFAULT_VALUES)) {
        if (section === 'theme') continue // Skip theme, it's handled separately
        
        mergedContent[section] = {
          ...(defaults as Record<string, string>),
          ...(grouped[section] || {}),
        }
      }

      setContent(mergedContent)
    } catch (error) {
      console.error('Error loading content:', error)
      toast.error('Failed to load content')
      // On error, still set defaults so fields are populated
      const fallbackContent: Record<string, Record<string, string>> = {}
      for (const [section, defaults] of Object.entries(DEFAULT_VALUES)) {
        if (section === 'theme') continue
        fallbackContent[section] = defaults as Record<string, string>
      }
      setContent(fallbackContent)
    } finally {
      setLoading(false)
    }
  }

  const loadTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')

      if (error) throw error

      const themeData: Record<string, string> = {}
      data?.forEach((item: ThemeSettings) => {
        themeData[item.key] = item.value
      })

      if (Object.keys(themeData).length > 0) {
        setTheme({
          primaryColor: themeData.primaryColor || '#ec4899',
          secondaryColor: themeData.secondaryColor || '#a855f7',
          accentColor: themeData.accentColor || '#10b981',
          fontFamily: themeData.fontFamily || 'Montserrat',
        })
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const loadInquiryCount = async () => {
    try {
      const { count, error } = await supabase
        .from('customer_inquiries')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setInquiryCount(count || 0)
    } catch (error) {
      console.error('Error loading inquiry count:', error)
    }
  }

  const handleInquiriesClick = () => {
    // Mark as visited and hide notification
    localStorage.setItem('admin_visited_inquiries', 'true')
    setHasVisitedInquiries(true)
  }


  const handleContentChange = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleImageUpload = async (section: string, field: string, file: File) => {
    try {
      setUploading(`${section}-${field}`)
      const fileExt = file.name.split('.').pop()
      const fileName = `${section}-${field}-${Date.now()}.${fileExt}`
      const filePath = `images/${fileName}`

      // Try to access the bucket directly - this will fail if bucket doesn't exist or policies are wrong
      // We'll catch the error and provide helpful feedback

      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        // Check for common errors and provide helpful messages
        if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
          throw new Error(
            'Storage bucket "website-assets" not found or not accessible.\n\n' +
            'The bucket exists but policies may not be set up. Please:\n\n' +
            '1. Go to Supabase Dashboard → Storage → Policies\n' +
            '2. Select the "website-assets" bucket\n' +
            '3. Run the SQL script: setup-storage-policies.sql\n' +
            '   (Or manually create policies for SELECT, INSERT, UPDATE, DELETE)'
          )
        }
        
        // If file already exists, try to remove and re-upload
        if (uploadError.message.includes('already exists')) {
          // Remove existing file first
          await supabase.storage
            .from('website-assets')
            .remove([filePath])
          
          // Upload again
          const { error: retryError } = await supabase.storage
            .from('website-assets')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (retryError) throw retryError
        } else {
          throw uploadError
        }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('website-assets').getPublicUrl(filePath)

      handleContentChange(section, field, publicUrl)

      // Save to database
      await saveContentField(section, field, publicUrl)
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(null)
    }
  }

  const saveContentField = async (section: string, field: string, value: string) => {
    try {
      console.log('saveContentField called:', { section, field, value: value.substring(0, 50) + '...' })
      
      // First try to update existing record
      const { data: existing, error: checkError } = await supabase
        .from('section_content')
        .select('id')
        .eq('section', section)
        .eq('field', field)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new records
        console.error('Error checking existing record:', checkError)
        throw checkError
      }

      if (existing) {
        // Update existing record
        console.log('Updating existing record:', existing.id)
        const { data, error } = await supabase
          .from('section_content')
          .update({ value })
          .eq('section', section)
          .eq('field', field)
          .select()

        if (error) {
          console.error('Error updating record:', error)
          throw error
        }
        console.log('Successfully updated record:', data)
      } else {
        // Insert new record
        console.log('Inserting new record')
        const { data, error } = await supabase
          .from('section_content')
          .insert({ section, field, value })
          .select()

        if (error) {
          console.error('Error inserting record:', error)
          throw error
        }
        console.log('Successfully inserted record:', data)
      }
    } catch (error: any) {
      console.error('Error saving content field:', error)
      const errorMessage = error?.message || error?.error?.message || 'Failed to save content'
      throw new Error(errorMessage)
    }
  }

  const saveAllContent = async () => {
    try {
      setSaving(true)
      console.log('saveAllContent called, preparing records...')
      
      // Prepare all records
      const records = []
      for (const [section, fields] of Object.entries(content)) {
        for (const [field, value] of Object.entries(fields)) {
          if (value !== undefined && value !== null && value !== '') {
            records.push({
              section,
              field,
              value: String(value),
            })
          }
        }
      }

      console.log(`Prepared ${records.length} records to save`)

      if (records.length === 0) {
        toast.info('No content to save')
        return
      }

      // Process each record individually to handle conflicts
      const results = await Promise.allSettled(
        records.map(async (record) => {
          console.log(`Processing record: ${record.section}.${record.field}`)
          
          // Try to update first
          const { data: existing, error: checkError } = await supabase
            .from('section_content')
            .select('id')
            .eq('section', record.section)
            .eq('field', record.field)
            .maybeSingle()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Error checking ${record.section}.${record.field}:`, checkError)
            throw checkError
          }

          if (existing) {
            // Update existing
            console.log(`Updating existing record: ${record.section}.${record.field}`)
            const { error } = await supabase
              .from('section_content')
              .update({ value: record.value })
              .eq('section', record.section)
              .eq('field', record.field)
            
            if (error) {
              console.error(`Error updating ${record.section}.${record.field}:`, error)
              throw error
            }
            console.log(`Successfully updated: ${record.section}.${record.field}`)
          } else {
            // Insert new
            console.log(`Inserting new record: ${record.section}.${record.field}`)
            const { error } = await supabase
              .from('section_content')
              .insert(record)
            
            if (error) {
              console.error(`Error inserting ${record.section}.${record.field}:`, error)
              throw error
            }
            console.log(`Successfully inserted: ${record.section}.${record.field}`)
          }
        })
      )

      // Check for failures
      const failures = results.filter(r => r.status === 'rejected')
      if (failures.length > 0) {
        console.error('Some records failed to save:', failures)
        const errorMessages = failures.map(f => f.reason?.message || 'Unknown error').join(', ')
        toast.error(`Failed to save ${failures.length} record(s): ${errorMessages}`)
      } else {
        console.log('All records saved successfully')
        toast.success(`Successfully saved ${records.length} record(s)!`)
      }
    } catch (error: any) {
      console.error('Error saving content:', error)
      const errorMessage = error?.message || error?.error?.message || 'Failed to save content'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const saveTheme = async () => {
    try {
      setSaving(true)
      
      const records = [
        { key: 'primaryColor', value: theme.primaryColor },
        { key: 'secondaryColor', value: theme.secondaryColor },
        { key: 'accentColor', value: theme.accentColor },
        { key: 'fontFamily', value: theme.fontFamily },
      ]

      // Process each theme setting individually
      const promises = records.map(async (record) => {
        // Check if exists
        const { data: existing, error: checkError } = await supabase
          .from('theme_settings')
          .select('id')
          .eq('key', record.key)
          .maybeSingle()

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (existing) {
          // Update
          const { error } = await supabase
            .from('theme_settings')
            .update({ value: record.value })
            .eq('key', record.key)
          
          if (error) throw error
        } else {
          // Insert
          const { error } = await supabase
            .from('theme_settings')
            .insert(record)
          
          if (error) throw error
        }
      })

      await Promise.all(promises)
      
      toast.success('Theme saved successfully!')
    } catch (error: any) {
      console.error('Error saving theme:', error)
      toast.error(error.message || 'Failed to save theme')
    } finally {
      setSaving(false)
    }
  }

  const getImageUrl = (section: string, field: string) => {
    return content[section]?.[field] || ''
  }

  const revertSectionToDefault = async (sectionName: string) => {
    try {
      setSaving(true)
      const defaults = DEFAULT_VALUES[sectionName as keyof typeof DEFAULT_VALUES]
      
      if (!defaults) {
        toast.error('No default values found for this section')
        return
      }

      // Update local state
      const updatedContent: Record<string, string> = {}
      for (const [field, value] of Object.entries(defaults)) {
        updatedContent[field] = value as string
        handleContentChange(sectionName, field, value as string)
      }

      // Save to database
      const records = Object.entries(defaults).map(([field, value]) => ({
        section: sectionName,
        field,
        value: value as string,
      }))

      const promises = records.map(async (record) => {
        const { data: existing } = await supabase
          .from('section_content')
          .select('id')
          .eq('section', record.section)
          .eq('field', record.field)
          .maybeSingle()

        if (existing) {
          const { error } = await supabase
            .from('section_content')
            .update({ value: record.value })
            .eq('section', record.section)
            .eq('field', record.field)
          
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('section_content')
            .insert(record)
          
          if (error) throw error
        }
      })

      await Promise.all(promises)
      toast.success(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section reverted to defaults!`)
    } catch (error: any) {
      console.error('Error reverting section:', error)
      toast.error(error.message || 'Failed to revert section')
    } finally {
      setSaving(false)
    }
  }

  const revertThemeToDefault = async () => {
    try {
      setSaving(true)
      const defaults = DEFAULT_VALUES.theme
      
      // Update local state
      setTheme({
        primaryColor: defaults.primaryColor,
        secondaryColor: defaults.secondaryColor,
        accentColor: defaults.accentColor,
        fontFamily: defaults.fontFamily,
      })

      // Save to database
      const records = [
        { key: 'primaryColor', value: defaults.primaryColor },
        { key: 'secondaryColor', value: defaults.secondaryColor },
        { key: 'accentColor', value: defaults.accentColor },
        { key: 'fontFamily', value: defaults.fontFamily },
      ]

      const promises = records.map(async (record) => {
        const { data: existing } = await supabase
          .from('theme_settings')
          .select('id')
          .eq('key', record.key)
          .maybeSingle()

        if (existing) {
          const { error } = await supabase
            .from('theme_settings')
            .update({ value: record.value })
            .eq('key', record.key)
          
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('theme_settings')
            .insert(record)
          
          if (error) throw error
        }
      })

      await Promise.all(promises)
      toast.success('Theme reverted to defaults!')
    } catch (error: any) {
      console.error('Error reverting theme:', error)
      toast.error(error.message || 'Failed to revert theme')
    } finally {
      setSaving(false)
    }
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-20 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 text-sm font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-20 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 text-sm font-medium animate-pulse">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-pink-500/10 p-8 mb-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 text-sm flex items-center gap-2">
                  Manage your website content and theme settings
                  {user && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-xs font-medium text-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {user.email}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/admin/inquiries" onClick={handleInquiriesClick}>
                  <Button 
                    variant="outline" 
                    className="gap-2 relative hover:bg-pink-50 hover:border-pink-300 hover:scale-105 hover:shadow-lg transition-all duration-300 group"
                  >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    View Inquiries
                    {inquiryCount > 0 && !hasVisitedInquiries && (
                      <span className="absolute -top-2 -right-2 flex min-w-[20px] h-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white px-1.5 shadow-lg shadow-pink-500/50 animate-bounce">
                        {inquiryCount > 99 ? '99+' : inquiryCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Website
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
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg shadow-pink-500/5 p-2 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
              <TabsList className="grid w-full max-w-3xl grid-cols-5 bg-transparent gap-2">
                <TabsTrigger 
                  value="hero" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
                >
                  Hero
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
                >
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger 
                  value="testimonials" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
                >
                  Testimonials
                </TabsTrigger>
                <TabsTrigger 
                  value="theme" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Theme
                </TabsTrigger>
              </TabsList>
            </div>
            <Button 
              onClick={saveAllContent} 
              disabled={saving} 
              className="ml-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Save All
                </>
              )}
            </Button>
          </div>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:scale-[1.01] group">
              <CardHeader className="border-b border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">Hero Section</CardTitle>
                    <CardDescription className="text-slate-600">Edit the main hero section content</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revertSectionToDefault('hero')}
                      disabled={saving}
                      className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Revert to Default
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero-tagline" className="text-sm font-semibold text-slate-700">Tagline</Label>
                    <AIEditor
                      currentValue={content.hero?.tagline || ''}
                      onUpdate={(value) => handleContentChange('hero', 'tagline', value)}
                      onSave={saveContentField}
                      section="hero"
                      field="tagline"
                      fieldName="Tagline"
                      sectionName="Hero"
                    />
                  </div>
                  <Input
                    id="hero-tagline"
                    value={content.hero?.tagline || ''}
                    onChange={(e) => handleContentChange('hero', 'tagline', e.target.value)}
                    placeholder="Empowering Women Through Fitness"
                    className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-pink-200 hover:shadow-sm transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero-title">Title</Label>
                    <AIEditor
                      currentValue={content.hero?.title || ''}
                      onUpdate={(value) => handleContentChange('hero', 'title', value)}
                      onSave={saveContentField}
                      section="hero"
                      field="title"
                      fieldName="Title"
                      sectionName="Hero"
                    />
                  </div>
                  <Input
                    id="hero-title"
                    value={content.hero?.title || ''}
                    onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                    placeholder="Strong. Confident. Empowered."
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <AIEditor
                      currentValue={content.hero?.subtitle || ''}
                      onUpdate={(value) => handleContentChange('hero', 'subtitle', value)}
                      onSave={saveContentField}
                      section="hero"
                      field="subtitle"
                      fieldName="Subtitle"
                      sectionName="Hero"
                    />
                  </div>
                  <Textarea
                    id="hero-subtitle"
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                    placeholder="Reach your fitness goals without stress or confusion..."
                    rows={3}
                    className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero-button">Button Text</Label>
                    <AIEditor
                      currentValue={content.hero?.buttonText || ''}
                      onUpdate={(value) => handleContentChange('hero', 'buttonText', value)}
                      onSave={saveContentField}
                      section="hero"
                      field="buttonText"
                      fieldName="Button Text"
                      sectionName="Hero"
                    />
                  </div>
                  <Input
                    id="hero-button"
                    value={content.hero?.buttonText || ''}
                    onChange={(e) => handleContentChange('hero', 'buttonText', e.target.value)}
                    placeholder="Start Your Journey"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:scale-[1.01]">
              <CardHeader className="border-b border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">About Section</CardTitle>
                    <CardDescription className="text-slate-600">Edit the about section content and image</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revertSectionToDefault('about')}
                      disabled={saving}
                      className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Revert to Default
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about-title">Title</Label>
                    <AIEditor
                      currentValue={content.about?.title || ''}
                      onUpdate={(value) => handleContentChange('about', 'title', value)}
                      onSave={saveContentField}
                      section="about"
                      field="title"
                      fieldName="Title"
                      sectionName="About"
                    />
                  </div>
                  <Input
                    id="about-title"
                    value={content.about?.title || ''}
                    onChange={(e) => handleContentChange('about', 'title', e.target.value)}
                    placeholder="Meet Your Personal Trainer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about-description">Description</Label>
                    <AIEditor
                      currentValue={content.about?.description || ''}
                      onUpdate={(value) => handleContentChange('about', 'description', value)}
                      onSave={saveContentField}
                      section="about"
                      field="description"
                      fieldName="Description"
                      sectionName="About"
                    />
                  </div>
                  <Textarea
                    id="about-description"
                    value={content.about?.description || ''}
                    onChange={(e) => handleContentChange('about', 'description', e.target.value)}
                    placeholder="Hi, I'm Sophie! I'm a 27-year-old personal trainer..."
                    rows={5}
                    className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">About Image</Label>
                  <div className="flex items-center gap-4">
                    {getImageUrl('about', 'image') && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                        <img
                          src={getImageUrl('about', 'image')}
                          alt="About"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload('about', 'image', file)
                          }
                        }}
                        className="cursor-pointer focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all"
                        disabled={uploading === 'about-image'}
                      />
                      {uploading === 'about-image' && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                          <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about-stats">Stats Number</Label>
                    <AIEditor
                      currentValue={content.about?.statsNumber || ''}
                      onUpdate={(value) => handleContentChange('about', 'statsNumber', value)}
                      onSave={saveContentField}
                      section="about"
                      field="statsNumber"
                      fieldName="Stats Number"
                      sectionName="About"
                    />
                  </div>
                  <Input
                    id="about-stats"
                    value={content.about?.statsNumber || ''}
                    onChange={(e) => handleContentChange('about', 'statsNumber', e.target.value)}
                    placeholder="500+"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about-stats-label">Stats Label</Label>
                    <AIEditor
                      currentValue={content.about?.statsLabel || ''}
                      onUpdate={(value) => handleContentChange('about', 'statsLabel', value)}
                      onSave={saveContentField}
                      section="about"
                      field="statsLabel"
                      fieldName="Stats Label"
                      sectionName="About"
                    />
                  </div>
                  <Input
                    id="about-stats-label"
                    value={content.about?.statsLabel || ''}
                    onChange={(e) => handleContentChange('about', 'statsLabel', e.target.value)}
                    placeholder="Women Empowered"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:scale-[1.01]">
              <CardHeader className="border-b border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">Services Section</CardTitle>
                    <CardDescription className="text-slate-600">Edit service cards content</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revertSectionToDefault('services')}
                      disabled={saving}
                      className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Revert to Default
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="services-title">Section Title</Label>
                    <AIEditor
                      currentValue={content.services?.title || ''}
                      onUpdate={(value) => handleContentChange('services', 'title', value)}
                      onSave={saveContentField}
                      section="services"
                      field="title"
                      fieldName="Section Title"
                      sectionName="Services"
                    />
                  </div>
                  <Input
                    id="services-title"
                    value={content.services?.title || ''}
                    onChange={(e) => handleContentChange('services', 'title', e.target.value)}
                    placeholder="How I Can Help"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="services-subtitle">Section Subtitle</Label>
                    <AIEditor
                      currentValue={content.services?.subtitle || ''}
                      onUpdate={(value) => handleContentChange('services', 'subtitle', value)}
                      onSave={saveContentField}
                      section="services"
                      field="subtitle"
                      fieldName="Section Subtitle"
                      sectionName="Services"
                    />
                  </div>
                  <Input
                    id="services-subtitle"
                    value={content.services?.subtitle || ''}
                    onChange={(e) => handleContentChange('services', 'subtitle', e.target.value)}
                    placeholder="Choose the service that fits your lifestyle and goals"
                  />
                </div>

                {/* Service 1 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Service 1 - 1-on-1 Training</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service1-title">Title</Label>
                      <AIEditor
                        currentValue={content.services?.service1Title || ''}
                        onUpdate={(value) => handleContentChange('services', 'service1Title', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service1Title"
                        fieldName="Service 1 Title"
                        sectionName="Services"
                      />
                    </div>
                    <Input
                      id="service1-title"
                      value={content.services?.service1Title || ''}
                      onChange={(e) => handleContentChange('services', 'service1Title', e.target.value)}
                      placeholder="1-on-1 Training"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service1-description">Description</Label>
                      <AIEditor
                        currentValue={content.services?.service1Description || ''}
                        onUpdate={(value) => handleContentChange('services', 'service1Description', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service1Description"
                        fieldName="Service 1 Description"
                        sectionName="Services"
                      />
                    </div>
                    <Textarea
                      id="service1-description"
                      value={content.services?.service1Description || ''}
                      onChange={(e) => handleContentChange('services', 'service1Description', e.target.value)}
                      placeholder="Personalized in-person sessions..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Service 2 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Service 2 - Online Coaching</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service2-title">Title</Label>
                      <AIEditor
                        currentValue={content.services?.service2Title || ''}
                        onUpdate={(value) => handleContentChange('services', 'service2Title', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service2Title"
                        fieldName="Service 2 Title"
                        sectionName="Services"
                      />
                    </div>
                    <Input
                      id="service2-title"
                      value={content.services?.service2Title || ''}
                      onChange={(e) => handleContentChange('services', 'service2Title', e.target.value)}
                      placeholder="Online Coaching"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service2-description">Description</Label>
                      <AIEditor
                        currentValue={content.services?.service2Description || ''}
                        onUpdate={(value) => handleContentChange('services', 'service2Description', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service2Description"
                        fieldName="Service 2 Description"
                        sectionName="Services"
                      />
                    </div>
                    <Textarea
                      id="service2-description"
                      value={content.services?.service2Description || ''}
                      onChange={(e) => handleContentChange('services', 'service2Description', e.target.value)}
                      placeholder="Train anywhere with custom workout plans..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Service 3 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Service 3 - Nutrition Guidance</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service3-title">Title</Label>
                      <AIEditor
                        currentValue={content.services?.service3Title || ''}
                        onUpdate={(value) => handleContentChange('services', 'service3Title', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service3Title"
                        fieldName="Service 3 Title"
                        sectionName="Services"
                      />
                    </div>
                    <Input
                      id="service3-title"
                      value={content.services?.service3Title || ''}
                      onChange={(e) => handleContentChange('services', 'service3Title', e.target.value)}
                      placeholder="Nutrition Guidance"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service3-description">Description</Label>
                      <AIEditor
                        currentValue={content.services?.service3Description || ''}
                        onUpdate={(value) => handleContentChange('services', 'service3Description', value)}
                        onSave={saveContentField}
                        section="services"
                        field="service3Description"
                        fieldName="Service 3 Description"
                        sectionName="Services"
                      />
                    </div>
                    <Textarea
                      id="service3-description"
                      value={content.services?.service3Description || ''}
                      onChange={(e) => handleContentChange('services', 'service3Description', e.target.value)}
                      placeholder="Simple, sustainable nutrition advice..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:scale-[1.01]">
              <CardHeader className="border-b border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">Testimonials Section</CardTitle>
                    <CardDescription className="text-slate-600">Edit testimonials content</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revertSectionToDefault('testimonials')}
                      disabled={saving}
                      className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Revert to Default
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="testimonials-title">Section Title</Label>
                    <AIEditor
                      currentValue={content.testimonials?.title || ''}
                      onUpdate={(value) => handleContentChange('testimonials', 'title', value)}
                      onSave={saveContentField}
                      section="testimonials"
                      field="title"
                      fieldName="Section Title"
                      sectionName="Testimonials"
                    />
                  </div>
                  <Input
                    id="testimonials-title"
                    value={content.testimonials?.title || ''}
                    onChange={(e) => handleContentChange('testimonials', 'title', e.target.value)}
                    placeholder="Success Stories"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="testimonials-subtitle">Section Subtitle</Label>
                    <AIEditor
                      currentValue={content.testimonials?.subtitle || ''}
                      onUpdate={(value) => handleContentChange('testimonials', 'subtitle', value)}
                      onSave={saveContentField}
                      section="testimonials"
                      field="subtitle"
                      fieldName="Section Subtitle"
                      sectionName="Testimonials"
                    />
                  </div>
                  <Input
                    id="testimonials-subtitle"
                    value={content.testimonials?.subtitle || ''}
                    onChange={(e) => handleContentChange('testimonials', 'subtitle', e.target.value)}
                    placeholder="Real transformations from real women"
                  />
                </div>

                {/* Testimonial 1 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Testimonial 1</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="testimonial1-text">Text</Label>
                      <AIEditor
                        currentValue={content.testimonials?.testimonial1Text || ''}
                        onUpdate={(value) => handleContentChange('testimonials', 'testimonial1Text', value)}
                        onSave={saveContentField}
                        section="testimonials"
                        field="testimonial1Text"
                        fieldName="Testimonial 1 Text"
                        sectionName="Testimonials"
                      />
                    </div>
                    <Textarea
                      id="testimonial1-text"
                      value={content.testimonials?.testimonial1Text || ''}
                      onChange={(e) => handleContentChange('testimonials', 'testimonial1Text', e.target.value)}
                      placeholder="Sophie completely transformed my relationship with fitness..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial1-name">Name</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial1Name || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial1Name', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial1Name"
                          fieldName="Testimonial 1 Name"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial1-name"
                        value={content.testimonials?.testimonial1Name || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial1Name', e.target.value)}
                        placeholder="Emma"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial1-age">Age</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial1Age || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial1Age', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial1Age"
                          fieldName="Testimonial 1 Age"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial1-age"
                        value={content.testimonials?.testimonial1Age || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial1Age', e.target.value)}
                        placeholder="Age 34"
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Testimonial 2</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="testimonial2-text">Text</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial2Text || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial2Text', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial2Text"
                          fieldName="Testimonial 2 Text"
                          sectionName="Testimonials"
                        />
                    </div>
                    <Textarea
                      id="testimonial2-text"
                      value={content.testimonials?.testimonial2Text || ''}
                      onChange={(e) => handleContentChange('testimonials', 'testimonial2Text', e.target.value)}
                      placeholder="Best decision I ever made!..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial2-name">Name</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial2Name || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial2Name', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial2Name"
                          fieldName="Testimonial 2 Name"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial2-name"
                        value={content.testimonials?.testimonial2Name || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial2Name', e.target.value)}
                        placeholder="Rachel"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial2-age">Age</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial2Age || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial2Age', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial2Age"
                          fieldName="Testimonial 2 Age"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial2-age"
                        value={content.testimonials?.testimonial2Age || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial2Age', e.target.value)}
                        placeholder="Age 29"
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Testimonial 3</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="testimonial3-text">Text</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial3Text || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial3Text', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial3Text"
                          fieldName="Testimonial 3 Text"
                          sectionName="Testimonials"
                        />
                    </div>
                    <Textarea
                      id="testimonial3-text"
                      value={content.testimonials?.testimonial3Text || ''}
                      onChange={(e) => handleContentChange('testimonials', 'testimonial3Text', e.target.value)}
                      placeholder="I was so intimidated by gyms before..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial3-name">Name</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial3Name || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial3Name', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial3Name"
                          fieldName="Testimonial 3 Name"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial3-name"
                        value={content.testimonials?.testimonial3Name || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial3Name', e.target.value)}
                        placeholder="Jessica"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonial3-age">Age</Label>
                        <AIEditor
                          currentValue={content.testimonials?.testimonial3Age || ''}
                          onUpdate={(value) => handleContentChange('testimonials', 'testimonial3Age', value)}
                          onSave={saveContentField}
                          section="testimonials"
                          field="testimonial3Age"
                          fieldName="Testimonial 3 Age"
                          sectionName="Testimonials"
                        />
                      </div>
                      <Input
                        id="testimonial3-age"
                        value={content.testimonials?.testimonial3Age || ''}
                        onChange={(e) => handleContentChange('testimonials', 'testimonial3Age', e.target.value)}
                        placeholder="Age 42"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Section */}
          <TabsContent value="theme" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-white/50 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:scale-[1.01]">
              <CardHeader className="border-b border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">Theme Settings</CardTitle>
                    <CardDescription className="text-slate-600">Customize your website's colors and fonts</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={revertThemeToDefault}
                      disabled={saving}
                      className="hover:bg-slate-50 hover:scale-105 hover:shadow-md transition-all duration-300 group"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Revert to Default
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-pink-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <Label htmlFor="primary-color" className="text-sm font-semibold text-slate-700">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primary-color"
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="w-16 h-12 cursor-pointer rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
                      />
                      <Input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        placeholder="#ec4899"
                        className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-violet-50/50 border border-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <Label htmlFor="secondary-color" className="text-sm font-semibold text-slate-700">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                        className="w-16 h-12 cursor-pointer rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
                      />
                      <Input
                        type="text"
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                        placeholder="#a855f7"
                        className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <Label htmlFor="accent-color" className="text-sm font-semibold text-slate-700">Accent Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="accent-color"
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        className="w-16 h-12 cursor-pointer rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
                      />
                      <Input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        placeholder="#10b981"
                        className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-slate-50/50 to-gray-50/50 border border-slate-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Label htmlFor="font-family" className="text-sm font-semibold text-slate-700">Font Family</Label>
                  <select
                    id="font-family"
                    value={theme.fontFamily}
                    onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/20 hover:border-slate-300"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button 
                    onClick={saveTheme} 
                    disabled={saving}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Theme...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Theme
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

