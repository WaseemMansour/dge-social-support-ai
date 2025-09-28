import { Check, Edit3, Loader2, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import type { FinancialAssistanceFormData } from '../store/slices/formSlice'
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Mock AI generation function
  const generateContent = async () => {
    setIsGenerating(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock content generation based on field type and form data
    let content = ''
    
    switch (fieldName) {
      case 'currentFinancialSituation':
        content = `Based on your information, I understand that you are currently facing financial challenges. You have a monthly income of ${formData.familyFinancial?.monthlyIncome || 'N/A'} AED and monthly expenses of ${formData.familyFinancial?.monthlyExpenses || 'N/A'} AED. With ${formData.familyFinancial?.dependents || 'N/A'} dependents, this creates a significant financial strain. Your employment status as ${formData.familyFinancial?.employmentStatus || 'N/A'} further complicates your financial stability.`
        break
      case 'employmentCircumstances':
        content = `Your employment circumstances show that you are currently ${formData.familyFinancial?.employmentStatus || 'unemployed'}. ${formData.familyFinancial?.employmentStatus === 'employed' ? `You work as a ${formData.familyFinancial?.jobTitle || 'professional'} with ${formData.familyFinancial?.workExperience || 'N/A'} years of experience.` : 'This situation has significantly impacted your ability to meet your financial obligations and support your family.'} The challenges you face in the current job market make it difficult to secure stable employment that would provide adequate income for your family's needs.`
        break
      case 'reasonForApplying':
        content = `I am applying for financial assistance because my current financial situation has become unsustainable. With ${formData.familyFinancial?.dependents || 'N/A'} dependents relying on me and a monthly income of ${formData.familyFinancial?.monthlyIncome || 'N/A'} AED against expenses of ${formData.familyFinancial?.monthlyExpenses || 'N/A'} AED, I am struggling to meet basic needs. My employment status as ${formData.familyFinancial?.employmentStatus || 'unemployed'} has created additional financial pressure. This assistance would help me stabilize my family's situation and work towards long-term financial independence.`
        break
      default:
        content = 'Generated content based on your information...'
    }
    
    setGeneratedContent(content)
    setIsGenerating(false)
    setIsDialogOpen(true)
  }

  const handleAccept = () => {
    onAccept(generatedContent)
    setIsDialogOpen(false)
    setGeneratedContent('')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditSave = () => {
    onEdit(generatedContent)
    setIsDialogOpen(false)
    setIsEditing(false)
    setGeneratedContent('')
  }

  const handleDisregard = () => {
    onDisregard()
    setIsDialogOpen(false)
    setGeneratedContent('')
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generateContent}
        disabled={isGenerating}
        className={cn(
          "flex items-center space-x-2 border-[#C2B89C]/30 text-[#C2B89C] hover:bg-[#C2B89C]/10 hover:border-[#C2B89C]/50 transition-all duration-200 shadow-sm",
          isRTL && "space-x-reverse",
          className
        )}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="text-sm">
          {isGenerating ? t('financial-assistance.situationFields.aiAssistance.generating') : t('financial-assistance.situationFields.aiAssistance.generate')}
        </span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
              <Sparkles className="w-5 h-5 text-[#C2B89C]" />
              <span>{t('financial-assistance.situationFields.aiAssistance.generate')}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-[#C2B89C]/10 border border-[#C2B89C]/20 rounded-lg p-4">
              <p className="text-sm text-[#C2B89C]/80">
                {t('financial-assistance.situationFields.aiAssistance.prompt')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t(`financial-assistance.situationFields.${fieldName}`)}
              </label>
              {isEditing ? (
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                  placeholder={t(`financial-assistance.situationFields.placeholders.${fieldName}`)}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
                  <p className="text-gray-800 whitespace-pre-wrap">{generatedContent}</p>
                </div>
              )}
            </div>

            <div className={cn("flex justify-end space-x-2", isRTL && "space-x-reverse")}>
              <Button
                variant="outline"
                onClick={handleDisregard}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>{t('financial-assistance.situationFields.aiAssistance.disregard')}</span>
              </Button>
              
              {isEditing ? (
                  <Button
                    onClick={handleEditSave}
                    className="flex items-center space-x-2 bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('financial-assistance.situationFields.aiAssistance.accept')}</span>
                  </Button>
              ) : (
                <>
                  <Button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t('financial-assistance.situationFields.aiAssistance.edit')}</span>
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex items-center space-x-2 bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('financial-assistance.situationFields.aiAssistance.accept')}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
