;;   Note: SIP-010 trait implementation removed for simnet compatibility
;;   Define the token
(define-fungible-token alliance-token)

;;   === CONSTANTS ===
(define-constant THIS_CONTRACT (as-contract tx-sender))
(define-constant MERCHANT-REGISTRATION-FEE u1000)
(define-constant MERCHANT-MINT-AMOUNT u100000)
(define-constant TOKEN-NAME "UMKM ALLIANCE TOKEN")
(define-constant TOKEN-SYMBOL "UAT")
(define-constant TOKEN-DECIMALS 18)
(define-constant TOKEN-SUPPLY 1000000000)

;;   === STORAGES ===
(define-map merchant
  principal
  {
    merchant-address: principal,
    merchant-name: (string-ascii 100),
  }
)

;;   === FUNCTIONS ===
(define-public (register-merchant
    (merchant-address principal)
    (merchant-name (string-ascii 100))
  )
  (begin
    (asserts! (is-none (map-get? merchant merchant-address)) (err u100)) ;; Merchant already registered
    (asserts! (> (len merchant-name) u0) (err u102)) ;; Merchant name cannot be empty
    (asserts! (>= (stx-get-balance tx-sender) MERCHANT-REGISTRATION-FEE)
      (err u101)
    )
    ;;           Insufficient balance
    (try! (stx-transfer? MERCHANT-REGISTRATION-FEE tx-sender THIS_CONTRACT))
    (map-set merchant merchant-address {
      ;;               Use principal directly, no conversion needed
      merchant-address: merchant-address,
      merchant-name: merchant-name,
    })
    (ok true)
  )
)

(define-public (mint-for-purchase (customer-address principal))
  (begin
    ;;           Customer must not be registered as merchant
    (asserts! (not (is-some (map-get? merchant customer-address))) (err u107))
    ;;           Balance must be less than 10,000
    (asserts! (< (ft-get-balance alliance-token customer-address) u10000)
      (err u104)
    )
    ;;           Mint tokens to customer
    (ft-mint? alliance-token MERCHANT-MINT-AMOUNT customer-address)
  )
)

(define-public (redeem-at-merchant
    (merchant-address principal)
    (customer-address principal)
    (amount uint)
  )
  (begin
    (try! (get-merchant-status merchant-address)) ;; Merchant must be registered
    (asserts! (>= (ft-get-balance alliance-token customer-address) amount)
      (err u105)
    )
    ;;                 Insufficient balance
    (asserts! (> amount u0) (err u106)) ;; Amount must be greater than 0
    (ft-transfer? alliance-token amount customer-address merchant-address)
  )
)

(define-public (get-merchant-status (merchant-address principal))
  (begin
    (asserts! (is-some (map-get? merchant merchant-address)) (err u103)) ;; Merchant not registered
    (ok true)
  )
)

(define-public (transfer-between-merchants
    (from-merchant principal)
    (to-merchant principal)
    (amount uint)
  )
  (begin
    (try! (get-merchant-status from-merchant)) ;; From merchant must be registered
    (try! (get-merchant-status to-merchant)) ;; To merchant must be registered
    (asserts! (>= (ft-get-balance alliance-token from-merchant) amount)
      (err u105)
    )
    ;;                Insufficient balance
    (asserts! (> amount u0) (err u106)) ;; Amount must be greater than 0
    (ft-transfer? alliance-token amount from-merchant to-merchant)
  )
)

(define-read-only (get-balance (address principal))
  (ft-get-balance alliance-token address)
)

(define-read-only (is-merchant (address principal))
  (is-some (map-get? merchant address))
)

(define-read-only (get-merchant-info (address principal))
  (map-get? merchant address)
)

;;   === ERRORS ===
(define-constant ERR_MERCHANT_ALREADY_REGISTERED (err u100))
(define-constant ERR_MERCHANT_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_EMPTY_MERCHANT_NAME (err u102))
(define-constant ERR_NOT_REGISTERED_MERCHANT (err u103))
(define-constant ERR_BALANCE_TOO_HIGH_FOR_MINTING (err u104))
(define-constant ERR_INSUFFICIENT_BALANCE_FOR_REDEMPTION (err u105))
(define-constant ERR_INVALID_AMOUNT (err u106))
(define-constant ERR_ADDRESS_IS_REGISTERED_MERCHANT (err u107))

;;   SIP-010 required functions
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

(define-read-only (get-total-supply)
  (ft-get-supply alliance-token)
)

;;;;   Define the token
;; (define-fungible-token alliance-token)

;;;;   === CONSTANTS ===
;; (define-constant CONTRACT-OWNER tx-sender)
;; (define-constant MERCHANT-REGISTRATION-FEE u1000)
;; (define-constant MERCHANT-MINT-AMOUNT u100000)

