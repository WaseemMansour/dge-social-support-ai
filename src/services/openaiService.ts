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
function buildAIPrompt(request: AIRequest, language: string = 'en'): string {
  const { fieldName, formData } = request
  const { personalInfo, familyFinancial } = formData
  const isArabic = language === 'ar'
  
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
      basePrompt = isArabic 
        ? `أحتاج مساعدة في الكتابة عن وضعي المالي الحالي لطلب دعم اجتماعي. يرجى مساعدتي في كتابة وصف متعاطف وصادق ومفصل عن وضعي المالي الحالي. ركز على التحديات التي أواجهها وكيف تؤثر على حياتي اليومية وعائلتي. كن متعاطفاً وداعماً في النبرة، حيث أن هذا لطلب دعم اجتماعي. `
        : `I need help writing about my current financial situation for a social support application. Please help me write a compassionate, honest, and detailed description of my current financial situation. Focus on the challenges I'm facing and how they impact my daily life and family. Be empathetic and supportive in tone, as this is for a social support application. `
      break
    case 'employmentCircumstances':
      basePrompt = isArabic
        ? `أحتاج مساعدة في وصف ظروف عملي لطلب دعم اجتماعي. يرجى مساعدتي في كتابة وصف مفصل وصادق عن ظروف عملي، بما في ذلك أي تحديات أو عوائق أواجهها في مكان العمل. كن متفهماً وداعماً في النبرة، موضحاً كيف يؤثر وضعي الوظيفي على استقراري المالي ورفاهية عائلتي. `
        : `I need help describing my employment circumstances for a social support application. Please help me write a detailed and honest description of my employment circumstances, including any challenges or barriers I face in the workplace. Be understanding and supportive in tone, explaining how my work situation affects my financial stability and family wellbeing. `
      break
    case 'reasonForApplying':
      basePrompt = isArabic
        ? `أحتاج مساعدة في شرح سبب تقديمي لطلب المساعدة الاجتماعية. يرجى مساعدتي في كتابة شرح صادق ومقنع لسبب حاجتي للمساعدة الاجتماعية. ركز على التحديات المحددة التي أواجهها، وكيف تؤثر على عائلتي، وكيف ستساعدني هذه المساعدة في تحسين وضعي. كن متعاطفاً وصادقاً في النبرة. `
        : `I need help explaining why I'm applying for social support assistance. Please help me write a heartfelt and compelling explanation of why I need social support assistance. Focus on the specific challenges I'm facing, how they impact my family, and how this assistance would help improve our situation. Be empathetic and genuine in tone. `
      break
    default:
      basePrompt = isArabic
        ? `أحتاج مساعدة في كتابة محتوى لطلب الدعم الاجتماعي. يرجى تقديم وصف متعاطف وصادق ومفصل يكون مناسباً لطلب دعم اجتماعي. `
        : `I need help writing content for my social support application. Please provide a compassionate, honest, and detailed description that would be appropriate for a social support application. `
  }
  
  // Add context from form data
  const context = []
  if (name) context.push(isArabic ? `الاسم: ${name}` : `Name: ${name}`)
  if (employmentStatus) context.push(isArabic ? `حالة التوظيف: ${employmentStatus}` : `Employment Status: ${employmentStatus}`)
  if (monthlyIncome) context.push(isArabic ? `الدخل الشهري: ${monthlyIncome}` : `Monthly Income: ${monthlyIncome}`)
  if (familySize) context.push(isArabic ? `حجم العائلة: ${familySize}` : `Family Size: ${familySize}`)
  if (dependents) context.push(isArabic ? `المعالين: ${dependents}` : `Dependents: ${dependents}`)
  if (dateOfBirth) {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
    context.push(isArabic ? `العمر: ${age}` : `Age: ${age}`)
  }
  
  if (context.length > 0) {
    basePrompt += isArabic 
      ? `بناءً على هذه المعلومات: ${context.join(', ')}. `
      : `Based on this information: ${context.join(', ')}. `
  }
  
  basePrompt += isArabic
    ? `يرجى كتابة وصف واضح ومهني ومتعاطف يكون مناسباً لطلب المساعدة المالية.`
    : `Please write a clear, professional, and empathetic description that would be appropriate for a financial assistance application.`
  
  return basePrompt
}

// Generate AI content using OpenAI SDK
export async function generateAIContent(request: AIRequest, language: string = 'en'): Promise<AIResponse> {
  const client = getOpenAIClient()
  
  if (!client) {
    // Return mock response if no API key
    return getMockAIResponse(request, language)
  }

  try {
    const prompt = buildAIPrompt(request, language)
    const isArabic = language === 'ar'
    
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: isArabic 
            ? 'أنت مساعد مفيد يساعد المستخدمين في كتابة أوصاف واضحة ومهنية عن أوضاعهم المالية لطلبات المساعدة. كن متعاطفاً ومفصلاً وواقعياً. قدم معلومات شاملة تساعد المستخدمين على التعبير عن وضعهم بوضوح.'
            : 'You are a helpful assistant that helps users write clear, professional descriptions of their financial situations for assistance applications. Be empathetic, detailed, and factual. Provide comprehensive information that helps users express their situation clearly.'
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
    return getMockAIResponse(request, language)
  }
}

