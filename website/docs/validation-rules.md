---
id: validation-rules
title: Validation Rules
---

We've discussed the [Validator Class](validator.md) earlier. Now you know how to create a validator and got a good 
knowledge of the structure. There are some built-in validators in Silvie that you can use them in your validator rules
object. Silvie uses the [validator](https://www.npmjs.com/package/validator) package for most of these validation rules,
and they are acting like a wrapper to make them usable by this Validator structure. Here is the full list of available 
validation methods:


## Arrays
These validation rules apply to array values

### array
This rule makes sure the matching value is an array.

### contains
This rule checks if an entry exists in the array.
- **key** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### distinct
This rule makes sure the array doesn't have any duplicate entries.


## Credentials
These validation rules check credentials.

### confirmed
This rule requires another data entry in the same level with a suffix of `_confirmation` and same value. For example if 
`password` field needs to be confirmed, there must be a `password_confirmation` with the exact same value in it.

### creditCard
This rule checks to see if a string is a valid credit card number or not. You may define the locale by passing it as a 
parameter.
- **locale?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### email
This will check if a string is a valid email address or not.

### identityCard
This will check to see if a string is a valid identity card or not. It accepts a locale to check for a specific locale
identity card.
- **locale** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### name
This rule will check if a string is a valid name or not. A valid name should not contain numbers and special characters 
excluding whitespaces.

### phone
This method will check for a valid phone number in the given locale.
- **locale** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### postalCode
This method will check for a valid postal code in the specified locale.
- **locale** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


## Dates
The following rules will work on data strings.

### after
The value must be after a given date. You need to specify the date as its parameter.
- **key** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### before
The value must be before a given date. You need to specify the date as its parameter.
- **key** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


## Length
These rules will check the length of a string or array.

### length
This rule checks if an `array` or a `string` have the exact same length as specified.
- **value** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### size
This rule checks if an `array` or a `string` have the exact length as specified.
- **value** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


## Range
These rules will make sure a value is in an specific range.

### max
If it is used for a `number`, the value must be less than or equal to the given value. If it is used for a `string` or 
`array`, the value must have a length less than or equal to the given value. 
- **value** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### min
If it is used for a `number`, the value must be greater or equal to the given value. If it is used for a `string` 
or `array`, the value must have a length greater or equal to the given value.
- **value** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

## Numbers
The following rules will be applied to numeric values.
 
### divisibleBy
This rule checks to see if a number is divisible by the given number or not.
- **value** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### float
This rule checks for a valid float number.

### int
This rule checks for a valid integer number.

### latlng
This rule requires a valid latitude-longitude combination, the format must be `lat,long` or `lat, long`.

### numeric
The values passed to this rule, must be numeric.

## Requires
The rules will check if a value exists in the data set or not.

### nullable
This rule will indicate that a piece of data can be missing. If the value of that data is `null` or `undefined` the 
other validation rules won't be executed any more.

### present
This rule needs to see a piece of data in the data set, no matter if it is `null`. It just shouldn't be `undefined`.

### required
This rule will require a not `null`, not `undefined` and not empty value.

### requiredIf
This will require its value only if another field has a specific value.
- **fieldName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **value** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### requiredUnless
This will require its value only if another field isn't equal to a specific value.
- **fieldName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **value** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### requiredWith
This rule will require its value if another field is present and not `null`, `undefined` or `empty`.
- **fieldName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### requiredWithout
This rule will require its value if another field is not present or is `null`, `undefined` or `empty`.
- **fieldName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


## Standards
The following rules will apply to some basic standards.

### ascii
This rule will check for a valid `ASCII` string.

### base32
This will check for a valid `Base32` string.

### base64
This will check for a valid `Base64` string.

### hash
This will check if a string is a valid hash value of the given hashing algorithm.
- **hashName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### hex
This will check if a string is a valid `Hexadecimal` value.

### hexColor
This will check if a string is a valid hex color. 

### isbn
This rule checks for a valid `ISBN` of version `10` or `13`.

### isin
This rule checks for a valid `ISIN`.

### iso8601
This rule checks for a valid `ISO 8601` date string.

### iso31661Alpha2
This rule checks for a valid `ISO 31661 Alpha 2` country code.

### iso31661Alpha3
This rule checks for a valid `ISO 31661 Alpha 3` country code.

### isrc
This rule checks for a valid `ISRC`.

### issn
This rule checks for a valid `ISSN`.

### json
This rule will check for a valid `JSON` string. If the `allowPrimitives` parameter is `true`, then the values 
`true`, `false` and `null` will be accepted as valid `JSON` values.
- **allowPrimitives?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

### jwt
This will check for a valid `JWT` token string.

### md5
This will check for a valid `MD5` hash value.

### mime
This rule requires a valid `MIME` string.

### mongoId
This rule will require a valid `MongoDB ObjectID` value.

### octal
This rule will check for a valid `Octal` value.

### rfc3339
This rule checks for a valid `RFC 3339` date string.

### uuid
This rule checks for a valid `UUID` string.


## Strings
These rules will be applied to string values.

### alpha
The value should be a string which only contains alphabetical characters.

### alphanumeric
The value should be a string which only contains alphabetical and numeric characters.

### empty
The value should be an empty string. You can specify a boolean value for the `trim` parameter to indicate if the value 
should be trimmed before validation or not.
- **trim?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `true`

### endsWidth
This rule will check if the string ends with a given string.
- **value** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### fullWidth
This rule will check if the string contains any full-width characters.

### halfWidth
This rule will check if the string contains any half-width characters.

### lowercase
This rule will check if the string only contains lowercase characters.

### multibyte
This rule will check if the string contains any multibyte characters.

### startsWith
This rule will check if the string starts with a given string.
- **value** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### surrogate
This rule will check if the string contains any surrogate pairs characters.

### uppercase
This rule will check if the string only contains uppercase characters.

### variableWidth
This rule will check if the string contains both half-width and full-width characters.

## Network
These rules will be applied to network related data.

### dataUri
This rule will check if the string is a valid data URI.

### fqdn
This rule will check if the string is a valid FQDN.

### ip
This rule will check if the string is a valid IP address of the specified version
- **version?** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `4`

### ipRange
This will check if the string is a valid IP range.

### mac
This will check if the string is a valid MAC address. You can specify if the MAC address should not contain colons or 
not, by the `noColons` parameter.
- **noColons?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

### magnetUri
This rule will check if the string is a valid Magnet URI.

### port
This rule will check if the value is a valid port number. 

### url
This rule will check if the string is a valid URL.


## Other
The following rules can be used on every kind of data.

### boolean
This rule checks if a value is a `boolean` kind. A boolean kind value is a `true` or `false` value or, `0` or `1` 
numbers or, a string matching `'yes'`, `'no'`, `'on'` or `'off'` values.

### equals
This rule will check if the value has the exact same value as specified.
- **value** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
[<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) |
[<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
[<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If the value is an `object`, their values will be compared by `JSON.stringify()`ing both of them.

If the value is a `boolean`, their value will be compared by `!!` operator.

If the value is a `number`, they will be compared by `parseFloat()` or `parseInt()` depending on if they have anything 
after decimal point or not.

If the value is a `string`, they will be just check for equality with `===` operator.

If the value is not one of these types, a loose equality checking will happen between them by `==` operator.

### in
This rule will check if a value **exists** in a list of values. You can specify multiple parameters for this rule.
- **...values** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

### notIn
This rule will check if a value **does not exist** in a list of values. You can specify multiple parameters for this rule.
- **...values** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
