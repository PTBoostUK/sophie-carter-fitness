'use client'

import { useState } from 'react'
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
import { Sparkles, Loader2 } from 'lucide-react'
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

  const handleAIEdit = async () => {
    if (!instruction.trim()) {
      toast.error('Please provide an instruction for the AI')
      return
    }

    try {
      setLoading(true)
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
      toast.success('AI content generated! Review and apply if you like it.')
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
      
      // Update local state
      onUpdate(preview)
      
      // Save to database if save function and identifiers are provided
      if (onSave && section && field) {
        await onSave(section, field, preview)
      }
      
      setOpen(false)
      setInstruction('')
      setPreview(null)
      toast.success('Content updated and saved to database!')
    } catch (error: any) {
      console.error('Error saving content:', error)
      toast.error(error.message || 'Failed to save content to database')
      // Don't close the dialog if save failed, so user can try again
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setInstruction('')
    setPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
          title="Edit with AI"
        >
          <Sparkles className="w-4 h-4" />
          AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            AI Content Editor
          </DialogTitle>
          <DialogDescription>
            {fieldName && sectionName
              ? `Edit ${fieldName} in ${sectionName} section`
              : 'Describe how you want to improve this content'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-text">Current Content</Label>
            <Textarea
              id="current-text"
              value={currentValue || '(empty)'}
              readOnly
              className="bg-gray-50 text-sm"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-instruction">
              What would you like to change? (e.g., "Make it more engaging", "Make it shorter", "Add more energy")
            </Label>
            <Textarea
              id="ai-instruction"
              placeholder="Example: Make this more engaging and add a call to action..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label htmlFor="preview">AI Generated Preview</Label>
              <Textarea
                id="preview"
                value={preview}
                readOnly
                className="bg-green-50 border-green-200 text-sm"
                rows={4}
              />
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              <span className="ml-2 text-sm text-gray-600">AI is working on your content...</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          {!preview ? (
            <Button onClick={handleAIEdit} disabled={loading || !instruction.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setPreview(null)} disabled={loading || saving}>
                Try Again
              </Button>
              <Button onClick={handleApply} disabled={loading || saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Apply Changes'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

