---
id: cryptography
title: Cryptography
---

## Crypt Class
There is a cryptography helper class which provides the essential methods to make it easy to do cryptographical 
operations. The `Crypt` class can be imported from `silvie/utils/crypt`. It is like a wrapper around the 
[bcrypt](https://www.npmjs.com/package/bcrypt) package and the built-in `Node.js` 
[Crypto](https://nodejs.org/dist/latest-v15.x/docs/api/crypto.html).

### BCrypt
[BCrypt](https://en.wikipedia.org/wiki/Bcrypt) is a password hashing algorithm based on the 
[Blowfish](https://en.wikipedia.org/wiki/Blowfish_(cipher)) cipher. Silvie provides two methods on the `Crypt` class for
this kind of hashing algorithm.

#### Crypt.make()
This method will take a plain string and returns its hashed version by bcrypt. 
- **plain** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
import Crypt from 'silvie/utils/crypt';

const password = Crypt.make('1234qwerty');
// $2y$08$rf16Hu/OWdAznOmXKilB7eUJznQIqzbd.1wPClQXPM0SL.yyRuS4O
```

:::note
The result of a bcrypt hash will be different everytime even if you are hashing the same data.
:::

#### Crypt.check()
This method will check if a bcrypt hash matches a plain string and returns a `boolean` as the result.
- **plain** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **hashed** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
import Crypt from 'silvie/utils/crypt';

if (Crypt.check('1234qwerty', '$2y$12$hAPVzIXNBKRC2HEVzjlHnO4njvFuTsf/JbZuM2bvqcyqj5L3AGuNu')) {
    console.log("Password Match");
} else {
    console.log("Password Doesn't Match");
}
```

### Hash
Hashing is a one-way function that scrambles a plain text to a unique digest. There is almost no way to reverse a hashed
data to what it was at the beginning. Silvie uses the crypto package of `Node.js` for hashing.
 
#### Crypt.hash()
This method will take a data and hashes that data with the given hashing algorithm. The result will be a digest message
in a form that you specified for it.
- **data** [<TData\>](#tdata)
- **algorithm?** [<THashMethod\>](#thashmethod) default: `'sha256'`
- **digest?** [<THashDigest\>](#thashdigest) default: `'hex'`

Data
For a list of supported hashing algorithms please read [THashMethod](#thashmethod) section.

```typescript
import Crypt from 'silvie/utils/crypt';

const sha256Hashed = Crypt.hash('Hello There!');
// 35e82dd5e8910e44e8c32748375cf17da2e8e89b76990125b20cb04472b6a3b7

const buffer = Buffer.from([65, 66, 67]);
const md5Hashed = Crypt.hash(buffer, 'md5');
// 902fbdd2b1df0c4f70b4a5d23525e932
```

### Cipher
Cipher is a two-way function that you can encrypt and decrypt your data with the proper key. Silvie uses the crypto 
package of `Node.js` to provide a helper method for cipher methods.

#### Crypt.randomBytes()
This method will create a buffer with the given length.
- **length** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

```typescript
const buffer = Crypt.randomBytes(64);
```

#### Crypt.generateIV()
This method will create a buffer with random bytes with the given length to be used as initialization vector in a cipher
algorithm. The default length to generate an IV is `16`. Learn more about what an IV is and what it does, read 
[Initialization Vector](https://en.wikipedia.org/wiki/Initialization_vector) on wikipedia.
- **length?** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `16`

```typescript
const iv16 = Crypt.generateIV();

const iv48 = Crypt.generateIV(48);
```

#### Crypt.generateKey()
This method will create a buffer with random bytes with the given length to be used as the encryption key.
- **length?** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `32`

```typescript
const key32 = Crypt.generateKey();

const key64 = Crypt.generateKey(64);
```

:::info
The key length depends on the algorithm. For example for `aes128` you need to use a key with `16` bytes*(128 bits)*.
:::

#### Crypt.encrypt()
This method will take a data and encrypts it into an output digest. The output will be and `object` containing the 
encrypted `data` and the `iv`. 
- **data** [<TData\>](#tdata)
- **key** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | 
[<Buffer\>](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer)
- **algorithm** [<TCipherMethod\>](#tciphermethod)
- **digest?** [<TCipherDigest\>](#tcipherdigest) default: `'hex'`
- **IVLength** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `16`

```typescript
import Crypt from 'silvie/utils/crypt';

// Generate a 32 byte random key (256 bit)
const key = Crypt.generateKey();

// Encrypt the text with the given key in 'aes256'
const { data, iv } = Crypt.encrypt("I'm An Encrypted Text", key, 'aes256');

console.log(key.toString('hex'));
// Encryption Key:
// bf7170221e9220adf22320fb4168acde6c5dd8a88f2a0e12296c7829be44bc3f

console.log(data);
// Encrypted Data:
// 2cb69bb5883e8d3408947dcaf6f171389250c7be1064a374b48a1cd314f5f9f1

console.log(iv);
// Initialization Vector
// c2edfb7c97e385390b514381122b9053
``` 

#### Crypt.decrypt()
This method will take an encrypted data and decrypts it with the proper `Key` and `IV` that was used to encrypt it in 
the first place.
- **data** [<TData\>](#tdata)
- **key** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | 
[<Buffer\>](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer)
- **iv** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | 
[<Buffer\>](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer)
- **algorithm** [<TCipherMethod\>](#tciphermethod)
- **digest?** [<TCipherDigest\>](#tcipherdigest) default: `'hex'`

```typescript
import Crypt from 'silvie/utils/crypt';

const key = 'de28e3018fff3e407f2bbc3b9a9f47b3a5621e827075611996a388e5f82e8ba8';
const iv = '63228d5dada1e77ffa8b1781b7531d3e';
const data = 'cdba9fb350e42657e23e37f25811ff33';

const text = Crypt.decrypt(data, key, iv, 'aes256');

console.log(text);
// I Was Encrypted
```

## Types
### TData
This type represents a data like value, and can be one of the following data types:
- [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- [<Buffer\>](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer)
- [<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- [<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### THashDigest
A string representing the type for the output digest of a hash:
- 'latin1'
- 'hex'
- 'base64'

### TCipherDigest
A string representing the output type of the cipher digest:
- 'ascii'
- 'utf8'
- 'utf-8'
- 'utf16le'
- 'ucs2'
- 'ucs-2'
- 'base64'
- 'latin1'
- 'binary'
- 'hex'


### THashMethod
A string to indicate the hashing algorithm. To see a list of all supported hashing algorithms, use the 
[crypto.getHashes()](https://nodejs.org/dist/latest-v15.x/docs/api/crypto.html#crypto_crypto_gethashes) method.

### TCipherMethod
A string indicating the cipher algorithm. To see a list of all supported cipher algorithms, use the 
[crypto.getCiphers()](https://nodejs.org/dist/latest-v15.x/docs/api/crypto.html#crypto_crypto_getciphers) method.

:::note
We do not mention the supported hashing and cipher algorithms here, because they might change in different `Node.js` 
versions, and it is a very long list of items too. 
:::
