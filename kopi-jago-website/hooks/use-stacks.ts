import { getStxBalance, getAllianceTokenBalance } from "@/lib/stx-utils";
import { callMintForPurchase } from "@/lib/contract";
import {
    AppConfig,
    showConnect,
    type UserData,
    UserSession,
} from "@stacks/connect";
import { useEffect, useState } from "react";

const appDetails = {
    name: "Champion Coffee",
    icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
};

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

export function useStacks() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [stxBalance, setStxBalance] = useState(0);
    const [allianceTokenBalance, setAllianceTokenBalance] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // Handle client-side initialization
    useEffect(() => {
        setIsClient(true);
    }, []);

    function connectWallet() {
        if (!isClient) return;

        showConnect({
            appDetails,
            onFinish: () => {
                window.location.reload();
            },
            userSession,
        });
    }

    function disconnectWallet() {
        if (!isClient) return;

        userSession.signUserOut();
        setUserData(null);
        setAllianceTokenBalance(0);
    }

    async function handleMintForPurchase() {
        if (!isClient || typeof window === "undefined") return;

        try {
            if (!userData) throw new Error("User not connected");

            const customerAddress = userData.profile.stxAddress.testnet;
            await callMintForPurchase(customerAddress, appDetails, userSession);

            // Refresh token balance after successful mint
            setTimeout(() => {
                refreshAllianceTokenBalance();
            }, 2000); // Wait a bit for the transaction to be processed
        } catch (_err) {
            const err = _err as Error;
            console.error(err);
            window.alert(err.message);
        }
    }

    async function refreshAllianceTokenBalance() {
        if (!isClient || !userData) return;

        const address = userData.profile.stxAddress.testnet;
        const balance = await getAllianceTokenBalance(address);
        setAllianceTokenBalance(balance);
    }

    // Handle user session initialization
    useEffect(() => {
        if (!isClient) return;

        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, [isClient]);

    // Handle balance fetching
    useEffect(() => {
        if (!isClient || !userData) return;

        const address = userData.profile.stxAddress.testnet;

        getStxBalance(address).then((balance) => {
            setStxBalance(balance);
        });

        getAllianceTokenBalance(address).then((balance) => {
            setAllianceTokenBalance(balance);
        });
    }, [isClient, userData]);

    return {
        userData,
        stxBalance,
        allianceTokenBalance,
        connectWallet,
        disconnectWallet,
        handleMintForPurchase,
        refreshAllianceTokenBalance,
        isClient,
    };
}
