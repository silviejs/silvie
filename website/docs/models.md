---
id: models
title: Models
---

Silvie brings models to action, to make it easier to work with your database entities. A model is some kind of 
[query builder](query-builders.md) which is configured to work with its own table and reduces the effort of creating a 
query builder instance from scratch. 

## Model Class
The 'Model' class can be imported from `silvie/database/model`. However, you don't need to do this your self. You can 
always create a new model with [Silvie CLI](cli.md#make).

```bash
silvie make model User
```

Since the model is the main entity that you can define in a Silvie application, you can create other related entities in
a single command.

```bash
silvie make model User -msr
```

The above command will create a Model, a Migration, a Schema and a Resolver for your `User` entity. By running this 
command, a file named `user.ts` will be created in `src/models` directory of your project with the following content:

```typescript
import Model from 'silvie/database/model';

export default class User extends Model {
	declare id: number;
}
```


### Table Name
The name of a table will be the `plural name` of the model class name in `snake case`. When you create a model with 
Silvie CLI, it will be automatically created with the singular form of your provided name. For example, the table name 
for the `User` model will be `users`. 

You can always set a custom table name for your models by using the static `tableName` property of that specific class.

```typescript
import Model from 'silvie/database/model';

export default class User extends Model {
    static tableName = 'employees';

	declare id: number;
}
``` 


### Query Builder
The models came to help you with your query builders. The model class will create a base query builder that is 
configured to work with the table belonging to that model. It also registers a data processor callback on the query 
builder to cast the fetched results into instances of that model, and sets the other query related model properties on 
its query builder.

#### Methods
You are able to use all available methods of a query builder instance, directly from a model by their equivalent static 
methods. All of these methods will pass their properties to the [baseQueryBuilder](#modelbasequerybuilder), acting as a 
proxy between the model and query builder.

```typescript
User.where('name', 'John').get();
// Fetches all users with the name 'John'

Post.leftJoin('users', 'users.id', 'posts.user_id').get();
// Fetches all posts joined with their user
```

:::note
We are not going to go through all these methods since they are exactly the same as their query builder equivalents. 
Read more about query builder methods on [Query Builder](query-builders.md#query-builder) section.
:::

#### Model.baseQueryBuilder
If you want to access the configured query builder of you model you can use this property.

```typescript
User.baseQueryBuilder.where('id', '<', 5).get();
```

#### Model.extendBaseQueryBuilder()
There are some times that you need to modify the base query builder of your model. You can override this static method 
to add your custom features to the base query builder.

```typescript
import Model from 'silvie/database/model';

export default class User extends Model {
    static extendBaseQueryBuilder(queryBuilder) {
        queryBuilder.where('active', true);
    }
    // The basic query builder will 
    // restrict to active users only
}
```


### Constructor
The model constructor accepts an `object` as its only parameter to initialize a new instance with that initial data. It
acts like casting that object into an instance of the model. This behavior will also be used to cast database results.
- **initialData?** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```typescript
const user = new User({
    name: 'John',
    family: 'Doe',
    age: 22,
});
```


### Properties
#### Model.tableName
This property specifies the table name of the model, which is `''` by default. If you don't set a value for this 
property, it will be set by [table](#modeltable) property based on the model class name. 

#### Model.table
This read only property will contain the table name of the model. If you haven't specify the [tableName](#modeltablename) 
property on your model, it tries to pluralize the class name and turn it into snake case to be considered as table name.

#### Model.primaryKey
This property will specify the primary key column name for the current model. It is set to `'id'` by default. This can 
be a `string` or `an array of strings` for those models with multiple primary keys. 

#### Model.useTimestamps
This property is a boolean value indicating weather to use `create` and `update` timestamps or not. This is `true` by 
default.
 
#### Model.createTimestamp
This property will specify the create timestamp column name which is set to `'created_at'` by default. 

#### Model.updateTimestamp
This property will specify the update timestamp column name which its default value is `'updated_at'`.

#### Model.softDeleteTimestamp
This property will specify the soft delete timestamp column name which is `'deleted_at'` by default.

#### Model.useSoftDeletes
Setting this property to `true`, will enable soft deletes on the model and its query builder. The default value for 
this property is `false`; 

#### Model.relations
This property is an object of relations between its class and other models. The keys of this object will be relation 
names, and their value must be a model relation. This will be discussed in detail in [Relations](#relations) section. 


### Fetch
#### Model.all()
This method will fetch all records from the table, and returns an array of your model type.

```typescript
User.all();
// returns all users in an array
```

#### Model.find()
This method will search for a value on primary key column and returns that record. If the record was not found in the
database, it will return `null`; 
- **id** [<TBaseValue\>](query-builders.md#tbasevalue) | [<TBaseValue[]\>](query-builders.md#tbasevalue)

If you only have a single column for your primary key, you will only need to pass a single value to the `id` parameter.
But, if you have multiple columns for your primary key, you need to pass an array of values in the same order of your 
primary keys to the `id` parameter.

```typescript
User.find(41);
// Returns the user with id 41
```

Saying we have a `PostRating` model which contains a foreign key for the user id and another foreign key for the 
post id which they are also primary keys. `primaryKey = ['user_id', 'post_id']`. The following code example will
return a post rating which belongs to user `12` and post `7`.

```typescript
PostRating.find([12, 7]);
```

#### Model.findAll()
This method will take one or more keys to look for. Then it will return the records that was found with those given ids.
- **...ids** [<TBaseValue[]\>](query-builders.md#tbasevalue) | [<TBaseValue[][]\>](query-builders.md#tbasevalue)

```typescript
User.find(1, 5, 10);
// Returns the users with ids 1, 5, 10
```

```typescript
PostRating.find([12, 7], [13, 2], [1, 5]);
// Returns the post ratings with those key combinations
```

In addition to these methods you can always use the query builder methods on the model class to fetch your records from 
the database. However, it will be a little painful to handle complex primary keys to find what you are looking for. Take 
a look at the following code examples:

```typescript
User.whereIn(id, [1, 5, 10]).get();
// Returns the users with ids 1, 5, 10

Post.whereLike('title', '%New York%').first();
// Fetches the first post with a title
// containing 'New York'
``` 


### Create
#### Model.create()
This method will create a record in the database with the given object keys and values.    
- **data** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **shouldReturn?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `true`

Indicating weather to return the created record after it was created or not. This will make an extra query on the 
database. So set it to `false` if you don't want to use it after the creation. If the value of this parameter is `false`
then it will return the id of the inserted record.

```typescript
User.create({
    name: 'Sonya',
    family: 'Grats',
    age: 19
});
```


### Delete
#### Model.delete()
This method will delete a record of that model using the given id. If you have enabled soft deletes in your model, it 
will use that to delete the record. Otherwise, the record will be deleted physically from the database.
- **id** [<TBaseValue\>](query-builders.md#tbasevalue) | [<TBaseValue[]\>](query-builders.md#tbasevalue)

```typescript
User.delete(5);
```

#### Model.deleteAll()
This method will take an array ids as its parameters, and deletes all records found with those ids. If you have
enabled soft deletes, the records will be soft deleted. Otherwise, they will be deleted physically.
- **...ids** [<TBaseValue[]\>](query-builders.md#tbasevalue) | [<TBaseValue[][]\>](query-builders.md#tbasevalue)

```typescript
User.deleteAll(5, 6, 7);
```

#### Model.restore()
This method will restore a soft deleted record with a given id. It only works if you have enabled soft deletes on your 
model. 
- **id** [<TBaseValue\>](query-builders.md#tbasevalue) | [<TBaseValue[]\>](query-builders.md#tbasevalue)

```typescript
User.restore(6);
```

#### Model.restoreAll()
This method will restore soft deleted records found with the give ids in its parameters. This only works if your have 
enabled soft deletes on your model. 
- **...ids** [<TBaseValue[]\>](query-builders.md#tbasevalue) | [<TBaseValue[][]\>](query-builders.md#tbasevalue)

```typescript
User.restoreAll(4, 5, 7);
```

#### Model.forceDelete()
This method will get an id and deletes the underlying record found with that id.
- **id** [<TBaseValue\>](query-builders.md#tbasevalue) | [<TBaseValue[]\>](query-builders.md#tbasevalue)

```typescript
User.forceDelete(10);
```

#### Model.forceDeleteAll()
This method will delete records found with the given ids from the database.
- **...ids** [<TBaseValue[]\>](query-builders.md#tbasevalue) | [<TBaseValue[][]\>](query-builders.md#tbasevalue)

```typescript
User.forceDeleteAll(7, 8, 9);
```

### Relations
Model relations are a way to bind your models together. They are useful to fetch different entities within a single
database query. The fetched relation data will be bundled into your reference model and will be accessible by the name
that you provided for the relation name. Here are the relation methods that a model can have:

#### Model.hasOne()
This method will create a `one-to-one` relation between two models.
- **model** [<Model\>](models.md#model-class)
- **foreignKey** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **primaryKey?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If you don't specify the primary key column, It will use the model primary key be default.

```typescript
import Model from 'silvie/database/model';
import NationalFlag from 'models/national_flag';

export default class Country extends Model {
	static relations = {
	    flag: Model.hasOne(NationalFlag, 'country_id')
    };
}
```

#### Model.hasMany()
This method will create a `one-to-many` relation between two models.
- **model** [<Model\>](models.md#model-class)
- **foreignKey** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **primaryKey?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If you don't specify the primary key column, It will use the model primary key be default.

```typescript
import Model from 'silvie/database/model';
import State from 'models/state';

export default class Country extends Model {
	static relations = {
	    states: Model.hasMany(State, 'country_id')
    };
}
```

```typescript
import Model from 'silvie/database/model';
import City from 'models/city';

export default class State extends Model {
	static relations = {
	    cities: Model.hasMany(City, 'state_id')
    };
}
```

#### Model.belongsTo()
This method will create a reversed `one-to-many` relation between two models.
- **model** [<Model\>](models.md#model-class)
- **foreignKey** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **primaryKey?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If you don't specify the primary key column, It will use the model primary key be default.

```typescript
import Model from 'silvie/database/model';
import State from 'models/state';

export default class City extends Model {
	static relations = {
	    state: Model.belongsTo(State, 'state_id')
    };
}
```

#### Model.with()
This method specifies which relations should be fetched along with the current model. The specified relation names 
should be defined in the `relations` static property of your model class.   
- **...relationNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Note that if you want to fetch nested relations on a model, you are able to write nested relation names in this method 
by joining their name with a dot sign `'.'`. Take a look at the following example:

```typescript
const us = await Country.with('flag', 'states', 'states.cities')
                       .where('code', 'US')
                       .first();

console.log(us.states); // -> [{ name: 'Alabama', ... }, { name: 'Alaska', ... }, ...]

const [alabama] = us.states;
console.log(alabama.cities); // -> [{ name: 'Abbeville', ... }, { name: 'Adamsville', ... }, ...]

console.log(us.flag); // -> { filename: '/uploads/flags/us.png', ... }
```


## Model Instance
An instance of a model have some methods to let you do some essential operations on that specific instance. 

### Delete
#### model.delete()
This method will delete the underlying database record. If you have enabled soft deletes on your model, it will soft 
delete the record. Otherwise, it will remove the record from the database for good.

```typescript
const user = await User.find(4);

user.delete();
```

#### model.forceDelete()
This method will delete the record from the database without using the soft deletes even if it is enabled on the model.

```typescript
const user = await User.find(4);

user.forceDelete();
```


### Update
#### model.update()
This method will get an object and updates the database record using the object keys and values.
- **data** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **silent?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

If you don't want to touch the `updated_at` column when updating the record, you should pass a `true` value to the 
`silent` parameter.

```typescript
const user = await User.find(4);

user.update({
    name: 'Sam',
    age: 39
});
```

#### model.save()
When you are working with a model, you have access to its properties that are record fields. Use this method if you have changed the 
model, and you want to save your changes in the database.
- **silent?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
const user = await User.find(4);

user.name = 'Sam';
user.age = 39;

user.save();
``` 


### Data
#### model.fill()
This method will assign an object entries to the model instance. This can be used to fill a model with a data object.
- **data** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```typescript
const user = await User.find(4);

user.fill({
    name: 'Jim',
    family: 'Valentine'
});

user.save();
```

#### model.fresh()
This method will fetch and return a new fresh copy of the current instance from the database and returns.
 
```typescript
const user = await User.find(4);

user.name = 'Kanan';

const userCopy = user.fresh();
// This will contain the original 
// name form the database. since
// it is a new copy
```

#### model.refresh()
This method will reset all changes to the current instance by fetching its data from the database again. This will not 
affect the new custom properties that you may have set on that instance. It only overrides the properties matching the
database fields. 

```typescript
const user = await User.find(4);

user.name = 'George';
user.family = 'Walter';

user.refresh();
// The changes you've made to the user
// will be reverted to its original.
```
