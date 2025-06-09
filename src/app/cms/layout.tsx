import CMSLayout from '@/components/cms/CMSLayout'
import { ThemeProvider } from '@/components/theme-provider'

export default function CMSLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CMSLayout>{children}</CMSLayout>
    </ThemeProvider>
  )
}

export const metadata = {
  title: {
    template: '%s | Bali Tourism CMS',
    default: 'Bali Tourism CMS',
  },
  description: 'Content Management System for Bali Tourism website',
}