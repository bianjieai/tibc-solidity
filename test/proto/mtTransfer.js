/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.MtTransfer = (function() {

    /**
     * Properties of a MtTransfer.
     * @exports IMtTransfer
     * @interface IMtTransfer
     * @property {string|null} ["class"] MtTransfer class
     * @property {string|null} [id] MtTransfer id
     * @property {Uint8Array|null} [data] MtTransfer data
     * @property {string|null} [sender] MtTransfer sender
     * @property {string|null} [receiver] MtTransfer receiver
     * @property {boolean|null} [awayFromOrigin] MtTransfer awayFromOrigin
     * @property {string|null} [destContract] MtTransfer destContract
     * @property {number|Long|null} [amount] MtTransfer amount
     */

    /**
     * Constructs a new MtTransfer.
     * @exports MtTransfer
     * @classdesc Represents a MtTransfer.
     * @implements IMtTransfer
     * @constructor
     * @param {IMtTransfer=} [properties] Properties to set
     */
    function MtTransfer(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MtTransfer class.
     * @member {string} class
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype["class"] = "";

    /**
     * MtTransfer id.
     * @member {string} id
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.id = "";

    /**
     * MtTransfer data.
     * @member {Uint8Array} data
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.data = $util.newBuffer([]);

    /**
     * MtTransfer sender.
     * @member {string} sender
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.sender = "";

    /**
     * MtTransfer receiver.
     * @member {string} receiver
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.receiver = "";

    /**
     * MtTransfer awayFromOrigin.
     * @member {boolean} awayFromOrigin
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.awayFromOrigin = false;

    /**
     * MtTransfer destContract.
     * @member {string} destContract
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.destContract = "";

    /**
     * MtTransfer amount.
     * @member {number|Long} amount
     * @memberof MtTransfer
     * @instance
     */
    MtTransfer.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new MtTransfer instance using the specified properties.
     * @function create
     * @memberof MtTransfer
     * @static
     * @param {IMtTransfer=} [properties] Properties to set
     * @returns {MtTransfer} MtTransfer instance
     */
    MtTransfer.create = function create(properties) {
        return new MtTransfer(properties);
    };

    /**
     * Encodes the specified MtTransfer message. Does not implicitly {@link MtTransfer.verify|verify} messages.
     * @function encode
     * @memberof MtTransfer
     * @static
     * @param {IMtTransfer} message MtTransfer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MtTransfer.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message["class"] != null && Object.hasOwnProperty.call(message, "class"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message["class"]);
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
        if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.sender);
        if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.receiver);
        if (message.awayFromOrigin != null && Object.hasOwnProperty.call(message, "awayFromOrigin"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.awayFromOrigin);
        if (message.destContract != null && Object.hasOwnProperty.call(message, "destContract"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.destContract);
        if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
            writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.amount);
        return writer;
    };

    /**
     * Encodes the specified MtTransfer message, length delimited. Does not implicitly {@link MtTransfer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MtTransfer
     * @static
     * @param {IMtTransfer} message MtTransfer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MtTransfer.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MtTransfer message from the specified reader or buffer.
     * @function decode
     * @memberof MtTransfer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MtTransfer} MtTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MtTransfer.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MtTransfer();
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
                message.data = reader.bytes();
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
            case 8:
                message.amount = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MtTransfer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MtTransfer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MtTransfer} MtTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MtTransfer.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MtTransfer message.
     * @function verify
     * @memberof MtTransfer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MtTransfer.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message["class"] != null && message.hasOwnProperty("class"))
            if (!$util.isString(message["class"]))
                return "class: string expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
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
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                return "amount: integer|Long expected";
        return null;
    };

    /**
     * Creates a MtTransfer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MtTransfer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MtTransfer} MtTransfer
     */
    MtTransfer.fromObject = function fromObject(object) {
        if (object instanceof $root.MtTransfer)
            return object;
        var message = new $root.MtTransfer();
        if (object["class"] != null)
            message["class"] = String(object["class"]);
        if (object.id != null)
            message.id = String(object.id);
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        if (object.sender != null)
            message.sender = String(object.sender);
        if (object.receiver != null)
            message.receiver = String(object.receiver);
        if (object.awayFromOrigin != null)
            message.awayFromOrigin = Boolean(object.awayFromOrigin);
        if (object.destContract != null)
            message.destContract = String(object.destContract);
        if (object.amount != null)
            if ($util.Long)
                (message.amount = $util.Long.fromValue(object.amount)).unsigned = true;
            else if (typeof object.amount === "string")
                message.amount = parseInt(object.amount, 10);
            else if (typeof object.amount === "number")
                message.amount = object.amount;
            else if (typeof object.amount === "object")
                message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a MtTransfer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MtTransfer
     * @static
     * @param {MtTransfer} message MtTransfer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MtTransfer.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object["class"] = "";
            object.id = "";
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
            object.sender = "";
            object.receiver = "";
            object.awayFromOrigin = false;
            object.destContract = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.amount = options.longs === String ? "0" : 0;
        }
        if (message["class"] != null && message.hasOwnProperty("class"))
            object["class"] = message["class"];
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        if (message.sender != null && message.hasOwnProperty("sender"))
            object.sender = message.sender;
        if (message.receiver != null && message.hasOwnProperty("receiver"))
            object.receiver = message.receiver;
        if (message.awayFromOrigin != null && message.hasOwnProperty("awayFromOrigin"))
            object.awayFromOrigin = message.awayFromOrigin;
        if (message.destContract != null && message.hasOwnProperty("destContract"))
            object.destContract = message.destContract;
        if (message.amount != null && message.hasOwnProperty("amount"))
            if (typeof message.amount === "number")
                object.amount = options.longs === String ? String(message.amount) : message.amount;
            else
                object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber(true) : message.amount;
        return object;
    };

    /**
     * Converts this MtTransfer to JSON.
     * @function toJSON
     * @memberof MtTransfer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MtTransfer.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MtTransfer;
})();

module.exports = $root;
