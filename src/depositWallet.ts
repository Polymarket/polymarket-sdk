import { type Address, getCreate2Address, type Hex, pad } from "viem";

// TODO: replace with keccak256 of ERC1967 proxy init bytecode from deployed DepositWalletFactory
const DEPOSIT_WALLET_INIT_CODE_HASH: Hex =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Calculates the address of a given owner's deposit wallet.
 * walletId = pad(ownerAddress, 32), used as CREATE2 salt.
 * @param factory - address of the DepositWalletFactory contract
 * @param owner - address of the wallet owner
 */
export const getDepositWalletAddress = (factory: Address, owner: Address): Address =>
    getCreate2Address({
        from: factory,
        salt: pad(owner, { size: 32 }),
        bytecodeHash: DEPOSIT_WALLET_INIT_CODE_HASH,
    });
