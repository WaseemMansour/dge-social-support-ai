import { useNavigate } from '@tanstack/react-router'
import { CheckCircle, Copy, Home, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { useAppDispatch } from '../../../store/hooks'
import { clearForm } from '../../../store/slices/formSlice'

interface SuccessScreenProps {
  onStartNew: () => void
}

export function SuccessScreen({ onStartNew }: SuccessScreenProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  // Generate a random application number
  const generateApplicationNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `FA-${timestamp}-${random}`
  }
  
  const [applicationNumber] = useState(generateApplicationNumber())
  const [copied, setCopied] = useState(false)

  const handleStartNew = () => {
    dispatch(clearForm())
    onStartNew()
  }

  const handleGoHome = () => {
    // Navigate to home first
    navigate({ to: '/' })
    // Then clear form after navigation
    setTimeout(() => {
      dispatch(clearForm())
    }, 100)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(applicationNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-[#C2B89C]/5 to-[#C2B89C]/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('financial-assistance.success.title')}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            {t('financial-assistance.success.description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Application Number */}
          <div className="bg-gradient-to-br from-[#C2B89C]/20 to-gray-100 rounded-2xl p-8 text-center rounded-lg p-4">
            <p className="text-gray-900 text-sm text-center mb-2">
              {t('financial-assistance.success.applicationNumber')}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <code className="bg-white px-3 py-1 rounded border text-sm font-mono text-gray-800">
                {applicationNumber}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-1 hover:bg-gray-50 hover:border-gray-400"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? t('financial-assistance.success.copied') : t('financial-assistance.success.copy')}</span>
              </Button>
            </div>
            <div>
              <p className="text-gray-800 text-sm text-center mt-4">
                {t('financial-assistance.success.message')}
              </p>
            </div>
          </div>
          
           <div className="space-y-3 flex gap-2">
            <Button
              onClick={handleStartNew}
              className="flex-1 bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('financial-assistance.success.startNew')}</span>
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>{t('financial-assistance.success.goHome')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