;;;;   === ERROR CONSTANTS ===
;; (define-constant ERR-MERCHANT-ALREADY-REGISTERED (err u100))
;; (define-constant ERR-INSUFFICIENT-STX-BALANCE (err u101))
;; (define-constant ERR-EMPTY-MERCHANT-NAME (err u102))
;; (define-constant ERR-MERCHANT-NOT-REGISTERED (err u103))
;; (define-constant ERR-BALANCE-TOO-HIGH (err u104))
;; (define-constant ERR-INSUFFICIENT-TOKEN-BALANCE (err u105))
;; (define-constant ERR-INVALID-AMOUNT (err u106))
;; (define-constant ERR-IS-MERCHANT (err u107))

;;;;   === DATA MAPS ===
;; (define-map merchant
;;   principal
;;   {
;;     merchant-address: principal,
;;     merchant-name: (string-ascii 100),
;;   }
;; )

;;;;   === PUBLIC FUNCTIONS ===

;;;;   Register a new merchant
;; (define-public (register-merchant
;;     (merchant-address principal)
;;     (merchant-name (string-ascii 100))
;;   )
;;   (begin
;;;;           Check if merchant already exists
;;     (asserts! (is-none (map-get? merchant merchant-address))
;;       ERR-MERCHANT-ALREADY-REGISTERED
;;     )
;;;;           Check if name is not empty
;;     (asserts! (> (len merchant-name) u0) ERR-EMPTY-MERCHANT-NAME)
;;;;           Check STX balance
;;     (asserts! (>= (stx-get-balance tx-sender) MERCHANT-REGISTRATION-FEE)
;;       ERR-INSUFFICIENT-STX-BALANCE
;;     )
;;;;           Transfer registration fee
;;     (try! (stx-transfer? MERCHANT-REGISTRATION-FEE tx-sender CONTRACT-OWNER))
;;;;           Register merchant
;;     (map-set merchant merchant-address {
;;       merchant-address: merchant-address,
;;       merchant-name: merchant-name,
;;     })
;;     (ok true)
;;   )
;; )

;;;;   Mint tokens for customer purchases
;; (define-public (mint-for-purchase (customer-address principal))
;;   (begin
;;;;           Check customer is not a merchant
;;     (asserts! (is-none (map-get? merchant customer-address)) ERR-IS-MERCHANT)
;;;;           Check balance limit
;;     (asserts! (< (ft-get-balance alliance-token customer-address) u10000)
;;       ERR-BALANCE-TOO-HIGH
;;     )
;;;;           Mint tokens
;;     (ft-mint? alliance-token MERCHANT-MINT-AMOUNT customer-address)
;;   )
;; )

;;;;   Redeem tokens at merchant
;; (define-public (redeem-at-merchant
;;     (merchant-address principal)
;;     (customer-address principal)
;;     (amount uint)
;;   )
;;   (begin
;;;;           Check merchant is registered
;;     (asserts! (is-some (map-get? merchant merchant-address))
;;       ERR-MERCHANT-NOT-REGISTERED
;;     )
;;;;           Check customer has enough tokens
;;     (asserts! (>= (ft-get-balance alliance-token customer-address) amount)
;;       ERR-INSUFFICIENT-TOKEN-BALANCE
;;     )
;;;;           Check amount is valid
;;     (asserts! (> amount u0) ERR-INVALID-AMOUNT)
;;;;           Transfer tokens
;;     (ft-transfer? alliance-token amount customer-address merchant-address)
;;   )
;; )

;;;;   Transfer between merchants
;; (define-public (transfer-between-merchants
;;     (from-merchant principal)
;;     (to-merchant principal)
;;     (amount uint)
;;   )
;;   (begin
;;;;           Check both are registered merchants
;;     (asserts! (is-some (map-get? merchant from-merchant))
;;       ERR-MERCHANT-NOT-REGISTERED
;;     )
;;     (asserts! (is-some (map-get? merchant to-merchant))
;;       ERR-MERCHANT-NOT-REGISTERED
;;     )
;;;;           Check balance
;;     (asserts! (>= (ft-get-balance alliance-token from-merchant) amount)
;;       ERR-INSUFFICIENT-TOKEN-BALANCE
;;     )
;;;;           Check amount is valid
;;     (asserts! (> amount u0) ERR-INVALID-AMOUNT)
;;;;           Transfer tokens
;;     (ft-transfer? alliance-token amount from-merchant to-merchant)
;;   )
;; )

;;;;   === READ-ONLY FUNCTIONS ===

;;;;   Get token balance
;; (define-read-only (get-balance (address principal))
;;   (ft-get-balance alliance-token address)
;; )

;;;;   Get total supply
;; (define-read-only (get-total-supply)
;;   (ft-get-supply alliance-token)
;; )

;;;;   Check if address is registered merchant
;; (define-read-only (is-merchant (address principal))
;;   (is-some (map-get? merchant address))
;; )

;;;;   Get merchant info
;; (define-read-only (get-merchant-info (address principal))
;;   (map-get? merchant address)
;; )
