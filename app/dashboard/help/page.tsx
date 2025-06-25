import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="help">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600">Get help and support for using My Medi.AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call: +91 9701744770
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email: Harsha.bandarla@gmail.com
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">How do I upload health records?</h4>
                    <p className="text-sm text-gray-600">Go to Health Records and click the upload button.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Is my data secure?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, we use enterprise-grade encryption to protect your data.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">How does the AI assistant work?</h4>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes your health data to provide personalized insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
