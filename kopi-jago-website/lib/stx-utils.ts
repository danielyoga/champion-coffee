export function abbreviateAddress(address: string) {
    return `${address.substring(0, 5)}...${address.substring(36)}`;
}

export function abbreviateTxnId(txnId: string) {
    return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
}

export function explorerAddress(address: string) {
    return `https://explorer.hiro.so/address/${address}?chain=testnet`;
}

export async function getStxBalance(address: string) {
    const baseUrl = "https://api.testnet.hiro.so";
    const url = `${baseUrl}/extended/v1/address/${address}/stx`;

    const response = await fetch(url).then((res) => res.json());
    const balance = parseInt(response.balance);
    return balance;
}

// Get alliance token balance from the wallet
export async function getAllianceTokenBalance(address: string) {
    const baseUrl = "https://api.testnet.hiro.so";
    const contractAddress = "ST1R6WTW58RQFZPMMFYHZA663838XZDW1RVXC58N9";
    const contractName = "umkm-alliance-3";
    const tokenName = "alliance-token";

    const url = `${baseUrl}/extended/v1/address/${address}/balances`;

    try {
        const response = await fetch(url).then((res) => res.json());
        console.log("Full balance response:", response); // Debug log

        // Check if fungible_tokens exists
        if (!response.fungible_tokens) {
            console.log("No fungible tokens found:", response);
            return 0;
        }

        // Log all available tokens for debugging
        console.log("Available fungible tokens:", response.fungible_tokens);

        // The fungible_tokens is an object, not an array
        const expectedContractId = `${contractAddress}.${contractName}::${tokenName}`;
        console.log("Looking for:", expectedContractId);

        // Check if the alliance token exists in the fungible_tokens object
        if (response.fungible_tokens[expectedContractId]) {
            const allianceToken = response.fungible_tokens[expectedContractId];
            console.log("Found alliance token:", allianceToken);
            return parseInt(allianceToken.balance);
        }

        console.log("Alliance token not found. Available tokens:", Object.keys(response.fungible_tokens));
        return 0; // Return 0 if token not found
    } catch (error) {
        console.error("Error fetching alliance token balance:", error);
        return 0;
    }
}

// Test function to call the contract's get-balance function directly
export async function testContractBalance(address: string) {
    const baseUrl = "https://api.testnet.hiro.so";
    const contractAddress = "ST1R6WTW58RQFZPMMFYHZA663838XZDW1RVXC58N9";
    const contractName = "umkm-alliance-3";

    // Use the correct endpoint for reading contract functions
    const url = `${baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-balance`;

    try {
        console.log("Calling contract API:", url);
        console.log("Address:", address);

        // Use the simple format that Hiro API expects
        const requestBody = {
            sender: address,
            arguments: [address]
        };

        console.log("Request body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const responseText = await response.text();
        console.log("Raw response:", responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.error("Response text:", responseText);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }

        console.log("Contract get-balance result:", result);

        if (result.result && result.result !== '0x') {
            return parseInt(result.result, 16);
        }

        return 0;
    } catch (error) {
        console.error("Error calling contract get-balance:", error);
        return 0;
    }
}

// Convert a raw STX amount to a human readable format by respecting the 6 decimal places
export function formatStx(amount: number) {
    return parseFloat((amount / 10 ** 6).toFixed(2));
}

// Convert a human readable STX balance to the raw amount
export function parseStx(amount: number) {
    return amount * 10 ** 6;
}
