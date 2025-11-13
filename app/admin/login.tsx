'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface LoginProps {
  onLoginSuccess: () => void
}

const REMEMBERED_EMAIL_KEY = 'admin_remembered_email'
const REMEMBER_EMAIL_KEY = 'admin_remember_email'

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(true)

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY)
    const shouldRemember = localStorage.getItem(REMEMBER_EMAIL_KEY) !== 'false'
    
    if (rememberedEmail && shouldRemember) {
      setEmail(rememberedEmail)
      setRememberEmail(true)
    } else {
      setRememberEmail(shouldRemember)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Save email if "Remember email" is checked
        if (rememberEmail) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
          localStorage.setItem(REMEMBER_EMAIL_KEY, 'true')
        } else {
          // Clear remembered email if unchecked
          localStorage.removeItem(REMEMBERED_EMAIL_KEY)
          localStorage.setItem(REMEMBER_EMAIL_KEY, 'false')
        }
        
        toast.success('Login successful!')
        onLoginSuccess()
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleRememberEmailChange = (checked: boolean) => {
    setRememberEmail(checked)
    localStorage.setItem(REMEMBER_EMAIL_KEY, checked.toString())
    
    // If unchecking, clear the remembered email
    if (!checked) {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    } else if (email) {
      // If checking and email exists, save it
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-xl border-white/50 shadow-2xl shadow-pink-500/10 relative z-10 animate-fade-in-scale hover:shadow-3xl hover:shadow-pink-500/20 transition-all duration-500">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mb-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <Lock className="w-8 h-8 text-pink-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Login
            </CardTitle>
            <CardDescription className="text-slate-600">
              Enter your credentials to access the Dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-pink-200 hover:shadow-sm transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-pink-200 hover:shadow-sm transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-email"
                checked={rememberEmail}
                onCheckedChange={handleRememberEmailChange}
                disabled={loading}
                className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label
                htmlFor="remember-email"
                className="text-sm font-normal cursor-pointer text-slate-600 hover:text-slate-900 transition-colors duration-300"
              >
                Remember email address
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <Lock className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

