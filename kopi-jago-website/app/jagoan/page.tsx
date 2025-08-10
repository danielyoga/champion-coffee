"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Wallet, Send, Users, ArrowLeft, MapPin, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JagoanDashboard() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [balance, setBalance] = useState(75000)
  const [transferAmount, setTransferAmount] = useState("")
  const [selectedJagoan, setSelectedJagoan] = useState("")
  const [showTransfer, setShowTransfer] = useState(false)
  const router = useRouter()

  const jagoans = [
    { id: 1, name: "Ahmad Coffee", location: "Menteng", rating: 4.8, balance: 120000 },
    { id: 2, name: "Sari Kopi", location: "Kemang", rating: 4.9, balance: 95000 },
    { id: 3, name: "Budi's Brew", location: "Senayan", rating: 4.7, balance: 150000 },
    { id: 4, name: "Maya Coffee Cart", location: "Sudirman", rating: 4.6, balance: 80000 },
  ]

  const handleTransfer = () => {
    const amount = Number.parseInt(transferAmount)
    if (amount > 0 && amount <= balance && selectedJagoan) {
      setBalance(balance - amount)
      setTransferAmount("")
      setSelectedJagoan("")
      setShowTransfer(false)
      alert("Transfer successful!")
    } else {
      alert("Invalid transfer amount or recipient!")
    }
  }

  const handleRegistration = () => {
    setIsRegistered(true)
    alert("Registration successful! Welcome to Champion Coffee Jagoans!")
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-black">Champion Coffee</h1>
                </div>
              </div>
              <div className="text-sm text-gray-600">Jagoan Registration</div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">Become a Jagoan</CardTitle>
              <CardDescription>Join our network of coffee champions and start earning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/*  <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Location/Area"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <textarea
                  placeholder="Tell us about your coffee experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>*/}
              <Button onClick={handleRegistration} className="w-full bg-black hover:bg-gray-800 text-white" size="lg">
                Register as Jagoan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-black">Champion Coffee</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">Jagoan Dashboard</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Balance & Transfer Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Balance Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-red-600" />
                  <span>My Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">Rp {balance.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Available Balance</div>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-red-600" />
                  <span>Transfer Funds</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showTransfer ? (
                  <Button
                    onClick={() => setShowTransfer(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Transfer to Jagoan
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <select
                      value={selectedJagoan}
                      onChange={(e) => setSelectedJagoan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Jagoan</option>
                      {jagoans.map((jagoan) => (
                        <option key={jagoan.id} value={jagoan.name}>
                          {jagoan.name} - {jagoan.location}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleTransfer} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        Send
                      </Button>
                      <Button onClick={() => setShowTransfer(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Jagoans List */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span>Fellow Jagoans</span>
                </CardTitle>
                <CardDescription>Connect with other coffee champions in your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jagoans.map((jagoan) => (
                    <div
                      key={jagoan.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">{jagoan.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{jagoan.location}</span>
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{jagoan.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-black">Rp {jagoan.balance.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Balance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
