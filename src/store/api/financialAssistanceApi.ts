import { createApi } from '@reduxjs/toolkit/query/react'
import { normalizeApiError } from '../../lib/api-error'
import { generateAIContent } from '../../services/openaiService'
import { createBaseQueryWithHandling } from '../baseQueryWithHandling'
import type { FinancialAssistanceFormData } from '../slices/formSlice'

// Mock API response type
interface SubmissionResponse {
  success: boolean
  applicationId: string
  message: string
  submittedAt: string
}

// Mock API error type
interface ApiError {
  status: number
  data: {
    message: string
    errors?: Record<string, string[]>
  }
}

// AI Service types
export interface AIRequest {
  prompt: string
  fieldName: string
  formData: Record<string, unknown>
  language?: string
}

export interface AIResponse {
  content: string
  success: boolean
  error?: string
}

export const financialAssistanceApi = createApi({
  reducerPath: 'financialAssistanceApi',
  baseQuery: createBaseQueryWithHandling('/api/financial-assistance'),
  tagTypes: ['FinancialAssistance', 'AIContent'],
  endpoints: (builder) => ({
    submitApplication: builder.mutation<SubmissionResponse, FinancialAssistanceFormData>({
      // Mock the API call for now
      async queryFn(formData, _queryApi, _extraOptions) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock validation
        if (!formData.personalInfo?.firstName) {
          return {
            error: {
              status: 400,
              data: {
                message: 'First name is required',
                errors: {
                  firstName: ['First name is required']
                }
              }
            } as ApiError
          }
        }
        
        // Mock successful submission
        const mockResponse: SubmissionResponse = {
          success: true,
          applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: 'Your financial assistance application has been submitted successfully',
          submittedAt: new Date().toISOString(),
        }
        
        return { data: mockResponse }
      },
      invalidatesTags: ['FinancialAssistance'],
    }),
    
    // Optional: Add endpoint to save draft
    saveDraft: builder.mutation<{ success: boolean }, Partial<FinancialAssistanceFormData>>({
      async queryFn(_formData, _queryApi, _extraOptions) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock successful draft save
        return { 
          data: { 
            success: true 
          } 
        }
      },
    }),

    // AI Content Generation endpoint using OpenAI SDK
    generateAIContent: builder.mutation<AIResponse, AIRequest>({
      async queryFn(request: AIRequest, _queryApi, _extraOptions) {
        try {
          const response = await generateAIContent(request, request.language || 'en')
          return { data: response }
        } catch (error) {
          const normalized = normalizeApiError({ status: 'FETCH_ERROR', error: error instanceof Error ? error.message : 'Network error' })
          return {
            error: {
              status: 'FETCH_ERROR',
              error: normalized.message
            }
          }
        }
      },
      invalidatesTags: ['AIContent'],
    }),
  }),
})


export const {
  useSubmitApplicationMutation,
  useSaveDraftMutation,
  useGenerateAIContentMutation,
} = financialAssistanceApi
