import { getStxBalance } from "@/lib/stx-utils";
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

    function connectWallet() {
        showConnect({
            appDetails,
            onFinish: () => {
                window.location.reload();
            },
            userSession,
        });
    }

    function disconnectWallet() {
        userSession.signUserOut();
        setUserData(null);
    }

    useEffect(() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    useEffect(() => {
        if (userData) {
            const address = userData.profile.stxAddress.testnet;
            getStxBalance(address).then((balance) => {
                setStxBalance(balance);
            });
        }
    }, [userData]);

    return {
        userData,
        stxBalance,
        connectWallet,
        disconnectWallet,
    };
}
