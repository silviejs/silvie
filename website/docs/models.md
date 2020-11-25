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
- **ids** [<TBaseValue[]\>](query-builders.md#tbasevalue) | [<TBaseValue[][]\>](query-builders.md#tbasevalue)

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


### Insert
#### Model.create()
#### Model.insert()


### Update
#### Model.bulkUpdate()


### Delete
#### Model.delete()
#### Model.deleteAll()
#### Model.restore()
#### Model.restoreAll()
#### Model.forceDelete()
#### Model.forceDeleteAll()


### Relations
#### Model.with()
#### Model.hasOne()
#### Model.hasMany()
#### Model.belongsTo()
#### Model.belongsToMany()


## Model Instance
### Delete
#### model.delete()
#### model.forceDelete()


### Update
#### model.update()
#### model.save()


### Other
#### model.fill()
#### model.fresh()
#### model.refresh()
