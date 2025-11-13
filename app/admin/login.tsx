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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-email"
                checked={rememberEmail}
                onCheckedChange={handleRememberEmailChange}
                disabled={loading}
              />
              <Label
                htmlFor="remember-email"
                className="text-sm font-normal cursor-pointer"
              >
                Remember email address
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

