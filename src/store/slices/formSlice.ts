import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PersonalInfoFormData } from '../../schemas/financial-assistance'

// Define the complete form data structure
export interface FinancialAssistanceFormData {
  personalInfo: PersonalInfoFormData
  familyFinancial: {
    maritalStatus: string
    dependents: string
    employmentStatus: string
    monthlyIncome: string
    housingStatus: string
    monthlyExpenses: string
    employerName: string
    jobTitle: string
    workExperience: string
    additionalIncome?: string
    additionalIncomeSource?: string
  }
  situationDescription: {
    currentFinancialSituation: string
    employmentCircumstances: string
    reasonForApplying: string
    previousAssistance?: string
    documents?: string[]
    additionalInfo?: string
  }
  aiGeneratedContent: {
    currentFinancialSituation: string
    employmentCircumstances: string
    reasonForApplying: string
  }
}

// Define step names
export type StepName = 'personal-info' | 'family-financial' | 'situation-description' | 'success'

interface FormState {
  currentStep: StepName
  formData: Partial<FinancialAssistanceFormData>
  isDirty: boolean
  lastSaved: string | null
  hasSubmittedSuccessfully: boolean
}

// Load initial state from localStorage
const loadInitialState = (): FormState => {
  try {
    const savedState = localStorage.getItem('financial-assistance-form')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      
      // No date conversion needed - dates are now stored as strings
      
      return {
        currentStep: parsed.currentStep || 'personal-info',
        formData: {
          ...parsed.formData,
          aiGeneratedContent: parsed.formData?.aiGeneratedContent || {
            currentFinancialSituation: '',
            employmentCircumstances: '',
            reasonForApplying: ''
          }
        },
        isDirty: false,
        lastSaved: parsed.lastSaved || null,
        hasSubmittedSuccessfully: parsed.hasSubmittedSuccessfully || false,
      }
    }
  } catch (error) {
    console.error('Error loading form state from localStorage:', error)
  }
  
  return {
    currentStep: 'personal-info',
    formData: {
      aiGeneratedContent: {
        currentFinancialSituation: '',
        employmentCircumstances: '',
        reasonForApplying: ''
      }
    },
    isDirty: false,
    lastSaved: null,
    hasSubmittedSuccessfully: false,
  }
}

const initialState: FormState = loadInitialState()

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<StepName>) => {
      state.currentStep = action.payload
      state.isDirty = true
    },
    updatePersonalInfo: (state, action: PayloadAction<PersonalInfoFormData>) => {
      state.formData.personalInfo = action.payload
      state.isDirty = true
    },
    updateFamilyFinancial: (state, action: PayloadAction<FinancialAssistanceFormData['familyFinancial']>) => {
      state.formData.familyFinancial = action.payload
      state.isDirty = true
    },
    updateSituationDescription: (state, action: PayloadAction<FinancialAssistanceFormData['situationDescription']>) => {
      state.formData.situationDescription = action.payload
      state.isDirty = true
    },
    updateAIGeneratedContent: (state, action: PayloadAction<{ fieldName: string; content: string }>) => {
      if (!state.formData.aiGeneratedContent) {
        state.formData.aiGeneratedContent = {
          currentFinancialSituation: '',
          employmentCircumstances: '',
          reasonForApplying: ''
        }
      }
      state.formData.aiGeneratedContent[action.payload.fieldName as keyof typeof state.formData.aiGeneratedContent] = action.payload.content
      state.isDirty = true
    },
    saveToLocalStorage: (state) => {
      try {
        const stateToSave = {
          currentStep: state.currentStep,
          formData: state.formData,
          lastSaved: new Date().toISOString(),
        }
        localStorage.setItem('financial-assistance-form', JSON.stringify(stateToSave))
        state.lastSaved = stateToSave.lastSaved
        state.isDirty = false
      } catch (error) {
        console.error('Error saving form state to localStorage:', error)
      }
    },
    clearForm: (state) => {
      state.formData = {
        aiGeneratedContent: {
          currentFinancialSituation: '',
          employmentCircumstances: '',
          reasonForApplying: ''
        }
      }
      state.currentStep = 'personal-info'
      state.isDirty = false
      state.lastSaved = null
      state.hasSubmittedSuccessfully = false
      localStorage.removeItem('financial-assistance-form')
    },
    markAsClean: (state) => {
      state.isDirty = false
    },
    markSubmissionSuccess: (state) => {
      state.hasSubmittedSuccessfully = true
    },
  },
})

export const {
  setCurrentStep,
  updatePersonalInfo,
  updateFamilyFinancial,
  updateSituationDescription,
  updateAIGeneratedContent,
  saveToLocalStorage,
  clearForm,
  markAsClean,
  markSubmissionSuccess,
} = formSlice.actions

export default formSlice.reducer
