import { PostConditionMode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { principalCV } from "@stacks/transactions";
import { UserSession } from "@stacks/connect";
import { showConnect } from "@stacks/connect";

// Contract details
const CONTRACT_ADDRESS = "ST1R6WTW58RQFZPMMFYHZA663838XZDW1RVXC58N9";
const CONTRACT_NAME = "umkm-alliance-1";
const FUNCTION_NAME = "mint-for-purchase";

export async function mintForPurchase(customerAddress: string) {
    console.log("mintForPurchase called with address:", customerAddress);

    const functionArgs = [principalCV(customerAddress)];
    console.log("Function args:", functionArgs);

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: FUNCTION_NAME,
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
    };

    console.log("Transaction options:", txOptions);
    return txOptions;
}

export async function callMintForPurchase(customerAddress: string, appDetails: any, userSession?: UserSession) {
    try {
        console.log("callMintForPurchase started");
        console.log("Customer address:", customerAddress);
        console.log("App details:", appDetails);
        console.log("UserSession provided:", !!userSession);

        // Ensure the address is properly formatted as a principal
        const formattedAddress = customerAddress.startsWith('ST') ? customerAddress : `ST${customerAddress}`;
        console.log("Formatted address:", formattedAddress);

        const txOptions = await mintForPurchase(formattedAddress);
        console.log("Got transaction options:", txOptions);

        if ((window as any).LeatherProvider) {
            console.log("Using Leather Wallet for contract call");
            const leather = (window as any).LeatherProvider;
            console.log("Available Leather Wallet methods:", Object.keys(leather));
            console.log("Leather Wallet object:", leather);

            try {
                console.log("Trying openContractCall first...");
                const result = await openContractCall({
                    ...txOptions,
                    appDetails,
                    onFinish: (data) => {
                        console.log("Mint for purchase transaction sent:", data);
                        window.alert("Top up successful! Alliance tokens have been minted to your wallet.");
                    },
                    onCancel: () => {
                        console.log("Transaction cancelled");
                        window.alert("Top up cancelled.");
                    },
                });
                console.log("openContractCall result:", result);
                if (result === undefined) {
                    console.log("openContractCall returned undefined, trying Leather Wallet methods...");
                    throw new Error("openContractCall returned undefined");
                }
                return result;
            } catch (openContractError) {
                console.log("openContractCall failed, trying Leather Wallet methods...");

                // Check what methods are supported
                try {
                    const supportedMethods = await leather.request('supportedMethods');
                    console.log("Supported methods:", supportedMethods);
                } catch (methodError) {
                    console.log("Could not get supported methods:", methodError);
                }

                // Try the actual mint function
                try {
                    console.log("Trying mint-for-purchase...");
                    const mintParams = {
                        method: 'stx_callContract',
                        params: {
                            contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
                            functionName: FUNCTION_NAME,
                            functionArgs: [customerAddress],
                            network: 'testnet',
                            postConditionMode: 'allow'
                        }
                    };
                    console.log("Mint parameters:", JSON.stringify(mintParams, null, 2));

                    try {
                        console.log("Calling mint-for-purchase...");
                        const mintResult = await leather.request(mintParams.method, mintParams.params);
                        console.log("Mint result:", mintResult);

                        if (mintResult && !mintResult.error) {
                            window.alert("Top up successful! Alliance tokens have been minted to your wallet.");
                            return mintResult;
                        } else {
                            const errorDetails = mintResult?.error
                                ? JSON.stringify(mintResult.error, null, 2)
                                : "Unknown error";
                            console.error("Mint error details:", errorDetails);
                            window.alert(`Error: Failed to mint tokens. ${errorDetails}`);
                            throw new Error(`Mint failed: ${errorDetails}`);
                        }
                    } catch (mintError) {
                        console.error("Mint call failed:", JSON.stringify(mintError, null, 2));
                        if (mintError instanceof Error) {
                            console.error("Error message:", mintError.message);
                            console.error("Error stack:", mintError.stack);
                        }
                        window.alert(`Error: Failed to mint tokens. ${JSON.stringify(mintError, null, 2)}`);
                        throw mintError;
                    }
                } catch (error) {
                    console.error("Overall mint process failed:", error);
                    throw error;
                }

                throw new Error("All Leather Wallet methods failed");
            }
        } else {
            console.log("Leather Wallet not available, trying openContractCall");

            // Fallback to openContractCall
            const result = await openContractCall({
                ...txOptions,
                appDetails,
                onFinish: (data) => {
                    console.log("Mint for purchase transaction sent:", data);
                    window.alert("Top up successful! Alliance tokens have been minted to your wallet.");
                },
                onCancel: () => {
                    console.log("Transaction cancelled");
                    window.alert("Top up cancelled.");
                },
            });

            console.log("openContractCall result:", result);

            if (result === undefined) {
                console.error("openContractCall returned undefined - wallet may not be connected");
                throw new Error("Wallet connection failed. Please make sure your wallet extension is installed and connected.");
            }

            return result;
        }
    } catch (error) {
        console.error("Error calling mint-for-purchase:", error);
        window.alert("Error: Failed to top up balance. Please try again.");
        throw error; // Re-throw to let the calling function handle it
    }
}
