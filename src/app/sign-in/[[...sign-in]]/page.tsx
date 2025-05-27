import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
              card: 'bg-dark-800 border border-dark-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/70',
              socialButtonsBlockButton: 'border-dark-600 text-white hover:bg-dark-700',
              formFieldLabel: 'text-white',
              formFieldInput: 'bg-dark-700 border-dark-600 text-white',
              footerActionLink: 'text-primary-500 hover:text-primary-400',
            }
          }}
        />
      </div>
    </div>
  )
}