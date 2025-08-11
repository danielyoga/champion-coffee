"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Wallet, Plus, ShoppingCart, ArrowLeft, RefreshCw, TestTube } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStacks } from "@/hooks/use-stacks"
import { abbreviateAddress, formatStx, testContractBalance } from "@/lib/stx-utils"
import { ClientOnly } from "@/components/client-only"

function CustomerDashboardContent() {
  const router = useRouter()
  const { userData, stxBalance, allianceTokenBalance, disconnectWallet, handleMintForPurchase, refreshAllianceTokenBalance, isClient } = useStacks()
  const [contractBalance, setContractBalance] = useState<number | null>(null)

  const handlePurchase = (price: number) => {
    if (allianceTokenBalance >= price) {
      // In a real implementation, you would call a contract function to transfer tokens
      alert("Purchase successful!")
      // Refresh the balance after purchase
      refreshAllianceTokenBalance()
    } else {
      alert("Insufficient balance!")
    }
  }

  const handleTopUp = async () => {
    console.log("Top up button clicked!") // Debug log
    console.log("userData:", userData) // Debug log
    console.log("isClient:", isClient) // Debug log

    if (!userData) {
      console.log("No userData, showing alert") // Debug log
      alert("Please connect your wallet first!")
      return
    }

    console.log("UserData exists, proceeding...") // Debug log

    try {
      console.log("Calling handleMintForPurchase...") // Debug log
      // Call the mint-for-purchase function from the smart contract
      await handleMintForPurchase()
      console.log("handleMintForPurchase completed successfully") // Debug log
    } catch (error) {
      console.error("Top up failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert("Error: " + errorMessage) // Show error to user
      // Error handling is done in the contract call function
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log("handleButtonClick called!") // Debug log
    e.preventDefault()
    e.stopPropagation()
    console.log("Button clicked!") // Debug log
    console.log("About to call handleTopUp...") // Debug log

    // Add a simple alert to test if the click is working
    alert("Button clicked! Testing...")

    handleTopUp()
  }

  const handleRefreshBalance = () => {
    console.log("Manual refresh clicked")
    console.log("Current allianceTokenBalance:", allianceTokenBalance)
    console.log("User data:", userData)
    refreshAllianceTokenBalance()
  }

  const handleTestContractBalance = async () => {
    if (!userData) {
      alert("Please connect your wallet first!")
      return
    }

    try {
      const address = userData.profile.stxAddress.testnet
      console.log("Testing contract balance for address:", address)
      const balance = await testContractBalance(address)
      setContractBalance(balance)
      console.log("Contract balance result:", balance)
    } catch (error) {
      console.error("Error testing contract balance:", error)
    }
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
              {isClient && userData && (
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
                  {allianceTokenBalance > 0 ? (
                    <>
                      <div className="text-3xl font-bold text-black">{allianceTokenBalance.toLocaleString()} Alliance Tokens</div>
                      <div className="text-sm text-gray-600">Available Balance</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-black">0 Alliance Tokens</div>
                      <div className="text-sm text-gray-600">No tokens yet - Get your first tokens!</div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleButtonClick}
                    className="w-full bg-red-600 hover:bg-red-700 text-white relative z-10 cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {allianceTokenBalance > 0 ? "Get More Alliance Tokens" : "Get Your First Alliance Tokens"}
                  </Button>

                  <Button
                    onClick={handleRefreshBalance}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Balance
                  </Button>

                  <Button
                    onClick={handleTestContractBalance}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Contract Balance
                  </Button>
                </div>

                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
                  <div>Debug Info:</div>
                  <div>Balance: {allianceTokenBalance}</div>
                  <div>Contract Balance: {contractBalance !== null ? contractBalance : 'Not tested'}</div>
                  <div>Is Client: {isClient ? 'Yes' : 'No'}</div>
                  <div>User Connected: {userData ? 'Yes' : 'No'}</div>
                  {userData && (
                    <div>Address: {abbreviateAddress(userData.profile.stxAddress.testnet)}</div>
                  )}
                </div>
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
                      <div className="text-xl font-bold text-red-600 mt-2">15,000 Tokens</div>
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
                      <div className="text-xl font-bold text-red-600 mt-2">12,000 Tokens</div>
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

export default function CustomerDashboard() {
  return (
    <ClientOnly>
      <CustomerDashboardContent />
    </ClientOnly>
  )
}
