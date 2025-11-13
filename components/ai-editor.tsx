'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sparkles, Loader2, Wand2, Zap, TrendingUp, Heart, Target, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface AIEditorProps {
  currentValue: string
  onUpdate: (newValue: string) => void
  onSave?: (section: string, field: string, value: string) => Promise<void>
  fieldName?: string
  sectionName?: string
  section?: string
  field?: string
  disabled?: boolean
}

export function AIEditor({
  currentValue,
  onUpdate,
  onSave,
  fieldName,
  sectionName,
  section,
  field,
  disabled = false,
}: AIEditorProps) {
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [displayedPreview, setDisplayedPreview] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [confettiPositions, setConfettiPositions] = useState<Array<{ left: string; top: string; color: string; delay: string; duration: string }>>([])

  // Quick action presets
  const quickActions = [
    { id: 'engaging', label: 'More Engaging', icon: Heart, prompt: 'Make this more engaging and compelling' },
    { id: 'shorter', label: 'Make Shorter', icon: Zap, prompt: 'Make this more concise and to the point' },
    { id: 'energetic', label: 'Add Energy', icon: TrendingUp, prompt: 'Add more energy and enthusiasm' },
    { id: 'professional', label: 'More Professional', icon: Target, prompt: 'Make this more professional and polished' },
  ]

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate confetti positions only on client side when celebration is shown
  useEffect(() => {
    if (showCelebration && mounted) {
      const colors = ['#ec4899', '#a855f7', '#10b981', '#f59e0b']
      const positions = Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 0.5}s`,
        duration: `${0.5 + Math.random() * 0.5}s`,
      }))
      setConfettiPositions(positions)
    } else {
      setConfettiPositions([])
    }
  }, [showCelebration, mounted])

  // Typing animation effect
  useEffect(() => {
    if (!preview) {
      setDisplayedPreview('')
      setIsTyping(false)
      return
    }

    // Reset and start typing animation when preview changes
    setIsTyping(true)
    setDisplayedPreview('')
    let currentIndex = 0
    
    const typeInterval = setInterval(() => {
      if (currentIndex < preview.length) {
        setDisplayedPreview(preview.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 15) // Adjust speed here (lower = faster)
    
    return () => clearInterval(typeInterval)
  }, [preview])

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setSelectedQuickAction(action.id)
    setInstruction(action.prompt)
    setTimeout(() => setSelectedQuickAction(null), 2000)
  }

  const handleAIEdit = async () => {
    if (!instruction.trim()) {
      toast.error('Please provide an instruction for the AI')
      return
    }

    try {
      setLoading(true)
      setPreview(null)
      setDisplayedPreview('')
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentText: currentValue || '',
          instruction: instruction.trim(),
          fieldName,
          sectionName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get AI response')
      }

      const data = await response.json()
      // Remove any leading/trailing quotation marks as a safety measure
      const cleanedText = data.improvedText?.replace(/^["']+|["']+$/g, '') || data.improvedText
      setPreview(cleanedText)
      toast.success('✨ AI magic complete! Review the result below.')
    } catch (error: any) {
      console.error('AI edit error:', error)
      toast.error(error.message || 'Failed to generate AI content')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!preview) return

    try {
      setSaving(true)
      setShowCelebration(true)
      
      // Update local state first
      onUpdate(preview)
      
      // Save to database if save function and identifiers are provided
      if (onSave && section && field) {
        console.log('Saving to database:', { section, field, value: preview })
        await onSave(section, field, preview)
        console.log('Successfully saved to database')
      } else {
        console.warn('Save function not available:', { hasOnSave: !!onSave, section, field })
        toast.warning('Content updated locally. Please use "Save All" to persist changes.')
      }
      
      // Reset saving state immediately after successful save
      setSaving(false)
      
      // Show celebration for a moment before closing
      setTimeout(() => {
        setOpen(false)
        setInstruction('')
        setPreview(null)
        setDisplayedPreview('')
        setShowCelebration(false)
        toast.success('🎉 Content updated and saved!')
      }, 800)
    } catch (error: any) {
      console.error('Error saving content:', error)
      const errorMessage = error?.message || error?.error?.message || 'Failed to save content to database'
      toast.error(errorMessage)
      setShowCelebration(false)
      setSaving(false) // Always reset saving state on error
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setInstruction('')
    setPreview(null)
    setDisplayedPreview('')
    setShowCelebration(false)
    setSaving(false) // Reset saving state when canceling
    setLoading(false) // Also reset loading state
  }

  // Reset states when dialog closes
  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset all states when dialog closes
      setInstruction('')
      setPreview(null)
      setDisplayedPreview('')
      setShowCelebration(false)
      setSaving(false)
      setLoading(false)
      setSelectedQuickAction(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 hover:scale-105 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          disabled={disabled}
          title="Edit with AI"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Sparkles className="w-4 h-4 group-hover:animate-pulse relative z-10" />
          <span className="relative z-10 font-medium">AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {showCelebration && mounted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="relative">
              {/* Confetti effect - only render on client side */}
              {confettiPositions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: pos.color,
                    left: pos.left,
                    top: pos.top,
                    animationDelay: pos.delay,
                    animationDuration: pos.duration,
                  }}
                />
              ))}
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-scale-in" />
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
              <Wand2 className="w-6 h-6 text-pink-500 relative z-10 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Content Editor
            </span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {fieldName && sectionName
              ? `Edit ${fieldName} in ${sectionName} section`
              : 'Describe how you want to improve this content'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Quick Actions</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                const isSelected = selectedQuickAction === action.id
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                      isSelected
                        ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg'
                        : 'border-slate-200 hover:border-pink-300 bg-white'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-500' : 'text-slate-600'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-pink-600' : 'text-slate-600'}`}>
                      {action.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-text" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span>Current Content</span>
              <span className="text-xs font-normal text-slate-400">
                ({currentValue?.length || 0} characters)
              </span>
            </Label>
            <Textarea
              id="current-text"
              value={currentValue || '(empty)'}
              readOnly
              className="bg-gradient-to-br from-slate-50 to-slate-100 text-sm border-slate-200"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-instruction" className="text-sm font-semibold text-slate-700">
              What would you like to change?
            </Label>
            <Textarea
              id="ai-instruction"
              placeholder="Example: Make this more engaging and add a call to action..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              disabled={loading}
              className="focus:ring-2 focus:ring-pink-500/20 border-slate-200 hover:border-pink-200 transition-all duration-300"
            />
            {instruction && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Ready to generate magic!
              </p>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-xl border-2 border-dashed border-pink-200">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                <Loader2 className="w-10 h-10 animate-spin text-pink-500 relative z-10" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-slate-700">AI is crafting your content...</p>
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                  <span className="text-xs text-slate-500">This usually takes a few seconds</span>
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          )}

          {preview && !loading && (
            <div className="space-y-2 animate-fade-in-scale">
              <Label htmlFor="preview" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>AI Generated Preview</span>
                <span className="text-xs font-normal text-slate-400">
                  ({preview.length} characters)
                </span>
              </Label>
              <div className="relative">
                <Textarea
                  id="preview"
                  value={displayedPreview}
                  readOnly
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-sm min-h-[120px] relative z-10"
                  rows={5}
                />
                {isTyping && (
                  <span className="absolute bottom-3 right-3 text-green-500 animate-pulse">|</span>
                )}
                {!isTyping && displayedPreview === preview && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Ready!</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ArrowRight className="w-3 h-3" />
                <span>Review the preview above and click "Apply Changes" to use it</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={loading || saving}
            className="hover:bg-slate-50 hover:scale-105 transition-all duration-300"
          >
            Cancel
          </Button>
          {!preview ? (
            <Button 
              onClick={handleAIEdit} 
              disabled={loading || !instruction.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Generate Magic
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setPreview(null)
                  setDisplayedPreview('')
                }} 
                disabled={loading || saving}
                className="hover:bg-slate-50 hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={handleApply} 
                disabled={loading || saving}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Apply Changes
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

