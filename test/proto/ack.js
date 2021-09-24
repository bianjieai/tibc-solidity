/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Acknowledgement = (function() {

    /**
     * Properties of an Acknowledgement.
     * @exports IAcknowledgement
     * @interface IAcknowledgement
     * @property {Uint8Array|null} [result] Acknowledgement result
     * @property {string|null} [error] Acknowledgement error
     */

    /**
     * Constructs a new Acknowledgement.
     * @exports Acknowledgement
     * @classdesc Represents an Acknowledgement.
     * @implements IAcknowledgement
     * @constructor
     * @param {IAcknowledgement=} [properties] Properties to set
     */
    function Acknowledgement(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Acknowledgement result.
     * @member {Uint8Array|null|undefined} result
     * @memberof Acknowledgement
     * @instance
     */
    Acknowledgement.prototype.result = null;

    /**
     * Acknowledgement error.
     * @member {string|null|undefined} error
     * @memberof Acknowledgement
     * @instance
     */
    Acknowledgement.prototype.error = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Acknowledgement response.
     * @member {"result"|"error"|undefined} response
     * @memberof Acknowledgement
     * @instance
     */
    Object.defineProperty(Acknowledgement.prototype, "response", {
        get: $util.oneOfGetter($oneOfFields = ["result", "error"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Acknowledgement instance using the specified properties.
     * @function create
     * @memberof Acknowledgement
     * @static
     * @param {IAcknowledgement=} [properties] Properties to set
     * @returns {Acknowledgement} Acknowledgement instance
     */
    Acknowledgement.create = function create(properties) {
        return new Acknowledgement(properties);
    };

    /**
     * Encodes the specified Acknowledgement message. Does not implicitly {@link Acknowledgement.verify|verify} messages.
     * @function encode
     * @memberof Acknowledgement
     * @static
     * @param {IAcknowledgement} message Acknowledgement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Acknowledgement.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.result != null && Object.hasOwnProperty.call(message, "result"))
            writer.uint32(/* id 21, wireType 2 =*/170).bytes(message.result);
        if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            writer.uint32(/* id 22, wireType 2 =*/178).string(message.error);
        return writer;
    };

    /**
     * Encodes the specified Acknowledgement message, length delimited. Does not implicitly {@link Acknowledgement.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Acknowledgement
     * @static
     * @param {IAcknowledgement} message Acknowledgement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Acknowledgement.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Acknowledgement message from the specified reader or buffer.
     * @function decode
     * @memberof Acknowledgement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Acknowledgement} Acknowledgement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Acknowledgement.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Acknowledgement();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 21:
                message.result = reader.bytes();
                break;
            case 22:
                message.error = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Acknowledgement message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Acknowledgement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Acknowledgement} Acknowledgement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Acknowledgement.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Acknowledgement message.
     * @function verify
     * @memberof Acknowledgement
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Acknowledgement.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.result != null && message.hasOwnProperty("result")) {
            properties.response = 1;
            if (!(message.result && typeof message.result.length === "number" || $util.isString(message.result)))
                return "result: buffer expected";
        }
        if (message.error != null && message.hasOwnProperty("error")) {
            if (properties.response === 1)
                return "response: multiple values";
            properties.response = 1;
            if (!$util.isString(message.error))
                return "error: string expected";
        }
        return null;
    };

    /**
     * Creates an Acknowledgement message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Acknowledgement
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Acknowledgement} Acknowledgement
     */
    Acknowledgement.fromObject = function fromObject(object) {
        if (object instanceof $root.Acknowledgement)
            return object;
        var message = new $root.Acknowledgement();
        if (object.result != null)
            if (typeof object.result === "string")
                $util.base64.decode(object.result, message.result = $util.newBuffer($util.base64.length(object.result)), 0);
            else if (object.result.length)
                message.result = object.result;
        if (object.error != null)
            message.error = String(object.error);
        return message;
    };

    /**
     * Creates a plain object from an Acknowledgement message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Acknowledgement
     * @static
     * @param {Acknowledgement} message Acknowledgement
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Acknowledgement.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.result != null && message.hasOwnProperty("result")) {
            object.result = options.bytes === String ? $util.base64.encode(message.result, 0, message.result.length) : options.bytes === Array ? Array.prototype.slice.call(message.result) : message.result;
            if (options.oneofs)
                object.response = "result";
        }
        if (message.error != null && message.hasOwnProperty("error")) {
            object.error = message.error;
            if (options.oneofs)
                object.response = "error";
        }
        return object;
    };

    /**
     * Converts this Acknowledgement to JSON.
     * @function toJSON
     * @memberof Acknowledgement
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Acknowledgement.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Acknowledgement;
})();

module.exports = $root;
