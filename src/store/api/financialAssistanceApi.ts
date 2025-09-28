import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { generateAIContent } from '../../services/openaiService'
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
}

export interface AIResponse {
  content: string
  success: boolean
  error?: string
}

export const financialAssistanceApi = createApi({
  reducerPath: 'financialAssistanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/financial-assistance', // This would be your actual API endpoint
    prepareHeaders: (headers) => {
      // Add any auth headers here
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
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
          const response = await generateAIContent(request)
          return { data: response }
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error occurred'
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
