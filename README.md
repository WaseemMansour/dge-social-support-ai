# DGE Social Support AI

A modern, AI-powered financial assistance application platform built for the Department of Government Excellence (DGE). This application streamlines the process of applying for financial support while providing intelligent assistance to applicants.

![Application Overview](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/financial-assistance-form-overview.png)

## 🌟 Features

- 🤖 **AI-Powered Assistance**: Intelligent help for form filling using OpenAI's GPT models
- 🌐 **Bilingual Support**: Full Arabic and English language support
- 📱 **Responsive Design**: Seamless experience across all devices
- ♿ **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- 🔒 **Secure Form Handling**: Robust validation and secure data processing
- 🎯 **Step-by-Step Wizard**: Intuitive multi-step application process
- 💡 **Smart Suggestions**: AI-powered content suggestions for better form completion

## 🖼️ Application Showcase

<details>
<summary>Click to view application screenshots</summary>

### Landing Page
![Landing Page](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/landing-page.png)

### Personal Information Step
![Personal Information](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/financial-assistance-personal-info.png)

### Family Information Step
![Family Information](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/financial-assistance-family-info.png)

### Situation Description Step
![Situation Description](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/financial-assistance-situation.png)

### AI Assistance Feature
![AI Assistance](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/ai-assistance-demo.png)

### Success Screen
![Success Screen](https://raw.githubusercontent.com/WaseemMansour/dge-social-support-ai/main/public/screenshots/financial-assistance-success.png)

</details>

## 🏗️ Technology Stack & Architecture

### Why This Stack?

We've carefully chosen our technology stack to provide the best developer experience while ensuring high performance and maintainability:

- **React + Vite**: For fast development and optimal production builds
- **TypeScript**: For type safety and better developer experience
- **TanStack Router**: For type-safe routing with built-in data loading
- **Redux Toolkit + RTK Query**: For predictable state management and efficient API calls
- **Shadcn/UI**: For beautiful, accessible, and customizable components
- **Tailwind CSS**: For utility-first styling with excellent DX
- **OpenAI SDK**: For reliable AI integration
- **Vitest + Playwright**: For comprehensive testing coverage
- **i18next**: For robust internationalization

### Architecture Decisions

1. **Modular Component Structure**
   - Reusable UI components in `src/components/ui`
   - Feature-specific components in respective feature directories
   - Shared layouts for consistent UI

2. **Type-Safe Development**
   - Strict TypeScript configuration
   - No use of `any` type, preferring `unknown` with type guards
   - Zod schemas for runtime validation

3. **State Management**
   - Redux Toolkit for global state
   - RTK Query for API cache management
   - Local component state for UI-specific state

4. **Testing Strategy**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Continuous Integration checks

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 7.0.0 or higher

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone [repository-url]
   cd dge-social-support-ai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Create a \`.env.local\` file
   - Add required variables:
     \`\`\`
     VITE_OPENAI_API_KEY=your-openai-api-key
     \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧪 Testing

- Run E2E tests:
  \`\`\`bash
  npm run test:e2e
  \`\`\`

## 🛠️ Development Tools

### Adding UI Components

Use Shadcn to add new components:

\`\`\`bash
pnpx shadcn@latest add [component-name]
\`\`\`

### Code Quality

- Linting: \`npm run lint\`
- Formatting: \`npm run format\`
- Type checking: \`npm run check\`

## 🌍 Internationalization

The application supports both English and Arabic languages. Language files are located in \`src/locales/\`.

## 📦 Building for Production

Build the application:

\`\`\`bash
npm run build
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
