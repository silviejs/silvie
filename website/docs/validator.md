---
id: validator
title: Validator
---

Validators come to action when you are working with the user input. Silvie has a built-in `Validator` helper class to 
handle the validations in your application. The main idea is to validate an object containing various kinds of data. The 
technique used in this class was inspired from the [Validation from Laravel Framework](https://laravel.com/docs/8.x/validation). 

## Validator
The validator class can be imported from `silvie/validator`. You need to create an instance of this object and specify
your data and validation rules in the constructor.
- **data** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **rules** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **messages?** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **generateNestedErrors?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `true`

The `data` should be an object containing the data that needs to be validated.

The `rules` parameter should be an object containing the path to each piece of data with its corresponding validation 
rule string. This will be explained in detail in [Rules Object](#rules-object) section.

The `messages` parameter should be an object of error messages that need to be shown when a validation rule fails. The 
keys of this object are data paths, and their values are [Validation Message](#messages-object) strings. This parameter 
should be used in order to define custom messages, It will try to use default error messages if you don't specify this
parameter.

If you set the `generateNestedErrors` parameter to `true`, It will create an object with the same structure of the 
original data, and puts the error messages on their exact place in the object structure. Otherwise, it will return a 
simple object with data paths as keys and their errors as their values.

Saying we have the following object as the user input, and we want to validate it.

```typescript
const data = {
    name: 'Ho$$ein Maktoobian',
    phone: '+18885002321',
    email: 'contacthmak.me',
};
```

```typescript
import Validator from 'silvie/validator';

const val = new Validator(data, {
    name: 'required|name',
    phone: 'required|phone:en-US',
    email: 'nullable|email'
}, {
    'name:required': 'You should enter your name',
    'name:name': 'The name is not valid name',
    'phone:required': 'You should enter your phone',
    'phone:phone': 'Your phone is not a valida US phone number',
    'email:email': 'Your email is not valid'
});
```

Then it will parse the rules and validation messages and tries to validate all rules over their corresponding data. Then 
it will generate an error object which is accessible with `.errors` on the validator instance. All of these steps will 
happen in the constructor.

```typescript
if (val.hasErrors) {
    console.log(val.errors);
    // {
    //     name: ['The name is not valid name'],
    //     email: ['Your email is not valid'],
    // }
}
```


### Rules Object
The rules object is the object that defines what needs to be validated, and how it is going to be validated. You should
define the path of the data as keys of the rules object. The values of those keys are rule strings as described below:

A rule string is a string with rule names separated with a pipe line character `|`. If a rule can accept parameters, 
they can be specified by separating the parameters from the rule name with a colon character `:`. Multiple parameters 
can also be separated with a comma character `,`. 

```typescript
const rules = {
    phone: 'requiredWithout:email|phone:en-US',
    gender: 'required|in:Male,Female,Other'
};
```

### Messages Object
Validation messages will be emitted into the errors object of the validator instance whenever a rule fails in validation.
There is a default validation message for all validation rules. If you don't want to get the default validation messages,
you can pass a third parameter to the validator constructor to use those validation messages for the failed rules.

The keys of this object should be [path strings](#path-strings) with a little difference at the end. You need to specify 
the rule name separated by a colon character `:` at the end the path.

```typescript
const messages = {
    'name:name': 'The name is not valid',
    'friends.0.name:required': 'Your first friend name is missing',
    'friends.*.name:name': 'One of your friends has an invalid name'
};
```

#### Custom Messages
Validation messages should tell the issues about the data. It might be better to include some extra info into the error
message. There are a few placeholders defined which can be replaced in a message.
- **:path** This will be the exact path of the matching data
- **:field** This will be the path of the matching data
- **:name** This will be last part of the path being the exact field name
- **:params** This will be the array of params joined by a comma, and a white space `, `
- **:[index]** This will point to an index of parameters

```typescript
const messages = {
    'friends.*.name:required': 'The ":path" is not defined',
    'gender:in': 'The gender should be one of: :params',
};
```

### Path Strings
Data paths are `strings` that are defined as object keys in the validator `errors` or `messages` objects. A path is a
string separated with dots. Each part can be one of the following:
- **key** Key to reach members of an object like data
- **index** Key to reach members of an array like data
- **wildcard** Match everything in that path

All routes will be searched for from the root level of the main data object. Take a look at the following examples:

```typescript
const rules = {
    'parents.father.name': 'required|name',
    'parents.*.name': 'required|name',
    'friends': 'required|array',
    'friends.0.age': 'required|numeric|min:18'
};
```

The first one reaches the `parents` member and tries to find a `father` property on it, then it will look for the `name` 
property.   

The second one will reach the `parents` property, and iterates over all its members, and looks for the `name` property 
on each one of those members.

The third one will just look for a member called `friends` in the root object.

The fourth one will reach the `friends` property in the root object, then it will check for the `age` on the first entry
of `friends` array.

In all these three steps, searching will be cancelled if something is missing along the path.
