# Polymarket SDK

TypeScript SDK for building Polymarket proxy-wallet transaction payloads.

This package does **NOT** send transactions. Instead, it returns deterministic `Transaction` objects containing:

- `to`: contract address to target
- `typeCode`: how the proxy wallet should execute the call (`Call` vs `DelegateCall`)
- `data`: ABI-encoded calldata (`0x...`)
- `value`: ETH value as a string

## Install

```bash
pnpm add @polymarket/sdk
```

Node.js `>= 22` is required.

## Key Concepts

### Transaction builders

The exported functions are **pure builders**:
they take addresses/amounts/ids and produce `Transaction` objects (or `Transaction[]` bundles).

Most higher-level workflows return multiple transactions, commonly:

1. An approval transaction (ERC20 approve, or ERC1155 `setApprovalForAll`)
2. The main action transaction (market addFunding/buy/sell, debt pay, etc.)

### CallType

`typeCode` comes from `src/types.ts`:

- `CallType.Call` (`"1"`): normal `call`
- `CallType.DelegateCall` (`"2"`): `delegatecall` semantics (meant to be executed by a proxy wallet that supports it)

If a returned transaction uses `DelegateCall`, you generally should **not** submit it as a normal Ethereum transaction directly; execute it via the intended proxy wallet/executor.

## Example: compute a proxy wallet address

```ts
import { getProxyWalletAddress } from "@polymarket/sdk";
import type { Address } from "viem";

const factory = "0x..."; // proxy wallet factory
const user = "0x..."; // user address

const proxyWallet = getProxyWalletAddress(factory as Address, user as Address);
console.log(proxyWallet);
```

## Example: build a market purchase bundle

```ts
import { buyMarketOutcome } from "@polymarket/sdk";

// fixed product market maker + collateral token
const marketMaker = "0x..."; // FixedProductMarketMaker
const collateralToken = "0x..."; // ERC20

const investmentAmount = 1_000n * 10n ** 6n; // use bigint; decimals depend on token
const outcomeIndex = 0n; // typically bigint
const minOutcomeTokensToBuy = 900n * 10n ** 6n;

const bundle = buyMarketOutcome(
	marketMaker,
	collateralToken,
	investmentAmount,
	outcomeIndex,
	minOutcomeTokensToBuy,
);

// bundle is Transaction[]:
// - [0] ERC20 approve(collateral -> marketMaker)
// - [1] marketMaker.buy(...)
```

## Example: conditional tokens (split/merge/redeem)

The SDK derives the partition from `outcomeSlotCount`:
`[1n, 2n, 4n, ...]`.

### Split

```ts
import { splitPosition } from "@polymarket/sdk";

const txs = splitPosition(
	"0x... (ConditionalTokens)",
	"0x... (collateral token)",
	"0x... (conditionId)",
	2, // outcomeSlotCount
	100n, // amount
);
```

### Merge / Redeem

```ts
import { mergePositions, redeemPositions } from "@polymarket/sdk";

const mergeTxs = mergePositions(CT, COLLATERAL, CONDITION_ID, 3, 500n);
const redeemTxs = redeemPositions(CT, COLLATERAL, CONDITION_ID, 2);
```

## Example: debt workflows

```ts
import { takeOnDebt, payDebt } from "@polymarket/sdk";

// takeOnDebt builds a single tx targeting the debt tracker
const takeTxs = takeOnDebt("0x... (debtTracker)", 100n, "0x... (txHash)");

// payDebt returns [approve, payDebt]
const payTxs = payDebt("0x... (debtTracker)", "0x... (tokenAddress)", 50n);
```

## Example: negRisk adapter operations

```ts
import { negRiskOperations } from "@polymarket/sdk";

const convertTx = negRiskOperations.convertPositions({
	negRiskAdapterAddress: "0x... (adapter)",
	marketId: "0x... (marketId)",
	indexSet: 5n,
	amount: 2_000n,
});

const redeemTx = negRiskOperations.redeemPositions({
	negRiskAdapterAddress: "0x... (adapter)",
	conditionId: "0x... (conditionId)",
	amounts: [750n, 250n],
});
```

## Example: UMA adapter initialization

```ts
import { initialize, negRiskInitialize } from "@polymarket/sdk/adapter";
// Note: depending on your bundler, you may instead import from package root.

const tx = initialize(
	"0x... (adapter address)",
	new Uint8Array([]), // ancillaryData
	"0x... (reward token)",
	1n, // reward
	1n, // proposalBond
);

const negTx = negRiskInitialize(
	"0x... (adapter address)",
	new Uint8Array([]),
	"0x... (reward token)",
	1n,
	1n,
	100n, // liveness
);
```

## Utilities

```ts
import { getIndexSet, getMarketIndex } from "@polymarket/sdk";

const indexSet = getIndexSet([0, 2, 3]); // bigint bitset
const marketIndex = getMarketIndex("0x... questionId");
```

Other helpers:

- `erc20ApprovalTransaction(tokenAddress, spender, amount)`
- `erc1155ApprovalTransaction(tokenAddress, spender, approval)`
- `erc20TransferTransaction(tokenAddress, recipient, amount)`
- `ethTransferTransaction(recipient, amount)`

## License

MIT
