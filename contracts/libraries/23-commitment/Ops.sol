// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../proto/Proofs.sol";
import "../utils/Bytes.sol";

library LeafOpLib {
    function checkAgainstSpec(LeafOp.Data memory op, ProofSpec.Data memory spec)
        internal
        pure
    {
        require(op.hash == spec.leaf_spec.hash, "Unexpected HashOp");
        require(
            op.prehash_key == spec.leaf_spec.prehash_key,
            "Unexpected PrehashKey"
        );
        require(
            op.prehash_value == spec.leaf_spec.prehash_value,
            "Unexpected PrehashKey"
        );
        require(op.length == spec.leaf_spec.length, "Unexpected LengthOp");
        require(
            Bytes.hasPrefix(op.prefix, spec.leaf_spec.prefix),
            "Wrong prefix"
        );
    }

    function applyValue(
        LeafOp.Data memory op,
        bytes memory key,
        bytes memory value
    ) internal pure returns (bytes memory) {
        require(key.length > 0, "Leaf op needs key");
        require(value.length > 0, "Leaf op needs value");
        bytes memory pkey = prepareLeafData(op.prehash_key, op.length, key);
        bytes memory pvalue = prepareLeafData(
            op.prehash_value,
            op.length,
            value
        );
        bytes memory data = Bytes.concat(Bytes.concat(op.prefix, pkey), pvalue);
        return Operation.doHash(op.hash, data);
    }

    function prepareLeafData(
        PROOFS_PROTO_GLOBAL_ENUMS.HashOp hashOp,
        PROOFS_PROTO_GLOBAL_ENUMS.LengthOp lengthOp,
        bytes memory data
    ) private pure returns (bytes memory) {
        bytes memory hdata = doHashOrNoop(hashOp, data);
        return Operation.doLength(lengthOp, hdata);
    }

    function doHashOrNoop(
        PROOFS_PROTO_GLOBAL_ENUMS.HashOp hashOp,
        bytes memory data
    ) private pure returns (bytes memory) {
        if (hashOp == PROOFS_PROTO_GLOBAL_ENUMS.HashOp.NO_HASH) {
            return data;
        }
        return Operation.doHash(hashOp, data);
    }
}

library InnerOpLib {
    function checkAgainstSpec(
        InnerOp.Data memory op,
        ProofSpec.Data memory spec
    ) internal pure {
        require(op.hash == spec.leaf_spec.hash, "Unexpected HashOp");
        require(
            !Bytes.hasPrefix(op.prefix, spec.leaf_spec.prefix),
            "Wrong prefix"
        );
        require(
            op.prefix.length >= uint256(spec.inner_spec.min_prefix_length),
            "InnerOp prefix too short"
        );

        uint256 maxLeftChildLen = (spec.inner_spec.child_order.length - 1) *
            uint256(spec.inner_spec.child_size);
        require(
            op.prefix.length <=
                uint256(spec.inner_spec.max_prefix_length) + maxLeftChildLen,
            "InnerOp prefix too short"
        );
    }

    function applyValue(InnerOp.Data memory op, bytes memory child)
        internal
        pure
        returns (bytes memory)
    {
        require(child.length > 0, "Inner op needs child value");
        return
            Operation.doHash(
                op.hash,
                Bytes.concat(Bytes.concat(op.prefix, child), op.suffix)
            );
    }
}

library Operation {
    function doHash(PROOFS_PROTO_GLOBAL_ENUMS.HashOp hashOp, bytes memory data)
        internal
        pure
        returns (bytes memory)
    {
        if (hashOp == PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256) {
            return Bytes.fromBytes32(sha256(data));
        }

        if (hashOp == PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA512) {
            //TODO: implement sha512
            revert("SHA512 not implemented");
        }

        if (hashOp == PROOFS_PROTO_GLOBAL_ENUMS.HashOp.RIPEMD160) {
            return Bytes.fromBytes32(ripemd160(data));
        }

        if (hashOp == PROOFS_PROTO_GLOBAL_ENUMS.HashOp.BITCOIN) {
            bytes32 hash = sha256(data);
            return Bytes.fromBytes32(ripemd160(Bytes.fromBytes32(hash)));
        }
        revert("Unsupported hashop");
    }

    function doLength(
        PROOFS_PROTO_GLOBAL_ENUMS.LengthOp lengthOp,
        bytes memory data
    ) internal pure returns (bytes memory) {
        if (lengthOp == PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.NO_PREFIX) {
            return data;
        }
        if (lengthOp == PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.VAR_PROTO) {
            return Bytes.concat(encodeVarintProto(uint64(data.length)), data);
        }
        if (lengthOp == PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.REQUIRE_32_BYTES) {
            require(data.length == 32, "Expected 32 bytes");
            return data;
        }
        if (lengthOp == PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.REQUIRE_64_BYTES) {
            require(data.length == 64, "Expected 64 bytes");
            return data;
        }
        revert("Unsupported lengthop");
    }

    function encodeVarintProto(uint64 n) internal pure returns (bytes memory) {
        // Count the number of groups of 7 bits
        // We need this pre-processing step since Solidity doesn't allow dynamic memory resizing
        uint64 tmp = n;
        uint64 num_bytes = 1;
        while (tmp > 0x7F) {
            tmp = tmp >> 7;
            num_bytes += 1;
        }

        bytes memory buf = new bytes(num_bytes);

        tmp = n;
        for (uint64 i = 0; i < num_bytes; i++) {
            // Set the first bit in the byte for each group of 7 bits
            buf[i] = bytes1(0x80 | uint8(tmp & 0x7F));
            tmp = tmp >> 7;
        }
        // Unset the first bit of the last byte
        buf[num_bytes - 1] &= 0x7F;

        return buf;
    }
}
