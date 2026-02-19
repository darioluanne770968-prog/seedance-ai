import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Learn how to create amazing AI-generated videos
        </p>

        <div className="prose prose-invert max-w-none">
          <h2>Coming Soon</h2>
          <p>
            Documentation is under construction. In the meantime, feel free to explore the platform!
          </p>
        </div>
      </div>
    </div>
  )
}
