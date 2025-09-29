import { Check, Copy, Edit3, Loader2, RefreshCw, Sparkles, Wand2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import { useGenerateAIContentMutation, type AIRequest } from '../store/api/financialAssistanceApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { FinancialAssistanceFormData } from '../store/slices/formSlice'
import { updateAIGeneratedContent } from '../store/slices/formSlice'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/textarea'

interface AIAssistanceProps {
  fieldName: string
  onAccept: (content: string) => void
  onEdit: (content: string) => void
  onDisregard: () => void
  formData: Partial<FinancialAssistanceFormData>
  className?: string
}

export function AIAssistance({
  fieldName,
  onAccept,
  onEdit,
  onDisregard,
  formData,
  className
}: AIAssistanceProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const dispatch = useAppDispatch()
  
  // Get persisted AI generated content from Redux store
  const persistedContent = useAppSelector(state => 
    state.form.formData.aiGeneratedContent?.[fieldName as keyof typeof state.form.formData.aiGeneratedContent] || ''
  )
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(persistedContent)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [generationStep, setGenerationStep] = useState<'idle' | 'requesting' | 'complete' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const isRequestInFlight = useRef(false)
  
  // RTK Query mutation for AI content generation
  const [generateAIContent, { isLoading: isGenerating }] = useGenerateAIContentMutation()

  // Update local state when persisted content changes (but not when modal is open)
  useEffect(() => {
    if (!isDialogOpen) {
      setGeneratedContent(persistedContent)
    }
  }, [persistedContent, isDialogOpen])

  // AI content generation function with enhanced UX
  const generateContent = async () => {
    if (isRequestInFlight.current) return
    isRequestInFlight.current = true
    setIsDialogOpen(true)
    setGenerationStep('requesting')
    
    try {
        const request: AIRequest = {
          prompt: t('financial-assistance.situationFields.aiAssistance.prompt'),
          fieldName,
          formData,
          language: i18n.language
        }
      
      const response = await generateAIContent(request).unwrap()
      
      if (response.success) {
        setGeneratedContent(response.content)
        // Persist to Redux store
        dispatch(updateAIGeneratedContent({ fieldName, content: response.content }))
        setGenerationStep('complete')
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 2000)
      } else {
        setGenerationStep('error')
      }
    } catch (_error) {
      setGenerationStep('error')
    } finally {
      isRequestInFlight.current = false
    }
  }

  const handleAccept = () => {
    onAccept(generatedContent)
    setIsDialogOpen(false)
    setIsEditing(false)
    setGenerationStep('idle')
    // Keep generatedContent persistent - don't clear it
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditSave = () => {
    onEdit(generatedContent)
    // Persist edited content to Redux store
    dispatch(updateAIGeneratedContent({ fieldName, content: generatedContent }))
    setIsDialogOpen(false)
    setIsEditing(false)
    setGenerationStep('idle')
    // Keep generatedContent persistent - don't clear it
  }

  const handleDisregard = () => {
    onDisregard()
    setIsDialogOpen(false)
    setGenerationStep('idle')
    // Keep generatedContent persistent - don't clear it
  }

  const handleRegenerate = () => {
    setGenerationStep('idle')
    setGeneratedContent('') // Clear previous content when regenerating
    // Don't close the modal, just regenerate content
    generateContent()
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Only close the modal if we're not in the middle of generating content
      if (generationStep === 'idle' || generationStep === 'complete' || generationStep === 'error') {
        setIsDialogOpen(false)
        setIsEditing(false)
        setGenerationStep('idle')
      }
      // If we're generating content, don't close the modal
    }
    // Don't set isDialogOpen to true here - let the Dialog component handle it
  }

  const getStepMessage = () => {
    if (generationStep === 'requesting') return t('financial-assistance.situationFields.aiAssistance.generating')
    if (generationStep === 'complete') return t('financial-assistance.situationFields.aiAssistance.modal.generatedContent')
    if (generationStep === 'error') return t('errors.network')
    return t('financial-assistance.situationFields.aiAssistance.generating')
  }

  // Check if we have an API key
  const hasApiKey = import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'your-api-key-here'

  return (
    <>
      {/* Enhanced AI Assistant Button */}
      <div className="relative group">
        {/* Hidden help text for screen readers */}
        <div id={`ai-help-${fieldName}`} className="sr-only">
          {t('accessibility.aiAssistance')}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateContent}
          disabled={isGenerating || generationStep === 'requesting' || isRequestInFlight.current}
          aria-label={t('accessibility.generateContent')}
          aria-describedby={`ai-help-${fieldName}`}
          className={cn(
            "relative overflow-hidden flex items-center space-x-2",
            "bg-gradient-to-r from-[#C2B89C]/5 to-[#C2B89C]/10",
            "border-[#C2B89C]/40 text-[#C2B89C]",
            "hover:from-[#C2B89C]/10 hover:to-[#C2B89C]/20",
            "hover:border-[#C2B89C]/60 hover:shadow-lg hover:shadow-[#C2B89C]/20",
            "transition-all duration-300 ease-out",
            "transform hover:scale-105 active:scale-95",
            isRTL && "space-x-reverse",
            className
          )}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Icon with enhanced animation */}
          <div className="relative z-10">
            {isGenerating ? (
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin" />
                <div className="absolute inset-0 w-4 h-4 border-2 border-[#C2B89C]/20 rounded-full animate-ping" />
              </div>
            ) : (
              <div className="relative">
                <Wand2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-[#C2B89C]/60 animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Text with enhanced styling */}
          <span className="relative z-10 text-sm font-medium">
            {isGenerating ? t('financial-assistance.situationFields.aiAssistance.generating') : t('financial-assistance.situationFields.aiAssistance.generate')}
          </span>
          
          {/* Demo indicator with better styling */}
          {!hasApiKey && (
            <span className="relative z-10 text-xs bg-[#C2B89C]/20 text-[#C2B89C]/80 px-2 py-0.5 rounded-full border border-[#C2B89C]/30">
              Demo
            </span>
          )}
        </Button>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#C2B89C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      </div>

      {/* Enhanced AI Assistant Modal */}
      <Dialog open={isDialogOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Enhanced Header */}
          <DialogHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C2B89C]/5 to-transparent rounded-t-lg" />
            <DialogTitle className={cn("relative flex items-center space-x-3 py-4 text-start", isRTL && "space-x-reverse")}>
              <div className="relative m-0">
                <div className="w-10 h-10 me-2 bg-gradient-to-br from-[#C2B89C] to-[#C2B89C]/80 rounded-full flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                {showSuccessAnimation && (
                  <div className="absolute inset-0 w-10 h-10 bg-[#C2B89C] rounded-full animate-ping opacity-75" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t('financial-assistance.situationFields.aiAssistance.modal.title')}</h3>
                <p className="text-sm text-gray-600">{t('financial-assistance.situationFields.aiAssistance.modal.subtitle')}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {generationStep !== 'complete' ? (
              /* Enhanced Loading State */
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-6 max-w-md">
                  {/* Animated Progress Ring */}
                  <div className="relative mx-auto w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-[#C2B89C]/20"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset="251.2"
                        className="text-[#C2B89C] transition-all duration-1000 ease-out"
                        style={{ strokeDashoffset: generationStep === 'requesting' ? '125.6' : '0' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {generationStep === 'error' ? (
                        <X className="w-8 h-8 text-red-500" />
                      ) : (
                        <Wand2 className="w-8 h-8 text-[#C2B89C] animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  {/* Step Message */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-900">{getStepMessage()}</h4>
                    {generationStep === 'error' && (
                      <p className="text-sm text-red-600">{t('errors.network')}</p>
                    )}
                  </div>
                  
                  {/* Progress Dots removed to avoid fake staging */}
                </div>
              </div>
            ) : (
              /* Enhanced Content Display */
              <div className="space-y-6">
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Edit3 className="w-4 h-4" />
                      <span>{t('financial-assistance.situationFields.aiAssistance.modal.editContent')}</span>
                    </div>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={12}
                      className="w-full resize-none border-2 border-[#C2B89C]/20 focus:border-[#C2B89C] transition-colors max-h-96 overflow-y-auto"
                      placeholder={t('financial-assistance.situationFields.aiAssistance.modal.editPlaceholder')}
                    />
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDisregard}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                        aria-label={t('accessibility.disregardContent')}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        <span>{t('financial-assistance.situationFields.aiAssistance.modal.disregard')}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="px-6"
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white px-6"
                      >
                        {t('common.saveChanges')}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => { onAccept(generatedContent); setIsDialogOpen(false); setIsEditing(false); setGenerationStep('idle') }}
                        className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        aria-label={t('accessibility.acceptContent')}
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>{t('financial-assistance.situationFields.aiAssistance.modal.accept')}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Content Display Mode */
                  <div className="space-y-6">
                    {/* Generated Content Card */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-[#C2B89C]/20 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-gray-700">{t('financial-assistance.situationFields.aiAssistance.modal.generatedContent')}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyToClipboard}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            title={copied ? t('financial-assistance.situationFields.aiAssistance.modal.copied') : t('financial-assistance.situationFields.aiAssistance.modal.copy')}
                          >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto pr-2">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {generatedContent}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Left Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit}
                          className="flex items-center space-x-2 hover:bg-[#C2B89C]/10 hover:border-[#C2B89C]/50"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>{t('financial-assistance.situationFields.aiAssistance.modal.edit')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerate}
                          className="flex items-center space-x-2 hover:bg-[#C2B89C]/10 hover:border-[#C2B89C]/50"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>{t('financial-assistance.situationFields.aiAssistance.modal.regenerate')}</span>
                        </Button>
                      </div>
                      
                      {/* Right Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisregard}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                          aria-label={t('accessibility.disregardContent')}
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          <span>{t('financial-assistance.situationFields.aiAssistance.modal.disregard')}</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAccept}
                          className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                          aria-label={t('accessibility.acceptContent')}
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>{t('financial-assistance.situationFields.aiAssistance.modal.accept')}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
