/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.NftTransfer = (function() {

    /**
     * Properties of a NftTransfer.
     * @exports INftTransfer
     * @interface INftTransfer
     * @property {string|null} ["class"] NftTransfer class
     * @property {string|null} [id] NftTransfer id
     * @property {string|null} [uri] NftTransfer uri
     * @property {string|null} [sender] NftTransfer sender
     * @property {string|null} [receiver] NftTransfer receiver
     * @property {boolean|null} [awayFromOrigin] NftTransfer awayFromOrigin
     * @property {string|null} [destContract] NftTransfer destContract
     */

    /**
     * Constructs a new NftTransfer.
     * @exports NftTransfer
     * @classdesc Represents a NftTransfer.
     * @implements INftTransfer
     * @constructor
     * @param {INftTransfer=} [properties] Properties to set
     */
    function NftTransfer(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NftTransfer class.
     * @member {string} class
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype["class"] = "";

    /**
     * NftTransfer id.
     * @member {string} id
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.id = "";

    /**
     * NftTransfer uri.
     * @member {string} uri
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.uri = "";

    /**
     * NftTransfer sender.
     * @member {string} sender
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.sender = "";

    /**
     * NftTransfer receiver.
     * @member {string} receiver
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.receiver = "";

    /**
     * NftTransfer awayFromOrigin.
     * @member {boolean} awayFromOrigin
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.awayFromOrigin = false;

    /**
     * NftTransfer destContract.
     * @member {string} destContract
     * @memberof NftTransfer
     * @instance
     */
    NftTransfer.prototype.destContract = "";

    /**
     * Creates a new NftTransfer instance using the specified properties.
     * @function create
     * @memberof NftTransfer
     * @static
     * @param {INftTransfer=} [properties] Properties to set
     * @returns {NftTransfer} NftTransfer instance
     */
    NftTransfer.create = function create(properties) {
        return new NftTransfer(properties);
    };

    /**
     * Encodes the specified NftTransfer message. Does not implicitly {@link NftTransfer.verify|verify} messages.
     * @function encode
     * @memberof NftTransfer
     * @static
     * @param {INftTransfer} message NftTransfer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NftTransfer.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message["class"] != null && Object.hasOwnProperty.call(message, "class"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message["class"]);
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
        if (message.uri != null && Object.hasOwnProperty.call(message, "uri"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.uri);
        if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sender);
        if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.receiver);
        if (message.awayFromOrigin != null && Object.hasOwnProperty.call(message, "awayFromOrigin"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.awayFromOrigin);
        if (message.destContract != null && Object.hasOwnProperty.call(message, "destContract"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.destContract);
        return writer;
    };

    /**
     * Encodes the specified NftTransfer message, length delimited. Does not implicitly {@link NftTransfer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NftTransfer
     * @static
     * @param {INftTransfer} message NftTransfer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NftTransfer.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NftTransfer message from the specified reader or buffer.
     * @function decode
     * @memberof NftTransfer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NftTransfer} NftTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NftTransfer.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NftTransfer();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message["class"] = reader.string();
                break;
            case 2:
                message.id = reader.string();
                break;
            case 3:
                message.uri = reader.string();
                break;
            case 4:
                message.sender = reader.string();
                break;
            case 5:
                message.receiver = reader.string();
                break;
            case 6:
                message.awayFromOrigin = reader.bool();
                break;
            case 7:
                message.destContract = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NftTransfer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NftTransfer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NftTransfer} NftTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NftTransfer.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NftTransfer message.
     * @function verify
     * @memberof NftTransfer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NftTransfer.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message["class"] != null && message.hasOwnProperty("class"))
            if (!$util.isString(message["class"]))
                return "class: string expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.uri != null && message.hasOwnProperty("uri"))
            if (!$util.isString(message.uri))
                return "uri: string expected";
        if (message.sender != null && message.hasOwnProperty("sender"))
            if (!$util.isString(message.sender))
                return "sender: string expected";
        if (message.receiver != null && message.hasOwnProperty("receiver"))
            if (!$util.isString(message.receiver))
                return "receiver: string expected";
        if (message.awayFromOrigin != null && message.hasOwnProperty("awayFromOrigin"))
            if (typeof message.awayFromOrigin !== "boolean")
                return "awayFromOrigin: boolean expected";
        if (message.destContract != null && message.hasOwnProperty("destContract"))
            if (!$util.isString(message.destContract))
                return "destContract: string expected";
        return null;
    };

    /**
     * Creates a NftTransfer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NftTransfer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NftTransfer} NftTransfer
     */
    NftTransfer.fromObject = function fromObject(object) {
        if (object instanceof $root.NftTransfer)
            return object;
        var message = new $root.NftTransfer();
        if (object["class"] != null)
            message["class"] = String(object["class"]);
        if (object.id != null)
            message.id = String(object.id);
        if (object.uri != null)
            message.uri = String(object.uri);
        if (object.sender != null)
            message.sender = String(object.sender);
        if (object.receiver != null)
            message.receiver = String(object.receiver);
        if (object.awayFromOrigin != null)
            message.awayFromOrigin = Boolean(object.awayFromOrigin);
        if (object.destContract != null)
            message.destContract = String(object.destContract);
        return message;
    };

    /**
     * Creates a plain object from a NftTransfer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NftTransfer
     * @static
     * @param {NftTransfer} message NftTransfer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NftTransfer.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object["class"] = "";
            object.id = "";
            object.uri = "";
            object.sender = "";
            object.receiver = "";
            object.awayFromOrigin = false;
            object.destContract = "";
        }
        if (message["class"] != null && message.hasOwnProperty("class"))
            object["class"] = message["class"];
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.uri != null && message.hasOwnProperty("uri"))
            object.uri = message.uri;
        if (message.sender != null && message.hasOwnProperty("sender"))
            object.sender = message.sender;
        if (message.receiver != null && message.hasOwnProperty("receiver"))
            object.receiver = message.receiver;
        if (message.awayFromOrigin != null && message.hasOwnProperty("awayFromOrigin"))
            object.awayFromOrigin = message.awayFromOrigin;
        if (message.destContract != null && message.hasOwnProperty("destContract"))
            object.destContract = message.destContract;
        return object;
    };

    /**
     * Converts this NftTransfer to JSON.
     * @function toJSON
     * @memberof NftTransfer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NftTransfer.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NftTransfer;
})();

module.exports = $root;
