// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library Host {

    /* @notice                  nextSequenceSendPath defines the next send sequence counter store path
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    */
    function nextSequenceSendPath(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat("nextSequenceSend/", packetPath(sourceChain, destChain));
    }

    /* @notice                  nextSequenceSendKey returns the store key for the send sequence of a particular
   *
   *  @param sourceChain        source chain name
   *  @param destChain          destination chain name
   */
    function nextSequenceSendKey(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (bytes memory)
    {
        return  bytes(nextSequenceSendPath(sourceChain, destChain));
    }

    /* @notice                  packetCommitmentPath defines the next send sequence counter store path
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    *  @param sequence           sequence
    */
    function packetCommitmentPath(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat(packetCommitmentPrefixPath(sourceChain, destChain),"/"), uint642str(sequence));
    }

    /* @notice                  packetCommitmentKey returns the store key of under which a packet commitment
   *
   *  @param sourceChain        source chain name
   *  @param destChain          destination chain name
   *  @param sequence           sequence
   */
    function packetCommitmentKey(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (bytes memory)
    {
        return  bytes(packetCommitmentPath(sourceChain, destChain, sequence));
    }

    /* @notice                  packetCommitmentPrefixPath returns the store key of under which a packet commitment
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    */
    function packetCommitmentPrefixPath(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat("commitments/", packetPath(sourceChain, destChain)), "/sequences");
    }

    /* @notice                  packetAcknowledgementPath defines the packet acknowledgement store path
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    *  @param sequence           sequence
    */
    function packetAcknowledgementPath(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat(packetAcknowledgementPrefixPath(sourceChain, destChain), "/"), uint642str(sequence));
    }

    /* @notice                  packetAcknowledgementKey returns the store key of under which a packet
   *
   *  @param sourceChain        source chain name
   *  @param destChain          destination chain name
   *  @param sequence           sequence
   */
    function packetAcknowledgementKey(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (bytes memory)
    {
        return  bytes(packetAcknowledgementPath(sourceChain, destChain, sequence));
    }

    /* @notice                  packetAcknowledgementPrefixPath defines the prefix for commitments to packet data fields store path.
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    */
    function packetAcknowledgementPrefixPath(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat("acks/", packetPath(sourceChain, destChain)), "/sequences");
    }

    /* @notice                  packetReceiptPath defines the packet acknowledgement store path
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    *  @param sequence           sequence
    */
    function packetReceiptPath(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat(packetReceiptPrefixPath(sourceChain, destChain),"/"), uint642str(sequence));
    }

    /* @notice                  packetReceiptKey returns the store key of under which a packet
   *
   *  @param sourceChain        source chain name
   *  @param destChain          destination chain name
   *  @param sequence           sequence
   */
    function packetReceiptKey(
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    )
    public
    pure
    returns (bytes memory)
    {
        return  bytes(packetReceiptPath(sourceChain, destChain, sequence));
    }

    /* @notice                  packetReceiptPrefixPath defines the prefix for receipt to packet data fields store path.
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    */
    function packetReceiptPrefixPath(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat("receipts/", packetPath(sourceChain, destChain)), "/sequences");
    }

    /* @notice                  cleanPacketCommitmentKey returns the store key of under which a clean packet commitment
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    *  @param sequence           sequence
    */
    function cleanPacketCommitmentKey(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (bytes memory)
    {
        return  bytes(cleanPacketCommitmentPath(sourceChain, destChain));
    }

    /* @notice                  cleanPacketCommitmentPath defines the prefix for receipt to packet data fields store path.
    *
    *  @param sourceChain        source chain name
    *  @param destChain          destination chain name
    */
    function cleanPacketCommitmentPath(
        string memory sourceChain,
        string memory destChain
    )
    public
    pure
    returns (string memory)
    {
        return  _strConcat("clean/", packetPath(sourceChain, destChain));
    }

    /* @notice       packetPath
   *
   *  @param sourceChain        source chain name
   *  @param destChain          destination chain name
   */
    function packetPath(
        string memory sourceChain,
        string memory destChain)
    internal
    pure
    returns (string memory)
    {
        return  _strConcat(_strConcat(sourceChain, "/"), destChain);
    }

    function uint642str(
        uint64 _i
    )
    internal
    pure
    returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint64 j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    /*
     * @notice Concatenate two strings into a single string
     * @param _first First string
     * @param _second Second string
     */
    function _strConcat(
        string memory _first,
        string memory _second
    )
    internal
    pure
    returns(string memory)
    {
        bytes memory first = bytes(_first);
        bytes memory second = bytes(_second);
        bytes memory res = new bytes(first.length + second.length);

        for(uint i = 0; i < first.length; i++) {
            res[i] = first[i];
        }

        for(uint j = 0; j < second.length; j++) {
            res[first.length+j] = second[j];
        }

        return string(res);
    }
}
