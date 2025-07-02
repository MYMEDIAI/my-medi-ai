import MyMedLogo from "./mymed-logo"

export default function PoweredByFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <MyMedLogo size="sm" />
          <div className="text-center">
            <p className="text-sm text-gray-600">Powered by MYMED.AI • Made in India 🇮🇳 • HIPAA Compliant</p>
            <p className="text-xs text-gray-500 mt-1">
              This platform provides general health information and is not a substitute for professional medical advice.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>© 2024 MyMedi.ai</span>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">
              Terms of Service
            </a>
            <span>•</span>
            <a href="mailto:Harsha@mymedi.ai" className="hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
