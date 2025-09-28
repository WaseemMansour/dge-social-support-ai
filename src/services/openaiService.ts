import OpenAI from 'openai'
import type { AIRequest, AIResponse } from '../store/api/financialAssistanceApi'

// Initialize OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
  if (openaiClient) {
    return openaiClient
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    return null
  }

  try {
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    })
    return openaiClient
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error)
    return null
  }
}

// Build AI prompt based on form data and field name
function buildAIPrompt(request: AIRequest): string {
  const { fieldName, formData } = request
  const { personalInfo, familyFinancial } = formData
  
  // Extract relevant information from form data with proper typing
  const personalInfoData = personalInfo as Record<string, unknown> || {}
  const familyFinancialData = familyFinancial as Record<string, unknown> || {}
  
  const name = `${personalInfoData.firstName || ''} ${personalInfoData.lastName || ''}`.trim()
  const dateOfBirth = personalInfoData.dateOfBirth as Date | undefined
  const employmentStatus = familyFinancialData.employmentStatus as string || ''
  const monthlyIncome = familyFinancialData.monthlyIncome as string || ''
  const familySize = familyFinancialData.familySize as string || ''
  const dependents = familyFinancialData.dependents as string || ''
  
  let basePrompt = ''
  
  switch (fieldName) {
    case 'currentFinancialSituation':
      basePrompt = `Help me describe my current financial situation. `
      break
    case 'employmentCircumstances':
      basePrompt = `Help me describe my employment circumstances. `
      break
    case 'reasonForApplying':
      basePrompt = `Help me explain why I am applying for financial assistance. `
      break
    default:
      basePrompt = `Help me describe my situation. `
  }
  
  // Add context from form data
  const context = []
  if (name) context.push(`Name: ${name}`)
  if (employmentStatus) context.push(`Employment Status: ${employmentStatus}`)
  if (monthlyIncome) context.push(`Monthly Income: ${monthlyIncome}`)
  if (familySize) context.push(`Family Size: ${familySize}`)
  if (dependents) context.push(`Dependents: ${dependents}`)
  if (dateOfBirth) {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
    context.push(`Age: ${age}`)
  }
  
  if (context.length > 0) {
    basePrompt += `Based on this information: ${context.join(', ')}. `
  }
  
  basePrompt += `Please write a clear, professional, and empathetic description that would be appropriate for a financial assistance application.`
  
  return basePrompt
}

// Generate AI content using OpenAI SDK
export async function generateAIContent(request: AIRequest): Promise<AIResponse> {
  const client = getOpenAIClient()
  
  if (!client) {
    // Return mock response if no API key
    return getMockAIResponse(request)
  }

  try {
    const prompt = buildAIPrompt(request)
    
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that helps users write clear, professional descriptions of their financial situations for assistance applications. Be empathetic, concise, and factual.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const content = completion.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error('No content generated')
    }

    return {
      content,
      success: true,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Return mock response on error
    return getMockAIResponse(request)
  }
}

// Mock response generator (fallback)
function getMockAIResponse(request: AIRequest): AIResponse {
  const { fieldName } = request
  
  const mockResponses = {
    currentFinancialSituation: "I am currently facing significant financial challenges that have made it difficult to meet my basic living expenses. My monthly income is insufficient to cover essential costs such as housing, utilities, and groceries, leaving me in a precarious financial position that requires immediate assistance.",
    
    employmentCircumstances: "My current employment situation is unstable due to recent changes in my work circumstances. I am experiencing reduced hours, temporary layoffs, or other employment-related challenges that have significantly impacted my ability to maintain a stable income and provide for my family's needs.",
    
    reasonForApplying: "I am applying for financial assistance because I am experiencing genuine financial hardship that has made it difficult to meet my basic needs. This assistance would provide temporary relief while I work to improve my financial situation through employment opportunities and better financial management. I am committed to using any assistance responsibly and working towards long-term financial stability."
  }
  
  return {
    content: mockResponses[fieldName as keyof typeof mockResponses] || "I am experiencing financial difficulties and would appreciate assistance during this challenging time.",
    success: true,
  }
}
