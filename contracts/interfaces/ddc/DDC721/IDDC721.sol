// SPDX-License-Identifier: BSN DDC

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/introspection/IERC165Upgradeable.sol";

/**
 * @dev DDC721 logic contract interface
 */
interface IDDC721 is IERC165Upgradeable {
    /**
     * @dev Emitted when `ddc` ddc is initialized.
     */
    event SetNameAndSymbol(string name, string symbol);

    /**
     * @dev Emitted when `ddcId` ddc is transferred from `from` to `to`.
     */
    event Transfer(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 ddcId
    );

    /**
     * @dev Emitted when `ddcId` ddc is batch transferred from `from` to `to`.
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ddcIds
    );
    /**
     * @dev Emitted when `owner` enables `approved` to manage the `ddcId` ddc.
     */
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed ddcId
    );

    event ApprovalBatch(
        address[] indexed owners,
        address indexed approved,
        uint256[] ddcIds
    );
    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    /**
     * @dev Emitted when `owner` or (`approved`) `operator` set uri.
     */
    event SetURI(
        address indexed operator,
        uint256 indexed ddcId,
        string ddcURI
    );

    /**
     * @dev Emitted when `sender` disables the ddc.
     */
    event EnterBlacklist(address indexed sender, uint256 ddcId);

    /**
     * @dev Emitted when `sender` enables the ddc.
     */
    event ExitBlacklist(address indexed sender, uint256 ddcId);

    /**
     * @dev  Initializes a name and symbol for the ddc.
     *
     * Requirements:
     * - sender must be the owner only.
     */
    function setNameAndSymbol(string calldata name_, string calldata symbol_)
        external;

    /**
     * @dev Sets charge proxy address.
     *
     * Requirements:
     * - sender must be the owner only.
     */
    function setChargeProxyAddress(address chargeProxyAddress) external;

    /**
     * @dev  Sets authority proxy address.
     *
     * Requirements:
     * - sender must be the owner only.
     */
    function setAuthorityProxyAddress(address authorityProxyAddress) external;

    /**
     * @dev  Creates a new ddc for `to`. The ddc ID will be automatically
     *       assigned (and available on the emitted {IDDC721-Transfer} event)
     *
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute.
     * - `sender` and `to` must belong to the same platform.
     */
    function mint(address to, string calldata ddcURI_) external;

    /**
     * @dev  Creates multipe new ddcs for `to`.The ddc ID will be automatically
     *       assigned (and available on the emitted {IDDC721-TransferBatch} event)
     *
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute
     * - `sender` and `to` must belong to the same platform.
     */
    function mintBatch(address to, string[] calldata ddcURIs) external;

    /**
     * @dev  Creates a new ddc for `to`. The ddc ID will be automatically
     *       assigned (and available on the emitted {IDDC721-Transfer} event)
     *
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute
     * - `sender` and `to` must belong to the same platform.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     */
    function safeMint(
        address to,
        string calldata _ddcURI,
        bytes calldata _data
    ) external;

    /**
     * @dev  Creates multipe new ddcs for `to`. The ddc ID will be automatically
     *       assigned (and available on the emitted {IDDC721-TransferBatch} event)
     *
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute
     * - `sender` and `to` must belong to the same platform.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     */
    function safeMintBatch(
        address to,
        string[] calldata ddcURIs,
        bytes calldata data
    ) external;

    /**
     * @dev  Set the URI for ddcId when ddcURI is not set. (and available on the emitted {IDDC721-SetURI} event)
     *
     * Requirements:
     * - sender must have call method permission.
     * - The ddcURI is not initialized.
     */
    function setURI(uint256 ddcId, string calldata ddcURI_) external;

    /**
     * @dev Gives permission to `to` to transfer `ddcId` ddc to another account.
     * The approval is cleared when the token is transferred.
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute
     * - sender must be the owner or approved operator.
     */
    function approve(address to, uint256 ddcId) external;

    /**
     * @dev Gives permission to `to` to transfer all `ddcIds` ddc to another account.
     * The approval is cleared when the token is transferred.
     * Requirements:
     * - sender must have call method permission.
     * - `to` must have the `DDC` attribute
     * - sender must be the owner or approved operator.
     */
    function approveBatch(address to, uint256[] calldata ddcIds) external;

    /**
     * @dev Returns the account approved for `ddcId` ddc.
     *
     * Requirements:
     *
     */
    function getApproved(uint256 ddcId)
        external
        view
        returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any ddc owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    /**
     * @dev Safely transfers `ddcId` ddc from `from` to `to`, checking first that contract recipients
     * are aware of the DDC721 protocol to prevent ddcs from being forever locked.
     *
     * Requirements:
     * - sender must have call method permission.
     * - `from `&`to` are must be a available `ddc` account.
     * - `ddc` must be available.
     * - sender & from & to are must be belong to the same platform;
     * - sender must be the owner or approved.
     *
     * transfer:
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `ddcId` ddc must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this ddc by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IDDC721Receiver-onDDC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 ddcId,
        bytes calldata data
    ) external;

    /**
     * @dev Safely transfers all `ddcIds` ddc from `from` to `to`, checking first that contract recipients
     * are aware of the DDC721 protocol to prevent ddcs from being forever locked.
     *
     * Requirements:
     * - sender must have call method permission.
     * - `from `&`to` are must be a available `ddc` account.
     * - `ddc` must be available.
     * - sender & from & to are must be belong to the same platform;
     * - sender must be the owner or approved.
     *
     * transfer:
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `ddcId` ddc must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this ddc by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IDDC721Receiver-onDDC721Received}, which is called upon a safe transfer.
     *
     * Emits a {TransferBatch} event.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ddcIds,
        bytes calldata data
    ) external;

    /**
     * @dev Transfers `ddcId` ddc from `from` to `to`.
     *
     * Requirements:
     * - sender must be the owner or approved.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 ddcId
    ) external;

    /**
     * @dev Transfers all `ddcIds` ddc from `from` to `to`.
     *
     * Requirements:
     * - sender must be the owner or approved.
     *
     * Emits a {TransferBatch} event.
     */
    function batchTransferFrom(
        address from,
        address to,
        uint256[] calldata ddcIds
    ) external;

    /**
     * @dev  Freezes a ddc. If the ddc has freezed, it cann't do any actions.
     *
     * Requirements:
     * - sender's role is operator only.
     * - ``
     */
    function freeze(uint256 ddcId) external;

    /**
     * @dev  Unfreezes a ddc. If the ddc has unfreezed, it can do any actions.
     *
     * Requirements:
     * - sender's role is operator only.
     * - ``
     */
    function unFreeze(uint256 ddcId) external;

    /**
     * @dev Burns a ddc.
     *
     * Requirements:
     * - sender must own `ddcId` or be an approved operator.
     */
    function burn(uint256 ddcId) external;

    /**
     * @dev Burns mutiple ddc.
     *
     * Requirements:
     * - sender must own `ddcId` or be an approved operator.
     */
    function burnBatch(address owner, uint256[] calldata ddcIds) external;

    /**
     * @dev Returns the number of ddcs in ``owner``'s account.
     *
     * Requirements:
     *
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Query the number of DDC for each owner.
     *
     * Requirements:
     */
    function balanceOfBatch(address[] calldata owners)
        external
        view
        returns (uint256[] memory);

    /**
     * @dev Returns the owner of the `ddcId` ddc.
     *
     * Requirements:
     */
    function ownerOf(uint256 ddcId) external view returns (address);

    /**
     * @dev Returns an array of DDC owners.
     *
     * Requirements:
     */
    function ownerOfBatch(uint256[] calldata ddcIds)
        external
        view
        returns (address[] memory);

    /**
     * @dev Returns the ddc collection name.
     * Requirements:
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the ddc collection symbol.
     * Requirements:
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `ddcId` ddc.
     * Requirements:
     */
    function ddcURI(uint256 ddcId) external view returns (string memory);

    /**
     * @dev Returns the ID of the last DDC in all records.
     *
     * Requirements:
     * - `sender` must be `Operator` role
     */
    function getLatestDDCId() external view returns (uint256);
}
