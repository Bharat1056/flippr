# Enterprise Next.js Application

A senior-level Next.js application with modern tooling, TypeScript, React Query, Zod validation, and Shadcn/UI components.

## 🚀 Features

- **TypeScript First**: Full TypeScript support with strict type checking
- **React Query**: Powerful data fetching with caching and background updates
- **Zod Validation**: Runtime type validation with excellent TypeScript integration
- **Shadcn/UI**: Beautiful, accessible components built with Radix UI
- **Axios Client**: Configured HTTP client with interceptors and error handling
- **Code Quality**: ESLint, Prettier, Husky, and commitlint
- **TailwindCSS v4**: Latest version with CSS variables and modern features
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Complete auth flow with token management
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios with interceptors
- **Code Quality**: ESLint, Prettier, Husky, commitlint
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=My App
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── dashboard/         # Dashboard routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── common/           # Common components
├── lib/                  # Library code
│   ├── providers/        # React providers
│   ├── hooks/            # Custom hooks
│   ├── schemas/          # Zod schemas
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
└── styles/               # Additional styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run commit` - Interactive commit with commitizen

## 🎯 Key Features

### 1. React Query Setup

- Optimized query keys for caching
- Automatic background refetching
- Optimistic updates
- Error handling and retries

### 2. Form Handling

- React Hook Form integration
- Zod schema validation
- Real-time validation feedback
- Error state management

### 3. API Client

- Axios with interceptors
- Automatic token management
- Error handling and logging
- Request/response transformation

### 4. Authentication

- Complete auth flow
- Token management
- Protected routes
- User state management

### 5. Code Quality

- ESLint with TypeScript rules
- Prettier formatting
- Husky git hooks
- Conventional commits

## 📝 Usage Examples

### Creating a Custom Hook

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { userService } from '@/lib/services/user.service'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
    staleTime: 5 * 60 * 1000,
  })
}
```

### Using Forms with Validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/lib/schemas/user-schema'

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### API Service Pattern

```typescript
import { apiClient } from '@/lib/services/axios-config'

export class UserService {
  async getUsers() {
    return apiClient.get('/users')
  }

  async createUser(data: CreateUserInput) {
    return apiClient.post('/users', data)
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use `npm run build` and `npm run start`
- **Railway**: Automatic deployment from GitHub
- **Docker**: Use the provided Dockerfile

## 🔒 Environment Variables

| Variable                   | Description  | Default                     |
| -------------------------- | ------------ | --------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL`      | App URL      | `http://localhost:3000`     |
| `NEXT_PUBLIC_APP_NAME`     | App name     | `My App`                    |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`npm run commit`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [React Query](https://tanstack.com/query) - Data fetching
- [Zod](https://zod.dev/) - Schema validation
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
