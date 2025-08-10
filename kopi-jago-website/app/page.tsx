"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, ShoppingBag, Coffee, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStacks } from "@/hooks/use-stacks"

export default function ChampionCoffeeLanding() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()
  const { userData, connectWallet } = useStacks()

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)

    // If user is not connected, connect wallet first
    if (!userData) {
      connectWallet()
      return
    }

    // Navigate to the appropriate dashboard
    if (role === "customer") {
      router.push("/customer")
    } else if (role === "jagoan") {
      router.push("/jagoan")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-black">Champion Coffee</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-black">Choose Your Role</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join Champion Coffee as a customer to discover amazing coffee or as a Jagoan to bring quality coffee to
                your neighborhood
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Card */}
            <Card
              className={`bg-white border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${selectedRole === "customer" ? "border-white shadow-xl" : "border-white/30"
                }`}
              onClick={() => handleRoleSelect("customer")}
            >
              <CardHeader className="text-center pb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ backgroundColor: "#E53E3E" }}
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-black">Customer</CardTitle>
                <CardDescription className="text-gray-700">Order premium coffee from local merchants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                  {userData ? "Start Ordering" : "Connect Wallet to Order"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Jagoan Card */}
            <Card
              className={`bg-white border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${selectedRole === "jagoan" ? "border-white shadow-xl" : "border-white/30"
                }`}
              onClick={() => handleRoleSelect("jagoan")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-black">Jagoan</CardTitle>
                <CardDescription className="text-gray-700">
                  Become a Jagoan and bring quality coffee to your neighborhood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-black hover:bg-gray-800 text-white transition-colors" size="lg">
                  {userData ? "Become a Jagoan" : "Connect Wallet to Join"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
