/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.MerkleRoot = (function() {

    /**
     * Properties of a MerkleRoot.
     * @exports IMerkleRoot
     * @interface IMerkleRoot
     * @property {Uint8Array|null} [hash] MerkleRoot hash
     */

    /**
     * Constructs a new MerkleRoot.
     * @exports MerkleRoot
     * @classdesc Represents a MerkleRoot.
     * @implements IMerkleRoot
     * @constructor
     * @param {IMerkleRoot=} [properties] Properties to set
     */
    function MerkleRoot(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MerkleRoot hash.
     * @member {Uint8Array} hash
     * @memberof MerkleRoot
     * @instance
     */
    MerkleRoot.prototype.hash = $util.newBuffer([]);

    /**
     * Creates a new MerkleRoot instance using the specified properties.
     * @function create
     * @memberof MerkleRoot
     * @static
     * @param {IMerkleRoot=} [properties] Properties to set
     * @returns {MerkleRoot} MerkleRoot instance
     */
    MerkleRoot.create = function create(properties) {
        return new MerkleRoot(properties);
    };

    /**
     * Encodes the specified MerkleRoot message. Does not implicitly {@link MerkleRoot.verify|verify} messages.
     * @function encode
     * @memberof MerkleRoot
     * @static
     * @param {IMerkleRoot} message MerkleRoot message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerkleRoot.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hash);
        return writer;
    };

    /**
     * Encodes the specified MerkleRoot message, length delimited. Does not implicitly {@link MerkleRoot.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MerkleRoot
     * @static
     * @param {IMerkleRoot} message MerkleRoot message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerkleRoot.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MerkleRoot message from the specified reader or buffer.
     * @function decode
     * @memberof MerkleRoot
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MerkleRoot} MerkleRoot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerkleRoot.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MerkleRoot();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MerkleRoot message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MerkleRoot
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MerkleRoot} MerkleRoot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerkleRoot.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MerkleRoot message.
     * @function verify
     * @memberof MerkleRoot
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MerkleRoot.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        return null;
    };

    /**
     * Creates a MerkleRoot message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MerkleRoot
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MerkleRoot} MerkleRoot
     */
    MerkleRoot.fromObject = function fromObject(object) {
        if (object instanceof $root.MerkleRoot)
            return object;
        var message = new $root.MerkleRoot();
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        return message;
    };

    /**
     * Creates a plain object from a MerkleRoot message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MerkleRoot
     * @static
     * @param {MerkleRoot} message MerkleRoot
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MerkleRoot.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.hash = "";
            else {
                object.hash = [];
                if (options.bytes !== Array)
                    object.hash = $util.newBuffer(object.hash);
            }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        return object;
    };

    /**
     * Converts this MerkleRoot to JSON.
     * @function toJSON
     * @memberof MerkleRoot
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MerkleRoot.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MerkleRoot;
})();

$root.MerklePrefix = (function() {

    /**
     * Properties of a MerklePrefix.
     * @exports IMerklePrefix
     * @interface IMerklePrefix
     * @property {Uint8Array|null} [keyPrefix] MerklePrefix keyPrefix
     */

    /**
     * Constructs a new MerklePrefix.
     * @exports MerklePrefix
     * @classdesc Represents a MerklePrefix.
     * @implements IMerklePrefix
     * @constructor
     * @param {IMerklePrefix=} [properties] Properties to set
     */
    function MerklePrefix(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MerklePrefix keyPrefix.
     * @member {Uint8Array} keyPrefix
     * @memberof MerklePrefix
     * @instance
     */
    MerklePrefix.prototype.keyPrefix = $util.newBuffer([]);

    /**
     * Creates a new MerklePrefix instance using the specified properties.
     * @function create
     * @memberof MerklePrefix
     * @static
     * @param {IMerklePrefix=} [properties] Properties to set
     * @returns {MerklePrefix} MerklePrefix instance
     */
    MerklePrefix.create = function create(properties) {
        return new MerklePrefix(properties);
    };

    /**
     * Encodes the specified MerklePrefix message. Does not implicitly {@link MerklePrefix.verify|verify} messages.
     * @function encode
     * @memberof MerklePrefix
     * @static
     * @param {IMerklePrefix} message MerklePrefix message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerklePrefix.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.keyPrefix != null && message.hasOwnProperty("keyPrefix"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.keyPrefix);
        return writer;
    };

    /**
     * Encodes the specified MerklePrefix message, length delimited. Does not implicitly {@link MerklePrefix.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MerklePrefix
     * @static
     * @param {IMerklePrefix} message MerklePrefix message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerklePrefix.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MerklePrefix message from the specified reader or buffer.
     * @function decode
     * @memberof MerklePrefix
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MerklePrefix} MerklePrefix
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerklePrefix.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MerklePrefix();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.keyPrefix = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MerklePrefix message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MerklePrefix
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MerklePrefix} MerklePrefix
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerklePrefix.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MerklePrefix message.
     * @function verify
     * @memberof MerklePrefix
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MerklePrefix.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.keyPrefix != null && message.hasOwnProperty("keyPrefix"))
            if (!(message.keyPrefix && typeof message.keyPrefix.length === "number" || $util.isString(message.keyPrefix)))
                return "keyPrefix: buffer expected";
        return null;
    };

    /**
     * Creates a MerklePrefix message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MerklePrefix
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MerklePrefix} MerklePrefix
     */
    MerklePrefix.fromObject = function fromObject(object) {
        if (object instanceof $root.MerklePrefix)
            return object;
        var message = new $root.MerklePrefix();
        if (object.keyPrefix != null)
            if (typeof object.keyPrefix === "string")
                $util.base64.decode(object.keyPrefix, message.keyPrefix = $util.newBuffer($util.base64.length(object.keyPrefix)), 0);
            else if (object.keyPrefix.length)
                message.keyPrefix = object.keyPrefix;
        return message;
    };

    /**
     * Creates a plain object from a MerklePrefix message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MerklePrefix
     * @static
     * @param {MerklePrefix} message MerklePrefix
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MerklePrefix.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.keyPrefix = "";
            else {
                object.keyPrefix = [];
                if (options.bytes !== Array)
                    object.keyPrefix = $util.newBuffer(object.keyPrefix);
            }
        if (message.keyPrefix != null && message.hasOwnProperty("keyPrefix"))
            object.keyPrefix = options.bytes === String ? $util.base64.encode(message.keyPrefix, 0, message.keyPrefix.length) : options.bytes === Array ? Array.prototype.slice.call(message.keyPrefix) : message.keyPrefix;
        return object;
    };

    /**
     * Converts this MerklePrefix to JSON.
     * @function toJSON
     * @memberof MerklePrefix
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MerklePrefix.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MerklePrefix;
})();

$root.MerklePath = (function() {

    /**
     * Properties of a MerklePath.
     * @exports IMerklePath
     * @interface IMerklePath
     * @property {Array.<string>|null} [keyPath] MerklePath keyPath
     */

    /**
     * Constructs a new MerklePath.
     * @exports MerklePath
     * @classdesc Represents a MerklePath.
     * @implements IMerklePath
     * @constructor
     * @param {IMerklePath=} [properties] Properties to set
     */
    function MerklePath(properties) {
        this.keyPath = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MerklePath keyPath.
     * @member {Array.<string>} keyPath
     * @memberof MerklePath
     * @instance
     */
    MerklePath.prototype.keyPath = $util.emptyArray;

    /**
     * Creates a new MerklePath instance using the specified properties.
     * @function create
     * @memberof MerklePath
     * @static
     * @param {IMerklePath=} [properties] Properties to set
     * @returns {MerklePath} MerklePath instance
     */
    MerklePath.create = function create(properties) {
        return new MerklePath(properties);
    };

    /**
     * Encodes the specified MerklePath message. Does not implicitly {@link MerklePath.verify|verify} messages.
     * @function encode
     * @memberof MerklePath
     * @static
     * @param {IMerklePath} message MerklePath message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerklePath.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.keyPath != null && message.keyPath.length)
            for (var i = 0; i < message.keyPath.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.keyPath[i]);
        return writer;
    };

    /**
     * Encodes the specified MerklePath message, length delimited. Does not implicitly {@link MerklePath.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MerklePath
     * @static
     * @param {IMerklePath} message MerklePath message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerklePath.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MerklePath message from the specified reader or buffer.
     * @function decode
     * @memberof MerklePath
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MerklePath} MerklePath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerklePath.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MerklePath();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.keyPath && message.keyPath.length))
                    message.keyPath = [];
                message.keyPath.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MerklePath message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MerklePath
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MerklePath} MerklePath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerklePath.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MerklePath message.
     * @function verify
     * @memberof MerklePath
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MerklePath.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.keyPath != null && message.hasOwnProperty("keyPath")) {
            if (!Array.isArray(message.keyPath))
                return "keyPath: array expected";
            for (var i = 0; i < message.keyPath.length; ++i)
                if (!$util.isString(message.keyPath[i]))
                    return "keyPath: string[] expected";
        }
        return null;
    };

    /**
     * Creates a MerklePath message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MerklePath
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MerklePath} MerklePath
     */
    MerklePath.fromObject = function fromObject(object) {
        if (object instanceof $root.MerklePath)
            return object;
        var message = new $root.MerklePath();
        if (object.keyPath) {
            if (!Array.isArray(object.keyPath))
                throw TypeError(".MerklePath.keyPath: array expected");
            message.keyPath = [];
            for (var i = 0; i < object.keyPath.length; ++i)
                message.keyPath[i] = String(object.keyPath[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a MerklePath message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MerklePath
     * @static
     * @param {MerklePath} message MerklePath
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MerklePath.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.keyPath = [];
        if (message.keyPath && message.keyPath.length) {
            object.keyPath = [];
            for (var j = 0; j < message.keyPath.length; ++j)
                object.keyPath[j] = message.keyPath[j];
        }
        return object;
    };

    /**
     * Converts this MerklePath to JSON.
     * @function toJSON
     * @memberof MerklePath
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MerklePath.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MerklePath;
})();

$root.MerkleProof = (function() {

    /**
     * Properties of a MerkleProof.
     * @exports IMerkleProof
     * @interface IMerkleProof
     * @property {Array.<ICommitmentProof>|null} [proofs] MerkleProof proofs
     */

    /**
     * Constructs a new MerkleProof.
     * @exports MerkleProof
     * @classdesc Represents a MerkleProof.
     * @implements IMerkleProof
     * @constructor
     * @param {IMerkleProof=} [properties] Properties to set
     */
    function MerkleProof(properties) {
        this.proofs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MerkleProof proofs.
     * @member {Array.<ICommitmentProof>} proofs
     * @memberof MerkleProof
     * @instance
     */
    MerkleProof.prototype.proofs = $util.emptyArray;

    /**
     * Creates a new MerkleProof instance using the specified properties.
     * @function create
     * @memberof MerkleProof
     * @static
     * @param {IMerkleProof=} [properties] Properties to set
     * @returns {MerkleProof} MerkleProof instance
     */
    MerkleProof.create = function create(properties) {
        return new MerkleProof(properties);
    };

    /**
     * Encodes the specified MerkleProof message. Does not implicitly {@link MerkleProof.verify|verify} messages.
     * @function encode
     * @memberof MerkleProof
     * @static
     * @param {IMerkleProof} message MerkleProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerkleProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.proofs != null && message.proofs.length)
            for (var i = 0; i < message.proofs.length; ++i)
                $root.CommitmentProof.encode(message.proofs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified MerkleProof message, length delimited. Does not implicitly {@link MerkleProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MerkleProof
     * @static
     * @param {IMerkleProof} message MerkleProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MerkleProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MerkleProof message from the specified reader or buffer.
     * @function decode
     * @memberof MerkleProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MerkleProof} MerkleProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerkleProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MerkleProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.proofs && message.proofs.length))
                    message.proofs = [];
                message.proofs.push($root.CommitmentProof.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MerkleProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MerkleProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MerkleProof} MerkleProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MerkleProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MerkleProof message.
     * @function verify
     * @memberof MerkleProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MerkleProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.proofs != null && message.hasOwnProperty("proofs")) {
            if (!Array.isArray(message.proofs))
                return "proofs: array expected";
            for (var i = 0; i < message.proofs.length; ++i) {
                var error = $root.CommitmentProof.verify(message.proofs[i]);
                if (error)
                    return "proofs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a MerkleProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MerkleProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MerkleProof} MerkleProof
     */
    MerkleProof.fromObject = function fromObject(object) {
        if (object instanceof $root.MerkleProof)
            return object;
        var message = new $root.MerkleProof();
        if (object.proofs) {
            if (!Array.isArray(object.proofs))
                throw TypeError(".MerkleProof.proofs: array expected");
            message.proofs = [];
            for (var i = 0; i < object.proofs.length; ++i) {
                if (typeof object.proofs[i] !== "object")
                    throw TypeError(".MerkleProof.proofs: object expected");
                message.proofs[i] = $root.CommitmentProof.fromObject(object.proofs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a MerkleProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MerkleProof
     * @static
     * @param {MerkleProof} message MerkleProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MerkleProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.proofs = [];
        if (message.proofs && message.proofs.length) {
            object.proofs = [];
            for (var j = 0; j < message.proofs.length; ++j)
                object.proofs[j] = $root.CommitmentProof.toObject(message.proofs[j], options);
        }
        return object;
    };

    /**
     * Converts this MerkleProof to JSON.
     * @function toJSON
     * @memberof MerkleProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MerkleProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MerkleProof;
})();

/**
 * HashOp enum.
 * @exports HashOp
 * @enum {string}
 * @property {number} NO_HASH=0 NO_HASH value
 * @property {number} SHA256=1 SHA256 value
 * @property {number} SHA512=2 SHA512 value
 * @property {number} KECCAK=3 KECCAK value
 * @property {number} RIPEMD160=4 RIPEMD160 value
 * @property {number} BITCOIN=5 BITCOIN value
 */
$root.HashOp = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "NO_HASH"] = 0;
    values[valuesById[1] = "SHA256"] = 1;
    values[valuesById[2] = "SHA512"] = 2;
    values[valuesById[3] = "KECCAK"] = 3;
    values[valuesById[4] = "RIPEMD160"] = 4;
    values[valuesById[5] = "BITCOIN"] = 5;
    return values;
})();

/**
 * LengthOp defines how to process the key and value of the LeafOp
 * to include length information. After encoding the length with the given
 * algorithm, the length will be prepended to the key and value bytes.
 * (Each one with it's own encoded length)
 * @exports LengthOp
 * @enum {string}
 * @property {number} NO_PREFIX=0 NO_PREFIX value
 * @property {number} VAR_PROTO=1 VAR_PROTO value
 * @property {number} VAR_RLP=2 VAR_RLP value
 * @property {number} FIXED32_BIG=3 FIXED32_BIG value
 * @property {number} FIXED32_LITTLE=4 FIXED32_LITTLE value
 * @property {number} FIXED64_BIG=5 FIXED64_BIG value
 * @property {number} FIXED64_LITTLE=6 FIXED64_LITTLE value
 * @property {number} REQUIRE_32_BYTES=7 REQUIRE_32_BYTES value
 * @property {number} REQUIRE_64_BYTES=8 REQUIRE_64_BYTES value
 */
$root.LengthOp = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "NO_PREFIX"] = 0;
    values[valuesById[1] = "VAR_PROTO"] = 1;
    values[valuesById[2] = "VAR_RLP"] = 2;
    values[valuesById[3] = "FIXED32_BIG"] = 3;
    values[valuesById[4] = "FIXED32_LITTLE"] = 4;
    values[valuesById[5] = "FIXED64_BIG"] = 5;
    values[valuesById[6] = "FIXED64_LITTLE"] = 6;
    values[valuesById[7] = "REQUIRE_32_BYTES"] = 7;
    values[valuesById[8] = "REQUIRE_64_BYTES"] = 8;
    return values;
})();

$root.ExistenceProof = (function() {

    /**
     * Properties of an ExistenceProof.
     * @exports IExistenceProof
     * @interface IExistenceProof
     * @property {Uint8Array|null} [key] ExistenceProof key
     * @property {Uint8Array|null} [value] ExistenceProof value
     * @property {ILeafOp|null} [leaf] ExistenceProof leaf
     * @property {Array.<IInnerOp>|null} [path] ExistenceProof path
     */

    /**
     * Constructs a new ExistenceProof.
     * @exports ExistenceProof
     * @classdesc ExistenceProof takes a key and a value and a set of steps to perform on it.
     * The result of peforming all these steps will provide a "root hash", which can
     * be compared to the value in a header.
     * 
     * Since it is computationally infeasible to produce a hash collission for any of
     * the used cryptographic hash functions, if someone can provide a series of
     * operations to transform a given key and value into a root hash that matches some
     * trusted root, these key and values must be in the referenced merkle tree.
     * 
     * The only possible issue is maliablity in LeafOp, such as providing extra prefix
     * data, which should be controlled by a spec. Eg. with lengthOp as NONE, prefix =
     * FOO, key = BAR, value = CHOICE and prefix = F, key = OOBAR, value = CHOICE would
     * produce the same value.
     * 
     * With LengthOp this is tricker but not impossible. Which is why the
     * "leafPrefixEqual" field in the ProofSpec is valuable to prevent this mutability.
     * And why all trees should length-prefix the data before hashing it.
     * @implements IExistenceProof
     * @constructor
     * @param {IExistenceProof=} [properties] Properties to set
     */
    function ExistenceProof(properties) {
        this.path = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ExistenceProof key.
     * @member {Uint8Array} key
     * @memberof ExistenceProof
     * @instance
     */
    ExistenceProof.prototype.key = $util.newBuffer([]);

    /**
     * ExistenceProof value.
     * @member {Uint8Array} value
     * @memberof ExistenceProof
     * @instance
     */
    ExistenceProof.prototype.value = $util.newBuffer([]);

    /**
     * ExistenceProof leaf.
     * @member {ILeafOp|null|undefined} leaf
     * @memberof ExistenceProof
     * @instance
     */
    ExistenceProof.prototype.leaf = null;

    /**
     * ExistenceProof path.
     * @member {Array.<IInnerOp>} path
     * @memberof ExistenceProof
     * @instance
     */
    ExistenceProof.prototype.path = $util.emptyArray;

    /**
     * Creates a new ExistenceProof instance using the specified properties.
     * @function create
     * @memberof ExistenceProof
     * @static
     * @param {IExistenceProof=} [properties] Properties to set
     * @returns {ExistenceProof} ExistenceProof instance
     */
    ExistenceProof.create = function create(properties) {
        return new ExistenceProof(properties);
    };

    /**
     * Encodes the specified ExistenceProof message. Does not implicitly {@link ExistenceProof.verify|verify} messages.
     * @function encode
     * @memberof ExistenceProof
     * @static
     * @param {IExistenceProof} message ExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExistenceProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
        if (message.leaf != null && message.hasOwnProperty("leaf"))
            $root.LeafOp.encode(message.leaf, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.path != null && message.path.length)
            for (var i = 0; i < message.path.length; ++i)
                $root.InnerOp.encode(message.path[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ExistenceProof message, length delimited. Does not implicitly {@link ExistenceProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ExistenceProof
     * @static
     * @param {IExistenceProof} message ExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExistenceProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ExistenceProof message from the specified reader or buffer.
     * @function decode
     * @memberof ExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ExistenceProof} ExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExistenceProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ExistenceProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.bytes();
                break;
            case 2:
                message.value = reader.bytes();
                break;
            case 3:
                message.leaf = $root.LeafOp.decode(reader, reader.uint32());
                break;
            case 4:
                if (!(message.path && message.path.length))
                    message.path = [];
                message.path.push($root.InnerOp.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ExistenceProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ExistenceProof} ExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExistenceProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ExistenceProof message.
     * @function verify
     * @memberof ExistenceProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ExistenceProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                return "key: buffer expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                return "value: buffer expected";
        if (message.leaf != null && message.hasOwnProperty("leaf")) {
            var error = $root.LeafOp.verify(message.leaf);
            if (error)
                return "leaf." + error;
        }
        if (message.path != null && message.hasOwnProperty("path")) {
            if (!Array.isArray(message.path))
                return "path: array expected";
            for (var i = 0; i < message.path.length; ++i) {
                var error = $root.InnerOp.verify(message.path[i]);
                if (error)
                    return "path." + error;
            }
        }
        return null;
    };

    /**
     * Creates an ExistenceProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ExistenceProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ExistenceProof} ExistenceProof
     */
    ExistenceProof.fromObject = function fromObject(object) {
        if (object instanceof $root.ExistenceProof)
            return object;
        var message = new $root.ExistenceProof();
        if (object.key != null)
            if (typeof object.key === "string")
                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
            else if (object.key.length)
                message.key = object.key;
        if (object.value != null)
            if (typeof object.value === "string")
                $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
            else if (object.value.length)
                message.value = object.value;
        if (object.leaf != null) {
            if (typeof object.leaf !== "object")
                throw TypeError(".ExistenceProof.leaf: object expected");
            message.leaf = $root.LeafOp.fromObject(object.leaf);
        }
        if (object.path) {
            if (!Array.isArray(object.path))
                throw TypeError(".ExistenceProof.path: array expected");
            message.path = [];
            for (var i = 0; i < object.path.length; ++i) {
                if (typeof object.path[i] !== "object")
                    throw TypeError(".ExistenceProof.path: object expected");
                message.path[i] = $root.InnerOp.fromObject(object.path[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an ExistenceProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ExistenceProof
     * @static
     * @param {ExistenceProof} message ExistenceProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ExistenceProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.path = [];
        if (options.defaults) {
            if (options.bytes === String)
                object.key = "";
            else {
                object.key = [];
                if (options.bytes !== Array)
                    object.key = $util.newBuffer(object.key);
            }
            if (options.bytes === String)
                object.value = "";
            else {
                object.value = [];
                if (options.bytes !== Array)
                    object.value = $util.newBuffer(object.value);
            }
            object.leaf = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
        if (message.leaf != null && message.hasOwnProperty("leaf"))
            object.leaf = $root.LeafOp.toObject(message.leaf, options);
        if (message.path && message.path.length) {
            object.path = [];
            for (var j = 0; j < message.path.length; ++j)
                object.path[j] = $root.InnerOp.toObject(message.path[j], options);
        }
        return object;
    };

    /**
     * Converts this ExistenceProof to JSON.
     * @function toJSON
     * @memberof ExistenceProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ExistenceProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ExistenceProof;
})();

$root.NonExistenceProof = (function() {

    /**
     * Properties of a NonExistenceProof.
     * @exports INonExistenceProof
     * @interface INonExistenceProof
     * @property {Uint8Array|null} [key] NonExistenceProof key
     * @property {IExistenceProof|null} [left] NonExistenceProof left
     * @property {IExistenceProof|null} [right] NonExistenceProof right
     */

    /**
     * Constructs a new NonExistenceProof.
     * @exports NonExistenceProof
     * @classdesc Represents a NonExistenceProof.
     * @implements INonExistenceProof
     * @constructor
     * @param {INonExistenceProof=} [properties] Properties to set
     */
    function NonExistenceProof(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NonExistenceProof key.
     * @member {Uint8Array} key
     * @memberof NonExistenceProof
     * @instance
     */
    NonExistenceProof.prototype.key = $util.newBuffer([]);

    /**
     * NonExistenceProof left.
     * @member {IExistenceProof|null|undefined} left
     * @memberof NonExistenceProof
     * @instance
     */
    NonExistenceProof.prototype.left = null;

    /**
     * NonExistenceProof right.
     * @member {IExistenceProof|null|undefined} right
     * @memberof NonExistenceProof
     * @instance
     */
    NonExistenceProof.prototype.right = null;

    /**
     * Creates a new NonExistenceProof instance using the specified properties.
     * @function create
     * @memberof NonExistenceProof
     * @static
     * @param {INonExistenceProof=} [properties] Properties to set
     * @returns {NonExistenceProof} NonExistenceProof instance
     */
    NonExistenceProof.create = function create(properties) {
        return new NonExistenceProof(properties);
    };

    /**
     * Encodes the specified NonExistenceProof message. Does not implicitly {@link NonExistenceProof.verify|verify} messages.
     * @function encode
     * @memberof NonExistenceProof
     * @static
     * @param {INonExistenceProof} message NonExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NonExistenceProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
        if (message.left != null && message.hasOwnProperty("left"))
            $root.ExistenceProof.encode(message.left, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.right != null && message.hasOwnProperty("right"))
            $root.ExistenceProof.encode(message.right, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NonExistenceProof message, length delimited. Does not implicitly {@link NonExistenceProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NonExistenceProof
     * @static
     * @param {INonExistenceProof} message NonExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NonExistenceProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NonExistenceProof message from the specified reader or buffer.
     * @function decode
     * @memberof NonExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NonExistenceProof} NonExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NonExistenceProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NonExistenceProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.bytes();
                break;
            case 2:
                message.left = $root.ExistenceProof.decode(reader, reader.uint32());
                break;
            case 3:
                message.right = $root.ExistenceProof.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NonExistenceProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NonExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NonExistenceProof} NonExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NonExistenceProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NonExistenceProof message.
     * @function verify
     * @memberof NonExistenceProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NonExistenceProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                return "key: buffer expected";
        if (message.left != null && message.hasOwnProperty("left")) {
            var error = $root.ExistenceProof.verify(message.left);
            if (error)
                return "left." + error;
        }
        if (message.right != null && message.hasOwnProperty("right")) {
            var error = $root.ExistenceProof.verify(message.right);
            if (error)
                return "right." + error;
        }
        return null;
    };

    /**
     * Creates a NonExistenceProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NonExistenceProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NonExistenceProof} NonExistenceProof
     */
    NonExistenceProof.fromObject = function fromObject(object) {
        if (object instanceof $root.NonExistenceProof)
            return object;
        var message = new $root.NonExistenceProof();
        if (object.key != null)
            if (typeof object.key === "string")
                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
            else if (object.key.length)
                message.key = object.key;
        if (object.left != null) {
            if (typeof object.left !== "object")
                throw TypeError(".NonExistenceProof.left: object expected");
            message.left = $root.ExistenceProof.fromObject(object.left);
        }
        if (object.right != null) {
            if (typeof object.right !== "object")
                throw TypeError(".NonExistenceProof.right: object expected");
            message.right = $root.ExistenceProof.fromObject(object.right);
        }
        return message;
    };

    /**
     * Creates a plain object from a NonExistenceProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NonExistenceProof
     * @static
     * @param {NonExistenceProof} message NonExistenceProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NonExistenceProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.key = "";
            else {
                object.key = [];
                if (options.bytes !== Array)
                    object.key = $util.newBuffer(object.key);
            }
            object.left = null;
            object.right = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
        if (message.left != null && message.hasOwnProperty("left"))
            object.left = $root.ExistenceProof.toObject(message.left, options);
        if (message.right != null && message.hasOwnProperty("right"))
            object.right = $root.ExistenceProof.toObject(message.right, options);
        return object;
    };

    /**
     * Converts this NonExistenceProof to JSON.
     * @function toJSON
     * @memberof NonExistenceProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NonExistenceProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NonExistenceProof;
})();

$root.CommitmentProof = (function() {

    /**
     * Properties of a CommitmentProof.
     * @exports ICommitmentProof
     * @interface ICommitmentProof
     * @property {IExistenceProof|null} [exist] CommitmentProof exist
     * @property {INonExistenceProof|null} [nonexist] CommitmentProof nonexist
     * @property {IBatchProof|null} [batch] CommitmentProof batch
     * @property {ICompressedBatchProof|null} [compressed] CommitmentProof compressed
     */

    /**
     * Constructs a new CommitmentProof.
     * @exports CommitmentProof
     * @classdesc Represents a CommitmentProof.
     * @implements ICommitmentProof
     * @constructor
     * @param {ICommitmentProof=} [properties] Properties to set
     */
    function CommitmentProof(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommitmentProof exist.
     * @member {IExistenceProof|null|undefined} exist
     * @memberof CommitmentProof
     * @instance
     */
    CommitmentProof.prototype.exist = null;

    /**
     * CommitmentProof nonexist.
     * @member {INonExistenceProof|null|undefined} nonexist
     * @memberof CommitmentProof
     * @instance
     */
    CommitmentProof.prototype.nonexist = null;

    /**
     * CommitmentProof batch.
     * @member {IBatchProof|null|undefined} batch
     * @memberof CommitmentProof
     * @instance
     */
    CommitmentProof.prototype.batch = null;

    /**
     * CommitmentProof compressed.
     * @member {ICompressedBatchProof|null|undefined} compressed
     * @memberof CommitmentProof
     * @instance
     */
    CommitmentProof.prototype.compressed = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * CommitmentProof proof.
     * @member {"exist"|"nonexist"|"batch"|"compressed"|undefined} proof
     * @memberof CommitmentProof
     * @instance
     */
    Object.defineProperty(CommitmentProof.prototype, "proof", {
        get: $util.oneOfGetter($oneOfFields = ["exist", "nonexist", "batch", "compressed"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new CommitmentProof instance using the specified properties.
     * @function create
     * @memberof CommitmentProof
     * @static
     * @param {ICommitmentProof=} [properties] Properties to set
     * @returns {CommitmentProof} CommitmentProof instance
     */
    CommitmentProof.create = function create(properties) {
        return new CommitmentProof(properties);
    };

    /**
     * Encodes the specified CommitmentProof message. Does not implicitly {@link CommitmentProof.verify|verify} messages.
     * @function encode
     * @memberof CommitmentProof
     * @static
     * @param {ICommitmentProof} message CommitmentProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommitmentProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.exist != null && message.hasOwnProperty("exist"))
            $root.ExistenceProof.encode(message.exist, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.nonexist != null && message.hasOwnProperty("nonexist"))
            $root.NonExistenceProof.encode(message.nonexist, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.batch != null && message.hasOwnProperty("batch"))
            $root.BatchProof.encode(message.batch, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.compressed != null && message.hasOwnProperty("compressed"))
            $root.CompressedBatchProof.encode(message.compressed, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CommitmentProof message, length delimited. Does not implicitly {@link CommitmentProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommitmentProof
     * @static
     * @param {ICommitmentProof} message CommitmentProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommitmentProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommitmentProof message from the specified reader or buffer.
     * @function decode
     * @memberof CommitmentProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommitmentProof} CommitmentProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommitmentProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommitmentProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.exist = $root.ExistenceProof.decode(reader, reader.uint32());
                break;
            case 2:
                message.nonexist = $root.NonExistenceProof.decode(reader, reader.uint32());
                break;
            case 3:
                message.batch = $root.BatchProof.decode(reader, reader.uint32());
                break;
            case 4:
                message.compressed = $root.CompressedBatchProof.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommitmentProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommitmentProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommitmentProof} CommitmentProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommitmentProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommitmentProof message.
     * @function verify
     * @memberof CommitmentProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommitmentProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            properties.proof = 1;
            {
                var error = $root.ExistenceProof.verify(message.exist);
                if (error)
                    return "exist." + error;
            }
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            if (properties.proof === 1)
                return "proof: multiple values";
            properties.proof = 1;
            {
                var error = $root.NonExistenceProof.verify(message.nonexist);
                if (error)
                    return "nonexist." + error;
            }
        }
        if (message.batch != null && message.hasOwnProperty("batch")) {
            if (properties.proof === 1)
                return "proof: multiple values";
            properties.proof = 1;
            {
                var error = $root.BatchProof.verify(message.batch);
                if (error)
                    return "batch." + error;
            }
        }
        if (message.compressed != null && message.hasOwnProperty("compressed")) {
            if (properties.proof === 1)
                return "proof: multiple values";
            properties.proof = 1;
            {
                var error = $root.CompressedBatchProof.verify(message.compressed);
                if (error)
                    return "compressed." + error;
            }
        }
        return null;
    };

    /**
     * Creates a CommitmentProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommitmentProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommitmentProof} CommitmentProof
     */
    CommitmentProof.fromObject = function fromObject(object) {
        if (object instanceof $root.CommitmentProof)
            return object;
        var message = new $root.CommitmentProof();
        if (object.exist != null) {
            if (typeof object.exist !== "object")
                throw TypeError(".CommitmentProof.exist: object expected");
            message.exist = $root.ExistenceProof.fromObject(object.exist);
        }
        if (object.nonexist != null) {
            if (typeof object.nonexist !== "object")
                throw TypeError(".CommitmentProof.nonexist: object expected");
            message.nonexist = $root.NonExistenceProof.fromObject(object.nonexist);
        }
        if (object.batch != null) {
            if (typeof object.batch !== "object")
                throw TypeError(".CommitmentProof.batch: object expected");
            message.batch = $root.BatchProof.fromObject(object.batch);
        }
        if (object.compressed != null) {
            if (typeof object.compressed !== "object")
                throw TypeError(".CommitmentProof.compressed: object expected");
            message.compressed = $root.CompressedBatchProof.fromObject(object.compressed);
        }
        return message;
    };

    /**
     * Creates a plain object from a CommitmentProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommitmentProof
     * @static
     * @param {CommitmentProof} message CommitmentProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommitmentProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            object.exist = $root.ExistenceProof.toObject(message.exist, options);
            if (options.oneofs)
                object.proof = "exist";
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            object.nonexist = $root.NonExistenceProof.toObject(message.nonexist, options);
            if (options.oneofs)
                object.proof = "nonexist";
        }
        if (message.batch != null && message.hasOwnProperty("batch")) {
            object.batch = $root.BatchProof.toObject(message.batch, options);
            if (options.oneofs)
                object.proof = "batch";
        }
        if (message.compressed != null && message.hasOwnProperty("compressed")) {
            object.compressed = $root.CompressedBatchProof.toObject(message.compressed, options);
            if (options.oneofs)
                object.proof = "compressed";
        }
        return object;
    };

    /**
     * Converts this CommitmentProof to JSON.
     * @function toJSON
     * @memberof CommitmentProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommitmentProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommitmentProof;
})();

$root.LeafOp = (function() {

    /**
     * Properties of a LeafOp.
     * @exports ILeafOp
     * @interface ILeafOp
     * @property {HashOp|null} [hash] LeafOp hash
     * @property {HashOp|null} [prehashKey] LeafOp prehashKey
     * @property {HashOp|null} [prehashValue] LeafOp prehashValue
     * @property {LengthOp|null} [length] LeafOp length
     * @property {Uint8Array|null} [prefix] LeafOp prefix
     */

    /**
     * Constructs a new LeafOp.
     * @exports LeafOp
     * @classdesc LeafOp represents the raw key-value data we wish to prove, and
     * must be flexible to represent the internal transformation from
     * the original key-value pairs into the basis hash, for many existing
     * merkle trees.
     * 
     * key and value are passed in. So that the signature of this operation is:
     * leafOp(key, value) -> output
     * 
     * To process this, first prehash the keys and values if needed (ANY means no hash
     * in this case): hkey = prehashKey(key) hvalue = prehashValue(value)
     * 
     * Then combine the bytes, and hash it
     * output = hash(prefix || length(hkey) || hkey || length(hvalue) || hvalue)
     * @implements ILeafOp
     * @constructor
     * @param {ILeafOp=} [properties] Properties to set
     */
    function LeafOp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LeafOp hash.
     * @member {HashOp} hash
     * @memberof LeafOp
     * @instance
     */
    LeafOp.prototype.hash = 0;

    /**
     * LeafOp prehashKey.
     * @member {HashOp} prehashKey
     * @memberof LeafOp
     * @instance
     */
    LeafOp.prototype.prehashKey = 0;

    /**
     * LeafOp prehashValue.
     * @member {HashOp} prehashValue
     * @memberof LeafOp
     * @instance
     */
    LeafOp.prototype.prehashValue = 0;

    /**
     * LeafOp length.
     * @member {LengthOp} length
     * @memberof LeafOp
     * @instance
     */
    LeafOp.prototype.length = 0;

    /**
     * LeafOp prefix.
     * @member {Uint8Array} prefix
     * @memberof LeafOp
     * @instance
     */
    LeafOp.prototype.prefix = $util.newBuffer([]);

    /**
     * Creates a new LeafOp instance using the specified properties.
     * @function create
     * @memberof LeafOp
     * @static
     * @param {ILeafOp=} [properties] Properties to set
     * @returns {LeafOp} LeafOp instance
     */
    LeafOp.create = function create(properties) {
        return new LeafOp(properties);
    };

    /**
     * Encodes the specified LeafOp message. Does not implicitly {@link LeafOp.verify|verify} messages.
     * @function encode
     * @memberof LeafOp
     * @static
     * @param {ILeafOp} message LeafOp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeafOp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hash);
        if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.prehashKey);
        if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.prehashValue);
        if (message.length != null && message.hasOwnProperty("length"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.length);
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.prefix);
        return writer;
    };

    /**
     * Encodes the specified LeafOp message, length delimited. Does not implicitly {@link LeafOp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LeafOp
     * @static
     * @param {ILeafOp} message LeafOp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LeafOp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LeafOp message from the specified reader or buffer.
     * @function decode
     * @memberof LeafOp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LeafOp} LeafOp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeafOp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LeafOp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.int32();
                break;
            case 2:
                message.prehashKey = reader.int32();
                break;
            case 3:
                message.prehashValue = reader.int32();
                break;
            case 4:
                message.length = reader.int32();
                break;
            case 5:
                message.prefix = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LeafOp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LeafOp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LeafOp} LeafOp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LeafOp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LeafOp message.
     * @function verify
     * @memberof LeafOp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LeafOp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            switch (message.hash) {
            default:
                return "hash: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
            switch (message.prehashKey) {
            default:
                return "prehashKey: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
            switch (message.prehashValue) {
            default:
                return "prehashValue: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.length != null && message.hasOwnProperty("length"))
            switch (message.length) {
            default:
                return "length: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                break;
            }
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            if (!(message.prefix && typeof message.prefix.length === "number" || $util.isString(message.prefix)))
                return "prefix: buffer expected";
        return null;
    };

    /**
     * Creates a LeafOp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LeafOp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LeafOp} LeafOp
     */
    LeafOp.fromObject = function fromObject(object) {
        if (object instanceof $root.LeafOp)
            return object;
        var message = new $root.LeafOp();
        switch (object.hash) {
        case "NO_HASH":
        case 0:
            message.hash = 0;
            break;
        case "SHA256":
        case 1:
            message.hash = 1;
            break;
        case "SHA512":
        case 2:
            message.hash = 2;
            break;
        case "KECCAK":
        case 3:
            message.hash = 3;
            break;
        case "RIPEMD160":
        case 4:
            message.hash = 4;
            break;
        case "BITCOIN":
        case 5:
            message.hash = 5;
            break;
        }
        switch (object.prehashKey) {
        case "NO_HASH":
        case 0:
            message.prehashKey = 0;
            break;
        case "SHA256":
        case 1:
            message.prehashKey = 1;
            break;
        case "SHA512":
        case 2:
            message.prehashKey = 2;
            break;
        case "KECCAK":
        case 3:
            message.prehashKey = 3;
            break;
        case "RIPEMD160":
        case 4:
            message.prehashKey = 4;
            break;
        case "BITCOIN":
        case 5:
            message.prehashKey = 5;
            break;
        }
        switch (object.prehashValue) {
        case "NO_HASH":
        case 0:
            message.prehashValue = 0;
            break;
        case "SHA256":
        case 1:
            message.prehashValue = 1;
            break;
        case "SHA512":
        case 2:
            message.prehashValue = 2;
            break;
        case "KECCAK":
        case 3:
            message.prehashValue = 3;
            break;
        case "RIPEMD160":
        case 4:
            message.prehashValue = 4;
            break;
        case "BITCOIN":
        case 5:
            message.prehashValue = 5;
            break;
        }
        switch (object.length) {
        case "NO_PREFIX":
        case 0:
            message.length = 0;
            break;
        case "VAR_PROTO":
        case 1:
            message.length = 1;
            break;
        case "VAR_RLP":
        case 2:
            message.length = 2;
            break;
        case "FIXED32_BIG":
        case 3:
            message.length = 3;
            break;
        case "FIXED32_LITTLE":
        case 4:
            message.length = 4;
            break;
        case "FIXED64_BIG":
        case 5:
            message.length = 5;
            break;
        case "FIXED64_LITTLE":
        case 6:
            message.length = 6;
            break;
        case "REQUIRE_32_BYTES":
        case 7:
            message.length = 7;
            break;
        case "REQUIRE_64_BYTES":
        case 8:
            message.length = 8;
            break;
        }
        if (object.prefix != null)
            if (typeof object.prefix === "string")
                $util.base64.decode(object.prefix, message.prefix = $util.newBuffer($util.base64.length(object.prefix)), 0);
            else if (object.prefix.length)
                message.prefix = object.prefix;
        return message;
    };

    /**
     * Creates a plain object from a LeafOp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LeafOp
     * @static
     * @param {LeafOp} message LeafOp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LeafOp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.hash = options.enums === String ? "NO_HASH" : 0;
            object.prehashKey = options.enums === String ? "NO_HASH" : 0;
            object.prehashValue = options.enums === String ? "NO_HASH" : 0;
            object.length = options.enums === String ? "NO_PREFIX" : 0;
            if (options.bytes === String)
                object.prefix = "";
            else {
                object.prefix = [];
                if (options.bytes !== Array)
                    object.prefix = $util.newBuffer(object.prefix);
            }
        }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.enums === String ? $root.HashOp[message.hash] : message.hash;
        if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
            object.prehashKey = options.enums === String ? $root.HashOp[message.prehashKey] : message.prehashKey;
        if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
            object.prehashValue = options.enums === String ? $root.HashOp[message.prehashValue] : message.prehashValue;
        if (message.length != null && message.hasOwnProperty("length"))
            object.length = options.enums === String ? $root.LengthOp[message.length] : message.length;
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            object.prefix = options.bytes === String ? $util.base64.encode(message.prefix, 0, message.prefix.length) : options.bytes === Array ? Array.prototype.slice.call(message.prefix) : message.prefix;
        return object;
    };

    /**
     * Converts this LeafOp to JSON.
     * @function toJSON
     * @memberof LeafOp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LeafOp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LeafOp;
})();

$root.InnerOp = (function() {

    /**
     * Properties of an InnerOp.
     * @exports IInnerOp
     * @interface IInnerOp
     * @property {HashOp|null} [hash] InnerOp hash
     * @property {Uint8Array|null} [prefix] InnerOp prefix
     * @property {Uint8Array|null} [suffix] InnerOp suffix
     */

    /**
     * Constructs a new InnerOp.
     * @exports InnerOp
     * @classdesc InnerOp represents a merkle-proof step that is not a leaf.
     * It represents concatenating two children and hashing them to provide the next
     * result.
     * 
     * The result of the previous step is passed in, so the signature of this op is:
     * innerOp(child) -> output
     * 
     * The result of applying InnerOp should be:
     * output = op.hash(op.prefix || child || op.suffix)
     * 
     * where the || operator is concatenation of binary data,
     * and child is the result of hashing all the tree below this step.
     * 
     * Any special data, like prepending child with the length, or prepending the
     * entire operation with some value to differentiate from leaf nodes, should be
     * included in prefix and suffix. If either of prefix or suffix is empty, we just
     * treat it as an empty string
     * @implements IInnerOp
     * @constructor
     * @param {IInnerOp=} [properties] Properties to set
     */
    function InnerOp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InnerOp hash.
     * @member {HashOp} hash
     * @memberof InnerOp
     * @instance
     */
    InnerOp.prototype.hash = 0;

    /**
     * InnerOp prefix.
     * @member {Uint8Array} prefix
     * @memberof InnerOp
     * @instance
     */
    InnerOp.prototype.prefix = $util.newBuffer([]);

    /**
     * InnerOp suffix.
     * @member {Uint8Array} suffix
     * @memberof InnerOp
     * @instance
     */
    InnerOp.prototype.suffix = $util.newBuffer([]);

    /**
     * Creates a new InnerOp instance using the specified properties.
     * @function create
     * @memberof InnerOp
     * @static
     * @param {IInnerOp=} [properties] Properties to set
     * @returns {InnerOp} InnerOp instance
     */
    InnerOp.create = function create(properties) {
        return new InnerOp(properties);
    };

    /**
     * Encodes the specified InnerOp message. Does not implicitly {@link InnerOp.verify|verify} messages.
     * @function encode
     * @memberof InnerOp
     * @static
     * @param {IInnerOp} message InnerOp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerOp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hash);
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.prefix);
        if (message.suffix != null && message.hasOwnProperty("suffix"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.suffix);
        return writer;
    };

    /**
     * Encodes the specified InnerOp message, length delimited. Does not implicitly {@link InnerOp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InnerOp
     * @static
     * @param {IInnerOp} message InnerOp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerOp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InnerOp message from the specified reader or buffer.
     * @function decode
     * @memberof InnerOp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InnerOp} InnerOp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerOp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InnerOp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.int32();
                break;
            case 2:
                message.prefix = reader.bytes();
                break;
            case 3:
                message.suffix = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InnerOp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InnerOp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InnerOp} InnerOp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerOp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InnerOp message.
     * @function verify
     * @memberof InnerOp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InnerOp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            switch (message.hash) {
            default:
                return "hash: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            if (!(message.prefix && typeof message.prefix.length === "number" || $util.isString(message.prefix)))
                return "prefix: buffer expected";
        if (message.suffix != null && message.hasOwnProperty("suffix"))
            if (!(message.suffix && typeof message.suffix.length === "number" || $util.isString(message.suffix)))
                return "suffix: buffer expected";
        return null;
    };

    /**
     * Creates an InnerOp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InnerOp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InnerOp} InnerOp
     */
    InnerOp.fromObject = function fromObject(object) {
        if (object instanceof $root.InnerOp)
            return object;
        var message = new $root.InnerOp();
        switch (object.hash) {
        case "NO_HASH":
        case 0:
            message.hash = 0;
            break;
        case "SHA256":
        case 1:
            message.hash = 1;
            break;
        case "SHA512":
        case 2:
            message.hash = 2;
            break;
        case "KECCAK":
        case 3:
            message.hash = 3;
            break;
        case "RIPEMD160":
        case 4:
            message.hash = 4;
            break;
        case "BITCOIN":
        case 5:
            message.hash = 5;
            break;
        }
        if (object.prefix != null)
            if (typeof object.prefix === "string")
                $util.base64.decode(object.prefix, message.prefix = $util.newBuffer($util.base64.length(object.prefix)), 0);
            else if (object.prefix.length)
                message.prefix = object.prefix;
        if (object.suffix != null)
            if (typeof object.suffix === "string")
                $util.base64.decode(object.suffix, message.suffix = $util.newBuffer($util.base64.length(object.suffix)), 0);
            else if (object.suffix.length)
                message.suffix = object.suffix;
        return message;
    };

    /**
     * Creates a plain object from an InnerOp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InnerOp
     * @static
     * @param {InnerOp} message InnerOp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InnerOp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.hash = options.enums === String ? "NO_HASH" : 0;
            if (options.bytes === String)
                object.prefix = "";
            else {
                object.prefix = [];
                if (options.bytes !== Array)
                    object.prefix = $util.newBuffer(object.prefix);
            }
            if (options.bytes === String)
                object.suffix = "";
            else {
                object.suffix = [];
                if (options.bytes !== Array)
                    object.suffix = $util.newBuffer(object.suffix);
            }
        }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.enums === String ? $root.HashOp[message.hash] : message.hash;
        if (message.prefix != null && message.hasOwnProperty("prefix"))
            object.prefix = options.bytes === String ? $util.base64.encode(message.prefix, 0, message.prefix.length) : options.bytes === Array ? Array.prototype.slice.call(message.prefix) : message.prefix;
        if (message.suffix != null && message.hasOwnProperty("suffix"))
            object.suffix = options.bytes === String ? $util.base64.encode(message.suffix, 0, message.suffix.length) : options.bytes === Array ? Array.prototype.slice.call(message.suffix) : message.suffix;
        return object;
    };

    /**
     * Converts this InnerOp to JSON.
     * @function toJSON
     * @memberof InnerOp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InnerOp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return InnerOp;
})();

$root.ProofSpec = (function() {

    /**
     * Properties of a ProofSpec.
     * @exports IProofSpec
     * @interface IProofSpec
     * @property {ILeafOp|null} [leafSpec] ProofSpec leafSpec
     * @property {IInnerSpec|null} [innerSpec] ProofSpec innerSpec
     * @property {number|null} [maxDepth] ProofSpec maxDepth
     * @property {number|null} [minDepth] ProofSpec minDepth
     */

    /**
     * Constructs a new ProofSpec.
     * @exports ProofSpec
     * @classdesc ProofSpec defines what the expected parameters are for a given proof type.
     * This can be stored in the client and used to validate any incoming proofs.
     * 
     * verify(ProofSpec, Proof) -> Proof | Error
     * 
     * As demonstrated in tests, if we don't fix the algorithm used to calculate the
     * LeafHash for a given tree, there are many possible key-value pairs that can
     * generate a given hash (by interpretting the preimage differently).
     * We need this for proper security, requires client knows a priori what
     * tree format server uses. But not in code, rather a configuration object.
     * @implements IProofSpec
     * @constructor
     * @param {IProofSpec=} [properties] Properties to set
     */
    function ProofSpec(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ProofSpec leafSpec.
     * @member {ILeafOp|null|undefined} leafSpec
     * @memberof ProofSpec
     * @instance
     */
    ProofSpec.prototype.leafSpec = null;

    /**
     * ProofSpec innerSpec.
     * @member {IInnerSpec|null|undefined} innerSpec
     * @memberof ProofSpec
     * @instance
     */
    ProofSpec.prototype.innerSpec = null;

    /**
     * ProofSpec maxDepth.
     * @member {number} maxDepth
     * @memberof ProofSpec
     * @instance
     */
    ProofSpec.prototype.maxDepth = 0;

    /**
     * ProofSpec minDepth.
     * @member {number} minDepth
     * @memberof ProofSpec
     * @instance
     */
    ProofSpec.prototype.minDepth = 0;

    /**
     * Creates a new ProofSpec instance using the specified properties.
     * @function create
     * @memberof ProofSpec
     * @static
     * @param {IProofSpec=} [properties] Properties to set
     * @returns {ProofSpec} ProofSpec instance
     */
    ProofSpec.create = function create(properties) {
        return new ProofSpec(properties);
    };

    /**
     * Encodes the specified ProofSpec message. Does not implicitly {@link ProofSpec.verify|verify} messages.
     * @function encode
     * @memberof ProofSpec
     * @static
     * @param {IProofSpec} message ProofSpec message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ProofSpec.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.leafSpec != null && message.hasOwnProperty("leafSpec"))
            $root.LeafOp.encode(message.leafSpec, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.innerSpec != null && message.hasOwnProperty("innerSpec"))
            $root.InnerSpec.encode(message.innerSpec, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.maxDepth != null && message.hasOwnProperty("maxDepth"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.maxDepth);
        if (message.minDepth != null && message.hasOwnProperty("minDepth"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.minDepth);
        return writer;
    };

    /**
     * Encodes the specified ProofSpec message, length delimited. Does not implicitly {@link ProofSpec.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ProofSpec
     * @static
     * @param {IProofSpec} message ProofSpec message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ProofSpec.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ProofSpec message from the specified reader or buffer.
     * @function decode
     * @memberof ProofSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ProofSpec} ProofSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ProofSpec.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ProofSpec();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.leafSpec = $root.LeafOp.decode(reader, reader.uint32());
                break;
            case 2:
                message.innerSpec = $root.InnerSpec.decode(reader, reader.uint32());
                break;
            case 3:
                message.maxDepth = reader.int32();
                break;
            case 4:
                message.minDepth = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ProofSpec message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ProofSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ProofSpec} ProofSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ProofSpec.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ProofSpec message.
     * @function verify
     * @memberof ProofSpec
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ProofSpec.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.leafSpec != null && message.hasOwnProperty("leafSpec")) {
            var error = $root.LeafOp.verify(message.leafSpec);
            if (error)
                return "leafSpec." + error;
        }
        if (message.innerSpec != null && message.hasOwnProperty("innerSpec")) {
            var error = $root.InnerSpec.verify(message.innerSpec);
            if (error)
                return "innerSpec." + error;
        }
        if (message.maxDepth != null && message.hasOwnProperty("maxDepth"))
            if (!$util.isInteger(message.maxDepth))
                return "maxDepth: integer expected";
        if (message.minDepth != null && message.hasOwnProperty("minDepth"))
            if (!$util.isInteger(message.minDepth))
                return "minDepth: integer expected";
        return null;
    };

    /**
     * Creates a ProofSpec message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ProofSpec
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ProofSpec} ProofSpec
     */
    ProofSpec.fromObject = function fromObject(object) {
        if (object instanceof $root.ProofSpec)
            return object;
        var message = new $root.ProofSpec();
        if (object.leafSpec != null) {
            if (typeof object.leafSpec !== "object")
                throw TypeError(".ProofSpec.leafSpec: object expected");
            message.leafSpec = $root.LeafOp.fromObject(object.leafSpec);
        }
        if (object.innerSpec != null) {
            if (typeof object.innerSpec !== "object")
                throw TypeError(".ProofSpec.innerSpec: object expected");
            message.innerSpec = $root.InnerSpec.fromObject(object.innerSpec);
        }
        if (object.maxDepth != null)
            message.maxDepth = object.maxDepth | 0;
        if (object.minDepth != null)
            message.minDepth = object.minDepth | 0;
        return message;
    };

    /**
     * Creates a plain object from a ProofSpec message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ProofSpec
     * @static
     * @param {ProofSpec} message ProofSpec
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ProofSpec.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.leafSpec = null;
            object.innerSpec = null;
            object.maxDepth = 0;
            object.minDepth = 0;
        }
        if (message.leafSpec != null && message.hasOwnProperty("leafSpec"))
            object.leafSpec = $root.LeafOp.toObject(message.leafSpec, options);
        if (message.innerSpec != null && message.hasOwnProperty("innerSpec"))
            object.innerSpec = $root.InnerSpec.toObject(message.innerSpec, options);
        if (message.maxDepth != null && message.hasOwnProperty("maxDepth"))
            object.maxDepth = message.maxDepth;
        if (message.minDepth != null && message.hasOwnProperty("minDepth"))
            object.minDepth = message.minDepth;
        return object;
    };

    /**
     * Converts this ProofSpec to JSON.
     * @function toJSON
     * @memberof ProofSpec
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ProofSpec.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ProofSpec;
})();

$root.InnerSpec = (function() {

    /**
     * Properties of an InnerSpec.
     * @exports IInnerSpec
     * @interface IInnerSpec
     * @property {Array.<number>|null} [childOrder] InnerSpec childOrder
     * @property {number|null} [childSize] InnerSpec childSize
     * @property {number|null} [minPrefixLength] InnerSpec minPrefixLength
     * @property {number|null} [maxPrefixLength] InnerSpec maxPrefixLength
     * @property {Uint8Array|null} [emptyChild] InnerSpec emptyChild
     * @property {HashOp|null} [hash] InnerSpec hash
     */

    /**
     * Constructs a new InnerSpec.
     * @exports InnerSpec
     * @classdesc Represents an InnerSpec.
     * @implements IInnerSpec
     * @constructor
     * @param {IInnerSpec=} [properties] Properties to set
     */
    function InnerSpec(properties) {
        this.childOrder = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InnerSpec childOrder.
     * @member {Array.<number>} childOrder
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.childOrder = $util.emptyArray;

    /**
     * InnerSpec childSize.
     * @member {number} childSize
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.childSize = 0;

    /**
     * InnerSpec minPrefixLength.
     * @member {number} minPrefixLength
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.minPrefixLength = 0;

    /**
     * InnerSpec maxPrefixLength.
     * @member {number} maxPrefixLength
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.maxPrefixLength = 0;

    /**
     * InnerSpec emptyChild.
     * @member {Uint8Array} emptyChild
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.emptyChild = $util.newBuffer([]);

    /**
     * InnerSpec hash.
     * @member {HashOp} hash
     * @memberof InnerSpec
     * @instance
     */
    InnerSpec.prototype.hash = 0;

    /**
     * Creates a new InnerSpec instance using the specified properties.
     * @function create
     * @memberof InnerSpec
     * @static
     * @param {IInnerSpec=} [properties] Properties to set
     * @returns {InnerSpec} InnerSpec instance
     */
    InnerSpec.create = function create(properties) {
        return new InnerSpec(properties);
    };

    /**
     * Encodes the specified InnerSpec message. Does not implicitly {@link InnerSpec.verify|verify} messages.
     * @function encode
     * @memberof InnerSpec
     * @static
     * @param {IInnerSpec} message InnerSpec message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerSpec.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.childOrder != null && message.childOrder.length) {
            writer.uint32(/* id 1, wireType 2 =*/10).fork();
            for (var i = 0; i < message.childOrder.length; ++i)
                writer.int32(message.childOrder[i]);
            writer.ldelim();
        }
        if (message.childSize != null && message.hasOwnProperty("childSize"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.childSize);
        if (message.minPrefixLength != null && message.hasOwnProperty("minPrefixLength"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.minPrefixLength);
        if (message.maxPrefixLength != null && message.hasOwnProperty("maxPrefixLength"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.maxPrefixLength);
        if (message.emptyChild != null && message.hasOwnProperty("emptyChild"))
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.emptyChild);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.hash);
        return writer;
    };

    /**
     * Encodes the specified InnerSpec message, length delimited. Does not implicitly {@link InnerSpec.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InnerSpec
     * @static
     * @param {IInnerSpec} message InnerSpec message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerSpec.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InnerSpec message from the specified reader or buffer.
     * @function decode
     * @memberof InnerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InnerSpec} InnerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerSpec.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InnerSpec();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.childOrder && message.childOrder.length))
                    message.childOrder = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.childOrder.push(reader.int32());
                } else
                    message.childOrder.push(reader.int32());
                break;
            case 2:
                message.childSize = reader.int32();
                break;
            case 3:
                message.minPrefixLength = reader.int32();
                break;
            case 4:
                message.maxPrefixLength = reader.int32();
                break;
            case 5:
                message.emptyChild = reader.bytes();
                break;
            case 6:
                message.hash = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InnerSpec message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InnerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InnerSpec} InnerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerSpec.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InnerSpec message.
     * @function verify
     * @memberof InnerSpec
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InnerSpec.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.childOrder != null && message.hasOwnProperty("childOrder")) {
            if (!Array.isArray(message.childOrder))
                return "childOrder: array expected";
            for (var i = 0; i < message.childOrder.length; ++i)
                if (!$util.isInteger(message.childOrder[i]))
                    return "childOrder: integer[] expected";
        }
        if (message.childSize != null && message.hasOwnProperty("childSize"))
            if (!$util.isInteger(message.childSize))
                return "childSize: integer expected";
        if (message.minPrefixLength != null && message.hasOwnProperty("minPrefixLength"))
            if (!$util.isInteger(message.minPrefixLength))
                return "minPrefixLength: integer expected";
        if (message.maxPrefixLength != null && message.hasOwnProperty("maxPrefixLength"))
            if (!$util.isInteger(message.maxPrefixLength))
                return "maxPrefixLength: integer expected";
        if (message.emptyChild != null && message.hasOwnProperty("emptyChild"))
            if (!(message.emptyChild && typeof message.emptyChild.length === "number" || $util.isString(message.emptyChild)))
                return "emptyChild: buffer expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            switch (message.hash) {
            default:
                return "hash: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        return null;
    };

    /**
     * Creates an InnerSpec message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InnerSpec
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InnerSpec} InnerSpec
     */
    InnerSpec.fromObject = function fromObject(object) {
        if (object instanceof $root.InnerSpec)
            return object;
        var message = new $root.InnerSpec();
        if (object.childOrder) {
            if (!Array.isArray(object.childOrder))
                throw TypeError(".InnerSpec.childOrder: array expected");
            message.childOrder = [];
            for (var i = 0; i < object.childOrder.length; ++i)
                message.childOrder[i] = object.childOrder[i] | 0;
        }
        if (object.childSize != null)
            message.childSize = object.childSize | 0;
        if (object.minPrefixLength != null)
            message.minPrefixLength = object.minPrefixLength | 0;
        if (object.maxPrefixLength != null)
            message.maxPrefixLength = object.maxPrefixLength | 0;
        if (object.emptyChild != null)
            if (typeof object.emptyChild === "string")
                $util.base64.decode(object.emptyChild, message.emptyChild = $util.newBuffer($util.base64.length(object.emptyChild)), 0);
            else if (object.emptyChild.length)
                message.emptyChild = object.emptyChild;
        switch (object.hash) {
        case "NO_HASH":
        case 0:
            message.hash = 0;
            break;
        case "SHA256":
        case 1:
            message.hash = 1;
            break;
        case "SHA512":
        case 2:
            message.hash = 2;
            break;
        case "KECCAK":
        case 3:
            message.hash = 3;
            break;
        case "RIPEMD160":
        case 4:
            message.hash = 4;
            break;
        case "BITCOIN":
        case 5:
            message.hash = 5;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from an InnerSpec message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InnerSpec
     * @static
     * @param {InnerSpec} message InnerSpec
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InnerSpec.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.childOrder = [];
        if (options.defaults) {
            object.childSize = 0;
            object.minPrefixLength = 0;
            object.maxPrefixLength = 0;
            if (options.bytes === String)
                object.emptyChild = "";
            else {
                object.emptyChild = [];
                if (options.bytes !== Array)
                    object.emptyChild = $util.newBuffer(object.emptyChild);
            }
            object.hash = options.enums === String ? "NO_HASH" : 0;
        }
        if (message.childOrder && message.childOrder.length) {
            object.childOrder = [];
            for (var j = 0; j < message.childOrder.length; ++j)
                object.childOrder[j] = message.childOrder[j];
        }
        if (message.childSize != null && message.hasOwnProperty("childSize"))
            object.childSize = message.childSize;
        if (message.minPrefixLength != null && message.hasOwnProperty("minPrefixLength"))
            object.minPrefixLength = message.minPrefixLength;
        if (message.maxPrefixLength != null && message.hasOwnProperty("maxPrefixLength"))
            object.maxPrefixLength = message.maxPrefixLength;
        if (message.emptyChild != null && message.hasOwnProperty("emptyChild"))
            object.emptyChild = options.bytes === String ? $util.base64.encode(message.emptyChild, 0, message.emptyChild.length) : options.bytes === Array ? Array.prototype.slice.call(message.emptyChild) : message.emptyChild;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.enums === String ? $root.HashOp[message.hash] : message.hash;
        return object;
    };

    /**
     * Converts this InnerSpec to JSON.
     * @function toJSON
     * @memberof InnerSpec
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InnerSpec.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return InnerSpec;
})();

$root.BatchProof = (function() {

    /**
     * Properties of a BatchProof.
     * @exports IBatchProof
     * @interface IBatchProof
     * @property {Array.<IBatchEntry>|null} [entries] BatchProof entries
     */

    /**
     * Constructs a new BatchProof.
     * @exports BatchProof
     * @classdesc Represents a BatchProof.
     * @implements IBatchProof
     * @constructor
     * @param {IBatchProof=} [properties] Properties to set
     */
    function BatchProof(properties) {
        this.entries = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BatchProof entries.
     * @member {Array.<IBatchEntry>} entries
     * @memberof BatchProof
     * @instance
     */
    BatchProof.prototype.entries = $util.emptyArray;

    /**
     * Creates a new BatchProof instance using the specified properties.
     * @function create
     * @memberof BatchProof
     * @static
     * @param {IBatchProof=} [properties] Properties to set
     * @returns {BatchProof} BatchProof instance
     */
    BatchProof.create = function create(properties) {
        return new BatchProof(properties);
    };

    /**
     * Encodes the specified BatchProof message. Does not implicitly {@link BatchProof.verify|verify} messages.
     * @function encode
     * @memberof BatchProof
     * @static
     * @param {IBatchProof} message BatchProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BatchProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entries != null && message.entries.length)
            for (var i = 0; i < message.entries.length; ++i)
                $root.BatchEntry.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BatchProof message, length delimited. Does not implicitly {@link BatchProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BatchProof
     * @static
     * @param {IBatchProof} message BatchProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BatchProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BatchProof message from the specified reader or buffer.
     * @function decode
     * @memberof BatchProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BatchProof} BatchProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BatchProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BatchProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.entries && message.entries.length))
                    message.entries = [];
                message.entries.push($root.BatchEntry.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BatchProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BatchProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BatchProof} BatchProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BatchProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BatchProof message.
     * @function verify
     * @memberof BatchProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BatchProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entries != null && message.hasOwnProperty("entries")) {
            if (!Array.isArray(message.entries))
                return "entries: array expected";
            for (var i = 0; i < message.entries.length; ++i) {
                var error = $root.BatchEntry.verify(message.entries[i]);
                if (error)
                    return "entries." + error;
            }
        }
        return null;
    };

    /**
     * Creates a BatchProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BatchProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BatchProof} BatchProof
     */
    BatchProof.fromObject = function fromObject(object) {
        if (object instanceof $root.BatchProof)
            return object;
        var message = new $root.BatchProof();
        if (object.entries) {
            if (!Array.isArray(object.entries))
                throw TypeError(".BatchProof.entries: array expected");
            message.entries = [];
            for (var i = 0; i < object.entries.length; ++i) {
                if (typeof object.entries[i] !== "object")
                    throw TypeError(".BatchProof.entries: object expected");
                message.entries[i] = $root.BatchEntry.fromObject(object.entries[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a BatchProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BatchProof
     * @static
     * @param {BatchProof} message BatchProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BatchProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.entries = [];
        if (message.entries && message.entries.length) {
            object.entries = [];
            for (var j = 0; j < message.entries.length; ++j)
                object.entries[j] = $root.BatchEntry.toObject(message.entries[j], options);
        }
        return object;
    };

    /**
     * Converts this BatchProof to JSON.
     * @function toJSON
     * @memberof BatchProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BatchProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BatchProof;
})();

$root.BatchEntry = (function() {

    /**
     * Properties of a BatchEntry.
     * @exports IBatchEntry
     * @interface IBatchEntry
     * @property {IExistenceProof|null} [exist] BatchEntry exist
     * @property {INonExistenceProof|null} [nonexist] BatchEntry nonexist
     */

    /**
     * Constructs a new BatchEntry.
     * @exports BatchEntry
     * @classdesc Represents a BatchEntry.
     * @implements IBatchEntry
     * @constructor
     * @param {IBatchEntry=} [properties] Properties to set
     */
    function BatchEntry(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BatchEntry exist.
     * @member {IExistenceProof|null|undefined} exist
     * @memberof BatchEntry
     * @instance
     */
    BatchEntry.prototype.exist = null;

    /**
     * BatchEntry nonexist.
     * @member {INonExistenceProof|null|undefined} nonexist
     * @memberof BatchEntry
     * @instance
     */
    BatchEntry.prototype.nonexist = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * BatchEntry proof.
     * @member {"exist"|"nonexist"|undefined} proof
     * @memberof BatchEntry
     * @instance
     */
    Object.defineProperty(BatchEntry.prototype, "proof", {
        get: $util.oneOfGetter($oneOfFields = ["exist", "nonexist"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new BatchEntry instance using the specified properties.
     * @function create
     * @memberof BatchEntry
     * @static
     * @param {IBatchEntry=} [properties] Properties to set
     * @returns {BatchEntry} BatchEntry instance
     */
    BatchEntry.create = function create(properties) {
        return new BatchEntry(properties);
    };

    /**
     * Encodes the specified BatchEntry message. Does not implicitly {@link BatchEntry.verify|verify} messages.
     * @function encode
     * @memberof BatchEntry
     * @static
     * @param {IBatchEntry} message BatchEntry message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BatchEntry.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.exist != null && message.hasOwnProperty("exist"))
            $root.ExistenceProof.encode(message.exist, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.nonexist != null && message.hasOwnProperty("nonexist"))
            $root.NonExistenceProof.encode(message.nonexist, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BatchEntry message, length delimited. Does not implicitly {@link BatchEntry.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BatchEntry
     * @static
     * @param {IBatchEntry} message BatchEntry message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BatchEntry.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BatchEntry message from the specified reader or buffer.
     * @function decode
     * @memberof BatchEntry
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BatchEntry} BatchEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BatchEntry.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BatchEntry();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.exist = $root.ExistenceProof.decode(reader, reader.uint32());
                break;
            case 2:
                message.nonexist = $root.NonExistenceProof.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BatchEntry message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BatchEntry
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BatchEntry} BatchEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BatchEntry.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BatchEntry message.
     * @function verify
     * @memberof BatchEntry
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BatchEntry.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            properties.proof = 1;
            {
                var error = $root.ExistenceProof.verify(message.exist);
                if (error)
                    return "exist." + error;
            }
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            if (properties.proof === 1)
                return "proof: multiple values";
            properties.proof = 1;
            {
                var error = $root.NonExistenceProof.verify(message.nonexist);
                if (error)
                    return "nonexist." + error;
            }
        }
        return null;
    };

    /**
     * Creates a BatchEntry message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BatchEntry
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BatchEntry} BatchEntry
     */
    BatchEntry.fromObject = function fromObject(object) {
        if (object instanceof $root.BatchEntry)
            return object;
        var message = new $root.BatchEntry();
        if (object.exist != null) {
            if (typeof object.exist !== "object")
                throw TypeError(".BatchEntry.exist: object expected");
            message.exist = $root.ExistenceProof.fromObject(object.exist);
        }
        if (object.nonexist != null) {
            if (typeof object.nonexist !== "object")
                throw TypeError(".BatchEntry.nonexist: object expected");
            message.nonexist = $root.NonExistenceProof.fromObject(object.nonexist);
        }
        return message;
    };

    /**
     * Creates a plain object from a BatchEntry message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BatchEntry
     * @static
     * @param {BatchEntry} message BatchEntry
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BatchEntry.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            object.exist = $root.ExistenceProof.toObject(message.exist, options);
            if (options.oneofs)
                object.proof = "exist";
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            object.nonexist = $root.NonExistenceProof.toObject(message.nonexist, options);
            if (options.oneofs)
                object.proof = "nonexist";
        }
        return object;
    };

    /**
     * Converts this BatchEntry to JSON.
     * @function toJSON
     * @memberof BatchEntry
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BatchEntry.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BatchEntry;
})();

$root.CompressedBatchProof = (function() {

    /**
     * Properties of a CompressedBatchProof.
     * @exports ICompressedBatchProof
     * @interface ICompressedBatchProof
     * @property {Array.<ICompressedBatchEntry>|null} [entries] CompressedBatchProof entries
     * @property {Array.<IInnerOp>|null} [lookupInners] CompressedBatchProof lookupInners
     */

    /**
     * Constructs a new CompressedBatchProof.
     * @exports CompressedBatchProof
     * @classdesc Represents a CompressedBatchProof.
     * @implements ICompressedBatchProof
     * @constructor
     * @param {ICompressedBatchProof=} [properties] Properties to set
     */
    function CompressedBatchProof(properties) {
        this.entries = [];
        this.lookupInners = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CompressedBatchProof entries.
     * @member {Array.<ICompressedBatchEntry>} entries
     * @memberof CompressedBatchProof
     * @instance
     */
    CompressedBatchProof.prototype.entries = $util.emptyArray;

    /**
     * CompressedBatchProof lookupInners.
     * @member {Array.<IInnerOp>} lookupInners
     * @memberof CompressedBatchProof
     * @instance
     */
    CompressedBatchProof.prototype.lookupInners = $util.emptyArray;

    /**
     * Creates a new CompressedBatchProof instance using the specified properties.
     * @function create
     * @memberof CompressedBatchProof
     * @static
     * @param {ICompressedBatchProof=} [properties] Properties to set
     * @returns {CompressedBatchProof} CompressedBatchProof instance
     */
    CompressedBatchProof.create = function create(properties) {
        return new CompressedBatchProof(properties);
    };

    /**
     * Encodes the specified CompressedBatchProof message. Does not implicitly {@link CompressedBatchProof.verify|verify} messages.
     * @function encode
     * @memberof CompressedBatchProof
     * @static
     * @param {ICompressedBatchProof} message CompressedBatchProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedBatchProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entries != null && message.entries.length)
            for (var i = 0; i < message.entries.length; ++i)
                $root.CompressedBatchEntry.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.lookupInners != null && message.lookupInners.length)
            for (var i = 0; i < message.lookupInners.length; ++i)
                $root.InnerOp.encode(message.lookupInners[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CompressedBatchProof message, length delimited. Does not implicitly {@link CompressedBatchProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CompressedBatchProof
     * @static
     * @param {ICompressedBatchProof} message CompressedBatchProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedBatchProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CompressedBatchProof message from the specified reader or buffer.
     * @function decode
     * @memberof CompressedBatchProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CompressedBatchProof} CompressedBatchProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedBatchProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CompressedBatchProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.entries && message.entries.length))
                    message.entries = [];
                message.entries.push($root.CompressedBatchEntry.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.lookupInners && message.lookupInners.length))
                    message.lookupInners = [];
                message.lookupInners.push($root.InnerOp.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CompressedBatchProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CompressedBatchProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CompressedBatchProof} CompressedBatchProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedBatchProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CompressedBatchProof message.
     * @function verify
     * @memberof CompressedBatchProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CompressedBatchProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entries != null && message.hasOwnProperty("entries")) {
            if (!Array.isArray(message.entries))
                return "entries: array expected";
            for (var i = 0; i < message.entries.length; ++i) {
                var error = $root.CompressedBatchEntry.verify(message.entries[i]);
                if (error)
                    return "entries." + error;
            }
        }
        if (message.lookupInners != null && message.hasOwnProperty("lookupInners")) {
            if (!Array.isArray(message.lookupInners))
                return "lookupInners: array expected";
            for (var i = 0; i < message.lookupInners.length; ++i) {
                var error = $root.InnerOp.verify(message.lookupInners[i]);
                if (error)
                    return "lookupInners." + error;
            }
        }
        return null;
    };

    /**
     * Creates a CompressedBatchProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CompressedBatchProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CompressedBatchProof} CompressedBatchProof
     */
    CompressedBatchProof.fromObject = function fromObject(object) {
        if (object instanceof $root.CompressedBatchProof)
            return object;
        var message = new $root.CompressedBatchProof();
        if (object.entries) {
            if (!Array.isArray(object.entries))
                throw TypeError(".CompressedBatchProof.entries: array expected");
            message.entries = [];
            for (var i = 0; i < object.entries.length; ++i) {
                if (typeof object.entries[i] !== "object")
                    throw TypeError(".CompressedBatchProof.entries: object expected");
                message.entries[i] = $root.CompressedBatchEntry.fromObject(object.entries[i]);
            }
        }
        if (object.lookupInners) {
            if (!Array.isArray(object.lookupInners))
                throw TypeError(".CompressedBatchProof.lookupInners: array expected");
            message.lookupInners = [];
            for (var i = 0; i < object.lookupInners.length; ++i) {
                if (typeof object.lookupInners[i] !== "object")
                    throw TypeError(".CompressedBatchProof.lookupInners: object expected");
                message.lookupInners[i] = $root.InnerOp.fromObject(object.lookupInners[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a CompressedBatchProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CompressedBatchProof
     * @static
     * @param {CompressedBatchProof} message CompressedBatchProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CompressedBatchProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.entries = [];
            object.lookupInners = [];
        }
        if (message.entries && message.entries.length) {
            object.entries = [];
            for (var j = 0; j < message.entries.length; ++j)
                object.entries[j] = $root.CompressedBatchEntry.toObject(message.entries[j], options);
        }
        if (message.lookupInners && message.lookupInners.length) {
            object.lookupInners = [];
            for (var j = 0; j < message.lookupInners.length; ++j)
                object.lookupInners[j] = $root.InnerOp.toObject(message.lookupInners[j], options);
        }
        return object;
    };

    /**
     * Converts this CompressedBatchProof to JSON.
     * @function toJSON
     * @memberof CompressedBatchProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CompressedBatchProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CompressedBatchProof;
})();

$root.CompressedBatchEntry = (function() {

    /**
     * Properties of a CompressedBatchEntry.
     * @exports ICompressedBatchEntry
     * @interface ICompressedBatchEntry
     * @property {ICompressedExistenceProof|null} [exist] CompressedBatchEntry exist
     * @property {ICompressedNonExistenceProof|null} [nonexist] CompressedBatchEntry nonexist
     */

    /**
     * Constructs a new CompressedBatchEntry.
     * @exports CompressedBatchEntry
     * @classdesc Represents a CompressedBatchEntry.
     * @implements ICompressedBatchEntry
     * @constructor
     * @param {ICompressedBatchEntry=} [properties] Properties to set
     */
    function CompressedBatchEntry(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CompressedBatchEntry exist.
     * @member {ICompressedExistenceProof|null|undefined} exist
     * @memberof CompressedBatchEntry
     * @instance
     */
    CompressedBatchEntry.prototype.exist = null;

    /**
     * CompressedBatchEntry nonexist.
     * @member {ICompressedNonExistenceProof|null|undefined} nonexist
     * @memberof CompressedBatchEntry
     * @instance
     */
    CompressedBatchEntry.prototype.nonexist = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * CompressedBatchEntry proof.
     * @member {"exist"|"nonexist"|undefined} proof
     * @memberof CompressedBatchEntry
     * @instance
     */
    Object.defineProperty(CompressedBatchEntry.prototype, "proof", {
        get: $util.oneOfGetter($oneOfFields = ["exist", "nonexist"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new CompressedBatchEntry instance using the specified properties.
     * @function create
     * @memberof CompressedBatchEntry
     * @static
     * @param {ICompressedBatchEntry=} [properties] Properties to set
     * @returns {CompressedBatchEntry} CompressedBatchEntry instance
     */
    CompressedBatchEntry.create = function create(properties) {
        return new CompressedBatchEntry(properties);
    };

    /**
     * Encodes the specified CompressedBatchEntry message. Does not implicitly {@link CompressedBatchEntry.verify|verify} messages.
     * @function encode
     * @memberof CompressedBatchEntry
     * @static
     * @param {ICompressedBatchEntry} message CompressedBatchEntry message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedBatchEntry.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.exist != null && message.hasOwnProperty("exist"))
            $root.CompressedExistenceProof.encode(message.exist, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.nonexist != null && message.hasOwnProperty("nonexist"))
            $root.CompressedNonExistenceProof.encode(message.nonexist, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CompressedBatchEntry message, length delimited. Does not implicitly {@link CompressedBatchEntry.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CompressedBatchEntry
     * @static
     * @param {ICompressedBatchEntry} message CompressedBatchEntry message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedBatchEntry.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CompressedBatchEntry message from the specified reader or buffer.
     * @function decode
     * @memberof CompressedBatchEntry
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CompressedBatchEntry} CompressedBatchEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedBatchEntry.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CompressedBatchEntry();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.exist = $root.CompressedExistenceProof.decode(reader, reader.uint32());
                break;
            case 2:
                message.nonexist = $root.CompressedNonExistenceProof.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CompressedBatchEntry message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CompressedBatchEntry
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CompressedBatchEntry} CompressedBatchEntry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedBatchEntry.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CompressedBatchEntry message.
     * @function verify
     * @memberof CompressedBatchEntry
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CompressedBatchEntry.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            properties.proof = 1;
            {
                var error = $root.CompressedExistenceProof.verify(message.exist);
                if (error)
                    return "exist." + error;
            }
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            if (properties.proof === 1)
                return "proof: multiple values";
            properties.proof = 1;
            {
                var error = $root.CompressedNonExistenceProof.verify(message.nonexist);
                if (error)
                    return "nonexist." + error;
            }
        }
        return null;
    };

    /**
     * Creates a CompressedBatchEntry message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CompressedBatchEntry
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CompressedBatchEntry} CompressedBatchEntry
     */
    CompressedBatchEntry.fromObject = function fromObject(object) {
        if (object instanceof $root.CompressedBatchEntry)
            return object;
        var message = new $root.CompressedBatchEntry();
        if (object.exist != null) {
            if (typeof object.exist !== "object")
                throw TypeError(".CompressedBatchEntry.exist: object expected");
            message.exist = $root.CompressedExistenceProof.fromObject(object.exist);
        }
        if (object.nonexist != null) {
            if (typeof object.nonexist !== "object")
                throw TypeError(".CompressedBatchEntry.nonexist: object expected");
            message.nonexist = $root.CompressedNonExistenceProof.fromObject(object.nonexist);
        }
        return message;
    };

    /**
     * Creates a plain object from a CompressedBatchEntry message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CompressedBatchEntry
     * @static
     * @param {CompressedBatchEntry} message CompressedBatchEntry
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CompressedBatchEntry.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.exist != null && message.hasOwnProperty("exist")) {
            object.exist = $root.CompressedExistenceProof.toObject(message.exist, options);
            if (options.oneofs)
                object.proof = "exist";
        }
        if (message.nonexist != null && message.hasOwnProperty("nonexist")) {
            object.nonexist = $root.CompressedNonExistenceProof.toObject(message.nonexist, options);
            if (options.oneofs)
                object.proof = "nonexist";
        }
        return object;
    };

    /**
     * Converts this CompressedBatchEntry to JSON.
     * @function toJSON
     * @memberof CompressedBatchEntry
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CompressedBatchEntry.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CompressedBatchEntry;
})();

$root.CompressedExistenceProof = (function() {

    /**
     * Properties of a CompressedExistenceProof.
     * @exports ICompressedExistenceProof
     * @interface ICompressedExistenceProof
     * @property {Uint8Array|null} [key] CompressedExistenceProof key
     * @property {Uint8Array|null} [value] CompressedExistenceProof value
     * @property {ILeafOp|null} [leaf] CompressedExistenceProof leaf
     * @property {Array.<number>|null} [path] CompressedExistenceProof path
     */

    /**
     * Constructs a new CompressedExistenceProof.
     * @exports CompressedExistenceProof
     * @classdesc Represents a CompressedExistenceProof.
     * @implements ICompressedExistenceProof
     * @constructor
     * @param {ICompressedExistenceProof=} [properties] Properties to set
     */
    function CompressedExistenceProof(properties) {
        this.path = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CompressedExistenceProof key.
     * @member {Uint8Array} key
     * @memberof CompressedExistenceProof
     * @instance
     */
    CompressedExistenceProof.prototype.key = $util.newBuffer([]);

    /**
     * CompressedExistenceProof value.
     * @member {Uint8Array} value
     * @memberof CompressedExistenceProof
     * @instance
     */
    CompressedExistenceProof.prototype.value = $util.newBuffer([]);

    /**
     * CompressedExistenceProof leaf.
     * @member {ILeafOp|null|undefined} leaf
     * @memberof CompressedExistenceProof
     * @instance
     */
    CompressedExistenceProof.prototype.leaf = null;

    /**
     * CompressedExistenceProof path.
     * @member {Array.<number>} path
     * @memberof CompressedExistenceProof
     * @instance
     */
    CompressedExistenceProof.prototype.path = $util.emptyArray;

    /**
     * Creates a new CompressedExistenceProof instance using the specified properties.
     * @function create
     * @memberof CompressedExistenceProof
     * @static
     * @param {ICompressedExistenceProof=} [properties] Properties to set
     * @returns {CompressedExistenceProof} CompressedExistenceProof instance
     */
    CompressedExistenceProof.create = function create(properties) {
        return new CompressedExistenceProof(properties);
    };

    /**
     * Encodes the specified CompressedExistenceProof message. Does not implicitly {@link CompressedExistenceProof.verify|verify} messages.
     * @function encode
     * @memberof CompressedExistenceProof
     * @static
     * @param {ICompressedExistenceProof} message CompressedExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedExistenceProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
        if (message.leaf != null && message.hasOwnProperty("leaf"))
            $root.LeafOp.encode(message.leaf, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.path != null && message.path.length) {
            writer.uint32(/* id 4, wireType 2 =*/34).fork();
            for (var i = 0; i < message.path.length; ++i)
                writer.int32(message.path[i]);
            writer.ldelim();
        }
        return writer;
    };

    /**
     * Encodes the specified CompressedExistenceProof message, length delimited. Does not implicitly {@link CompressedExistenceProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CompressedExistenceProof
     * @static
     * @param {ICompressedExistenceProof} message CompressedExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedExistenceProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CompressedExistenceProof message from the specified reader or buffer.
     * @function decode
     * @memberof CompressedExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CompressedExistenceProof} CompressedExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedExistenceProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CompressedExistenceProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.bytes();
                break;
            case 2:
                message.value = reader.bytes();
                break;
            case 3:
                message.leaf = $root.LeafOp.decode(reader, reader.uint32());
                break;
            case 4:
                if (!(message.path && message.path.length))
                    message.path = [];
                if ((tag & 7) === 2) {
                    var end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.path.push(reader.int32());
                } else
                    message.path.push(reader.int32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CompressedExistenceProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CompressedExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CompressedExistenceProof} CompressedExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedExistenceProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CompressedExistenceProof message.
     * @function verify
     * @memberof CompressedExistenceProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CompressedExistenceProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                return "key: buffer expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                return "value: buffer expected";
        if (message.leaf != null && message.hasOwnProperty("leaf")) {
            var error = $root.LeafOp.verify(message.leaf);
            if (error)
                return "leaf." + error;
        }
        if (message.path != null && message.hasOwnProperty("path")) {
            if (!Array.isArray(message.path))
                return "path: array expected";
            for (var i = 0; i < message.path.length; ++i)
                if (!$util.isInteger(message.path[i]))
                    return "path: integer[] expected";
        }
        return null;
    };

    /**
     * Creates a CompressedExistenceProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CompressedExistenceProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CompressedExistenceProof} CompressedExistenceProof
     */
    CompressedExistenceProof.fromObject = function fromObject(object) {
        if (object instanceof $root.CompressedExistenceProof)
            return object;
        var message = new $root.CompressedExistenceProof();
        if (object.key != null)
            if (typeof object.key === "string")
                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
            else if (object.key.length)
                message.key = object.key;
        if (object.value != null)
            if (typeof object.value === "string")
                $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
            else if (object.value.length)
                message.value = object.value;
        if (object.leaf != null) {
            if (typeof object.leaf !== "object")
                throw TypeError(".CompressedExistenceProof.leaf: object expected");
            message.leaf = $root.LeafOp.fromObject(object.leaf);
        }
        if (object.path) {
            if (!Array.isArray(object.path))
                throw TypeError(".CompressedExistenceProof.path: array expected");
            message.path = [];
            for (var i = 0; i < object.path.length; ++i)
                message.path[i] = object.path[i] | 0;
        }
        return message;
    };

    /**
     * Creates a plain object from a CompressedExistenceProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CompressedExistenceProof
     * @static
     * @param {CompressedExistenceProof} message CompressedExistenceProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CompressedExistenceProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.path = [];
        if (options.defaults) {
            if (options.bytes === String)
                object.key = "";
            else {
                object.key = [];
                if (options.bytes !== Array)
                    object.key = $util.newBuffer(object.key);
            }
            if (options.bytes === String)
                object.value = "";
            else {
                object.value = [];
                if (options.bytes !== Array)
                    object.value = $util.newBuffer(object.value);
            }
            object.leaf = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
        if (message.leaf != null && message.hasOwnProperty("leaf"))
            object.leaf = $root.LeafOp.toObject(message.leaf, options);
        if (message.path && message.path.length) {
            object.path = [];
            for (var j = 0; j < message.path.length; ++j)
                object.path[j] = message.path[j];
        }
        return object;
    };

    /**
     * Converts this CompressedExistenceProof to JSON.
     * @function toJSON
     * @memberof CompressedExistenceProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CompressedExistenceProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CompressedExistenceProof;
})();

$root.CompressedNonExistenceProof = (function() {

    /**
     * Properties of a CompressedNonExistenceProof.
     * @exports ICompressedNonExistenceProof
     * @interface ICompressedNonExistenceProof
     * @property {Uint8Array|null} [key] CompressedNonExistenceProof key
     * @property {ICompressedExistenceProof|null} [left] CompressedNonExistenceProof left
     * @property {ICompressedExistenceProof|null} [right] CompressedNonExistenceProof right
     */

    /**
     * Constructs a new CompressedNonExistenceProof.
     * @exports CompressedNonExistenceProof
     * @classdesc Represents a CompressedNonExistenceProof.
     * @implements ICompressedNonExistenceProof
     * @constructor
     * @param {ICompressedNonExistenceProof=} [properties] Properties to set
     */
    function CompressedNonExistenceProof(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CompressedNonExistenceProof key.
     * @member {Uint8Array} key
     * @memberof CompressedNonExistenceProof
     * @instance
     */
    CompressedNonExistenceProof.prototype.key = $util.newBuffer([]);

    /**
     * CompressedNonExistenceProof left.
     * @member {ICompressedExistenceProof|null|undefined} left
     * @memberof CompressedNonExistenceProof
     * @instance
     */
    CompressedNonExistenceProof.prototype.left = null;

    /**
     * CompressedNonExistenceProof right.
     * @member {ICompressedExistenceProof|null|undefined} right
     * @memberof CompressedNonExistenceProof
     * @instance
     */
    CompressedNonExistenceProof.prototype.right = null;

    /**
     * Creates a new CompressedNonExistenceProof instance using the specified properties.
     * @function create
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {ICompressedNonExistenceProof=} [properties] Properties to set
     * @returns {CompressedNonExistenceProof} CompressedNonExistenceProof instance
     */
    CompressedNonExistenceProof.create = function create(properties) {
        return new CompressedNonExistenceProof(properties);
    };

    /**
     * Encodes the specified CompressedNonExistenceProof message. Does not implicitly {@link CompressedNonExistenceProof.verify|verify} messages.
     * @function encode
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {ICompressedNonExistenceProof} message CompressedNonExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedNonExistenceProof.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
        if (message.left != null && message.hasOwnProperty("left"))
            $root.CompressedExistenceProof.encode(message.left, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.right != null && message.hasOwnProperty("right"))
            $root.CompressedExistenceProof.encode(message.right, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CompressedNonExistenceProof message, length delimited. Does not implicitly {@link CompressedNonExistenceProof.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {ICompressedNonExistenceProof} message CompressedNonExistenceProof message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CompressedNonExistenceProof.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CompressedNonExistenceProof message from the specified reader or buffer.
     * @function decode
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CompressedNonExistenceProof} CompressedNonExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedNonExistenceProof.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CompressedNonExistenceProof();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.bytes();
                break;
            case 2:
                message.left = $root.CompressedExistenceProof.decode(reader, reader.uint32());
                break;
            case 3:
                message.right = $root.CompressedExistenceProof.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CompressedNonExistenceProof message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CompressedNonExistenceProof} CompressedNonExistenceProof
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CompressedNonExistenceProof.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CompressedNonExistenceProof message.
     * @function verify
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CompressedNonExistenceProof.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                return "key: buffer expected";
        if (message.left != null && message.hasOwnProperty("left")) {
            var error = $root.CompressedExistenceProof.verify(message.left);
            if (error)
                return "left." + error;
        }
        if (message.right != null && message.hasOwnProperty("right")) {
            var error = $root.CompressedExistenceProof.verify(message.right);
            if (error)
                return "right." + error;
        }
        return null;
    };

    /**
     * Creates a CompressedNonExistenceProof message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CompressedNonExistenceProof} CompressedNonExistenceProof
     */
    CompressedNonExistenceProof.fromObject = function fromObject(object) {
        if (object instanceof $root.CompressedNonExistenceProof)
            return object;
        var message = new $root.CompressedNonExistenceProof();
        if (object.key != null)
            if (typeof object.key === "string")
                $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
            else if (object.key.length)
                message.key = object.key;
        if (object.left != null) {
            if (typeof object.left !== "object")
                throw TypeError(".CompressedNonExistenceProof.left: object expected");
            message.left = $root.CompressedExistenceProof.fromObject(object.left);
        }
        if (object.right != null) {
            if (typeof object.right !== "object")
                throw TypeError(".CompressedNonExistenceProof.right: object expected");
            message.right = $root.CompressedExistenceProof.fromObject(object.right);
        }
        return message;
    };

    /**
     * Creates a plain object from a CompressedNonExistenceProof message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CompressedNonExistenceProof
     * @static
     * @param {CompressedNonExistenceProof} message CompressedNonExistenceProof
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CompressedNonExistenceProof.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.key = "";
            else {
                object.key = [];
                if (options.bytes !== Array)
                    object.key = $util.newBuffer(object.key);
            }
            object.left = null;
            object.right = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
        if (message.left != null && message.hasOwnProperty("left"))
            object.left = $root.CompressedExistenceProof.toObject(message.left, options);
        if (message.right != null && message.hasOwnProperty("right"))
            object.right = $root.CompressedExistenceProof.toObject(message.right, options);
        return object;
    };

    /**
     * Converts this CompressedNonExistenceProof to JSON.
     * @function toJSON
     * @memberof CompressedNonExistenceProof
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CompressedNonExistenceProof.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CompressedNonExistenceProof;
})();

$root.PublicKey = (function() {

    /**
     * Properties of a PublicKey.
     * @exports IPublicKey
     * @interface IPublicKey
     * @property {Uint8Array|null} [ed25519] PublicKey ed25519
     * @property {Uint8Array|null} [secp256k1] PublicKey secp256k1
     */

    /**
     * Constructs a new PublicKey.
     * @exports PublicKey
     * @classdesc Represents a PublicKey.
     * @implements IPublicKey
     * @constructor
     * @param {IPublicKey=} [properties] Properties to set
     */
    function PublicKey(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PublicKey ed25519.
     * @member {Uint8Array} ed25519
     * @memberof PublicKey
     * @instance
     */
    PublicKey.prototype.ed25519 = $util.newBuffer([]);

    /**
     * PublicKey secp256k1.
     * @member {Uint8Array} secp256k1
     * @memberof PublicKey
     * @instance
     */
    PublicKey.prototype.secp256k1 = $util.newBuffer([]);

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * PublicKey sum.
     * @member {"ed25519"|"secp256k1"|undefined} sum
     * @memberof PublicKey
     * @instance
     */
    Object.defineProperty(PublicKey.prototype, "sum", {
        get: $util.oneOfGetter($oneOfFields = ["ed25519", "secp256k1"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new PublicKey instance using the specified properties.
     * @function create
     * @memberof PublicKey
     * @static
     * @param {IPublicKey=} [properties] Properties to set
     * @returns {PublicKey} PublicKey instance
     */
    PublicKey.create = function create(properties) {
        return new PublicKey(properties);
    };

    /**
     * Encodes the specified PublicKey message. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @function encode
     * @memberof PublicKey
     * @static
     * @param {IPublicKey} message PublicKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PublicKey.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.ed25519 != null && message.hasOwnProperty("ed25519"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ed25519);
        if (message.secp256k1 != null && message.hasOwnProperty("secp256k1"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.secp256k1);
        return writer;
    };

    /**
     * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PublicKey
     * @static
     * @param {IPublicKey} message PublicKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PublicKey.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PublicKey message from the specified reader or buffer.
     * @function decode
     * @memberof PublicKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PublicKey} PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PublicKey.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PublicKey();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.ed25519 = reader.bytes();
                break;
            case 2:
                message.secp256k1 = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PublicKey message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PublicKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PublicKey} PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PublicKey.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PublicKey message.
     * @function verify
     * @memberof PublicKey
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PublicKey.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.ed25519 != null && message.hasOwnProperty("ed25519")) {
            properties.sum = 1;
            if (!(message.ed25519 && typeof message.ed25519.length === "number" || $util.isString(message.ed25519)))
                return "ed25519: buffer expected";
        }
        if (message.secp256k1 != null && message.hasOwnProperty("secp256k1")) {
            if (properties.sum === 1)
                return "sum: multiple values";
            properties.sum = 1;
            if (!(message.secp256k1 && typeof message.secp256k1.length === "number" || $util.isString(message.secp256k1)))
                return "secp256k1: buffer expected";
        }
        return null;
    };

    /**
     * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PublicKey
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PublicKey} PublicKey
     */
    PublicKey.fromObject = function fromObject(object) {
        if (object instanceof $root.PublicKey)
            return object;
        var message = new $root.PublicKey();
        if (object.ed25519 != null)
            if (typeof object.ed25519 === "string")
                $util.base64.decode(object.ed25519, message.ed25519 = $util.newBuffer($util.base64.length(object.ed25519)), 0);
            else if (object.ed25519.length)
                message.ed25519 = object.ed25519;
        if (object.secp256k1 != null)
            if (typeof object.secp256k1 === "string")
                $util.base64.decode(object.secp256k1, message.secp256k1 = $util.newBuffer($util.base64.length(object.secp256k1)), 0);
            else if (object.secp256k1.length)
                message.secp256k1 = object.secp256k1;
        return message;
    };

    /**
     * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PublicKey
     * @static
     * @param {PublicKey} message PublicKey
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PublicKey.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.ed25519 != null && message.hasOwnProperty("ed25519")) {
            object.ed25519 = options.bytes === String ? $util.base64.encode(message.ed25519, 0, message.ed25519.length) : options.bytes === Array ? Array.prototype.slice.call(message.ed25519) : message.ed25519;
            if (options.oneofs)
                object.sum = "ed25519";
        }
        if (message.secp256k1 != null && message.hasOwnProperty("secp256k1")) {
            object.secp256k1 = options.bytes === String ? $util.base64.encode(message.secp256k1, 0, message.secp256k1.length) : options.bytes === Array ? Array.prototype.slice.call(message.secp256k1) : message.secp256k1;
            if (options.oneofs)
                object.sum = "secp256k1";
        }
        return object;
    };

    /**
     * Converts this PublicKey to JSON.
     * @function toJSON
     * @memberof PublicKey
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PublicKey.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PublicKey;
})();

$root.ClientState = (function() {

    /**
     * Properties of a ClientState.
     * @exports IClientState
     * @interface IClientState
     * @property {string|null} [chainId] ClientState chainId
     * @property {IFraction|null} [trustLevel] ClientState trustLevel
     * @property {number|Long|null} [trustingPeriod] ClientState trustingPeriod
     * @property {number|Long|null} [unbondingPeriod] ClientState unbondingPeriod
     * @property {number|Long|null} [maxClockDrift] ClientState maxClockDrift
     * @property {IHeight|null} [latestHeight] ClientState latestHeight
     * @property {Array.<IProofSpec>|null} [proofSpecs] ClientState proofSpecs
     * @property {IMerklePrefix|null} [merklePrefix] ClientState merklePrefix
     * @property {number|Long|null} [timeDelay] ClientState timeDelay
     */

    /**
     * Constructs a new ClientState.
     * @exports ClientState
     * @classdesc Represents a ClientState.
     * @implements IClientState
     * @constructor
     * @param {IClientState=} [properties] Properties to set
     */
    function ClientState(properties) {
        this.proofSpecs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClientState chainId.
     * @member {string} chainId
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.chainId = "";

    /**
     * ClientState trustLevel.
     * @member {IFraction|null|undefined} trustLevel
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.trustLevel = null;

    /**
     * ClientState trustingPeriod.
     * @member {number|Long} trustingPeriod
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.trustingPeriod = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ClientState unbondingPeriod.
     * @member {number|Long} unbondingPeriod
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.unbondingPeriod = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ClientState maxClockDrift.
     * @member {number|Long} maxClockDrift
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.maxClockDrift = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ClientState latestHeight.
     * @member {IHeight|null|undefined} latestHeight
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.latestHeight = null;

    /**
     * ClientState proofSpecs.
     * @member {Array.<IProofSpec>} proofSpecs
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.proofSpecs = $util.emptyArray;

    /**
     * ClientState merklePrefix.
     * @member {IMerklePrefix|null|undefined} merklePrefix
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.merklePrefix = null;

    /**
     * ClientState timeDelay.
     * @member {number|Long} timeDelay
     * @memberof ClientState
     * @instance
     */
    ClientState.prototype.timeDelay = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new ClientState instance using the specified properties.
     * @function create
     * @memberof ClientState
     * @static
     * @param {IClientState=} [properties] Properties to set
     * @returns {ClientState} ClientState instance
     */
    ClientState.create = function create(properties) {
        return new ClientState(properties);
    };

    /**
     * Encodes the specified ClientState message. Does not implicitly {@link ClientState.verify|verify} messages.
     * @function encode
     * @memberof ClientState
     * @static
     * @param {IClientState} message ClientState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.chainId);
        if (message.trustLevel != null && message.hasOwnProperty("trustLevel"))
            $root.Fraction.encode(message.trustLevel, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.trustingPeriod != null && message.hasOwnProperty("trustingPeriod"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.trustingPeriod);
        if (message.unbondingPeriod != null && message.hasOwnProperty("unbondingPeriod"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.unbondingPeriod);
        if (message.maxClockDrift != null && message.hasOwnProperty("maxClockDrift"))
            writer.uint32(/* id 5, wireType 0 =*/40).int64(message.maxClockDrift);
        if (message.latestHeight != null && message.hasOwnProperty("latestHeight"))
            $root.Height.encode(message.latestHeight, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.proofSpecs != null && message.proofSpecs.length)
            for (var i = 0; i < message.proofSpecs.length; ++i)
                $root.ProofSpec.encode(message.proofSpecs[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.merklePrefix != null && message.hasOwnProperty("merklePrefix"))
            $root.MerklePrefix.encode(message.merklePrefix, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.timeDelay != null && message.hasOwnProperty("timeDelay"))
            writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.timeDelay);
        return writer;
    };

    /**
     * Encodes the specified ClientState message, length delimited. Does not implicitly {@link ClientState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClientState
     * @static
     * @param {IClientState} message ClientState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClientState message from the specified reader or buffer.
     * @function decode
     * @memberof ClientState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClientState} ClientState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClientState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.chainId = reader.string();
                break;
            case 2:
                message.trustLevel = $root.Fraction.decode(reader, reader.uint32());
                break;
            case 3:
                message.trustingPeriod = reader.int64();
                break;
            case 4:
                message.unbondingPeriod = reader.int64();
                break;
            case 5:
                message.maxClockDrift = reader.int64();
                break;
            case 6:
                message.latestHeight = $root.Height.decode(reader, reader.uint32());
                break;
            case 7:
                if (!(message.proofSpecs && message.proofSpecs.length))
                    message.proofSpecs = [];
                message.proofSpecs.push($root.ProofSpec.decode(reader, reader.uint32()));
                break;
            case 8:
                message.merklePrefix = $root.MerklePrefix.decode(reader, reader.uint32());
                break;
            case 9:
                message.timeDelay = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClientState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClientState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClientState} ClientState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClientState message.
     * @function verify
     * @memberof ClientState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClientState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            if (!$util.isString(message.chainId))
                return "chainId: string expected";
        if (message.trustLevel != null && message.hasOwnProperty("trustLevel")) {
            var error = $root.Fraction.verify(message.trustLevel);
            if (error)
                return "trustLevel." + error;
        }
        if (message.trustingPeriod != null && message.hasOwnProperty("trustingPeriod"))
            if (!$util.isInteger(message.trustingPeriod) && !(message.trustingPeriod && $util.isInteger(message.trustingPeriod.low) && $util.isInteger(message.trustingPeriod.high)))
                return "trustingPeriod: integer|Long expected";
        if (message.unbondingPeriod != null && message.hasOwnProperty("unbondingPeriod"))
            if (!$util.isInteger(message.unbondingPeriod) && !(message.unbondingPeriod && $util.isInteger(message.unbondingPeriod.low) && $util.isInteger(message.unbondingPeriod.high)))
                return "unbondingPeriod: integer|Long expected";
        if (message.maxClockDrift != null && message.hasOwnProperty("maxClockDrift"))
            if (!$util.isInteger(message.maxClockDrift) && !(message.maxClockDrift && $util.isInteger(message.maxClockDrift.low) && $util.isInteger(message.maxClockDrift.high)))
                return "maxClockDrift: integer|Long expected";
        if (message.latestHeight != null && message.hasOwnProperty("latestHeight")) {
            var error = $root.Height.verify(message.latestHeight);
            if (error)
                return "latestHeight." + error;
        }
        if (message.proofSpecs != null && message.hasOwnProperty("proofSpecs")) {
            if (!Array.isArray(message.proofSpecs))
                return "proofSpecs: array expected";
            for (var i = 0; i < message.proofSpecs.length; ++i) {
                var error = $root.ProofSpec.verify(message.proofSpecs[i]);
                if (error)
                    return "proofSpecs." + error;
            }
        }
        if (message.merklePrefix != null && message.hasOwnProperty("merklePrefix")) {
            var error = $root.MerklePrefix.verify(message.merklePrefix);
            if (error)
                return "merklePrefix." + error;
        }
        if (message.timeDelay != null && message.hasOwnProperty("timeDelay"))
            if (!$util.isInteger(message.timeDelay) && !(message.timeDelay && $util.isInteger(message.timeDelay.low) && $util.isInteger(message.timeDelay.high)))
                return "timeDelay: integer|Long expected";
        return null;
    };

    /**
     * Creates a ClientState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClientState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClientState} ClientState
     */
    ClientState.fromObject = function fromObject(object) {
        if (object instanceof $root.ClientState)
            return object;
        var message = new $root.ClientState();
        if (object.chainId != null)
            message.chainId = String(object.chainId);
        if (object.trustLevel != null) {
            if (typeof object.trustLevel !== "object")
                throw TypeError(".ClientState.trustLevel: object expected");
            message.trustLevel = $root.Fraction.fromObject(object.trustLevel);
        }
        if (object.trustingPeriod != null)
            if ($util.Long)
                (message.trustingPeriod = $util.Long.fromValue(object.trustingPeriod)).unsigned = false;
            else if (typeof object.trustingPeriod === "string")
                message.trustingPeriod = parseInt(object.trustingPeriod, 10);
            else if (typeof object.trustingPeriod === "number")
                message.trustingPeriod = object.trustingPeriod;
            else if (typeof object.trustingPeriod === "object")
                message.trustingPeriod = new $util.LongBits(object.trustingPeriod.low >>> 0, object.trustingPeriod.high >>> 0).toNumber();
        if (object.unbondingPeriod != null)
            if ($util.Long)
                (message.unbondingPeriod = $util.Long.fromValue(object.unbondingPeriod)).unsigned = false;
            else if (typeof object.unbondingPeriod === "string")
                message.unbondingPeriod = parseInt(object.unbondingPeriod, 10);
            else if (typeof object.unbondingPeriod === "number")
                message.unbondingPeriod = object.unbondingPeriod;
            else if (typeof object.unbondingPeriod === "object")
                message.unbondingPeriod = new $util.LongBits(object.unbondingPeriod.low >>> 0, object.unbondingPeriod.high >>> 0).toNumber();
        if (object.maxClockDrift != null)
            if ($util.Long)
                (message.maxClockDrift = $util.Long.fromValue(object.maxClockDrift)).unsigned = false;
            else if (typeof object.maxClockDrift === "string")
                message.maxClockDrift = parseInt(object.maxClockDrift, 10);
            else if (typeof object.maxClockDrift === "number")
                message.maxClockDrift = object.maxClockDrift;
            else if (typeof object.maxClockDrift === "object")
                message.maxClockDrift = new $util.LongBits(object.maxClockDrift.low >>> 0, object.maxClockDrift.high >>> 0).toNumber();
        if (object.latestHeight != null) {
            if (typeof object.latestHeight !== "object")
                throw TypeError(".ClientState.latestHeight: object expected");
            message.latestHeight = $root.Height.fromObject(object.latestHeight);
        }
        if (object.proofSpecs) {
            if (!Array.isArray(object.proofSpecs))
                throw TypeError(".ClientState.proofSpecs: array expected");
            message.proofSpecs = [];
            for (var i = 0; i < object.proofSpecs.length; ++i) {
                if (typeof object.proofSpecs[i] !== "object")
                    throw TypeError(".ClientState.proofSpecs: object expected");
                message.proofSpecs[i] = $root.ProofSpec.fromObject(object.proofSpecs[i]);
            }
        }
        if (object.merklePrefix != null) {
            if (typeof object.merklePrefix !== "object")
                throw TypeError(".ClientState.merklePrefix: object expected");
            message.merklePrefix = $root.MerklePrefix.fromObject(object.merklePrefix);
        }
        if (object.timeDelay != null)
            if ($util.Long)
                (message.timeDelay = $util.Long.fromValue(object.timeDelay)).unsigned = true;
            else if (typeof object.timeDelay === "string")
                message.timeDelay = parseInt(object.timeDelay, 10);
            else if (typeof object.timeDelay === "number")
                message.timeDelay = object.timeDelay;
            else if (typeof object.timeDelay === "object")
                message.timeDelay = new $util.LongBits(object.timeDelay.low >>> 0, object.timeDelay.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a ClientState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClientState
     * @static
     * @param {ClientState} message ClientState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClientState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.proofSpecs = [];
        if (options.defaults) {
            object.chainId = "";
            object.trustLevel = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.trustingPeriod = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.trustingPeriod = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.unbondingPeriod = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.unbondingPeriod = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.maxClockDrift = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.maxClockDrift = options.longs === String ? "0" : 0;
            object.latestHeight = null;
            object.merklePrefix = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timeDelay = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timeDelay = options.longs === String ? "0" : 0;
        }
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            object.chainId = message.chainId;
        if (message.trustLevel != null && message.hasOwnProperty("trustLevel"))
            object.trustLevel = $root.Fraction.toObject(message.trustLevel, options);
        if (message.trustingPeriod != null && message.hasOwnProperty("trustingPeriod"))
            if (typeof message.trustingPeriod === "number")
                object.trustingPeriod = options.longs === String ? String(message.trustingPeriod) : message.trustingPeriod;
            else
                object.trustingPeriod = options.longs === String ? $util.Long.prototype.toString.call(message.trustingPeriod) : options.longs === Number ? new $util.LongBits(message.trustingPeriod.low >>> 0, message.trustingPeriod.high >>> 0).toNumber() : message.trustingPeriod;
        if (message.unbondingPeriod != null && message.hasOwnProperty("unbondingPeriod"))
            if (typeof message.unbondingPeriod === "number")
                object.unbondingPeriod = options.longs === String ? String(message.unbondingPeriod) : message.unbondingPeriod;
            else
                object.unbondingPeriod = options.longs === String ? $util.Long.prototype.toString.call(message.unbondingPeriod) : options.longs === Number ? new $util.LongBits(message.unbondingPeriod.low >>> 0, message.unbondingPeriod.high >>> 0).toNumber() : message.unbondingPeriod;
        if (message.maxClockDrift != null && message.hasOwnProperty("maxClockDrift"))
            if (typeof message.maxClockDrift === "number")
                object.maxClockDrift = options.longs === String ? String(message.maxClockDrift) : message.maxClockDrift;
            else
                object.maxClockDrift = options.longs === String ? $util.Long.prototype.toString.call(message.maxClockDrift) : options.longs === Number ? new $util.LongBits(message.maxClockDrift.low >>> 0, message.maxClockDrift.high >>> 0).toNumber() : message.maxClockDrift;
        if (message.latestHeight != null && message.hasOwnProperty("latestHeight"))
            object.latestHeight = $root.Height.toObject(message.latestHeight, options);
        if (message.proofSpecs && message.proofSpecs.length) {
            object.proofSpecs = [];
            for (var j = 0; j < message.proofSpecs.length; ++j)
                object.proofSpecs[j] = $root.ProofSpec.toObject(message.proofSpecs[j], options);
        }
        if (message.merklePrefix != null && message.hasOwnProperty("merklePrefix"))
            object.merklePrefix = $root.MerklePrefix.toObject(message.merklePrefix, options);
        if (message.timeDelay != null && message.hasOwnProperty("timeDelay"))
            if (typeof message.timeDelay === "number")
                object.timeDelay = options.longs === String ? String(message.timeDelay) : message.timeDelay;
            else
                object.timeDelay = options.longs === String ? $util.Long.prototype.toString.call(message.timeDelay) : options.longs === Number ? new $util.LongBits(message.timeDelay.low >>> 0, message.timeDelay.high >>> 0).toNumber(true) : message.timeDelay;
        return object;
    };

    /**
     * Converts this ClientState to JSON.
     * @function toJSON
     * @memberof ClientState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClientState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClientState;
})();

$root.ConsensusState = (function() {

    /**
     * Properties of a ConsensusState.
     * @exports IConsensusState
     * @interface IConsensusState
     * @property {ITimestamp|null} [timestamp] ConsensusState timestamp
     * @property {Uint8Array|null} [root] ConsensusState root
     * @property {Uint8Array|null} [nextValidatorsHash] ConsensusState nextValidatorsHash
     */

    /**
     * Constructs a new ConsensusState.
     * @exports ConsensusState
     * @classdesc Represents a ConsensusState.
     * @implements IConsensusState
     * @constructor
     * @param {IConsensusState=} [properties] Properties to set
     */
    function ConsensusState(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ConsensusState timestamp.
     * @member {ITimestamp|null|undefined} timestamp
     * @memberof ConsensusState
     * @instance
     */
    ConsensusState.prototype.timestamp = null;

    /**
     * ConsensusState root.
     * @member {Uint8Array} root
     * @memberof ConsensusState
     * @instance
     */
    ConsensusState.prototype.root = $util.newBuffer([]);

    /**
     * ConsensusState nextValidatorsHash.
     * @member {Uint8Array} nextValidatorsHash
     * @memberof ConsensusState
     * @instance
     */
    ConsensusState.prototype.nextValidatorsHash = $util.newBuffer([]);

    /**
     * Creates a new ConsensusState instance using the specified properties.
     * @function create
     * @memberof ConsensusState
     * @static
     * @param {IConsensusState=} [properties] Properties to set
     * @returns {ConsensusState} ConsensusState instance
     */
    ConsensusState.create = function create(properties) {
        return new ConsensusState(properties);
    };

    /**
     * Encodes the specified ConsensusState message. Does not implicitly {@link ConsensusState.verify|verify} messages.
     * @function encode
     * @memberof ConsensusState
     * @static
     * @param {IConsensusState} message ConsensusState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConsensusState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            $root.Timestamp.encode(message.timestamp, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.root != null && message.hasOwnProperty("root"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.root);
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.nextValidatorsHash);
        return writer;
    };

    /**
     * Encodes the specified ConsensusState message, length delimited. Does not implicitly {@link ConsensusState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ConsensusState
     * @static
     * @param {IConsensusState} message ConsensusState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConsensusState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ConsensusState message from the specified reader or buffer.
     * @function decode
     * @memberof ConsensusState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ConsensusState} ConsensusState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConsensusState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ConsensusState();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.timestamp = $root.Timestamp.decode(reader, reader.uint32());
                break;
            case 2:
                message.root = reader.bytes();
                break;
            case 3:
                message.nextValidatorsHash = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ConsensusState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ConsensusState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ConsensusState} ConsensusState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConsensusState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ConsensusState message.
     * @function verify
     * @memberof ConsensusState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ConsensusState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            var error = $root.Timestamp.verify(message.timestamp);
            if (error)
                return "timestamp." + error;
        }
        if (message.root != null && message.hasOwnProperty("root"))
            if (!(message.root && typeof message.root.length === "number" || $util.isString(message.root)))
                return "root: buffer expected";
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            if (!(message.nextValidatorsHash && typeof message.nextValidatorsHash.length === "number" || $util.isString(message.nextValidatorsHash)))
                return "nextValidatorsHash: buffer expected";
        return null;
    };

    /**
     * Creates a ConsensusState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ConsensusState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ConsensusState} ConsensusState
     */
    ConsensusState.fromObject = function fromObject(object) {
        if (object instanceof $root.ConsensusState)
            return object;
        var message = new $root.ConsensusState();
        if (object.timestamp != null) {
            if (typeof object.timestamp !== "object")
                throw TypeError(".ConsensusState.timestamp: object expected");
            message.timestamp = $root.Timestamp.fromObject(object.timestamp);
        }
        if (object.root != null)
            if (typeof object.root === "string")
                $util.base64.decode(object.root, message.root = $util.newBuffer($util.base64.length(object.root)), 0);
            else if (object.root.length)
                message.root = object.root;
        if (object.nextValidatorsHash != null)
            if (typeof object.nextValidatorsHash === "string")
                $util.base64.decode(object.nextValidatorsHash, message.nextValidatorsHash = $util.newBuffer($util.base64.length(object.nextValidatorsHash)), 0);
            else if (object.nextValidatorsHash.length)
                message.nextValidatorsHash = object.nextValidatorsHash;
        return message;
    };

    /**
     * Creates a plain object from a ConsensusState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ConsensusState
     * @static
     * @param {ConsensusState} message ConsensusState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ConsensusState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.timestamp = null;
            if (options.bytes === String)
                object.root = "";
            else {
                object.root = [];
                if (options.bytes !== Array)
                    object.root = $util.newBuffer(object.root);
            }
            if (options.bytes === String)
                object.nextValidatorsHash = "";
            else {
                object.nextValidatorsHash = [];
                if (options.bytes !== Array)
                    object.nextValidatorsHash = $util.newBuffer(object.nextValidatorsHash);
            }
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = $root.Timestamp.toObject(message.timestamp, options);
        if (message.root != null && message.hasOwnProperty("root"))
            object.root = options.bytes === String ? $util.base64.encode(message.root, 0, message.root.length) : options.bytes === Array ? Array.prototype.slice.call(message.root) : message.root;
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            object.nextValidatorsHash = options.bytes === String ? $util.base64.encode(message.nextValidatorsHash, 0, message.nextValidatorsHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.nextValidatorsHash) : message.nextValidatorsHash;
        return object;
    };

    /**
     * Converts this ConsensusState to JSON.
     * @function toJSON
     * @memberof ConsensusState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ConsensusState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ConsensusState;
})();

$root.Header = (function() {

    /**
     * Properties of a Header.
     * @exports IHeader
     * @interface IHeader
     * @property {ISignedHeader|null} [signedHeader] Header signedHeader
     * @property {IValidatorSet|null} [validatorSet] Header validatorSet
     * @property {IHeight|null} [trustedHeight] Header trustedHeight
     * @property {IValidatorSet|null} [trustedValidators] Header trustedValidators
     */

    /**
     * Constructs a new Header.
     * @exports Header
     * @classdesc Represents a Header.
     * @implements IHeader
     * @constructor
     * @param {IHeader=} [properties] Properties to set
     */
    function Header(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Header signedHeader.
     * @member {ISignedHeader|null|undefined} signedHeader
     * @memberof Header
     * @instance
     */
    Header.prototype.signedHeader = null;

    /**
     * Header validatorSet.
     * @member {IValidatorSet|null|undefined} validatorSet
     * @memberof Header
     * @instance
     */
    Header.prototype.validatorSet = null;

    /**
     * Header trustedHeight.
     * @member {IHeight|null|undefined} trustedHeight
     * @memberof Header
     * @instance
     */
    Header.prototype.trustedHeight = null;

    /**
     * Header trustedValidators.
     * @member {IValidatorSet|null|undefined} trustedValidators
     * @memberof Header
     * @instance
     */
    Header.prototype.trustedValidators = null;

    /**
     * Creates a new Header instance using the specified properties.
     * @function create
     * @memberof Header
     * @static
     * @param {IHeader=} [properties] Properties to set
     * @returns {Header} Header instance
     */
    Header.create = function create(properties) {
        return new Header(properties);
    };

    /**
     * Encodes the specified Header message. Does not implicitly {@link Header.verify|verify} messages.
     * @function encode
     * @memberof Header
     * @static
     * @param {IHeader} message Header message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Header.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signedHeader != null && message.hasOwnProperty("signedHeader"))
            $root.SignedHeader.encode(message.signedHeader, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.validatorSet != null && message.hasOwnProperty("validatorSet"))
            $root.ValidatorSet.encode(message.validatorSet, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.trustedHeight != null && message.hasOwnProperty("trustedHeight"))
            $root.Height.encode(message.trustedHeight, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.trustedValidators != null && message.hasOwnProperty("trustedValidators"))
            $root.ValidatorSet.encode(message.trustedValidators, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Header message, length delimited. Does not implicitly {@link Header.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Header
     * @static
     * @param {IHeader} message Header message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Header.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Header message from the specified reader or buffer.
     * @function decode
     * @memberof Header
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Header} Header
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Header.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Header();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signedHeader = $root.SignedHeader.decode(reader, reader.uint32());
                break;
            case 2:
                message.validatorSet = $root.ValidatorSet.decode(reader, reader.uint32());
                break;
            case 3:
                message.trustedHeight = $root.Height.decode(reader, reader.uint32());
                break;
            case 4:
                message.trustedValidators = $root.ValidatorSet.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Header message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Header
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Header} Header
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Header.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Header message.
     * @function verify
     * @memberof Header
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Header.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signedHeader != null && message.hasOwnProperty("signedHeader")) {
            var error = $root.SignedHeader.verify(message.signedHeader);
            if (error)
                return "signedHeader." + error;
        }
        if (message.validatorSet != null && message.hasOwnProperty("validatorSet")) {
            var error = $root.ValidatorSet.verify(message.validatorSet);
            if (error)
                return "validatorSet." + error;
        }
        if (message.trustedHeight != null && message.hasOwnProperty("trustedHeight")) {
            var error = $root.Height.verify(message.trustedHeight);
            if (error)
                return "trustedHeight." + error;
        }
        if (message.trustedValidators != null && message.hasOwnProperty("trustedValidators")) {
            var error = $root.ValidatorSet.verify(message.trustedValidators);
            if (error)
                return "trustedValidators." + error;
        }
        return null;
    };

    /**
     * Creates a Header message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Header
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Header} Header
     */
    Header.fromObject = function fromObject(object) {
        if (object instanceof $root.Header)
            return object;
        var message = new $root.Header();
        if (object.signedHeader != null) {
            if (typeof object.signedHeader !== "object")
                throw TypeError(".Header.signedHeader: object expected");
            message.signedHeader = $root.SignedHeader.fromObject(object.signedHeader);
        }
        if (object.validatorSet != null) {
            if (typeof object.validatorSet !== "object")
                throw TypeError(".Header.validatorSet: object expected");
            message.validatorSet = $root.ValidatorSet.fromObject(object.validatorSet);
        }
        if (object.trustedHeight != null) {
            if (typeof object.trustedHeight !== "object")
                throw TypeError(".Header.trustedHeight: object expected");
            message.trustedHeight = $root.Height.fromObject(object.trustedHeight);
        }
        if (object.trustedValidators != null) {
            if (typeof object.trustedValidators !== "object")
                throw TypeError(".Header.trustedValidators: object expected");
            message.trustedValidators = $root.ValidatorSet.fromObject(object.trustedValidators);
        }
        return message;
    };

    /**
     * Creates a plain object from a Header message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Header
     * @static
     * @param {Header} message Header
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Header.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.signedHeader = null;
            object.validatorSet = null;
            object.trustedHeight = null;
            object.trustedValidators = null;
        }
        if (message.signedHeader != null && message.hasOwnProperty("signedHeader"))
            object.signedHeader = $root.SignedHeader.toObject(message.signedHeader, options);
        if (message.validatorSet != null && message.hasOwnProperty("validatorSet"))
            object.validatorSet = $root.ValidatorSet.toObject(message.validatorSet, options);
        if (message.trustedHeight != null && message.hasOwnProperty("trustedHeight"))
            object.trustedHeight = $root.Height.toObject(message.trustedHeight, options);
        if (message.trustedValidators != null && message.hasOwnProperty("trustedValidators"))
            object.trustedValidators = $root.ValidatorSet.toObject(message.trustedValidators, options);
        return object;
    };

    /**
     * Converts this Header to JSON.
     * @function toJSON
     * @memberof Header
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Header.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Header;
})();

$root.Fraction = (function() {

    /**
     * Properties of a Fraction.
     * @exports IFraction
     * @interface IFraction
     * @property {number|Long|null} [numerator] Fraction numerator
     * @property {number|Long|null} [denominator] Fraction denominator
     */

    /**
     * Constructs a new Fraction.
     * @exports Fraction
     * @classdesc Represents a Fraction.
     * @implements IFraction
     * @constructor
     * @param {IFraction=} [properties] Properties to set
     */
    function Fraction(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Fraction numerator.
     * @member {number|Long} numerator
     * @memberof Fraction
     * @instance
     */
    Fraction.prototype.numerator = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Fraction denominator.
     * @member {number|Long} denominator
     * @memberof Fraction
     * @instance
     */
    Fraction.prototype.denominator = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new Fraction instance using the specified properties.
     * @function create
     * @memberof Fraction
     * @static
     * @param {IFraction=} [properties] Properties to set
     * @returns {Fraction} Fraction instance
     */
    Fraction.create = function create(properties) {
        return new Fraction(properties);
    };

    /**
     * Encodes the specified Fraction message. Does not implicitly {@link Fraction.verify|verify} messages.
     * @function encode
     * @memberof Fraction
     * @static
     * @param {IFraction} message Fraction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Fraction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.numerator != null && message.hasOwnProperty("numerator"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.numerator);
        if (message.denominator != null && message.hasOwnProperty("denominator"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.denominator);
        return writer;
    };

    /**
     * Encodes the specified Fraction message, length delimited. Does not implicitly {@link Fraction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Fraction
     * @static
     * @param {IFraction} message Fraction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Fraction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Fraction message from the specified reader or buffer.
     * @function decode
     * @memberof Fraction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Fraction} Fraction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Fraction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Fraction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.numerator = reader.uint64();
                break;
            case 2:
                message.denominator = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Fraction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Fraction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Fraction} Fraction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Fraction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Fraction message.
     * @function verify
     * @memberof Fraction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Fraction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.numerator != null && message.hasOwnProperty("numerator"))
            if (!$util.isInteger(message.numerator) && !(message.numerator && $util.isInteger(message.numerator.low) && $util.isInteger(message.numerator.high)))
                return "numerator: integer|Long expected";
        if (message.denominator != null && message.hasOwnProperty("denominator"))
            if (!$util.isInteger(message.denominator) && !(message.denominator && $util.isInteger(message.denominator.low) && $util.isInteger(message.denominator.high)))
                return "denominator: integer|Long expected";
        return null;
    };

    /**
     * Creates a Fraction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Fraction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Fraction} Fraction
     */
    Fraction.fromObject = function fromObject(object) {
        if (object instanceof $root.Fraction)
            return object;
        var message = new $root.Fraction();
        if (object.numerator != null)
            if ($util.Long)
                (message.numerator = $util.Long.fromValue(object.numerator)).unsigned = true;
            else if (typeof object.numerator === "string")
                message.numerator = parseInt(object.numerator, 10);
            else if (typeof object.numerator === "number")
                message.numerator = object.numerator;
            else if (typeof object.numerator === "object")
                message.numerator = new $util.LongBits(object.numerator.low >>> 0, object.numerator.high >>> 0).toNumber(true);
        if (object.denominator != null)
            if ($util.Long)
                (message.denominator = $util.Long.fromValue(object.denominator)).unsigned = true;
            else if (typeof object.denominator === "string")
                message.denominator = parseInt(object.denominator, 10);
            else if (typeof object.denominator === "number")
                message.denominator = object.denominator;
            else if (typeof object.denominator === "object")
                message.denominator = new $util.LongBits(object.denominator.low >>> 0, object.denominator.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a Fraction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Fraction
     * @static
     * @param {Fraction} message Fraction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Fraction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.numerator = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.numerator = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.denominator = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.denominator = options.longs === String ? "0" : 0;
        }
        if (message.numerator != null && message.hasOwnProperty("numerator"))
            if (typeof message.numerator === "number")
                object.numerator = options.longs === String ? String(message.numerator) : message.numerator;
            else
                object.numerator = options.longs === String ? $util.Long.prototype.toString.call(message.numerator) : options.longs === Number ? new $util.LongBits(message.numerator.low >>> 0, message.numerator.high >>> 0).toNumber(true) : message.numerator;
        if (message.denominator != null && message.hasOwnProperty("denominator"))
            if (typeof message.denominator === "number")
                object.denominator = options.longs === String ? String(message.denominator) : message.denominator;
            else
                object.denominator = options.longs === String ? $util.Long.prototype.toString.call(message.denominator) : options.longs === Number ? new $util.LongBits(message.denominator.low >>> 0, message.denominator.high >>> 0).toNumber(true) : message.denominator;
        return object;
    };

    /**
     * Converts this Fraction to JSON.
     * @function toJSON
     * @memberof Fraction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Fraction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Fraction;
})();

/**
 * BlockIDFlag enum.
 * @exports BlockIDFlag
 * @enum {string}
 * @property {number} BLOCK_ID_FLAG_UNKNOWN=0 BLOCK_ID_FLAG_UNKNOWN value
 * @property {number} BLOCK_ID_FLAG_ABSENT=1 BLOCK_ID_FLAG_ABSENT value
 * @property {number} BLOCK_ID_FLAG_COMMIT=2 BLOCK_ID_FLAG_COMMIT value
 * @property {number} BLOCK_ID_FLAG_NIL=3 BLOCK_ID_FLAG_NIL value
 */
$root.BlockIDFlag = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "BLOCK_ID_FLAG_UNKNOWN"] = 0;
    values[valuesById[1] = "BLOCK_ID_FLAG_ABSENT"] = 1;
    values[valuesById[2] = "BLOCK_ID_FLAG_COMMIT"] = 2;
    values[valuesById[3] = "BLOCK_ID_FLAG_NIL"] = 3;
    return values;
})();

/**
 * SignedMsgType enum.
 * @exports SignedMsgType
 * @enum {string}
 * @property {number} SIGNED_MSG_TYPE_UNKNOWN=0 SIGNED_MSG_TYPE_UNKNOWN value
 * @property {number} SIGNED_MSG_TYPE_PREVOTE=1 SIGNED_MSG_TYPE_PREVOTE value
 * @property {number} SIGNED_MSG_TYPE_PRECOMMIT=2 SIGNED_MSG_TYPE_PRECOMMIT value
 * @property {number} SIGNED_MSG_TYPE_PROPOSAL=32 SIGNED_MSG_TYPE_PROPOSAL value
 */
$root.SignedMsgType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "SIGNED_MSG_TYPE_UNKNOWN"] = 0;
    values[valuesById[1] = "SIGNED_MSG_TYPE_PREVOTE"] = 1;
    values[valuesById[2] = "SIGNED_MSG_TYPE_PRECOMMIT"] = 2;
    values[valuesById[32] = "SIGNED_MSG_TYPE_PROPOSAL"] = 32;
    return values;
})();

$root.PartSetHeader = (function() {

    /**
     * Properties of a PartSetHeader.
     * @exports IPartSetHeader
     * @interface IPartSetHeader
     * @property {number|Long|null} [total] PartSetHeader total
     * @property {Uint8Array|null} [hash] PartSetHeader hash
     */

    /**
     * Constructs a new PartSetHeader.
     * @exports PartSetHeader
     * @classdesc Represents a PartSetHeader.
     * @implements IPartSetHeader
     * @constructor
     * @param {IPartSetHeader=} [properties] Properties to set
     */
    function PartSetHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PartSetHeader total.
     * @member {number|Long} total
     * @memberof PartSetHeader
     * @instance
     */
    PartSetHeader.prototype.total = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * PartSetHeader hash.
     * @member {Uint8Array} hash
     * @memberof PartSetHeader
     * @instance
     */
    PartSetHeader.prototype.hash = $util.newBuffer([]);

    /**
     * Creates a new PartSetHeader instance using the specified properties.
     * @function create
     * @memberof PartSetHeader
     * @static
     * @param {IPartSetHeader=} [properties] Properties to set
     * @returns {PartSetHeader} PartSetHeader instance
     */
    PartSetHeader.create = function create(properties) {
        return new PartSetHeader(properties);
    };

    /**
     * Encodes the specified PartSetHeader message. Does not implicitly {@link PartSetHeader.verify|verify} messages.
     * @function encode
     * @memberof PartSetHeader
     * @static
     * @param {IPartSetHeader} message PartSetHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PartSetHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.total != null && message.hasOwnProperty("total"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.total);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.hash);
        return writer;
    };

    /**
     * Encodes the specified PartSetHeader message, length delimited. Does not implicitly {@link PartSetHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PartSetHeader
     * @static
     * @param {IPartSetHeader} message PartSetHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PartSetHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PartSetHeader message from the specified reader or buffer.
     * @function decode
     * @memberof PartSetHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PartSetHeader} PartSetHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PartSetHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PartSetHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.total = reader.uint64();
                break;
            case 2:
                message.hash = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PartSetHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PartSetHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PartSetHeader} PartSetHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PartSetHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PartSetHeader message.
     * @function verify
     * @memberof PartSetHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PartSetHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.total != null && message.hasOwnProperty("total"))
            if (!$util.isInteger(message.total) && !(message.total && $util.isInteger(message.total.low) && $util.isInteger(message.total.high)))
                return "total: integer|Long expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        return null;
    };

    /**
     * Creates a PartSetHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PartSetHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PartSetHeader} PartSetHeader
     */
    PartSetHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.PartSetHeader)
            return object;
        var message = new $root.PartSetHeader();
        if (object.total != null)
            if ($util.Long)
                (message.total = $util.Long.fromValue(object.total)).unsigned = true;
            else if (typeof object.total === "string")
                message.total = parseInt(object.total, 10);
            else if (typeof object.total === "number")
                message.total = object.total;
            else if (typeof object.total === "object")
                message.total = new $util.LongBits(object.total.low >>> 0, object.total.high >>> 0).toNumber(true);
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        return message;
    };

    /**
     * Creates a plain object from a PartSetHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PartSetHeader
     * @static
     * @param {PartSetHeader} message PartSetHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PartSetHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.total = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.total = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.hash = "";
            else {
                object.hash = [];
                if (options.bytes !== Array)
                    object.hash = $util.newBuffer(object.hash);
            }
        }
        if (message.total != null && message.hasOwnProperty("total"))
            if (typeof message.total === "number")
                object.total = options.longs === String ? String(message.total) : message.total;
            else
                object.total = options.longs === String ? $util.Long.prototype.toString.call(message.total) : options.longs === Number ? new $util.LongBits(message.total.low >>> 0, message.total.high >>> 0).toNumber(true) : message.total;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        return object;
    };

    /**
     * Converts this PartSetHeader to JSON.
     * @function toJSON
     * @memberof PartSetHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PartSetHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PartSetHeader;
})();

$root.BlockID = (function() {

    /**
     * Properties of a BlockID.
     * @exports IBlockID
     * @interface IBlockID
     * @property {Uint8Array|null} [hash] BlockID hash
     * @property {IPartSetHeader|null} [partSetHeader] BlockID partSetHeader
     */

    /**
     * Constructs a new BlockID.
     * @exports BlockID
     * @classdesc Represents a BlockID.
     * @implements IBlockID
     * @constructor
     * @param {IBlockID=} [properties] Properties to set
     */
    function BlockID(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BlockID hash.
     * @member {Uint8Array} hash
     * @memberof BlockID
     * @instance
     */
    BlockID.prototype.hash = $util.newBuffer([]);

    /**
     * BlockID partSetHeader.
     * @member {IPartSetHeader|null|undefined} partSetHeader
     * @memberof BlockID
     * @instance
     */
    BlockID.prototype.partSetHeader = null;

    /**
     * Creates a new BlockID instance using the specified properties.
     * @function create
     * @memberof BlockID
     * @static
     * @param {IBlockID=} [properties] Properties to set
     * @returns {BlockID} BlockID instance
     */
    BlockID.create = function create(properties) {
        return new BlockID(properties);
    };

    /**
     * Encodes the specified BlockID message. Does not implicitly {@link BlockID.verify|verify} messages.
     * @function encode
     * @memberof BlockID
     * @static
     * @param {IBlockID} message BlockID message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockID.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hash);
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader"))
            $root.PartSetHeader.encode(message.partSetHeader, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BlockID message, length delimited. Does not implicitly {@link BlockID.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BlockID
     * @static
     * @param {IBlockID} message BlockID message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BlockID.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BlockID message from the specified reader or buffer.
     * @function decode
     * @memberof BlockID
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BlockID} BlockID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockID.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BlockID();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.bytes();
                break;
            case 2:
                message.partSetHeader = $root.PartSetHeader.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BlockID message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BlockID
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BlockID} BlockID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BlockID.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BlockID message.
     * @function verify
     * @memberof BlockID
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BlockID.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader")) {
            var error = $root.PartSetHeader.verify(message.partSetHeader);
            if (error)
                return "partSetHeader." + error;
        }
        return null;
    };

    /**
     * Creates a BlockID message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BlockID
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BlockID} BlockID
     */
    BlockID.fromObject = function fromObject(object) {
        if (object instanceof $root.BlockID)
            return object;
        var message = new $root.BlockID();
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        if (object.partSetHeader != null) {
            if (typeof object.partSetHeader !== "object")
                throw TypeError(".BlockID.partSetHeader: object expected");
            message.partSetHeader = $root.PartSetHeader.fromObject(object.partSetHeader);
        }
        return message;
    };

    /**
     * Creates a plain object from a BlockID message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BlockID
     * @static
     * @param {BlockID} message BlockID
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BlockID.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.hash = "";
            else {
                object.hash = [];
                if (options.bytes !== Array)
                    object.hash = $util.newBuffer(object.hash);
            }
            object.partSetHeader = null;
        }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader"))
            object.partSetHeader = $root.PartSetHeader.toObject(message.partSetHeader, options);
        return object;
    };

    /**
     * Converts this BlockID to JSON.
     * @function toJSON
     * @memberof BlockID
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BlockID.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BlockID;
})();

$root.Timestamp = (function() {

    /**
     * Properties of a Timestamp.
     * @exports ITimestamp
     * @interface ITimestamp
     * @property {number|Long|null} [secs] Timestamp secs
     * @property {number|Long|null} [nanos] Timestamp nanos
     */

    /**
     * Constructs a new Timestamp.
     * @exports Timestamp
     * @classdesc Represents a Timestamp.
     * @implements ITimestamp
     * @constructor
     * @param {ITimestamp=} [properties] Properties to set
     */
    function Timestamp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Timestamp secs.
     * @member {number|Long} secs
     * @memberof Timestamp
     * @instance
     */
    Timestamp.prototype.secs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Timestamp nanos.
     * @member {number|Long} nanos
     * @memberof Timestamp
     * @instance
     */
    Timestamp.prototype.nanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new Timestamp instance using the specified properties.
     * @function create
     * @memberof Timestamp
     * @static
     * @param {ITimestamp=} [properties] Properties to set
     * @returns {Timestamp} Timestamp instance
     */
    Timestamp.create = function create(properties) {
        return new Timestamp(properties);
    };

    /**
     * Encodes the specified Timestamp message. Does not implicitly {@link Timestamp.verify|verify} messages.
     * @function encode
     * @memberof Timestamp
     * @static
     * @param {ITimestamp} message Timestamp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Timestamp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.secs != null && message.hasOwnProperty("secs"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.secs);
        if (message.nanos != null && message.hasOwnProperty("nanos"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.nanos);
        return writer;
    };

    /**
     * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link Timestamp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Timestamp
     * @static
     * @param {ITimestamp} message Timestamp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Timestamp message from the specified reader or buffer.
     * @function decode
     * @memberof Timestamp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Timestamp} Timestamp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Timestamp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Timestamp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.secs = reader.int64();
                break;
            case 2:
                message.nanos = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Timestamp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Timestamp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Timestamp} Timestamp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Timestamp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Timestamp message.
     * @function verify
     * @memberof Timestamp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Timestamp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.secs != null && message.hasOwnProperty("secs"))
            if (!$util.isInteger(message.secs) && !(message.secs && $util.isInteger(message.secs.low) && $util.isInteger(message.secs.high)))
                return "secs: integer|Long expected";
        if (message.nanos != null && message.hasOwnProperty("nanos"))
            if (!$util.isInteger(message.nanos) && !(message.nanos && $util.isInteger(message.nanos.low) && $util.isInteger(message.nanos.high)))
                return "nanos: integer|Long expected";
        return null;
    };

    /**
     * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Timestamp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Timestamp} Timestamp
     */
    Timestamp.fromObject = function fromObject(object) {
        if (object instanceof $root.Timestamp)
            return object;
        var message = new $root.Timestamp();
        if (object.secs != null)
            if ($util.Long)
                (message.secs = $util.Long.fromValue(object.secs)).unsigned = false;
            else if (typeof object.secs === "string")
                message.secs = parseInt(object.secs, 10);
            else if (typeof object.secs === "number")
                message.secs = object.secs;
            else if (typeof object.secs === "object")
                message.secs = new $util.LongBits(object.secs.low >>> 0, object.secs.high >>> 0).toNumber();
        if (object.nanos != null)
            if ($util.Long)
                (message.nanos = $util.Long.fromValue(object.nanos)).unsigned = false;
            else if (typeof object.nanos === "string")
                message.nanos = parseInt(object.nanos, 10);
            else if (typeof object.nanos === "number")
                message.nanos = object.nanos;
            else if (typeof object.nanos === "object")
                message.nanos = new $util.LongBits(object.nanos.low >>> 0, object.nanos.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Timestamp
     * @static
     * @param {Timestamp} message Timestamp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Timestamp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.secs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.secs = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.nanos = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nanos = options.longs === String ? "0" : 0;
        }
        if (message.secs != null && message.hasOwnProperty("secs"))
            if (typeof message.secs === "number")
                object.secs = options.longs === String ? String(message.secs) : message.secs;
            else
                object.secs = options.longs === String ? $util.Long.prototype.toString.call(message.secs) : options.longs === Number ? new $util.LongBits(message.secs.low >>> 0, message.secs.high >>> 0).toNumber() : message.secs;
        if (message.nanos != null && message.hasOwnProperty("nanos"))
            if (typeof message.nanos === "number")
                object.nanos = options.longs === String ? String(message.nanos) : message.nanos;
            else
                object.nanos = options.longs === String ? $util.Long.prototype.toString.call(message.nanos) : options.longs === Number ? new $util.LongBits(message.nanos.low >>> 0, message.nanos.high >>> 0).toNumber() : message.nanos;
        return object;
    };

    /**
     * Converts this Timestamp to JSON.
     * @function toJSON
     * @memberof Timestamp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Timestamp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Timestamp;
})();

$root.Consensus = (function() {

    /**
     * Properties of a Consensus.
     * @exports IConsensus
     * @interface IConsensus
     * @property {number|Long|null} [height] Consensus height
     * @property {number|Long|null} [app] Consensus app
     */

    /**
     * Constructs a new Consensus.
     * @exports Consensus
     * @classdesc Represents a Consensus.
     * @implements IConsensus
     * @constructor
     * @param {IConsensus=} [properties] Properties to set
     */
    function Consensus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Consensus height.
     * @member {number|Long} height
     * @memberof Consensus
     * @instance
     */
    Consensus.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Consensus app.
     * @member {number|Long} app
     * @memberof Consensus
     * @instance
     */
    Consensus.prototype.app = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new Consensus instance using the specified properties.
     * @function create
     * @memberof Consensus
     * @static
     * @param {IConsensus=} [properties] Properties to set
     * @returns {Consensus} Consensus instance
     */
    Consensus.create = function create(properties) {
        return new Consensus(properties);
    };

    /**
     * Encodes the specified Consensus message. Does not implicitly {@link Consensus.verify|verify} messages.
     * @function encode
     * @memberof Consensus
     * @static
     * @param {IConsensus} message Consensus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Consensus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.height);
        if (message.app != null && message.hasOwnProperty("app"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.app);
        return writer;
    };

    /**
     * Encodes the specified Consensus message, length delimited. Does not implicitly {@link Consensus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Consensus
     * @static
     * @param {IConsensus} message Consensus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Consensus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Consensus message from the specified reader or buffer.
     * @function decode
     * @memberof Consensus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Consensus} Consensus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Consensus.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Consensus();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.uint64();
                break;
            case 2:
                message.app = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Consensus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Consensus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Consensus} Consensus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Consensus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Consensus message.
     * @function verify
     * @memberof Consensus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Consensus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.app != null && message.hasOwnProperty("app"))
            if (!$util.isInteger(message.app) && !(message.app && $util.isInteger(message.app.low) && $util.isInteger(message.app.high)))
                return "app: integer|Long expected";
        return null;
    };

    /**
     * Creates a Consensus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Consensus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Consensus} Consensus
     */
    Consensus.fromObject = function fromObject(object) {
        if (object instanceof $root.Consensus)
            return object;
        var message = new $root.Consensus();
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = true;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
        if (object.app != null)
            if ($util.Long)
                (message.app = $util.Long.fromValue(object.app)).unsigned = true;
            else if (typeof object.app === "string")
                message.app = parseInt(object.app, 10);
            else if (typeof object.app === "number")
                message.app = object.app;
            else if (typeof object.app === "object")
                message.app = new $util.LongBits(object.app.low >>> 0, object.app.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a Consensus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Consensus
     * @static
     * @param {Consensus} message Consensus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Consensus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.app = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.app = options.longs === String ? "0" : 0;
        }
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
        if (message.app != null && message.hasOwnProperty("app"))
            if (typeof message.app === "number")
                object.app = options.longs === String ? String(message.app) : message.app;
            else
                object.app = options.longs === String ? $util.Long.prototype.toString.call(message.app) : options.longs === Number ? new $util.LongBits(message.app.low >>> 0, message.app.high >>> 0).toNumber(true) : message.app;
        return object;
    };

    /**
     * Converts this Consensus to JSON.
     * @function toJSON
     * @memberof Consensus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Consensus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Consensus;
})();

$root.TmHeader = (function() {

    /**
     * Properties of a TmHeader.
     * @exports ITmHeader
     * @interface ITmHeader
     * @property {IConsensus|null} [version] TmHeader version
     * @property {string|null} [chainId] TmHeader chainId
     * @property {number|Long|null} [height] TmHeader height
     * @property {ITimestamp|null} [time] TmHeader time
     * @property {IBlockID|null} [lastBlockId] TmHeader lastBlockId
     * @property {Uint8Array|null} [lastCommitHash] TmHeader lastCommitHash
     * @property {Uint8Array|null} [dataHash] TmHeader dataHash
     * @property {Uint8Array|null} [validatorsHash] TmHeader validatorsHash
     * @property {Uint8Array|null} [nextValidatorsHash] TmHeader nextValidatorsHash
     * @property {Uint8Array|null} [consensusHash] TmHeader consensusHash
     * @property {Uint8Array|null} [appHash] TmHeader appHash
     * @property {Uint8Array|null} [lastResultsHash] TmHeader lastResultsHash
     * @property {Uint8Array|null} [evidenceHash] TmHeader evidenceHash
     * @property {Uint8Array|null} [proposerAddress] TmHeader proposerAddress
     */

    /**
     * Constructs a new TmHeader.
     * @exports TmHeader
     * @classdesc Represents a TmHeader.
     * @implements ITmHeader
     * @constructor
     * @param {ITmHeader=} [properties] Properties to set
     */
    function TmHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TmHeader version.
     * @member {IConsensus|null|undefined} version
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.version = null;

    /**
     * TmHeader chainId.
     * @member {string} chainId
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.chainId = "";

    /**
     * TmHeader height.
     * @member {number|Long} height
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.height = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * TmHeader time.
     * @member {ITimestamp|null|undefined} time
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.time = null;

    /**
     * TmHeader lastBlockId.
     * @member {IBlockID|null|undefined} lastBlockId
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.lastBlockId = null;

    /**
     * TmHeader lastCommitHash.
     * @member {Uint8Array} lastCommitHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.lastCommitHash = $util.newBuffer([]);

    /**
     * TmHeader dataHash.
     * @member {Uint8Array} dataHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.dataHash = $util.newBuffer([]);

    /**
     * TmHeader validatorsHash.
     * @member {Uint8Array} validatorsHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.validatorsHash = $util.newBuffer([]);

    /**
     * TmHeader nextValidatorsHash.
     * @member {Uint8Array} nextValidatorsHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.nextValidatorsHash = $util.newBuffer([]);

    /**
     * TmHeader consensusHash.
     * @member {Uint8Array} consensusHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.consensusHash = $util.newBuffer([]);

    /**
     * TmHeader appHash.
     * @member {Uint8Array} appHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.appHash = $util.newBuffer([]);

    /**
     * TmHeader lastResultsHash.
     * @member {Uint8Array} lastResultsHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.lastResultsHash = $util.newBuffer([]);

    /**
     * TmHeader evidenceHash.
     * @member {Uint8Array} evidenceHash
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.evidenceHash = $util.newBuffer([]);

    /**
     * TmHeader proposerAddress.
     * @member {Uint8Array} proposerAddress
     * @memberof TmHeader
     * @instance
     */
    TmHeader.prototype.proposerAddress = $util.newBuffer([]);

    /**
     * Creates a new TmHeader instance using the specified properties.
     * @function create
     * @memberof TmHeader
     * @static
     * @param {ITmHeader=} [properties] Properties to set
     * @returns {TmHeader} TmHeader instance
     */
    TmHeader.create = function create(properties) {
        return new TmHeader(properties);
    };

    /**
     * Encodes the specified TmHeader message. Does not implicitly {@link TmHeader.verify|verify} messages.
     * @function encode
     * @memberof TmHeader
     * @static
     * @param {ITmHeader} message TmHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TmHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.version != null && message.hasOwnProperty("version"))
            $root.Consensus.encode(message.version, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainId);
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.height);
        if (message.time != null && message.hasOwnProperty("time"))
            $root.Timestamp.encode(message.time, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.lastBlockId != null && message.hasOwnProperty("lastBlockId"))
            $root.BlockID.encode(message.lastBlockId, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.lastCommitHash != null && message.hasOwnProperty("lastCommitHash"))
            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.lastCommitHash);
        if (message.dataHash != null && message.hasOwnProperty("dataHash"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.dataHash);
        if (message.validatorsHash != null && message.hasOwnProperty("validatorsHash"))
            writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.validatorsHash);
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.nextValidatorsHash);
        if (message.consensusHash != null && message.hasOwnProperty("consensusHash"))
            writer.uint32(/* id 10, wireType 2 =*/82).bytes(message.consensusHash);
        if (message.appHash != null && message.hasOwnProperty("appHash"))
            writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.appHash);
        if (message.lastResultsHash != null && message.hasOwnProperty("lastResultsHash"))
            writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.lastResultsHash);
        if (message.evidenceHash != null && message.hasOwnProperty("evidenceHash"))
            writer.uint32(/* id 13, wireType 2 =*/106).bytes(message.evidenceHash);
        if (message.proposerAddress != null && message.hasOwnProperty("proposerAddress"))
            writer.uint32(/* id 14, wireType 2 =*/114).bytes(message.proposerAddress);
        return writer;
    };

    /**
     * Encodes the specified TmHeader message, length delimited. Does not implicitly {@link TmHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TmHeader
     * @static
     * @param {ITmHeader} message TmHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TmHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TmHeader message from the specified reader or buffer.
     * @function decode
     * @memberof TmHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TmHeader} TmHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TmHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TmHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.version = $root.Consensus.decode(reader, reader.uint32());
                break;
            case 2:
                message.chainId = reader.string();
                break;
            case 3:
                message.height = reader.int64();
                break;
            case 4:
                message.time = $root.Timestamp.decode(reader, reader.uint32());
                break;
            case 5:
                message.lastBlockId = $root.BlockID.decode(reader, reader.uint32());
                break;
            case 6:
                message.lastCommitHash = reader.bytes();
                break;
            case 7:
                message.dataHash = reader.bytes();
                break;
            case 8:
                message.validatorsHash = reader.bytes();
                break;
            case 9:
                message.nextValidatorsHash = reader.bytes();
                break;
            case 10:
                message.consensusHash = reader.bytes();
                break;
            case 11:
                message.appHash = reader.bytes();
                break;
            case 12:
                message.lastResultsHash = reader.bytes();
                break;
            case 13:
                message.evidenceHash = reader.bytes();
                break;
            case 14:
                message.proposerAddress = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TmHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TmHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TmHeader} TmHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TmHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TmHeader message.
     * @function verify
     * @memberof TmHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TmHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.version != null && message.hasOwnProperty("version")) {
            var error = $root.Consensus.verify(message.version);
            if (error)
                return "version." + error;
        }
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            if (!$util.isString(message.chainId))
                return "chainId: string expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.time != null && message.hasOwnProperty("time")) {
            var error = $root.Timestamp.verify(message.time);
            if (error)
                return "time." + error;
        }
        if (message.lastBlockId != null && message.hasOwnProperty("lastBlockId")) {
            var error = $root.BlockID.verify(message.lastBlockId);
            if (error)
                return "lastBlockId." + error;
        }
        if (message.lastCommitHash != null && message.hasOwnProperty("lastCommitHash"))
            if (!(message.lastCommitHash && typeof message.lastCommitHash.length === "number" || $util.isString(message.lastCommitHash)))
                return "lastCommitHash: buffer expected";
        if (message.dataHash != null && message.hasOwnProperty("dataHash"))
            if (!(message.dataHash && typeof message.dataHash.length === "number" || $util.isString(message.dataHash)))
                return "dataHash: buffer expected";
        if (message.validatorsHash != null && message.hasOwnProperty("validatorsHash"))
            if (!(message.validatorsHash && typeof message.validatorsHash.length === "number" || $util.isString(message.validatorsHash)))
                return "validatorsHash: buffer expected";
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            if (!(message.nextValidatorsHash && typeof message.nextValidatorsHash.length === "number" || $util.isString(message.nextValidatorsHash)))
                return "nextValidatorsHash: buffer expected";
        if (message.consensusHash != null && message.hasOwnProperty("consensusHash"))
            if (!(message.consensusHash && typeof message.consensusHash.length === "number" || $util.isString(message.consensusHash)))
                return "consensusHash: buffer expected";
        if (message.appHash != null && message.hasOwnProperty("appHash"))
            if (!(message.appHash && typeof message.appHash.length === "number" || $util.isString(message.appHash)))
                return "appHash: buffer expected";
        if (message.lastResultsHash != null && message.hasOwnProperty("lastResultsHash"))
            if (!(message.lastResultsHash && typeof message.lastResultsHash.length === "number" || $util.isString(message.lastResultsHash)))
                return "lastResultsHash: buffer expected";
        if (message.evidenceHash != null && message.hasOwnProperty("evidenceHash"))
            if (!(message.evidenceHash && typeof message.evidenceHash.length === "number" || $util.isString(message.evidenceHash)))
                return "evidenceHash: buffer expected";
        if (message.proposerAddress != null && message.hasOwnProperty("proposerAddress"))
            if (!(message.proposerAddress && typeof message.proposerAddress.length === "number" || $util.isString(message.proposerAddress)))
                return "proposerAddress: buffer expected";
        return null;
    };

    /**
     * Creates a TmHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TmHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TmHeader} TmHeader
     */
    TmHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.TmHeader)
            return object;
        var message = new $root.TmHeader();
        if (object.version != null) {
            if (typeof object.version !== "object")
                throw TypeError(".TmHeader.version: object expected");
            message.version = $root.Consensus.fromObject(object.version);
        }
        if (object.chainId != null)
            message.chainId = String(object.chainId);
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = false;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber();
        if (object.time != null) {
            if (typeof object.time !== "object")
                throw TypeError(".TmHeader.time: object expected");
            message.time = $root.Timestamp.fromObject(object.time);
        }
        if (object.lastBlockId != null) {
            if (typeof object.lastBlockId !== "object")
                throw TypeError(".TmHeader.lastBlockId: object expected");
            message.lastBlockId = $root.BlockID.fromObject(object.lastBlockId);
        }
        if (object.lastCommitHash != null)
            if (typeof object.lastCommitHash === "string")
                $util.base64.decode(object.lastCommitHash, message.lastCommitHash = $util.newBuffer($util.base64.length(object.lastCommitHash)), 0);
            else if (object.lastCommitHash.length)
                message.lastCommitHash = object.lastCommitHash;
        if (object.dataHash != null)
            if (typeof object.dataHash === "string")
                $util.base64.decode(object.dataHash, message.dataHash = $util.newBuffer($util.base64.length(object.dataHash)), 0);
            else if (object.dataHash.length)
                message.dataHash = object.dataHash;
        if (object.validatorsHash != null)
            if (typeof object.validatorsHash === "string")
                $util.base64.decode(object.validatorsHash, message.validatorsHash = $util.newBuffer($util.base64.length(object.validatorsHash)), 0);
            else if (object.validatorsHash.length)
                message.validatorsHash = object.validatorsHash;
        if (object.nextValidatorsHash != null)
            if (typeof object.nextValidatorsHash === "string")
                $util.base64.decode(object.nextValidatorsHash, message.nextValidatorsHash = $util.newBuffer($util.base64.length(object.nextValidatorsHash)), 0);
            else if (object.nextValidatorsHash.length)
                message.nextValidatorsHash = object.nextValidatorsHash;
        if (object.consensusHash != null)
            if (typeof object.consensusHash === "string")
                $util.base64.decode(object.consensusHash, message.consensusHash = $util.newBuffer($util.base64.length(object.consensusHash)), 0);
            else if (object.consensusHash.length)
                message.consensusHash = object.consensusHash;
        if (object.appHash != null)
            if (typeof object.appHash === "string")
                $util.base64.decode(object.appHash, message.appHash = $util.newBuffer($util.base64.length(object.appHash)), 0);
            else if (object.appHash.length)
                message.appHash = object.appHash;
        if (object.lastResultsHash != null)
            if (typeof object.lastResultsHash === "string")
                $util.base64.decode(object.lastResultsHash, message.lastResultsHash = $util.newBuffer($util.base64.length(object.lastResultsHash)), 0);
            else if (object.lastResultsHash.length)
                message.lastResultsHash = object.lastResultsHash;
        if (object.evidenceHash != null)
            if (typeof object.evidenceHash === "string")
                $util.base64.decode(object.evidenceHash, message.evidenceHash = $util.newBuffer($util.base64.length(object.evidenceHash)), 0);
            else if (object.evidenceHash.length)
                message.evidenceHash = object.evidenceHash;
        if (object.proposerAddress != null)
            if (typeof object.proposerAddress === "string")
                $util.base64.decode(object.proposerAddress, message.proposerAddress = $util.newBuffer($util.base64.length(object.proposerAddress)), 0);
            else if (object.proposerAddress.length)
                message.proposerAddress = object.proposerAddress;
        return message;
    };

    /**
     * Creates a plain object from a TmHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TmHeader
     * @static
     * @param {TmHeader} message TmHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TmHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.version = null;
            object.chainId = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            object.time = null;
            object.lastBlockId = null;
            if (options.bytes === String)
                object.lastCommitHash = "";
            else {
                object.lastCommitHash = [];
                if (options.bytes !== Array)
                    object.lastCommitHash = $util.newBuffer(object.lastCommitHash);
            }
            if (options.bytes === String)
                object.dataHash = "";
            else {
                object.dataHash = [];
                if (options.bytes !== Array)
                    object.dataHash = $util.newBuffer(object.dataHash);
            }
            if (options.bytes === String)
                object.validatorsHash = "";
            else {
                object.validatorsHash = [];
                if (options.bytes !== Array)
                    object.validatorsHash = $util.newBuffer(object.validatorsHash);
            }
            if (options.bytes === String)
                object.nextValidatorsHash = "";
            else {
                object.nextValidatorsHash = [];
                if (options.bytes !== Array)
                    object.nextValidatorsHash = $util.newBuffer(object.nextValidatorsHash);
            }
            if (options.bytes === String)
                object.consensusHash = "";
            else {
                object.consensusHash = [];
                if (options.bytes !== Array)
                    object.consensusHash = $util.newBuffer(object.consensusHash);
            }
            if (options.bytes === String)
                object.appHash = "";
            else {
                object.appHash = [];
                if (options.bytes !== Array)
                    object.appHash = $util.newBuffer(object.appHash);
            }
            if (options.bytes === String)
                object.lastResultsHash = "";
            else {
                object.lastResultsHash = [];
                if (options.bytes !== Array)
                    object.lastResultsHash = $util.newBuffer(object.lastResultsHash);
            }
            if (options.bytes === String)
                object.evidenceHash = "";
            else {
                object.evidenceHash = [];
                if (options.bytes !== Array)
                    object.evidenceHash = $util.newBuffer(object.evidenceHash);
            }
            if (options.bytes === String)
                object.proposerAddress = "";
            else {
                object.proposerAddress = [];
                if (options.bytes !== Array)
                    object.proposerAddress = $util.newBuffer(object.proposerAddress);
            }
        }
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = $root.Consensus.toObject(message.version, options);
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            object.chainId = message.chainId;
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber() : message.height;
        if (message.time != null && message.hasOwnProperty("time"))
            object.time = $root.Timestamp.toObject(message.time, options);
        if (message.lastBlockId != null && message.hasOwnProperty("lastBlockId"))
            object.lastBlockId = $root.BlockID.toObject(message.lastBlockId, options);
        if (message.lastCommitHash != null && message.hasOwnProperty("lastCommitHash"))
            object.lastCommitHash = options.bytes === String ? $util.base64.encode(message.lastCommitHash, 0, message.lastCommitHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.lastCommitHash) : message.lastCommitHash;
        if (message.dataHash != null && message.hasOwnProperty("dataHash"))
            object.dataHash = options.bytes === String ? $util.base64.encode(message.dataHash, 0, message.dataHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.dataHash) : message.dataHash;
        if (message.validatorsHash != null && message.hasOwnProperty("validatorsHash"))
            object.validatorsHash = options.bytes === String ? $util.base64.encode(message.validatorsHash, 0, message.validatorsHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.validatorsHash) : message.validatorsHash;
        if (message.nextValidatorsHash != null && message.hasOwnProperty("nextValidatorsHash"))
            object.nextValidatorsHash = options.bytes === String ? $util.base64.encode(message.nextValidatorsHash, 0, message.nextValidatorsHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.nextValidatorsHash) : message.nextValidatorsHash;
        if (message.consensusHash != null && message.hasOwnProperty("consensusHash"))
            object.consensusHash = options.bytes === String ? $util.base64.encode(message.consensusHash, 0, message.consensusHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.consensusHash) : message.consensusHash;
        if (message.appHash != null && message.hasOwnProperty("appHash"))
            object.appHash = options.bytes === String ? $util.base64.encode(message.appHash, 0, message.appHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.appHash) : message.appHash;
        if (message.lastResultsHash != null && message.hasOwnProperty("lastResultsHash"))
            object.lastResultsHash = options.bytes === String ? $util.base64.encode(message.lastResultsHash, 0, message.lastResultsHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.lastResultsHash) : message.lastResultsHash;
        if (message.evidenceHash != null && message.hasOwnProperty("evidenceHash"))
            object.evidenceHash = options.bytes === String ? $util.base64.encode(message.evidenceHash, 0, message.evidenceHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.evidenceHash) : message.evidenceHash;
        if (message.proposerAddress != null && message.hasOwnProperty("proposerAddress"))
            object.proposerAddress = options.bytes === String ? $util.base64.encode(message.proposerAddress, 0, message.proposerAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.proposerAddress) : message.proposerAddress;
        return object;
    };

    /**
     * Converts this TmHeader to JSON.
     * @function toJSON
     * @memberof TmHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TmHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TmHeader;
})();

$root.Vote = (function() {

    /**
     * Properties of a Vote.
     * @exports IVote
     * @interface IVote
     * @property {SignedMsgType|null} [typ] Vote typ
     * @property {number|Long|null} [height] Vote height
     * @property {number|Long|null} [round] Vote round
     * @property {IBlockID|null} [blockId] Vote blockId
     * @property {ITimestamp|null} [timestamp] Vote timestamp
     * @property {Uint8Array|null} [validatorAddress] Vote validatorAddress
     * @property {number|Long|null} [validatorIndex] Vote validatorIndex
     * @property {Uint8Array|null} [signature] Vote signature
     */

    /**
     * Constructs a new Vote.
     * @exports Vote
     * @classdesc Represents a Vote.
     * @implements IVote
     * @constructor
     * @param {IVote=} [properties] Properties to set
     */
    function Vote(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Vote typ.
     * @member {SignedMsgType} typ
     * @memberof Vote
     * @instance
     */
    Vote.prototype.typ = 0;

    /**
     * Vote height.
     * @member {number|Long} height
     * @memberof Vote
     * @instance
     */
    Vote.prototype.height = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Vote round.
     * @member {number|Long} round
     * @memberof Vote
     * @instance
     */
    Vote.prototype.round = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Vote blockId.
     * @member {IBlockID|null|undefined} blockId
     * @memberof Vote
     * @instance
     */
    Vote.prototype.blockId = null;

    /**
     * Vote timestamp.
     * @member {ITimestamp|null|undefined} timestamp
     * @memberof Vote
     * @instance
     */
    Vote.prototype.timestamp = null;

    /**
     * Vote validatorAddress.
     * @member {Uint8Array} validatorAddress
     * @memberof Vote
     * @instance
     */
    Vote.prototype.validatorAddress = $util.newBuffer([]);

    /**
     * Vote validatorIndex.
     * @member {number|Long} validatorIndex
     * @memberof Vote
     * @instance
     */
    Vote.prototype.validatorIndex = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Vote signature.
     * @member {Uint8Array} signature
     * @memberof Vote
     * @instance
     */
    Vote.prototype.signature = $util.newBuffer([]);

    /**
     * Creates a new Vote instance using the specified properties.
     * @function create
     * @memberof Vote
     * @static
     * @param {IVote=} [properties] Properties to set
     * @returns {Vote} Vote instance
     */
    Vote.create = function create(properties) {
        return new Vote(properties);
    };

    /**
     * Encodes the specified Vote message. Does not implicitly {@link Vote.verify|verify} messages.
     * @function encode
     * @memberof Vote
     * @static
     * @param {IVote} message Vote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Vote.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.typ != null && message.hasOwnProperty("typ"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.typ);
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.height);
        if (message.round != null && message.hasOwnProperty("round"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.round);
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            $root.BlockID.encode(message.blockId, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            $root.Timestamp.encode(message.timestamp, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.validatorAddress);
        if (message.validatorIndex != null && message.hasOwnProperty("validatorIndex"))
            writer.uint32(/* id 7, wireType 0 =*/56).int64(message.validatorIndex);
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.signature);
        return writer;
    };

    /**
     * Encodes the specified Vote message, length delimited. Does not implicitly {@link Vote.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Vote
     * @static
     * @param {IVote} message Vote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Vote.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Vote message from the specified reader or buffer.
     * @function decode
     * @memberof Vote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Vote} Vote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Vote.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Vote();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.typ = reader.int32();
                break;
            case 2:
                message.height = reader.int64();
                break;
            case 3:
                message.round = reader.int64();
                break;
            case 4:
                message.blockId = $root.BlockID.decode(reader, reader.uint32());
                break;
            case 5:
                message.timestamp = $root.Timestamp.decode(reader, reader.uint32());
                break;
            case 6:
                message.validatorAddress = reader.bytes();
                break;
            case 7:
                message.validatorIndex = reader.int64();
                break;
            case 8:
                message.signature = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Vote message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Vote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Vote} Vote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Vote.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Vote message.
     * @function verify
     * @memberof Vote
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Vote.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.typ != null && message.hasOwnProperty("typ"))
            switch (message.typ) {
            default:
                return "typ: enum value expected";
            case 0:
            case 1:
            case 2:
            case 32:
                break;
            }
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.round != null && message.hasOwnProperty("round"))
            if (!$util.isInteger(message.round) && !(message.round && $util.isInteger(message.round.low) && $util.isInteger(message.round.high)))
                return "round: integer|Long expected";
        if (message.blockId != null && message.hasOwnProperty("blockId")) {
            var error = $root.BlockID.verify(message.blockId);
            if (error)
                return "blockId." + error;
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            var error = $root.Timestamp.verify(message.timestamp);
            if (error)
                return "timestamp." + error;
        }
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            if (!(message.validatorAddress && typeof message.validatorAddress.length === "number" || $util.isString(message.validatorAddress)))
                return "validatorAddress: buffer expected";
        if (message.validatorIndex != null && message.hasOwnProperty("validatorIndex"))
            if (!$util.isInteger(message.validatorIndex) && !(message.validatorIndex && $util.isInteger(message.validatorIndex.low) && $util.isInteger(message.validatorIndex.high)))
                return "validatorIndex: integer|Long expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                return "signature: buffer expected";
        return null;
    };

    /**
     * Creates a Vote message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Vote
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Vote} Vote
     */
    Vote.fromObject = function fromObject(object) {
        if (object instanceof $root.Vote)
            return object;
        var message = new $root.Vote();
        switch (object.typ) {
        case "SIGNED_MSG_TYPE_UNKNOWN":
        case 0:
            message.typ = 0;
            break;
        case "SIGNED_MSG_TYPE_PREVOTE":
        case 1:
            message.typ = 1;
            break;
        case "SIGNED_MSG_TYPE_PRECOMMIT":
        case 2:
            message.typ = 2;
            break;
        case "SIGNED_MSG_TYPE_PROPOSAL":
        case 32:
            message.typ = 32;
            break;
        }
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = false;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber();
        if (object.round != null)
            if ($util.Long)
                (message.round = $util.Long.fromValue(object.round)).unsigned = false;
            else if (typeof object.round === "string")
                message.round = parseInt(object.round, 10);
            else if (typeof object.round === "number")
                message.round = object.round;
            else if (typeof object.round === "object")
                message.round = new $util.LongBits(object.round.low >>> 0, object.round.high >>> 0).toNumber();
        if (object.blockId != null) {
            if (typeof object.blockId !== "object")
                throw TypeError(".Vote.blockId: object expected");
            message.blockId = $root.BlockID.fromObject(object.blockId);
        }
        if (object.timestamp != null) {
            if (typeof object.timestamp !== "object")
                throw TypeError(".Vote.timestamp: object expected");
            message.timestamp = $root.Timestamp.fromObject(object.timestamp);
        }
        if (object.validatorAddress != null)
            if (typeof object.validatorAddress === "string")
                $util.base64.decode(object.validatorAddress, message.validatorAddress = $util.newBuffer($util.base64.length(object.validatorAddress)), 0);
            else if (object.validatorAddress.length)
                message.validatorAddress = object.validatorAddress;
        if (object.validatorIndex != null)
            if ($util.Long)
                (message.validatorIndex = $util.Long.fromValue(object.validatorIndex)).unsigned = false;
            else if (typeof object.validatorIndex === "string")
                message.validatorIndex = parseInt(object.validatorIndex, 10);
            else if (typeof object.validatorIndex === "number")
                message.validatorIndex = object.validatorIndex;
            else if (typeof object.validatorIndex === "object")
                message.validatorIndex = new $util.LongBits(object.validatorIndex.low >>> 0, object.validatorIndex.high >>> 0).toNumber();
        if (object.signature != null)
            if (typeof object.signature === "string")
                $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
            else if (object.signature.length)
                message.signature = object.signature;
        return message;
    };

    /**
     * Creates a plain object from a Vote message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Vote
     * @static
     * @param {Vote} message Vote
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Vote.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.typ = options.enums === String ? "SIGNED_MSG_TYPE_UNKNOWN" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.round = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.round = options.longs === String ? "0" : 0;
            object.blockId = null;
            object.timestamp = null;
            if (options.bytes === String)
                object.validatorAddress = "";
            else {
                object.validatorAddress = [];
                if (options.bytes !== Array)
                    object.validatorAddress = $util.newBuffer(object.validatorAddress);
            }
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.validatorIndex = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.validatorIndex = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.signature = "";
            else {
                object.signature = [];
                if (options.bytes !== Array)
                    object.signature = $util.newBuffer(object.signature);
            }
        }
        if (message.typ != null && message.hasOwnProperty("typ"))
            object.typ = options.enums === String ? $root.SignedMsgType[message.typ] : message.typ;
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber() : message.height;
        if (message.round != null && message.hasOwnProperty("round"))
            if (typeof message.round === "number")
                object.round = options.longs === String ? String(message.round) : message.round;
            else
                object.round = options.longs === String ? $util.Long.prototype.toString.call(message.round) : options.longs === Number ? new $util.LongBits(message.round.low >>> 0, message.round.high >>> 0).toNumber() : message.round;
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            object.blockId = $root.BlockID.toObject(message.blockId, options);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = $root.Timestamp.toObject(message.timestamp, options);
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            object.validatorAddress = options.bytes === String ? $util.base64.encode(message.validatorAddress, 0, message.validatorAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.validatorAddress) : message.validatorAddress;
        if (message.validatorIndex != null && message.hasOwnProperty("validatorIndex"))
            if (typeof message.validatorIndex === "number")
                object.validatorIndex = options.longs === String ? String(message.validatorIndex) : message.validatorIndex;
            else
                object.validatorIndex = options.longs === String ? $util.Long.prototype.toString.call(message.validatorIndex) : options.longs === Number ? new $util.LongBits(message.validatorIndex.low >>> 0, message.validatorIndex.high >>> 0).toNumber() : message.validatorIndex;
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
        return object;
    };

    /**
     * Converts this Vote to JSON.
     * @function toJSON
     * @memberof Vote
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Vote.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Vote;
})();

$root.Commit = (function() {

    /**
     * Properties of a Commit.
     * @exports ICommit
     * @interface ICommit
     * @property {number|Long|null} [height] Commit height
     * @property {number|Long|null} [round] Commit round
     * @property {IBlockID|null} [blockId] Commit blockId
     * @property {Array.<ICommitSig>|null} [signatures] Commit signatures
     */

    /**
     * Constructs a new Commit.
     * @exports Commit
     * @classdesc Represents a Commit.
     * @implements ICommit
     * @constructor
     * @param {ICommit=} [properties] Properties to set
     */
    function Commit(properties) {
        this.signatures = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Commit height.
     * @member {number|Long} height
     * @memberof Commit
     * @instance
     */
    Commit.prototype.height = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Commit round.
     * @member {number|Long} round
     * @memberof Commit
     * @instance
     */
    Commit.prototype.round = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Commit blockId.
     * @member {IBlockID|null|undefined} blockId
     * @memberof Commit
     * @instance
     */
    Commit.prototype.blockId = null;

    /**
     * Commit signatures.
     * @member {Array.<ICommitSig>} signatures
     * @memberof Commit
     * @instance
     */
    Commit.prototype.signatures = $util.emptyArray;

    /**
     * Creates a new Commit instance using the specified properties.
     * @function create
     * @memberof Commit
     * @static
     * @param {ICommit=} [properties] Properties to set
     * @returns {Commit} Commit instance
     */
    Commit.create = function create(properties) {
        return new Commit(properties);
    };

    /**
     * Encodes the specified Commit message. Does not implicitly {@link Commit.verify|verify} messages.
     * @function encode
     * @memberof Commit
     * @static
     * @param {ICommit} message Commit message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Commit.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.height);
        if (message.round != null && message.hasOwnProperty("round"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.round);
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            $root.BlockID.encode(message.blockId, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.signatures != null && message.signatures.length)
            for (var i = 0; i < message.signatures.length; ++i)
                $root.CommitSig.encode(message.signatures[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Commit message, length delimited. Does not implicitly {@link Commit.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Commit
     * @static
     * @param {ICommit} message Commit message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Commit.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Commit message from the specified reader or buffer.
     * @function decode
     * @memberof Commit
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Commit} Commit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Commit.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Commit();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.height = reader.int64();
                break;
            case 2:
                message.round = reader.int64();
                break;
            case 3:
                message.blockId = $root.BlockID.decode(reader, reader.uint32());
                break;
            case 4:
                if (!(message.signatures && message.signatures.length))
                    message.signatures = [];
                message.signatures.push($root.CommitSig.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Commit message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Commit
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Commit} Commit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Commit.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Commit message.
     * @function verify
     * @memberof Commit
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Commit.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.round != null && message.hasOwnProperty("round"))
            if (!$util.isInteger(message.round) && !(message.round && $util.isInteger(message.round.low) && $util.isInteger(message.round.high)))
                return "round: integer|Long expected";
        if (message.blockId != null && message.hasOwnProperty("blockId")) {
            var error = $root.BlockID.verify(message.blockId);
            if (error)
                return "blockId." + error;
        }
        if (message.signatures != null && message.hasOwnProperty("signatures")) {
            if (!Array.isArray(message.signatures))
                return "signatures: array expected";
            for (var i = 0; i < message.signatures.length; ++i) {
                var error = $root.CommitSig.verify(message.signatures[i]);
                if (error)
                    return "signatures." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Commit message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Commit
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Commit} Commit
     */
    Commit.fromObject = function fromObject(object) {
        if (object instanceof $root.Commit)
            return object;
        var message = new $root.Commit();
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = false;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber();
        if (object.round != null)
            if ($util.Long)
                (message.round = $util.Long.fromValue(object.round)).unsigned = false;
            else if (typeof object.round === "string")
                message.round = parseInt(object.round, 10);
            else if (typeof object.round === "number")
                message.round = object.round;
            else if (typeof object.round === "object")
                message.round = new $util.LongBits(object.round.low >>> 0, object.round.high >>> 0).toNumber();
        if (object.blockId != null) {
            if (typeof object.blockId !== "object")
                throw TypeError(".Commit.blockId: object expected");
            message.blockId = $root.BlockID.fromObject(object.blockId);
        }
        if (object.signatures) {
            if (!Array.isArray(object.signatures))
                throw TypeError(".Commit.signatures: array expected");
            message.signatures = [];
            for (var i = 0; i < object.signatures.length; ++i) {
                if (typeof object.signatures[i] !== "object")
                    throw TypeError(".Commit.signatures: object expected");
                message.signatures[i] = $root.CommitSig.fromObject(object.signatures[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Commit message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Commit
     * @static
     * @param {Commit} message Commit
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Commit.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.signatures = [];
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.round = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.round = options.longs === String ? "0" : 0;
            object.blockId = null;
        }
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber() : message.height;
        if (message.round != null && message.hasOwnProperty("round"))
            if (typeof message.round === "number")
                object.round = options.longs === String ? String(message.round) : message.round;
            else
                object.round = options.longs === String ? $util.Long.prototype.toString.call(message.round) : options.longs === Number ? new $util.LongBits(message.round.low >>> 0, message.round.high >>> 0).toNumber() : message.round;
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            object.blockId = $root.BlockID.toObject(message.blockId, options);
        if (message.signatures && message.signatures.length) {
            object.signatures = [];
            for (var j = 0; j < message.signatures.length; ++j)
                object.signatures[j] = $root.CommitSig.toObject(message.signatures[j], options);
        }
        return object;
    };

    /**
     * Converts this Commit to JSON.
     * @function toJSON
     * @memberof Commit
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Commit.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Commit;
})();

$root.CommitSig = (function() {

    /**
     * Properties of a CommitSig.
     * @exports ICommitSig
     * @interface ICommitSig
     * @property {BlockIDFlag|null} [blockIdFlag] CommitSig blockIdFlag
     * @property {Uint8Array|null} [validatorAddress] CommitSig validatorAddress
     * @property {ITimestamp|null} [timestamp] CommitSig timestamp
     * @property {Uint8Array|null} [signature] CommitSig signature
     */

    /**
     * Constructs a new CommitSig.
     * @exports CommitSig
     * @classdesc Represents a CommitSig.
     * @implements ICommitSig
     * @constructor
     * @param {ICommitSig=} [properties] Properties to set
     */
    function CommitSig(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommitSig blockIdFlag.
     * @member {BlockIDFlag} blockIdFlag
     * @memberof CommitSig
     * @instance
     */
    CommitSig.prototype.blockIdFlag = 0;

    /**
     * CommitSig validatorAddress.
     * @member {Uint8Array} validatorAddress
     * @memberof CommitSig
     * @instance
     */
    CommitSig.prototype.validatorAddress = $util.newBuffer([]);

    /**
     * CommitSig timestamp.
     * @member {ITimestamp|null|undefined} timestamp
     * @memberof CommitSig
     * @instance
     */
    CommitSig.prototype.timestamp = null;

    /**
     * CommitSig signature.
     * @member {Uint8Array} signature
     * @memberof CommitSig
     * @instance
     */
    CommitSig.prototype.signature = $util.newBuffer([]);

    /**
     * Creates a new CommitSig instance using the specified properties.
     * @function create
     * @memberof CommitSig
     * @static
     * @param {ICommitSig=} [properties] Properties to set
     * @returns {CommitSig} CommitSig instance
     */
    CommitSig.create = function create(properties) {
        return new CommitSig(properties);
    };

    /**
     * Encodes the specified CommitSig message. Does not implicitly {@link CommitSig.verify|verify} messages.
     * @function encode
     * @memberof CommitSig
     * @static
     * @param {ICommitSig} message CommitSig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommitSig.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.blockIdFlag != null && message.hasOwnProperty("blockIdFlag"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.blockIdFlag);
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.validatorAddress);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            $root.Timestamp.encode(message.timestamp, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.signature);
        return writer;
    };

    /**
     * Encodes the specified CommitSig message, length delimited. Does not implicitly {@link CommitSig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommitSig
     * @static
     * @param {ICommitSig} message CommitSig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommitSig.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommitSig message from the specified reader or buffer.
     * @function decode
     * @memberof CommitSig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommitSig} CommitSig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommitSig.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommitSig();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.blockIdFlag = reader.int32();
                break;
            case 2:
                message.validatorAddress = reader.bytes();
                break;
            case 3:
                message.timestamp = $root.Timestamp.decode(reader, reader.uint32());
                break;
            case 4:
                message.signature = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommitSig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommitSig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommitSig} CommitSig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommitSig.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommitSig message.
     * @function verify
     * @memberof CommitSig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommitSig.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.blockIdFlag != null && message.hasOwnProperty("blockIdFlag"))
            switch (message.blockIdFlag) {
            default:
                return "blockIdFlag: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            if (!(message.validatorAddress && typeof message.validatorAddress.length === "number" || $util.isString(message.validatorAddress)))
                return "validatorAddress: buffer expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            var error = $root.Timestamp.verify(message.timestamp);
            if (error)
                return "timestamp." + error;
        }
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                return "signature: buffer expected";
        return null;
    };

    /**
     * Creates a CommitSig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommitSig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommitSig} CommitSig
     */
    CommitSig.fromObject = function fromObject(object) {
        if (object instanceof $root.CommitSig)
            return object;
        var message = new $root.CommitSig();
        switch (object.blockIdFlag) {
        case "BLOCK_ID_FLAG_UNKNOWN":
        case 0:
            message.blockIdFlag = 0;
            break;
        case "BLOCK_ID_FLAG_ABSENT":
        case 1:
            message.blockIdFlag = 1;
            break;
        case "BLOCK_ID_FLAG_COMMIT":
        case 2:
            message.blockIdFlag = 2;
            break;
        case "BLOCK_ID_FLAG_NIL":
        case 3:
            message.blockIdFlag = 3;
            break;
        }
        if (object.validatorAddress != null)
            if (typeof object.validatorAddress === "string")
                $util.base64.decode(object.validatorAddress, message.validatorAddress = $util.newBuffer($util.base64.length(object.validatorAddress)), 0);
            else if (object.validatorAddress.length)
                message.validatorAddress = object.validatorAddress;
        if (object.timestamp != null) {
            if (typeof object.timestamp !== "object")
                throw TypeError(".CommitSig.timestamp: object expected");
            message.timestamp = $root.Timestamp.fromObject(object.timestamp);
        }
        if (object.signature != null)
            if (typeof object.signature === "string")
                $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
            else if (object.signature.length)
                message.signature = object.signature;
        return message;
    };

    /**
     * Creates a plain object from a CommitSig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommitSig
     * @static
     * @param {CommitSig} message CommitSig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommitSig.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.blockIdFlag = options.enums === String ? "BLOCK_ID_FLAG_UNKNOWN" : 0;
            if (options.bytes === String)
                object.validatorAddress = "";
            else {
                object.validatorAddress = [];
                if (options.bytes !== Array)
                    object.validatorAddress = $util.newBuffer(object.validatorAddress);
            }
            object.timestamp = null;
            if (options.bytes === String)
                object.signature = "";
            else {
                object.signature = [];
                if (options.bytes !== Array)
                    object.signature = $util.newBuffer(object.signature);
            }
        }
        if (message.blockIdFlag != null && message.hasOwnProperty("blockIdFlag"))
            object.blockIdFlag = options.enums === String ? $root.BlockIDFlag[message.blockIdFlag] : message.blockIdFlag;
        if (message.validatorAddress != null && message.hasOwnProperty("validatorAddress"))
            object.validatorAddress = options.bytes === String ? $util.base64.encode(message.validatorAddress, 0, message.validatorAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.validatorAddress) : message.validatorAddress;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = $root.Timestamp.toObject(message.timestamp, options);
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
        return object;
    };

    /**
     * Converts this CommitSig to JSON.
     * @function toJSON
     * @memberof CommitSig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommitSig.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommitSig;
})();

$root.SignedHeader = (function() {

    /**
     * Properties of a SignedHeader.
     * @exports ISignedHeader
     * @interface ISignedHeader
     * @property {ITmHeader|null} [header] SignedHeader header
     * @property {ICommit|null} [commit] SignedHeader commit
     */

    /**
     * Constructs a new SignedHeader.
     * @exports SignedHeader
     * @classdesc Represents a SignedHeader.
     * @implements ISignedHeader
     * @constructor
     * @param {ISignedHeader=} [properties] Properties to set
     */
    function SignedHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SignedHeader header.
     * @member {ITmHeader|null|undefined} header
     * @memberof SignedHeader
     * @instance
     */
    SignedHeader.prototype.header = null;

    /**
     * SignedHeader commit.
     * @member {ICommit|null|undefined} commit
     * @memberof SignedHeader
     * @instance
     */
    SignedHeader.prototype.commit = null;

    /**
     * Creates a new SignedHeader instance using the specified properties.
     * @function create
     * @memberof SignedHeader
     * @static
     * @param {ISignedHeader=} [properties] Properties to set
     * @returns {SignedHeader} SignedHeader instance
     */
    SignedHeader.create = function create(properties) {
        return new SignedHeader(properties);
    };

    /**
     * Encodes the specified SignedHeader message. Does not implicitly {@link SignedHeader.verify|verify} messages.
     * @function encode
     * @memberof SignedHeader
     * @static
     * @param {ISignedHeader} message SignedHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.header != null && message.hasOwnProperty("header"))
            $root.TmHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.commit != null && message.hasOwnProperty("commit"))
            $root.Commit.encode(message.commit, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SignedHeader message, length delimited. Does not implicitly {@link SignedHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SignedHeader
     * @static
     * @param {ISignedHeader} message SignedHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SignedHeader message from the specified reader or buffer.
     * @function decode
     * @memberof SignedHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SignedHeader} SignedHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SignedHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.header = $root.TmHeader.decode(reader, reader.uint32());
                break;
            case 2:
                message.commit = $root.Commit.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SignedHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SignedHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SignedHeader} SignedHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SignedHeader message.
     * @function verify
     * @memberof SignedHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SignedHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            var error = $root.TmHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.commit != null && message.hasOwnProperty("commit")) {
            var error = $root.Commit.verify(message.commit);
            if (error)
                return "commit." + error;
        }
        return null;
    };

    /**
     * Creates a SignedHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SignedHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SignedHeader} SignedHeader
     */
    SignedHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.SignedHeader)
            return object;
        var message = new $root.SignedHeader();
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".SignedHeader.header: object expected");
            message.header = $root.TmHeader.fromObject(object.header);
        }
        if (object.commit != null) {
            if (typeof object.commit !== "object")
                throw TypeError(".SignedHeader.commit: object expected");
            message.commit = $root.Commit.fromObject(object.commit);
        }
        return message;
    };

    /**
     * Creates a plain object from a SignedHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SignedHeader
     * @static
     * @param {SignedHeader} message SignedHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SignedHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.header = null;
            object.commit = null;
        }
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.TmHeader.toObject(message.header, options);
        if (message.commit != null && message.hasOwnProperty("commit"))
            object.commit = $root.Commit.toObject(message.commit, options);
        return object;
    };

    /**
     * Converts this SignedHeader to JSON.
     * @function toJSON
     * @memberof SignedHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SignedHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SignedHeader;
})();

$root.CanonicalBlockID = (function() {

    /**
     * Properties of a CanonicalBlockID.
     * @exports ICanonicalBlockID
     * @interface ICanonicalBlockID
     * @property {Uint8Array|null} [hash] CanonicalBlockID hash
     * @property {ICanonicalPartSetHeader|null} [partSetHeader] CanonicalBlockID partSetHeader
     */

    /**
     * Constructs a new CanonicalBlockID.
     * @exports CanonicalBlockID
     * @classdesc Represents a CanonicalBlockID.
     * @implements ICanonicalBlockID
     * @constructor
     * @param {ICanonicalBlockID=} [properties] Properties to set
     */
    function CanonicalBlockID(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CanonicalBlockID hash.
     * @member {Uint8Array} hash
     * @memberof CanonicalBlockID
     * @instance
     */
    CanonicalBlockID.prototype.hash = $util.newBuffer([]);

    /**
     * CanonicalBlockID partSetHeader.
     * @member {ICanonicalPartSetHeader|null|undefined} partSetHeader
     * @memberof CanonicalBlockID
     * @instance
     */
    CanonicalBlockID.prototype.partSetHeader = null;

    /**
     * Creates a new CanonicalBlockID instance using the specified properties.
     * @function create
     * @memberof CanonicalBlockID
     * @static
     * @param {ICanonicalBlockID=} [properties] Properties to set
     * @returns {CanonicalBlockID} CanonicalBlockID instance
     */
    CanonicalBlockID.create = function create(properties) {
        return new CanonicalBlockID(properties);
    };

    /**
     * Encodes the specified CanonicalBlockID message. Does not implicitly {@link CanonicalBlockID.verify|verify} messages.
     * @function encode
     * @memberof CanonicalBlockID
     * @static
     * @param {ICanonicalBlockID} message CanonicalBlockID message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalBlockID.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.hash);
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader"))
            $root.CanonicalPartSetHeader.encode(message.partSetHeader, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CanonicalBlockID message, length delimited. Does not implicitly {@link CanonicalBlockID.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CanonicalBlockID
     * @static
     * @param {ICanonicalBlockID} message CanonicalBlockID message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalBlockID.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CanonicalBlockID message from the specified reader or buffer.
     * @function decode
     * @memberof CanonicalBlockID
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CanonicalBlockID} CanonicalBlockID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalBlockID.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CanonicalBlockID();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hash = reader.bytes();
                break;
            case 2:
                message.partSetHeader = $root.CanonicalPartSetHeader.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CanonicalBlockID message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CanonicalBlockID
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CanonicalBlockID} CanonicalBlockID
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalBlockID.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CanonicalBlockID message.
     * @function verify
     * @memberof CanonicalBlockID
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CanonicalBlockID.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader")) {
            var error = $root.CanonicalPartSetHeader.verify(message.partSetHeader);
            if (error)
                return "partSetHeader." + error;
        }
        return null;
    };

    /**
     * Creates a CanonicalBlockID message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CanonicalBlockID
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CanonicalBlockID} CanonicalBlockID
     */
    CanonicalBlockID.fromObject = function fromObject(object) {
        if (object instanceof $root.CanonicalBlockID)
            return object;
        var message = new $root.CanonicalBlockID();
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        if (object.partSetHeader != null) {
            if (typeof object.partSetHeader !== "object")
                throw TypeError(".CanonicalBlockID.partSetHeader: object expected");
            message.partSetHeader = $root.CanonicalPartSetHeader.fromObject(object.partSetHeader);
        }
        return message;
    };

    /**
     * Creates a plain object from a CanonicalBlockID message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CanonicalBlockID
     * @static
     * @param {CanonicalBlockID} message CanonicalBlockID
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CanonicalBlockID.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.hash = "";
            else {
                object.hash = [];
                if (options.bytes !== Array)
                    object.hash = $util.newBuffer(object.hash);
            }
            object.partSetHeader = null;
        }
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        if (message.partSetHeader != null && message.hasOwnProperty("partSetHeader"))
            object.partSetHeader = $root.CanonicalPartSetHeader.toObject(message.partSetHeader, options);
        return object;
    };

    /**
     * Converts this CanonicalBlockID to JSON.
     * @function toJSON
     * @memberof CanonicalBlockID
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CanonicalBlockID.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CanonicalBlockID;
})();

$root.CanonicalPartSetHeader = (function() {

    /**
     * Properties of a CanonicalPartSetHeader.
     * @exports ICanonicalPartSetHeader
     * @interface ICanonicalPartSetHeader
     * @property {number|Long|null} [total] CanonicalPartSetHeader total
     * @property {Uint8Array|null} [hash] CanonicalPartSetHeader hash
     */

    /**
     * Constructs a new CanonicalPartSetHeader.
     * @exports CanonicalPartSetHeader
     * @classdesc Represents a CanonicalPartSetHeader.
     * @implements ICanonicalPartSetHeader
     * @constructor
     * @param {ICanonicalPartSetHeader=} [properties] Properties to set
     */
    function CanonicalPartSetHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CanonicalPartSetHeader total.
     * @member {number|Long} total
     * @memberof CanonicalPartSetHeader
     * @instance
     */
    CanonicalPartSetHeader.prototype.total = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * CanonicalPartSetHeader hash.
     * @member {Uint8Array} hash
     * @memberof CanonicalPartSetHeader
     * @instance
     */
    CanonicalPartSetHeader.prototype.hash = $util.newBuffer([]);

    /**
     * Creates a new CanonicalPartSetHeader instance using the specified properties.
     * @function create
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {ICanonicalPartSetHeader=} [properties] Properties to set
     * @returns {CanonicalPartSetHeader} CanonicalPartSetHeader instance
     */
    CanonicalPartSetHeader.create = function create(properties) {
        return new CanonicalPartSetHeader(properties);
    };

    /**
     * Encodes the specified CanonicalPartSetHeader message. Does not implicitly {@link CanonicalPartSetHeader.verify|verify} messages.
     * @function encode
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {ICanonicalPartSetHeader} message CanonicalPartSetHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalPartSetHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.total != null && message.hasOwnProperty("total"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.total);
        if (message.hash != null && message.hasOwnProperty("hash"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.hash);
        return writer;
    };

    /**
     * Encodes the specified CanonicalPartSetHeader message, length delimited. Does not implicitly {@link CanonicalPartSetHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {ICanonicalPartSetHeader} message CanonicalPartSetHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalPartSetHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CanonicalPartSetHeader message from the specified reader or buffer.
     * @function decode
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CanonicalPartSetHeader} CanonicalPartSetHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalPartSetHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CanonicalPartSetHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.total = reader.uint64();
                break;
            case 2:
                message.hash = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CanonicalPartSetHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CanonicalPartSetHeader} CanonicalPartSetHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalPartSetHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CanonicalPartSetHeader message.
     * @function verify
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CanonicalPartSetHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.total != null && message.hasOwnProperty("total"))
            if (!$util.isInteger(message.total) && !(message.total && $util.isInteger(message.total.low) && $util.isInteger(message.total.high)))
                return "total: integer|Long expected";
        if (message.hash != null && message.hasOwnProperty("hash"))
            if (!(message.hash && typeof message.hash.length === "number" || $util.isString(message.hash)))
                return "hash: buffer expected";
        return null;
    };

    /**
     * Creates a CanonicalPartSetHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CanonicalPartSetHeader} CanonicalPartSetHeader
     */
    CanonicalPartSetHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.CanonicalPartSetHeader)
            return object;
        var message = new $root.CanonicalPartSetHeader();
        if (object.total != null)
            if ($util.Long)
                (message.total = $util.Long.fromValue(object.total)).unsigned = true;
            else if (typeof object.total === "string")
                message.total = parseInt(object.total, 10);
            else if (typeof object.total === "number")
                message.total = object.total;
            else if (typeof object.total === "object")
                message.total = new $util.LongBits(object.total.low >>> 0, object.total.high >>> 0).toNumber(true);
        if (object.hash != null)
            if (typeof object.hash === "string")
                $util.base64.decode(object.hash, message.hash = $util.newBuffer($util.base64.length(object.hash)), 0);
            else if (object.hash.length)
                message.hash = object.hash;
        return message;
    };

    /**
     * Creates a plain object from a CanonicalPartSetHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CanonicalPartSetHeader
     * @static
     * @param {CanonicalPartSetHeader} message CanonicalPartSetHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CanonicalPartSetHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.total = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.total = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.hash = "";
            else {
                object.hash = [];
                if (options.bytes !== Array)
                    object.hash = $util.newBuffer(object.hash);
            }
        }
        if (message.total != null && message.hasOwnProperty("total"))
            if (typeof message.total === "number")
                object.total = options.longs === String ? String(message.total) : message.total;
            else
                object.total = options.longs === String ? $util.Long.prototype.toString.call(message.total) : options.longs === Number ? new $util.LongBits(message.total.low >>> 0, message.total.high >>> 0).toNumber(true) : message.total;
        if (message.hash != null && message.hasOwnProperty("hash"))
            object.hash = options.bytes === String ? $util.base64.encode(message.hash, 0, message.hash.length) : options.bytes === Array ? Array.prototype.slice.call(message.hash) : message.hash;
        return object;
    };

    /**
     * Converts this CanonicalPartSetHeader to JSON.
     * @function toJSON
     * @memberof CanonicalPartSetHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CanonicalPartSetHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CanonicalPartSetHeader;
})();

$root.CanonicalVote = (function() {

    /**
     * Properties of a CanonicalVote.
     * @exports ICanonicalVote
     * @interface ICanonicalVote
     * @property {SignedMsgType|null} [typ] CanonicalVote typ
     * @property {number|Long|null} [height] CanonicalVote height
     * @property {number|Long|null} [round] CanonicalVote round
     * @property {ICanonicalBlockID|null} [blockId] CanonicalVote blockId
     * @property {ITimestamp|null} [timestamp] CanonicalVote timestamp
     * @property {string|null} [chainId] CanonicalVote chainId
     */

    /**
     * Constructs a new CanonicalVote.
     * @exports CanonicalVote
     * @classdesc Represents a CanonicalVote.
     * @implements ICanonicalVote
     * @constructor
     * @param {ICanonicalVote=} [properties] Properties to set
     */
    function CanonicalVote(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CanonicalVote typ.
     * @member {SignedMsgType} typ
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.typ = 0;

    /**
     * CanonicalVote height.
     * @member {number|Long} height
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.height = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CanonicalVote round.
     * @member {number|Long} round
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.round = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CanonicalVote blockId.
     * @member {ICanonicalBlockID|null|undefined} blockId
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.blockId = null;

    /**
     * CanonicalVote timestamp.
     * @member {ITimestamp|null|undefined} timestamp
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.timestamp = null;

    /**
     * CanonicalVote chainId.
     * @member {string} chainId
     * @memberof CanonicalVote
     * @instance
     */
    CanonicalVote.prototype.chainId = "";

    /**
     * Creates a new CanonicalVote instance using the specified properties.
     * @function create
     * @memberof CanonicalVote
     * @static
     * @param {ICanonicalVote=} [properties] Properties to set
     * @returns {CanonicalVote} CanonicalVote instance
     */
    CanonicalVote.create = function create(properties) {
        return new CanonicalVote(properties);
    };

    /**
     * Encodes the specified CanonicalVote message. Does not implicitly {@link CanonicalVote.verify|verify} messages.
     * @function encode
     * @memberof CanonicalVote
     * @static
     * @param {ICanonicalVote} message CanonicalVote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalVote.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.typ != null && message.hasOwnProperty("typ"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.typ);
        if (message.height != null && message.hasOwnProperty("height"))
            writer.uint32(/* id 2, wireType 1 =*/17).sfixed64(message.height);
        if (message.round != null && message.hasOwnProperty("round"))
            writer.uint32(/* id 3, wireType 1 =*/25).sfixed64(message.round);
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            $root.CanonicalBlockID.encode(message.blockId, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            $root.Timestamp.encode(message.timestamp, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.chainId);
        return writer;
    };

    /**
     * Encodes the specified CanonicalVote message, length delimited. Does not implicitly {@link CanonicalVote.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CanonicalVote
     * @static
     * @param {ICanonicalVote} message CanonicalVote message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CanonicalVote.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CanonicalVote message from the specified reader or buffer.
     * @function decode
     * @memberof CanonicalVote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CanonicalVote} CanonicalVote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalVote.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CanonicalVote();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.typ = reader.int32();
                break;
            case 2:
                message.height = reader.sfixed64();
                break;
            case 3:
                message.round = reader.sfixed64();
                break;
            case 4:
                message.blockId = $root.CanonicalBlockID.decode(reader, reader.uint32());
                break;
            case 5:
                message.timestamp = $root.Timestamp.decode(reader, reader.uint32());
                break;
            case 6:
                message.chainId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CanonicalVote message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CanonicalVote
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CanonicalVote} CanonicalVote
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CanonicalVote.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CanonicalVote message.
     * @function verify
     * @memberof CanonicalVote
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CanonicalVote.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.typ != null && message.hasOwnProperty("typ"))
            switch (message.typ) {
            default:
                return "typ: enum value expected";
            case 0:
            case 1:
            case 2:
            case 32:
                break;
            }
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                return "height: integer|Long expected";
        if (message.round != null && message.hasOwnProperty("round"))
            if (!$util.isInteger(message.round) && !(message.round && $util.isInteger(message.round.low) && $util.isInteger(message.round.high)))
                return "round: integer|Long expected";
        if (message.blockId != null && message.hasOwnProperty("blockId")) {
            var error = $root.CanonicalBlockID.verify(message.blockId);
            if (error)
                return "blockId." + error;
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            var error = $root.Timestamp.verify(message.timestamp);
            if (error)
                return "timestamp." + error;
        }
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            if (!$util.isString(message.chainId))
                return "chainId: string expected";
        return null;
    };

    /**
     * Creates a CanonicalVote message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CanonicalVote
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CanonicalVote} CanonicalVote
     */
    CanonicalVote.fromObject = function fromObject(object) {
        if (object instanceof $root.CanonicalVote)
            return object;
        var message = new $root.CanonicalVote();
        switch (object.typ) {
        case "SIGNED_MSG_TYPE_UNKNOWN":
        case 0:
            message.typ = 0;
            break;
        case "SIGNED_MSG_TYPE_PREVOTE":
        case 1:
            message.typ = 1;
            break;
        case "SIGNED_MSG_TYPE_PRECOMMIT":
        case 2:
            message.typ = 2;
            break;
        case "SIGNED_MSG_TYPE_PROPOSAL":
        case 32:
            message.typ = 32;
            break;
        }
        if (object.height != null)
            if ($util.Long)
                (message.height = $util.Long.fromValue(object.height)).unsigned = false;
            else if (typeof object.height === "string")
                message.height = parseInt(object.height, 10);
            else if (typeof object.height === "number")
                message.height = object.height;
            else if (typeof object.height === "object")
                message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber();
        if (object.round != null)
            if ($util.Long)
                (message.round = $util.Long.fromValue(object.round)).unsigned = false;
            else if (typeof object.round === "string")
                message.round = parseInt(object.round, 10);
            else if (typeof object.round === "number")
                message.round = object.round;
            else if (typeof object.round === "object")
                message.round = new $util.LongBits(object.round.low >>> 0, object.round.high >>> 0).toNumber();
        if (object.blockId != null) {
            if (typeof object.blockId !== "object")
                throw TypeError(".CanonicalVote.blockId: object expected");
            message.blockId = $root.CanonicalBlockID.fromObject(object.blockId);
        }
        if (object.timestamp != null) {
            if (typeof object.timestamp !== "object")
                throw TypeError(".CanonicalVote.timestamp: object expected");
            message.timestamp = $root.Timestamp.fromObject(object.timestamp);
        }
        if (object.chainId != null)
            message.chainId = String(object.chainId);
        return message;
    };

    /**
     * Creates a plain object from a CanonicalVote message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CanonicalVote
     * @static
     * @param {CanonicalVote} message CanonicalVote
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CanonicalVote.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.typ = options.enums === String ? "SIGNED_MSG_TYPE_UNKNOWN" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.height = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.round = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.round = options.longs === String ? "0" : 0;
            object.blockId = null;
            object.timestamp = null;
            object.chainId = "";
        }
        if (message.typ != null && message.hasOwnProperty("typ"))
            object.typ = options.enums === String ? $root.SignedMsgType[message.typ] : message.typ;
        if (message.height != null && message.hasOwnProperty("height"))
            if (typeof message.height === "number")
                object.height = options.longs === String ? String(message.height) : message.height;
            else
                object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber() : message.height;
        if (message.round != null && message.hasOwnProperty("round"))
            if (typeof message.round === "number")
                object.round = options.longs === String ? String(message.round) : message.round;
            else
                object.round = options.longs === String ? $util.Long.prototype.toString.call(message.round) : options.longs === Number ? new $util.LongBits(message.round.low >>> 0, message.round.high >>> 0).toNumber() : message.round;
        if (message.blockId != null && message.hasOwnProperty("blockId"))
            object.blockId = $root.CanonicalBlockID.toObject(message.blockId, options);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = $root.Timestamp.toObject(message.timestamp, options);
        if (message.chainId != null && message.hasOwnProperty("chainId"))
            object.chainId = message.chainId;
        return object;
    };

    /**
     * Converts this CanonicalVote to JSON.
     * @function toJSON
     * @memberof CanonicalVote
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CanonicalVote.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CanonicalVote;
})();

$root.Height = (function() {

    /**
     * Properties of an Height.
     * @exports IHeight
     * @interface IHeight
     * @property {number|Long|null} [revisionNumber] Height revisionNumber
     * @property {number|Long|null} [revisionHeight] Height revisionHeight
     */

    /**
     * Constructs a new Height.
     * @exports Height
     * @classdesc Represents an Height.
     * @implements IHeight
     * @constructor
     * @param {IHeight=} [properties] Properties to set
     */
    function Height(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Height revisionNumber.
     * @member {number|Long} revisionNumber
     * @memberof Height
     * @instance
     */
    Height.prototype.revisionNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Height revisionHeight.
     * @member {number|Long} revisionHeight
     * @memberof Height
     * @instance
     */
    Height.prototype.revisionHeight = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new Height instance using the specified properties.
     * @function create
     * @memberof Height
     * @static
     * @param {IHeight=} [properties] Properties to set
     * @returns {Height} Height instance
     */
    Height.create = function create(properties) {
        return new Height(properties);
    };

    /**
     * Encodes the specified Height message. Does not implicitly {@link Height.verify|verify} messages.
     * @function encode
     * @memberof Height
     * @static
     * @param {IHeight} message Height message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Height.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.revisionNumber);
        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.revisionHeight);
        return writer;
    };

    /**
     * Encodes the specified Height message, length delimited. Does not implicitly {@link Height.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Height
     * @static
     * @param {IHeight} message Height message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Height.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Height message from the specified reader or buffer.
     * @function decode
     * @memberof Height
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Height} Height
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Height.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Height();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.revisionNumber = reader.uint64();
                break;
            case 2:
                message.revisionHeight = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Height message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Height
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Height} Height
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Height.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Height message.
     * @function verify
     * @memberof Height
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Height.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
            if (!$util.isInteger(message.revisionNumber) && !(message.revisionNumber && $util.isInteger(message.revisionNumber.low) && $util.isInteger(message.revisionNumber.high)))
                return "revisionNumber: integer|Long expected";
        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
            if (!$util.isInteger(message.revisionHeight) && !(message.revisionHeight && $util.isInteger(message.revisionHeight.low) && $util.isInteger(message.revisionHeight.high)))
                return "revisionHeight: integer|Long expected";
        return null;
    };

    /**
     * Creates an Height message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Height
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Height} Height
     */
    Height.fromObject = function fromObject(object) {
        if (object instanceof $root.Height)
            return object;
        var message = new $root.Height();
        if (object.revisionNumber != null)
            if ($util.Long)
                (message.revisionNumber = $util.Long.fromValue(object.revisionNumber)).unsigned = true;
            else if (typeof object.revisionNumber === "string")
                message.revisionNumber = parseInt(object.revisionNumber, 10);
            else if (typeof object.revisionNumber === "number")
                message.revisionNumber = object.revisionNumber;
            else if (typeof object.revisionNumber === "object")
                message.revisionNumber = new $util.LongBits(object.revisionNumber.low >>> 0, object.revisionNumber.high >>> 0).toNumber(true);
        if (object.revisionHeight != null)
            if ($util.Long)
                (message.revisionHeight = $util.Long.fromValue(object.revisionHeight)).unsigned = true;
            else if (typeof object.revisionHeight === "string")
                message.revisionHeight = parseInt(object.revisionHeight, 10);
            else if (typeof object.revisionHeight === "number")
                message.revisionHeight = object.revisionHeight;
            else if (typeof object.revisionHeight === "object")
                message.revisionHeight = new $util.LongBits(object.revisionHeight.low >>> 0, object.revisionHeight.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from an Height message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Height
     * @static
     * @param {Height} message Height
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Height.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.revisionNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.revisionNumber = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.revisionHeight = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.revisionHeight = options.longs === String ? "0" : 0;
        }
        if (message.revisionNumber != null && message.hasOwnProperty("revisionNumber"))
            if (typeof message.revisionNumber === "number")
                object.revisionNumber = options.longs === String ? String(message.revisionNumber) : message.revisionNumber;
            else
                object.revisionNumber = options.longs === String ? $util.Long.prototype.toString.call(message.revisionNumber) : options.longs === Number ? new $util.LongBits(message.revisionNumber.low >>> 0, message.revisionNumber.high >>> 0).toNumber(true) : message.revisionNumber;
        if (message.revisionHeight != null && message.hasOwnProperty("revisionHeight"))
            if (typeof message.revisionHeight === "number")
                object.revisionHeight = options.longs === String ? String(message.revisionHeight) : message.revisionHeight;
            else
                object.revisionHeight = options.longs === String ? $util.Long.prototype.toString.call(message.revisionHeight) : options.longs === Number ? new $util.LongBits(message.revisionHeight.low >>> 0, message.revisionHeight.high >>> 0).toNumber(true) : message.revisionHeight;
        return object;
    };

    /**
     * Converts this Height to JSON.
     * @function toJSON
     * @memberof Height
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Height.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Height;
})();

$root.ValidatorSet = (function() {

    /**
     * Properties of a ValidatorSet.
     * @exports IValidatorSet
     * @interface IValidatorSet
     * @property {Array.<IValidator>|null} [validators] ValidatorSet validators
     * @property {IValidator|null} [proposer] ValidatorSet proposer
     * @property {number|Long|null} [totalVotingPower] ValidatorSet totalVotingPower
     */

    /**
     * Constructs a new ValidatorSet.
     * @exports ValidatorSet
     * @classdesc Represents a ValidatorSet.
     * @implements IValidatorSet
     * @constructor
     * @param {IValidatorSet=} [properties] Properties to set
     */
    function ValidatorSet(properties) {
        this.validators = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ValidatorSet validators.
     * @member {Array.<IValidator>} validators
     * @memberof ValidatorSet
     * @instance
     */
    ValidatorSet.prototype.validators = $util.emptyArray;

    /**
     * ValidatorSet proposer.
     * @member {IValidator|null|undefined} proposer
     * @memberof ValidatorSet
     * @instance
     */
    ValidatorSet.prototype.proposer = null;

    /**
     * ValidatorSet totalVotingPower.
     * @member {number|Long} totalVotingPower
     * @memberof ValidatorSet
     * @instance
     */
    ValidatorSet.prototype.totalVotingPower = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new ValidatorSet instance using the specified properties.
     * @function create
     * @memberof ValidatorSet
     * @static
     * @param {IValidatorSet=} [properties] Properties to set
     * @returns {ValidatorSet} ValidatorSet instance
     */
    ValidatorSet.create = function create(properties) {
        return new ValidatorSet(properties);
    };

    /**
     * Encodes the specified ValidatorSet message. Does not implicitly {@link ValidatorSet.verify|verify} messages.
     * @function encode
     * @memberof ValidatorSet
     * @static
     * @param {IValidatorSet} message ValidatorSet message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ValidatorSet.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.validators != null && message.validators.length)
            for (var i = 0; i < message.validators.length; ++i)
                $root.Validator.encode(message.validators[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.proposer != null && message.hasOwnProperty("proposer"))
            $root.Validator.encode(message.proposer, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.totalVotingPower != null && message.hasOwnProperty("totalVotingPower"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.totalVotingPower);
        return writer;
    };

    /**
     * Encodes the specified ValidatorSet message, length delimited. Does not implicitly {@link ValidatorSet.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ValidatorSet
     * @static
     * @param {IValidatorSet} message ValidatorSet message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ValidatorSet.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ValidatorSet message from the specified reader or buffer.
     * @function decode
     * @memberof ValidatorSet
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ValidatorSet} ValidatorSet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ValidatorSet.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ValidatorSet();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.validators && message.validators.length))
                    message.validators = [];
                message.validators.push($root.Validator.decode(reader, reader.uint32()));
                break;
            case 2:
                message.proposer = $root.Validator.decode(reader, reader.uint32());
                break;
            case 3:
                message.totalVotingPower = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ValidatorSet message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ValidatorSet
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ValidatorSet} ValidatorSet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ValidatorSet.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ValidatorSet message.
     * @function verify
     * @memberof ValidatorSet
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ValidatorSet.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.validators != null && message.hasOwnProperty("validators")) {
            if (!Array.isArray(message.validators))
                return "validators: array expected";
            for (var i = 0; i < message.validators.length; ++i) {
                var error = $root.Validator.verify(message.validators[i]);
                if (error)
                    return "validators." + error;
            }
        }
        if (message.proposer != null && message.hasOwnProperty("proposer")) {
            var error = $root.Validator.verify(message.proposer);
            if (error)
                return "proposer." + error;
        }
        if (message.totalVotingPower != null && message.hasOwnProperty("totalVotingPower"))
            if (!$util.isInteger(message.totalVotingPower) && !(message.totalVotingPower && $util.isInteger(message.totalVotingPower.low) && $util.isInteger(message.totalVotingPower.high)))
                return "totalVotingPower: integer|Long expected";
        return null;
    };

    /**
     * Creates a ValidatorSet message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ValidatorSet
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ValidatorSet} ValidatorSet
     */
    ValidatorSet.fromObject = function fromObject(object) {
        if (object instanceof $root.ValidatorSet)
            return object;
        var message = new $root.ValidatorSet();
        if (object.validators) {
            if (!Array.isArray(object.validators))
                throw TypeError(".ValidatorSet.validators: array expected");
            message.validators = [];
            for (var i = 0; i < object.validators.length; ++i) {
                if (typeof object.validators[i] !== "object")
                    throw TypeError(".ValidatorSet.validators: object expected");
                message.validators[i] = $root.Validator.fromObject(object.validators[i]);
            }
        }
        if (object.proposer != null) {
            if (typeof object.proposer !== "object")
                throw TypeError(".ValidatorSet.proposer: object expected");
            message.proposer = $root.Validator.fromObject(object.proposer);
        }
        if (object.totalVotingPower != null)
            if ($util.Long)
                (message.totalVotingPower = $util.Long.fromValue(object.totalVotingPower)).unsigned = false;
            else if (typeof object.totalVotingPower === "string")
                message.totalVotingPower = parseInt(object.totalVotingPower, 10);
            else if (typeof object.totalVotingPower === "number")
                message.totalVotingPower = object.totalVotingPower;
            else if (typeof object.totalVotingPower === "object")
                message.totalVotingPower = new $util.LongBits(object.totalVotingPower.low >>> 0, object.totalVotingPower.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a ValidatorSet message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ValidatorSet
     * @static
     * @param {ValidatorSet} message ValidatorSet
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ValidatorSet.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.validators = [];
        if (options.defaults) {
            object.proposer = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.totalVotingPower = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.totalVotingPower = options.longs === String ? "0" : 0;
        }
        if (message.validators && message.validators.length) {
            object.validators = [];
            for (var j = 0; j < message.validators.length; ++j)
                object.validators[j] = $root.Validator.toObject(message.validators[j], options);
        }
        if (message.proposer != null && message.hasOwnProperty("proposer"))
            object.proposer = $root.Validator.toObject(message.proposer, options);
        if (message.totalVotingPower != null && message.hasOwnProperty("totalVotingPower"))
            if (typeof message.totalVotingPower === "number")
                object.totalVotingPower = options.longs === String ? String(message.totalVotingPower) : message.totalVotingPower;
            else
                object.totalVotingPower = options.longs === String ? $util.Long.prototype.toString.call(message.totalVotingPower) : options.longs === Number ? new $util.LongBits(message.totalVotingPower.low >>> 0, message.totalVotingPower.high >>> 0).toNumber() : message.totalVotingPower;
        return object;
    };

    /**
     * Converts this ValidatorSet to JSON.
     * @function toJSON
     * @memberof ValidatorSet
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ValidatorSet.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ValidatorSet;
})();

$root.Validator = (function() {

    /**
     * Properties of a Validator.
     * @exports IValidator
     * @interface IValidator
     * @property {Uint8Array|null} [addr] Validator addr
     * @property {IPublicKey|null} [pubKey] Validator pubKey
     * @property {number|Long|null} [votingPower] Validator votingPower
     * @property {number|Long|null} [proposerPriority] Validator proposerPriority
     */

    /**
     * Constructs a new Validator.
     * @exports Validator
     * @classdesc Represents a Validator.
     * @implements IValidator
     * @constructor
     * @param {IValidator=} [properties] Properties to set
     */
    function Validator(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Validator addr.
     * @member {Uint8Array} addr
     * @memberof Validator
     * @instance
     */
    Validator.prototype.addr = $util.newBuffer([]);

    /**
     * Validator pubKey.
     * @member {IPublicKey|null|undefined} pubKey
     * @memberof Validator
     * @instance
     */
    Validator.prototype.pubKey = null;

    /**
     * Validator votingPower.
     * @member {number|Long} votingPower
     * @memberof Validator
     * @instance
     */
    Validator.prototype.votingPower = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Validator proposerPriority.
     * @member {number|Long} proposerPriority
     * @memberof Validator
     * @instance
     */
    Validator.prototype.proposerPriority = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new Validator instance using the specified properties.
     * @function create
     * @memberof Validator
     * @static
     * @param {IValidator=} [properties] Properties to set
     * @returns {Validator} Validator instance
     */
    Validator.create = function create(properties) {
        return new Validator(properties);
    };

    /**
     * Encodes the specified Validator message. Does not implicitly {@link Validator.verify|verify} messages.
     * @function encode
     * @memberof Validator
     * @static
     * @param {IValidator} message Validator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Validator.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.addr != null && message.hasOwnProperty("addr"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.addr);
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            $root.PublicKey.encode(message.pubKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.votingPower);
        if (message.proposerPriority != null && message.hasOwnProperty("proposerPriority"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.proposerPriority);
        return writer;
    };

    /**
     * Encodes the specified Validator message, length delimited. Does not implicitly {@link Validator.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Validator
     * @static
     * @param {IValidator} message Validator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Validator.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Validator message from the specified reader or buffer.
     * @function decode
     * @memberof Validator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Validator} Validator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Validator.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Validator();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.addr = reader.bytes();
                break;
            case 2:
                message.pubKey = $root.PublicKey.decode(reader, reader.uint32());
                break;
            case 3:
                message.votingPower = reader.int64();
                break;
            case 4:
                message.proposerPriority = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Validator message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Validator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Validator} Validator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Validator.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Validator message.
     * @function verify
     * @memberof Validator
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Validator.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.addr != null && message.hasOwnProperty("addr"))
            if (!(message.addr && typeof message.addr.length === "number" || $util.isString(message.addr)))
                return "addr: buffer expected";
        if (message.pubKey != null && message.hasOwnProperty("pubKey")) {
            var error = $root.PublicKey.verify(message.pubKey);
            if (error)
                return "pubKey." + error;
        }
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            if (!$util.isInteger(message.votingPower) && !(message.votingPower && $util.isInteger(message.votingPower.low) && $util.isInteger(message.votingPower.high)))
                return "votingPower: integer|Long expected";
        if (message.proposerPriority != null && message.hasOwnProperty("proposerPriority"))
            if (!$util.isInteger(message.proposerPriority) && !(message.proposerPriority && $util.isInteger(message.proposerPriority.low) && $util.isInteger(message.proposerPriority.high)))
                return "proposerPriority: integer|Long expected";
        return null;
    };

    /**
     * Creates a Validator message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Validator
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Validator} Validator
     */
    Validator.fromObject = function fromObject(object) {
        if (object instanceof $root.Validator)
            return object;
        var message = new $root.Validator();
        if (object.addr != null)
            if (typeof object.addr === "string")
                $util.base64.decode(object.addr, message.addr = $util.newBuffer($util.base64.length(object.addr)), 0);
            else if (object.addr.length)
                message.addr = object.addr;
        if (object.pubKey != null) {
            if (typeof object.pubKey !== "object")
                throw TypeError(".Validator.pubKey: object expected");
            message.pubKey = $root.PublicKey.fromObject(object.pubKey);
        }
        if (object.votingPower != null)
            if ($util.Long)
                (message.votingPower = $util.Long.fromValue(object.votingPower)).unsigned = false;
            else if (typeof object.votingPower === "string")
                message.votingPower = parseInt(object.votingPower, 10);
            else if (typeof object.votingPower === "number")
                message.votingPower = object.votingPower;
            else if (typeof object.votingPower === "object")
                message.votingPower = new $util.LongBits(object.votingPower.low >>> 0, object.votingPower.high >>> 0).toNumber();
        if (object.proposerPriority != null)
            if ($util.Long)
                (message.proposerPriority = $util.Long.fromValue(object.proposerPriority)).unsigned = false;
            else if (typeof object.proposerPriority === "string")
                message.proposerPriority = parseInt(object.proposerPriority, 10);
            else if (typeof object.proposerPriority === "number")
                message.proposerPriority = object.proposerPriority;
            else if (typeof object.proposerPriority === "object")
                message.proposerPriority = new $util.LongBits(object.proposerPriority.low >>> 0, object.proposerPriority.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a Validator message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Validator
     * @static
     * @param {Validator} message Validator
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Validator.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.addr = "";
            else {
                object.addr = [];
                if (options.bytes !== Array)
                    object.addr = $util.newBuffer(object.addr);
            }
            object.pubKey = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.votingPower = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.votingPower = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.proposerPriority = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.proposerPriority = options.longs === String ? "0" : 0;
        }
        if (message.addr != null && message.hasOwnProperty("addr"))
            object.addr = options.bytes === String ? $util.base64.encode(message.addr, 0, message.addr.length) : options.bytes === Array ? Array.prototype.slice.call(message.addr) : message.addr;
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            object.pubKey = $root.PublicKey.toObject(message.pubKey, options);
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            if (typeof message.votingPower === "number")
                object.votingPower = options.longs === String ? String(message.votingPower) : message.votingPower;
            else
                object.votingPower = options.longs === String ? $util.Long.prototype.toString.call(message.votingPower) : options.longs === Number ? new $util.LongBits(message.votingPower.low >>> 0, message.votingPower.high >>> 0).toNumber() : message.votingPower;
        if (message.proposerPriority != null && message.hasOwnProperty("proposerPriority"))
            if (typeof message.proposerPriority === "number")
                object.proposerPriority = options.longs === String ? String(message.proposerPriority) : message.proposerPriority;
            else
                object.proposerPriority = options.longs === String ? $util.Long.prototype.toString.call(message.proposerPriority) : options.longs === Number ? new $util.LongBits(message.proposerPriority.low >>> 0, message.proposerPriority.high >>> 0).toNumber() : message.proposerPriority;
        return object;
    };

    /**
     * Converts this Validator to JSON.
     * @function toJSON
     * @memberof Validator
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Validator.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Validator;
})();

$root.SimpleValidator = (function() {

    /**
     * Properties of a SimpleValidator.
     * @exports ISimpleValidator
     * @interface ISimpleValidator
     * @property {IPublicKey|null} [pubKey] SimpleValidator pubKey
     * @property {number|Long|null} [votingPower] SimpleValidator votingPower
     */

    /**
     * Constructs a new SimpleValidator.
     * @exports SimpleValidator
     * @classdesc Represents a SimpleValidator.
     * @implements ISimpleValidator
     * @constructor
     * @param {ISimpleValidator=} [properties] Properties to set
     */
    function SimpleValidator(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SimpleValidator pubKey.
     * @member {IPublicKey|null|undefined} pubKey
     * @memberof SimpleValidator
     * @instance
     */
    SimpleValidator.prototype.pubKey = null;

    /**
     * SimpleValidator votingPower.
     * @member {number|Long} votingPower
     * @memberof SimpleValidator
     * @instance
     */
    SimpleValidator.prototype.votingPower = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new SimpleValidator instance using the specified properties.
     * @function create
     * @memberof SimpleValidator
     * @static
     * @param {ISimpleValidator=} [properties] Properties to set
     * @returns {SimpleValidator} SimpleValidator instance
     */
    SimpleValidator.create = function create(properties) {
        return new SimpleValidator(properties);
    };

    /**
     * Encodes the specified SimpleValidator message. Does not implicitly {@link SimpleValidator.verify|verify} messages.
     * @function encode
     * @memberof SimpleValidator
     * @static
     * @param {ISimpleValidator} message SimpleValidator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SimpleValidator.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            $root.PublicKey.encode(message.pubKey, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.votingPower);
        return writer;
    };

    /**
     * Encodes the specified SimpleValidator message, length delimited. Does not implicitly {@link SimpleValidator.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SimpleValidator
     * @static
     * @param {ISimpleValidator} message SimpleValidator message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SimpleValidator.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SimpleValidator message from the specified reader or buffer.
     * @function decode
     * @memberof SimpleValidator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SimpleValidator} SimpleValidator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SimpleValidator.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SimpleValidator();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.pubKey = $root.PublicKey.decode(reader, reader.uint32());
                break;
            case 2:
                message.votingPower = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SimpleValidator message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SimpleValidator
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SimpleValidator} SimpleValidator
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SimpleValidator.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SimpleValidator message.
     * @function verify
     * @memberof SimpleValidator
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SimpleValidator.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pubKey != null && message.hasOwnProperty("pubKey")) {
            var error = $root.PublicKey.verify(message.pubKey);
            if (error)
                return "pubKey." + error;
        }
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            if (!$util.isInteger(message.votingPower) && !(message.votingPower && $util.isInteger(message.votingPower.low) && $util.isInteger(message.votingPower.high)))
                return "votingPower: integer|Long expected";
        return null;
    };

    /**
     * Creates a SimpleValidator message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SimpleValidator
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SimpleValidator} SimpleValidator
     */
    SimpleValidator.fromObject = function fromObject(object) {
        if (object instanceof $root.SimpleValidator)
            return object;
        var message = new $root.SimpleValidator();
        if (object.pubKey != null) {
            if (typeof object.pubKey !== "object")
                throw TypeError(".SimpleValidator.pubKey: object expected");
            message.pubKey = $root.PublicKey.fromObject(object.pubKey);
        }
        if (object.votingPower != null)
            if ($util.Long)
                (message.votingPower = $util.Long.fromValue(object.votingPower)).unsigned = false;
            else if (typeof object.votingPower === "string")
                message.votingPower = parseInt(object.votingPower, 10);
            else if (typeof object.votingPower === "number")
                message.votingPower = object.votingPower;
            else if (typeof object.votingPower === "object")
                message.votingPower = new $util.LongBits(object.votingPower.low >>> 0, object.votingPower.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a SimpleValidator message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SimpleValidator
     * @static
     * @param {SimpleValidator} message SimpleValidator
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SimpleValidator.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.pubKey = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.votingPower = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.votingPower = options.longs === String ? "0" : 0;
        }
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            object.pubKey = $root.PublicKey.toObject(message.pubKey, options);
        if (message.votingPower != null && message.hasOwnProperty("votingPower"))
            if (typeof message.votingPower === "number")
                object.votingPower = options.longs === String ? String(message.votingPower) : message.votingPower;
            else
                object.votingPower = options.longs === String ? $util.Long.prototype.toString.call(message.votingPower) : options.longs === Number ? new $util.LongBits(message.votingPower.low >>> 0, message.votingPower.high >>> 0).toNumber() : message.votingPower;
        return object;
    };

    /**
     * Converts this SimpleValidator to JSON.
     * @function toJSON
     * @memberof SimpleValidator
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SimpleValidator.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SimpleValidator;
})();

module.exports = $root;
