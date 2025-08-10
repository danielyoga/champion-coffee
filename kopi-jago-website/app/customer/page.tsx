"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Wallet, Plus, ShoppingCart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStacks } from "@/hooks/use-stacks"
import { abbreviateAddress, formatStx } from "@/lib/stx-utils"

export default function CustomerDashboard() {
  const [balance, setBalance] = useState(50000)
  const router = useRouter()
  const { userData, stxBalance, disconnectWallet } = useStacks()

  const handlePurchase = (price: number) => {
    if (balance >= price) {
      setBalance(balance - price)
      alert("Purchase successful!")
    } else {
      alert("Insufficient balance!")
    }
  }

  const handleTopUp = () => {
    // Simulate wallet interaction
    alert("Connecting to wallet...")
    // In a real implementation, this would connect to the user's wallet
    // and allow them to approve the transaction
    setTimeout(() => {
      const amount = 10000 // Default top-up amount
      setBalance(balance + amount)
      alert(`Top up successful! Added Rp ${amount.toLocaleString()} to your balance.`)
    }, 2000)
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
            <div className="flex items-center space-x-4">
              {userData && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">STX: {formatStx(stxBalance)}</span>
                  <span className="text-sm text-gray-600">|</span>
                  <span className="text-sm text-gray-600">{abbreviateAddress(userData.profile.stxAddress.testnet)}</span>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet} className="text-red-600 hover:text-red-700">
                    Disconnect
                  </Button>
                </div>
              )}
              <div className="text-sm text-gray-600">Customer Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Balance Section */}
          <div className="lg:col-span-1">
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

                <Button onClick={handleTopUp} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up Balance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-red-600" />
                  <span>Available Drinks</span>
                </CardTitle>
                <CardDescription>Choose from our premium selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Hojicha Lychee Tea */}
                  <div className="text-center space-y-4">
                    <div className="relative w-48 h-64 mx-auto">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-10%20at%2015.07.24-xtj4iscZV4y0vFBHJ4qGvbF4Y4EsLj.png"
                        alt="Hojicha Lychee Tea"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black">Hojicha Lychee Tea</h3>
                      <p className="text-sm text-gray-600">Refreshing hojicha tea with sweet lychee</p>
                      <div className="text-xl font-bold text-red-600 mt-2">Rp 15,000</div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(15000)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Buy Now
                    </Button>
                  </div>

                  {/* Additional Tea Option */}
                  {/* <div className="text-center space-y-4">
                    <div className="w-48 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">More drinks coming soon</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black">Premium Coffee</h3>
                      <p className="text-sm text-gray-600">Artisan coffee blend</p>
                      <div className="text-xl font-bold text-red-600 mt-2">Rp 12,000</div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(12000)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Buy Now
                    </Button>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