// Mock response generator (fallback)
function getMockAIResponse(request: AIRequest, language: string = 'en'): AIResponse {
  const { fieldName } = request
  const isArabic = language === 'ar'
  
  const mockResponses = {
    currentFinancialSituation: isArabic 
      ? "أواجه حالياً تحديات مالية كبيرة جعلت من الصعب عليّ تلبية نفقات المعيشة الأساسية. دخلي الشهري غير كافٍ لتغطية التكاليف الأساسية مثل السكن والمرافق والمواد الغذائية، مما وضعني في وضع مالي محفوف بالمخاطر يتطلب مساعدة فورية. ارتفاع تكلفة المعيشة زاد من تفاقم وضعي، مما جعل من الصعب بشكل متزايد توفير الاحتياجات الأساسية لعائلتي. كنت أعاني للحفاظ على وضع معيشي مستقر وضمان حصول أطفالي على التغذية والرعاية الصحية المناسبة. هذا الضغط المالي أثر أيضاً على صحتي النفسية وقدرتي على التركيز في البحث عن فرص عمل أفضل. أسعى للحصول على مساعدة لمساعدتي في عبور هذه الفترة الصعبة بينما أعمل على تحسين استقراري المالي."
      : "I am currently facing significant financial challenges that have made it difficult to meet my basic living expenses. My monthly income is insufficient to cover essential costs such as housing, utilities, and groceries, leaving me in a precarious financial position that requires immediate assistance. The rising cost of living has further exacerbated my situation, making it increasingly difficult to provide for my family's basic needs. I have been struggling to maintain a stable living situation and ensure that my children have access to proper nutrition and healthcare. This financial stress has also impacted my mental health and ability to focus on finding better employment opportunities. I am seeking assistance to help bridge this difficult period while I work towards improving my financial stability.",
    
    employmentCircumstances: isArabic
      ? "وضعي الوظيفي الحالي غير مستقر بسبب التغييرات الأخيرة في ظروف عملي. أواجه ساعات عمل مخفضة، أو تسريحات مؤقتة، أو تحديات أخرى متعلقة بالعمل أثرت بشكل كبير على قدرتي في الحفاظ على دخل مستقر وتوفير احتياجات عائلتي. عدم اليقين في جدول عملي جعل من الصعب التخطيط للمستقبل والوفاء بالتزاماتي المالية. كنت أبحث بنشاط عن فرص عمل إضافية واستكشاف طرق لزيادة دخلي، لكن سوق العمل الحالي قدم تحديات كبيرة. وضعي الوظيفي تأثر أيضاً بمشاكل صحية أو مسؤوليات عائلية حدت من تواجدي. أنا ملتزم بإيجاد عمل مستقر وتحسين ظروف عملي، لكنني أحتاج مساعدة مؤقتة لمساعدتي في عبور هذه الفترة الانتقالية."
      : "My current employment situation is unstable due to recent changes in my work circumstances. I am experiencing reduced hours, temporary layoffs, or other employment-related challenges that have significantly impacted my ability to maintain a stable income and provide for my family's needs. The uncertainty of my work schedule has made it difficult to plan for the future and meet my financial obligations. I have been actively seeking additional employment opportunities and exploring ways to increase my income, but the current job market has presented significant challenges. My work situation has also been affected by health issues or family responsibilities that have limited my availability. I am committed to finding stable employment and improving my work circumstances, but I need temporary assistance to help me through this transitional period.",
    
    reasonForApplying: isArabic
      ? "أقدم على المساعدة المالية لأنني أواجه صعوبات مالية حقيقية جعلت من الصعب عليّ تلبية احتياجاتي الأساسية. هذه المساعدة ستوفر راحة مؤقتة بينما أعمل على تحسين وضعي المالي من خلال فرص العمل وإدارة مالية أفضل. أنا ملتزم باستخدام أي مساعدة بمسؤولية والعمل نحو الاستقرار المالي طويل المدى. التحديات التي أواجهها مؤقتة، ولدي خطة واضحة لكيفية تحسين ظروفي. أفهم أن هذه المساعدة مخصصة لمساعدة الأفراد والعائلات خلال الأوقات الصعبة، وأنا ممتن لفرصة الحصول على الدعم. أنا ملتزم بالشفافية حول وضعي واستخدام أي مساعدة أتلقاها لمساعدتي في العودة إلى قدمي وأصبح مكتفياً ذاتياً مرة أخرى."
      : "I am applying for financial assistance because I am experiencing genuine financial hardship that has made it difficult to meet my basic needs. This assistance would provide temporary relief while I work to improve my financial situation through employment opportunities and better financial management. I am committed to using any assistance responsibly and working towards long-term financial stability. The challenges I am facing are temporary, and I have a clear plan for how I will improve my circumstances. I understand that this assistance is meant to help individuals and families during difficult times, and I am grateful for the opportunity to receive support. I am committed to being transparent about my situation and using any assistance I receive to help me get back on my feet and become self-sufficient again."
  }
  
  const defaultResponse = isArabic 
    ? "أواجه صعوبات مالية وأقدر المساعدة خلال هذا الوقت الصعب."
    : "I am experiencing financial difficulties and would appreciate assistance during this challenging time."
  
  return {
    content: mockResponses[fieldName as keyof typeof mockResponses] || defaultResponse,
    success: true,
  }
}
