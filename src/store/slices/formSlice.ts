import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PersonalInfoFormData } from '../../schemas/financial-assistance'

// Define the complete form data structure
export interface FinancialAssistanceFormData {
  personalInfo: PersonalInfoFormData
  familyFinancial: {
    monthlyIncome: string
    monthlyExpenses: string
    dependents: string
    employmentStatus: string
    employerName: string
    jobTitle: string
    workExperience: string
    additionalIncome: string
    additionalIncomeSource: string
  }
  situationDescription: {
    currentFinancialSituation: string
    employmentCircumstances: string
    reasonForApplying: string
    previousAssistance: string
    documents: string[]
    additionalInfo: string
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
      
      // Convert dateOfBirth string back to Date object if it exists
      if (parsed.formData?.personalInfo?.dateOfBirth && typeof parsed.formData.personalInfo.dateOfBirth === 'string') {
        const date = new Date(parsed.formData.personalInfo.dateOfBirth)
        // Only set the date if it's valid
        if (!isNaN(date.getTime())) {
          parsed.formData.personalInfo.dateOfBirth = date
        } else {
          // Remove invalid date
          delete parsed.formData.personalInfo.dateOfBirth
        }
      }
      
      return {
        currentStep: parsed.currentStep || 'personal-info',
        formData: parsed.formData || {},
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
    formData: {},
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
      state.formData = {}
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
  saveToLocalStorage,
  clearForm,
  markAsClean,
  markSubmissionSuccess,
} = formSlice.actions

export default formSlice.reducer
