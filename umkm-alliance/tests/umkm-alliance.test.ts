import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

describe("umkm alliance contract", () => {
    const accounts = simnet.getAccounts();
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    const wallet3 = accounts.get('wallet_3')!;

    describe("register-merchant function", () => {
        it("should register merchant successfully", () => {
            const merchantAddress = wallet1;
            const merchantName = "Test Merchant";

            const result = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(result.result).toEqual({ type: 'ok', value: { type: 'true' } });
        });

        it("should fail when merchant name is empty", () => {
            const merchantAddress = wallet2;
            const emptyName = "";

            const result = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(emptyName)],
                merchantAddress
            );
            expect(result.result).toEqual({ type: 'err', value: { type: 'uint', value: 102n } });
        });

        it("should fail when merchant is already registered", () => {
            const merchantAddress = wallet3;
            const merchantName = "Duplicate Merchant";

            const firstResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(firstResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const secondResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(secondResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 100n } });
        });
    });

    describe("mint-for-purchase function", () => {
        it("should fail when registered merchant tries to mint tokens", () => {
            const merchantAddress = wallet1;
            const merchantName = "Mint Test Merchant";

            const registerResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const mintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(merchantAddress)],
                merchantAddress
            );
            expect(mintResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 107n } });
        });

        it("should mint tokens successfully for unregistered customer", () => {
            const unregisteredAddress = wallet2;

            const result = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(unregisteredAddress)],
                unregisteredAddress
            );
            expect(result.result).toEqual({ type: 'ok', value: { type: 'true' } });
        });

        it("should fail when customer balance is already >= 10000", () => {
            const customerAddress = wallet3;

            // First mint should succeed (balance = 100000)
            const firstMintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(firstMintResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Second mint should fail (balance = 200000 > 10000)
            const secondMintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(secondMintResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 104n } });
        });
    });

    describe("redeem-at-merchant function", () => {
        it("should successfully mint tokens for customer and redeem to merchant", () => {
            const merchantAddress = wallet1;
            const customerAddress = wallet2;
            const merchantName = "Redeem Test Merchant";

            // Step 1: Register merchant
            const registerMerchantResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerMerchantResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Step 2: Customer mints tokens
            const mintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(mintResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Step 3: Customer redeems tokens to merchant
            const redeemResult = simnet.callPublicFn(
                'umkm-alliance',
                'redeem-at-merchant',
                [Cl.address(merchantAddress), Cl.address(customerAddress), Cl.uint(50000)],
                customerAddress
            );
            expect(redeemResult.result).toEqual({ type: 'ok', value: { type: 'true' } });
        });

        it("should fail when merchant is not registered", () => {
            const unregisteredMerchant = wallet3;
            const customerAddress = wallet1;

            const result = simnet.callPublicFn(
                'umkm-alliance',
                'redeem-at-merchant',
                [Cl.address(unregisteredMerchant), Cl.address(customerAddress), Cl.uint(100)],
                customerAddress
            );
            expect(result.result).toEqual({ type: 'err', value: { type: 'uint', value: 103n } });
        });

        it("should fail when customer has insufficient balance", () => {
            const merchantAddress = wallet1;
            const customerAddress = wallet2;
            const merchantName = "Insufficient Balance Test";

            const registerResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const redeemResult = simnet.callPublicFn(
                'umkm-alliance',
                'redeem-at-merchant',
                [Cl.address(merchantAddress), Cl.address(customerAddress), Cl.uint(100)],
                customerAddress
            );
            expect(redeemResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 105n } });
        });

        it("should fail when amount is zero", () => {
            const merchantAddress = wallet1;
            const customerAddress = wallet3;
            const merchantName = "Zero Amount Test";

            const registerResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const redeemResult = simnet.callPublicFn(
                'umkm-alliance',
                'redeem-at-merchant',
                [Cl.address(merchantAddress), Cl.address(customerAddress), Cl.uint(0)],
                customerAddress
            );
            expect(redeemResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 106n } });
        });
    });

    describe("is-merchant function", () => {
        it("should return true for registered merchant", () => {
            const merchantAddress = wallet1;
            const merchantName = "Status Test Merchant";

            const registerResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const statusResult = simnet.callReadOnlyFn(
                'umkm-alliance',
                'is-merchant',
                [Cl.address(merchantAddress)],
                merchantAddress
            );
            expect(statusResult.result).toEqual({ type: 'true' });
        });

        it("should return false for unregistered merchant", () => {
            const unregisteredAddress = wallet2;

            const result = simnet.callReadOnlyFn(
                'umkm-alliance',
                'is-merchant',
                [Cl.address(unregisteredAddress)],
                unregisteredAddress
            );
            expect(result.result).toEqual({ type: 'false' });
        });
    });

    describe("get-merchant-info function", () => {
        it("should return merchant info for registered merchant", () => {
            const merchantAddress = wallet1;
            const merchantName = "Info Test Merchant";

            const registerResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(merchantAddress), Cl.stringAscii(merchantName)],
                merchantAddress
            );
            expect(registerResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const infoResult = simnet.callReadOnlyFn(
                'umkm-alliance',
                'get-merchant-info',
                [Cl.address(merchantAddress)],
                merchantAddress
            );
            expect(infoResult.result).toEqual({
                type: 'some',
                value: {
                    type: 'tuple',
                    value: {
                        'merchant-address': { type: 'address', value: merchantAddress },
                        'merchant-name': { type: 'ascii', value: merchantName }
                    }
                }
            });
        });

        it("should return none for unregistered merchant", () => {
            const unregisteredAddress = wallet2;

            const result = simnet.callReadOnlyFn(
                'umkm-alliance',
                'get-merchant-info',
                [Cl.address(unregisteredAddress)],
                unregisteredAddress
            );
            expect(result.result).toEqual({ type: 'none' });
        });
    });

    describe("get-balance function", () => {
        it("should return correct balance for address with tokens", () => {
            const customerAddress = wallet3;

            // Mint tokens first
            const mintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(mintResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Check balance
            const balanceResult = simnet.callReadOnlyFn(
                'umkm-alliance',
                'get-balance',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(balanceResult.result).toEqual({ type: 'uint', value: 100000n });
        });

        it("should return zero balance for address without tokens", () => {
            const emptyAddress = wallet1;

            const result = simnet.callReadOnlyFn(
                'umkm-alliance',
                'get-balance',
                [Cl.address(emptyAddress)],
                emptyAddress
            );
            expect(result.result).toEqual({ type: 'uint', value: 0n });
        });
    });

    describe("get-total-supply function", () => {
        it("should return total supply", () => {
            const result = simnet.callReadOnlyFn(
                'umkm-alliance',
                'get-total-supply',
                [],
                wallet1
            );
            expect(result.result).toEqual({ type: 'uint', value: 0n });
        });
    });

    describe("transfer-between-merchants function", () => {
        it("should transfer tokens successfully between registered merchants", () => {
            const fromMerchant = wallet1;
            const toMerchant = wallet2;
            const customerAddress = wallet3;
            const fromMerchantName = "From Merchant";
            const toMerchantName = "To Merchant";

            // Step 1: Register both merchants
            const registerFromResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(fromMerchant), Cl.stringAscii(fromMerchantName)],
                fromMerchant
            );
            expect(registerFromResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const registerToResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(toMerchant), Cl.stringAscii(toMerchantName)],
                toMerchant
            );
            expect(registerToResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Step 2: Customer mints tokens
            const mintResult = simnet.callPublicFn(
                'umkm-alliance',
                'mint-for-purchase',
                [Cl.address(customerAddress)],
                customerAddress
            );
            expect(mintResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Step 3: Customer redeems tokens to fromMerchant
            const redeemResult = simnet.callPublicFn(
                'umkm-alliance',
                'redeem-at-merchant',
                [Cl.address(fromMerchant), Cl.address(customerAddress), Cl.uint(50000)],
                customerAddress
            );
            expect(redeemResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Step 4: fromMerchant transfers tokens to toMerchant
            const transferResult = simnet.callPublicFn(
                'umkm-alliance',
                'transfer-between-merchants',
                [Cl.address(fromMerchant), Cl.address(toMerchant), Cl.uint(25000)],
                fromMerchant
            );
            expect(transferResult.result).toEqual({ type: 'ok', value: { type: 'true' } });
        });

        it("should fail when from merchant is not registered", () => {
            const unregisteredFrom = wallet3;
            const toMerchant = wallet1;
            const toMerchantName = "To Merchant";

            // Register only toMerchant
            const registerToResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(toMerchant), Cl.stringAscii(toMerchantName)],
                toMerchant
            );
            expect(registerToResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Try to transfer from unregistered merchant
            const transferResult = simnet.callPublicFn(
                'umkm-alliance',
                'transfer-between-merchants',
                [Cl.address(unregisteredFrom), Cl.address(toMerchant), Cl.uint(100)],
                unregisteredFrom
            );
            expect(transferResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 103n } });
        });

        it("should fail when to merchant is not registered", () => {
            const fromMerchant = wallet1;
            const unregisteredTo = wallet3;
            const fromMerchantName = "From Merchant";

            // Register only fromMerchant
            const registerFromResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(fromMerchant), Cl.stringAscii(fromMerchantName)],
                fromMerchant
            );
            expect(registerFromResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            // Try to transfer to unregistered merchant
            const transferResult = simnet.callPublicFn(
                'umkm-alliance',
                'transfer-between-merchants',
                [Cl.address(fromMerchant), Cl.address(unregisteredTo), Cl.uint(100)],
                fromMerchant
            );
            expect(transferResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 103n } });
        });

        it("should fail when from merchant has insufficient balance", () => {
            const fromMerchant = wallet2;
            const toMerchant = wallet3;
            const fromMerchantName = "Poor From Merchant";
            const toMerchantName = "Rich To Merchant";

            const registerFromResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(fromMerchant), Cl.stringAscii(fromMerchantName)],
                fromMerchant
            );
            expect(registerFromResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const registerToResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(toMerchant), Cl.stringAscii(toMerchantName)],
                toMerchant
            );
            expect(registerToResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const transferResult = simnet.callPublicFn(
                'umkm-alliance',
                'transfer-between-merchants',
                [Cl.address(fromMerchant), Cl.address(toMerchant), Cl.uint(100)],
                fromMerchant
            );
            expect(transferResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 105n } });
        });

        it("should fail when amount is zero", () => {
            const fromMerchant = wallet1;
            const toMerchant = wallet2;
            const fromMerchantName = "Zero Amount From";
            const toMerchantName = "Zero Amount To";

            const registerFromResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(fromMerchant), Cl.stringAscii(fromMerchantName)],
                fromMerchant
            );
            expect(registerFromResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const registerToResult = simnet.callPublicFn(
                'umkm-alliance',
                'register-merchant',
                [Cl.address(toMerchant), Cl.stringAscii(toMerchantName)],
                toMerchant
            );
            expect(registerToResult.result).toEqual({ type: 'ok', value: { type: 'true' } });

            const transferResult = simnet.callPublicFn(
                'umkm-alliance',
                'transfer-between-merchants',
                [Cl.address(fromMerchant), Cl.address(toMerchant), Cl.uint(0)],
                fromMerchant
            );
            expect(transferResult.result).toEqual({ type: 'err', value: { type: 'uint', value: 106n } });
        });
    });
});