;; Define the token
(define-fungible-token alliance-token)

;; === CONSTANTS ===
(define-constant CONTRACT-OWNER tx-sender)
(define-constant MERCHANT-REGISTRATION-FEE u1000)
(define-constant MERCHANT-MINT-AMOUNT u100000)

;; === ERROR CONSTANTS ===
(define-constant ERR-MERCHANT-ALREADY-REGISTERED (err u100))
(define-constant ERR-INSUFFICIENT-STX-BALANCE (err u101))
(define-constant ERR-EMPTY-MERCHANT-NAME (err u102))
(define-constant ERR-MERCHANT-NOT-REGISTERED (err u103))
(define-constant ERR-BALANCE-TOO-HIGH (err u104))
(define-constant ERR-INSUFFICIENT-TOKEN-BALANCE (err u105))
(define-constant ERR-INVALID-AMOUNT (err u106))
(define-constant ERR-IS-MERCHANT (err u107))

;; === DATA MAPS ===
(define-map merchant
  principal
  {
    merchant-address: principal,
    merchant-name: (string-ascii 100),
  }
)

;; === PUBLIC FUNCTIONS ===

;; Register a new merchant
(define-public (register-merchant
    (merchant-address principal)
    (merchant-name (string-ascii 100))
  )
  (begin
    ;; Check if merchant already exists
    (asserts! (is-none (map-get? merchant merchant-address))
      ERR-MERCHANT-ALREADY-REGISTERED
    )
    ;; Check if name is not empty
    (asserts! (> (len merchant-name) u0) ERR-EMPTY-MERCHANT-NAME)
    ;; Check STX balance
    (asserts! (>= (stx-get-balance tx-sender) MERCHANT-REGISTRATION-FEE)
      ERR-INSUFFICIENT-STX-BALANCE
    )
    ;; Transfer registration fee
    (try! (stx-transfer? MERCHANT-REGISTRATION-FEE tx-sender CONTRACT-OWNER))
    ;; Register merchant
    (map-set merchant merchant-address {
      merchant-address: merchant-address,
      merchant-name: merchant-name,
    })
    (ok true)
  )
)

;; Mint tokens for customer purchases
(define-public (mint-for-purchase (customer-address principal))
  (begin
    ;; Check customer is not a merchant
    (asserts! (is-none (map-get? merchant customer-address)) ERR-IS-MERCHANT)
    ;; Check balance limit
    (asserts! (< (ft-get-balance alliance-token customer-address) u10000)
      ERR-BALANCE-TOO-HIGH
    )
    ;; Mint tokens
    (ft-mint? alliance-token MERCHANT-MINT-AMOUNT customer-address)
  )
)

;; Redeem tokens at merchant
(define-public (redeem-at-merchant
    (merchant-address principal)
    (customer-address principal)
    (amount uint)
  )
  (begin
    ;; Check merchant is registered
    (asserts! (is-some (map-get? merchant merchant-address))
      ERR-MERCHANT-NOT-REGISTERED
    )
    ;; Check customer has enough tokens
    (asserts! (>= (ft-get-balance alliance-token customer-address) amount)
      ERR-INSUFFICIENT-TOKEN-BALANCE
    )
    ;; Check amount is valid
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    ;; Transfer tokens
    (ft-transfer? alliance-token amount customer-address merchant-address)
  )
)

;; Transfer between merchants
(define-public (transfer-between-merchants
    (from-merchant principal)
    (to-merchant principal)
    (amount uint)
  )
  (begin
    ;; Check both are registered merchants
    (asserts! (is-some (map-get? merchant from-merchant))
      ERR-MERCHANT-NOT-REGISTERED
    )
    (asserts! (is-some (map-get? merchant to-merchant))
      ERR-MERCHANT-NOT-REGISTERED
    )
    ;; Check balance
    (asserts! (>= (ft-get-balance alliance-token from-merchant) amount)
      ERR-INSUFFICIENT-TOKEN-BALANCE
    )
    ;; Check amount is valid
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    ;; Transfer tokens
    (ft-transfer? alliance-token amount from-merchant to-merchant)
  )
)

;; === READ-ONLY FUNCTIONS ===

;; Get token balance
(define-read-only (get-balance (address principal))
  (ft-get-balance alliance-token address)
)

;; Get total supply
(define-read-only (get-total-supply)
  (ft-get-supply alliance-token)
)

;; Check if address is registered merchant
(define-read-only (is-merchant (address principal))
  (is-some (map-get? merchant address))
)

;; Get merchant info
(define-read-only (get-merchant-info (address principal))
  (map-get? merchant address)
)
