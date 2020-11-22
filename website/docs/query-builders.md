---
id: query-builders
title: Query Builders
---

We've talked about how you can build and initialize your database using migrations and seeders. There is also another 
aspect of working with databases, which is running database queries to fetch or update your database. 

Writing queries in different databases, needs you to know the specific syntax of that database system. However, writing
raw database queries in your code would make it dirty and hard to maintain. There are some database helpers which come 
with a query builder feature to ease the process of writing queries.

## Query Builder
The query builder is upon the `Builder` pattern which allows you to glue different parts of your query then it will 
be converted to a query of that database. This will be done by the [database drivers](database.md#driver). Silvie has
a built-in query builder which is configured on the [Models](models.md) by default to point to the right table belonging 
to the model. 

### Constructor
To start using a query builder you need to create an instance of it. This can be done by using the `QueryBuilder` 
constructor which is located at `silvie/database/builders/query`. The constructor will accept a table name which is 
optional if you plan not to select data from an actual table.
- **tableName?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
import QueryBuilder from 'silvie/database/builders/query';

const qb = new QueryBuilder('users');
```

### Selections
#### qb.select()
The basic select method accepts one or more string parameters as column names and adds them to the selection collection.
- **...columns** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.select('name', 'family', 'age');
qb.select('phone', 'email');
// The result will fetch all these 5 columns
```

#### qb.selectCount()
To select the count of the result set, you can use this method, and you should provide an alias name for the aggregate 
column. 
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectCount('users_count');
```

#### qb.selectAverage()
You may also want to get the average of column, so you can pass the name of that column, and an alias name for the 
aggregate column to this method. Note that the average method only works for numeric columns.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectAverage('age', 'age_average');
```

#### qb.selectSum()
This method will select the summation of values of a column. This method accepts a column name and an alias name for the
aggregate column. Note that the sum method only works for numeric columns.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectSum('balance', 'total_users_balance');
```

#### qb.selectMin()
This method will select the minimum value of a column. Jus give it a column name and an alias name for the aggregate 
column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectMin('games_played', 'minimum_games_played');
```

#### qb.selectMax()
This method will add an aggregate selection to your query to select the maximum value of a column. You need to give it a
column name and an alias for the aggregate column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectMax('balance', 'maximum_user_balance');
```

#### qb.selectSub()
There are some cases that you need to do a complex query for a single column of your selection. You can pass a query 
builder to this method to do the sub selection. Note that your sub query needs to have only one column in its selection.
- **queryBuilder** [<QueryBuilder\>](query-builders.md#query-builder)
- **alias** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
qb.selectSub(
    new QueryBuilder('posts')
        .select('posts.id')
        .whereColumn('posts.user_id', 'users.id')
        .orderBy('posts.id', 'desc')
        .first(), 
    'latest_post_id'
);
```

#### qb.selectRaw()
If your database supports raw queries, you will be able to write a raw database query here. You should pass a query 
string, and a params array which defaults to an empty array `[]` if you don't specify it.
- **query** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **params?** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) default: `[]`

```typescript
qb.selectRaw("CONCAT(`name`, ' ', `family`) AS `fullname`");
// Selects the user fullname by concatenating the name and familty columns

qb.selectRaw(
    '(SELECT COUNT(*) FROM `comments` WHERE `comments`.`user_id` = `users`.`id` AND `comments`.`post_id` = ?) AS `commentes_on_post`', 
    [12]
);
// Selects the count of user comments on an specific post 
```

:::caution
The raw queries will be added to the final query untouched, so **use it if you know what you are doing**.
::: 

### Conditions
#### qb.where()
#### qb.whereNull()
#### qb.whereNotNull()
#### qb.whereBetween()
#### qb.whereNotBetween()
#### qb.whereIn()
#### qb.whereNotIn()
#### qb.whereLike()
#### qb.whereNotLike()
#### qb.whereColumn()
#### qb.whereDate()
#### qb.whereYear()
#### qb.whereMonth()
#### qb.whereDay()
#### qb.whereTime()
#### qb.whereRaw()

### Order
#### qb.orderBy()
This method will order the results by a given column. The direction can be specified by the second parameter which 
accepts `'asc'`, `'desc'`, `'ASC'` or `'DESC'` as its value. The direction parameter is optional and defaults to `ASC`.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **direction?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'ASC''`

```typescript
qb.orderBy('name');
// Orders results by an ascending order of 'name' field

qb.orderBy('created_at', 'DESC');
// Orders results by a descending order of 'created_at' field 
```

The order methods can be used more than once if you are going to order the results by multiple columns. For example, the
above code orders the result by their name and orders the records with the same name, by their creation dates.

#### qb.reorder()
This method will clear the previously set orders on the query builder instance. If you pass a column and a direction to it, 
it will set a new order on the query builder. 
- **column?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **direction?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'ASC''`

```typescript
qb.reorder();
// Clears the query order

qb.reorder('family');
// Clears order and sets a new order by 'family' field
```

#### qb.shuffle()
This method will order the results randomly which results to a shuffled result.
- **seed?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `''`

```typescript
qb.shuffle();
```

#### qb.orderByRaw()
You can write more complex order queries by using this method. This method will accept a query string and its 
parameters, And will add this query to your order clause untouched.
- **query** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **params?** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) default: `[]`

```typescript
qb.orderByRaw(
    '(SELECT COUNT(*) FROM `posts` WHERE `posts`.`user_id` = `users`.`id`) DESC'
);
```

For example, the above code will order the result by post count of each user. This code is just an example and has a 
very low performance, since it will run that sub query for each record.

:::caution
The raw queries will be added to the final query untouched, so **use it if you know what you are doing**.
:::

### Group
#### qb.groupBy()
This method will group the results with the given columns. It is often used with the aggregate selections.
- **...columns** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript {2}
const userPostCount = await qb.selectCount('post_count')
                              .groupBy('user_id')
                              .get();
```

The above code will return the count of posts for each user.

#### qb.groupByRaw()
This method will add a raw query to the group clause.
- **query** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **params?** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) default: `[]`

```typescript {3}
const userDailyPosts = qb.selectCount('daily_posts')
                         .join('posts', 'posts.user_id', 'users_id')
                         .groupByRaw('`users`.`id`, DATE(`posts`.`created_at`)')
                         .where('user.id', 2)
                         .get();
```

:::caution
The raw queries will be added to the final query untouched, so **use it if you know what you are doing**.
:::

### Offset
#### qb.offset()
This method will be used to skip a specified number of records and fetch the rest.
- **count** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

```typescript
qb.offset(10);
// This query won't fetch the first 10 records
```

#### qb.skip()
This is an equivalent of [offset()](#qboffset) method.
- **count** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

```typescript
qb.skip(10);
// This query won't fetch the first 10 records
```

### Limit
#### qb.limit()
This method will be used to limit the number of records that are going to be fetched.
- **count** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

```typescript
qb.limit(7);
// This will return the first 7 records

qb.offset(10).limit(5);
// This will skip the first 10 records
// And returns the next 5 records
```

#### qb.take()
This is an equivalent of [limit()](#qblimit) method.
- **count** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

```typescript
qb.take(7);
// This will return the first 7 records

qb.offset(10).take(5);
// This will skip the first 10 records
// And returns the next 5 records
```

### Joins
#### qb.join()
This method will do an [INNER JOIN](https://www.w3resource.com/sql/joins/perform-an-inner-join.php) between two tables.
- **table** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<QueryBuilder\>](query-builders.md#query-builder)
- **column1** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **operator?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **column2?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If the `table` parameter is a `string`, it will try to join that with an actual table. However, it is possible to do a 
join with another `QueryBuilder` which will be assumed as a sub query.

If the `column1` parameter is a `Function`, it will be used as a callback function which will get a 
[JoinConditionBuilder](query-builders.md#join-condition-builder) as its only parameter, and you need to specify the join condition criteria 
with that instance of join condition builder. 

If you pass a `string` to the `column1` parameter, It will be assumed as a column name and expects you specify the next 
parameter.

The `operator` parameter is a `string` and its value depends on `column2` parameter. If you specify a value for the 
`column2`, This parameter will be treated as an actual [operator](query-builders.md#toperator). If you don't specify a
`column2`, the `operator` parameter will be assumed as the `column2` parameter and operator will take its default which 
is `=`.

The `alias` parameter will set an alias for the joined table to be used as an abbreviation in other query parts.

This specification will apply to the rest of join methods as mention below.

#### qb.leftJoin()
This method will do a [LEFT JOIN](https://www.w3resource.com/sql/joins/perform-a-left-join.php) between two tables. 
- **table** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<QueryBuilder\>](query-builders.md#query-builder)
- **column1** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **operator?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **column2?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

For more information about what these parameters do, please read [join()](query-builders.md#qbjoin) method description.

#### qb.rightJoin()
This method will do a [RIGHT JOIN](https://www.w3resource.com/sql/joins/perform-a-right-join.php) between two tables. 
- **table** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<QueryBuilder\>](query-builders.md#query-builder)
- **column1** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **operator?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **column2?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

For more information about what these parameters do, please read [join()](query-builders.md#qbjoin) method description.

#### qb.crossJoin()
This method will do a [CROSS JOIN](https://www.w3resource.com/sql/joins/cross-join.php) between two tables. 
- **table** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<QueryBuilder\>](query-builders.md#query-builder)
- **column1** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **operator?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **column2?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

For more information about what these parameters do, please read [join()](query-builders.md#qbjoin) method description.

#### qb.outerJoin()
This method will do an [OUTER JOIN](https://www.w3resource.com/sql/joins/perform-an-outer-join.php) between two tables. 
- **table** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<QueryBuilder\>](query-builders.md#query-builder)
- **column1** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- **operator?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **column2?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **alias?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

For more information about what these parameters do, please read [join()](query-builders.md#qbjoin) method description.


### Unions
#### qb.union()
This method will add the results of a query builder to the end of the current query builder. Note that the columns, and 
their data types must be the same. The union will remove the duplicate records from your results by default, unless you
pass a `true` to the `all` parameter.
- **queryBuilder** [<QueryBuilder\>](query-builders.md#query-builder)
- **all?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `false`

```typescript
qb.select('name', 'family').union(
    new QueryBuilder('admins').select('name', 'family'),
    true
);
```

#### qb.unionRaw()
This method will be used when you want to write a custom select for the union clause. It accepts a query string, and a
parameter array. The union will remove the duplicate records from your results by default, unless you
pass a `true` to the `all` parameter.
- **query** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **params?** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) default: `[]`
- **all?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
qb.select('name', 'family').union(
    'SELECT `name`, `family` FROM `admins` WHERE `admins`.`id` > ?',
    [10],
    true
);
```

:::caution
The raw queries will be added to the final query untouched, so **use it if you know what you are doing**.
:::

### Fetch
#### qb.get()
This method will execute the query and returns an array of results. 

```typescript
const results = await qb.get();
```

#### qb.first()
This method will execute the query and returns the first entry of the result set. This is done by temporarily limiting 
the query itself. You may get a `null` if there was nothing found within the query criteria.

```typescript
const result = await qb.first();
```

#### qb.pluck()
Pluck method will return an array containing the values of a given column. It also will return a hash table if you 
specify a key column. This method will retrieve the data from the database and maps the results into an array or reduces 
it into a hash table. 
- **keyColumn** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **valueColumn?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **overwrite** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
const userIds = await qb.pluck('id');
// Returns an array of user ids

const userBalances = await qb.pluck('id', 'balance');
// Returns an object with 'id' keys and 'balance' values
```

When you specify a value column and expecting the method to return a hash table, by default it will throw an error if it
faces a duplicate key. You can set the `overwrite` parameter to `true` to overwrite the values for existing keys.

### Existence
#### qb.exists()
This method will return `true` if it finds one or more records in your query criteria.

```typescript {2}
const userExists = await qb.where('phone', '+18005551234')
                           .exists();
```

#### qb.doesntExist()
This method will return `true` if there were no records in the query criteria.

```typescript {2}
const isNewUser = await qb.where('phone', '+18005551234')
                          .doesntExist();
``` 

### Aggregates
#### qb.count()
This method will return the count of database records matching your query criteria. 

```typescript
const usersCount = await qb.count();
```

#### qb.average()
This method will return the average of a given column. This only works for a numeric column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const averageAge = await qb.average('age');
```

#### qb.sum()
This method will return the summation of a given column. This only works for a numeric column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const totalBalance = await qb.sum('balance');
```

#### qb.min()
This method will return the minimum value of a given column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const minimumAge = await qb.min('age');
```

#### qb.max()
This method will return the maximum value of a given column.
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const maximumBalance = await qb.max('balance');
```

### Update
#### qb.update()
This method will update the records matching your query with the given data. The object keys will be used as column
names, and their values will be set to them. This method will update all records with the same data. If you want to 
update multiple records with different data, you need to use [bulkUpdate()](#qbbulkupdate) method. 

Update will also update the `updated_at` column to the current date and time. This can be disabled by passing a `true` 
to `silent` parameter.
- **data** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- **silent?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
new QueryBuilder('users').where('id', 10).update({
    name: 'Silvie'
});
```

#### qb.bulkUpdate()
The bulk update will be used to update multiple records with different data. This is handy when reducing the update
queries in your application if you are doing multiple updates in a row. 

The `data` parameter is the dataset to be used for the update, and it must contain the keys to search for their 
corresponding records.

The `keys` parameter is an array of key names. This will indicate which keys of the dataset should be used to find each 
record. The keys that will not be mentioned in this parameter will be used to update the record.

Update will also update the `updated_at` column to the current date and time. This can be disabled by passing a `true` 
to `silent` parameter.
- **data** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **keys** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **silent** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

```typescript
new QueryBuilder('users').bulkUpdate(
    [
        {
            id: 2,
            name: 'Sarah',
            family: 'Connor'
        },
        {
            id: 52,
            name: 'Matthew',
            age: 33
        },
        {
            id: 21,
            balance: 21000
        }
    ],
    ['id']
);
```

The above code will update the `name` and the `family` of the user `2`, the `name` and the `age` of user `52` and
the balance of user `21`. 

### Delete
#### qb.delete()
This method will delete the records matching the query criteria.

```typescript
await new QueryBuilder('users').where('age', '<', 18).delete();
// This will delete all underaged users
```

#### qb.useSoftDeletes()
This method will just mark the query builder to be able to use [softDelete()](query-builders.md#qbsoftdelete) and 
[restore()](query-builders.md#qbrestore) methods. You need to call this method before calling those methods.

```typescript
qb.useSoftDeletes();
```

#### qb.softDelete()
This method will soft delete the records matching the query criteria. Soft deleting must be enabled on the table. This 
can be done by adding a `deleted_at` timestamp field to the table. If you are going to change the name of this field, 
you need needs to indicate the new name in the query builder options which can be done through the 
[extend()](query-builders.md#qbextend) method. You also need to call [useSoftDeletes()](query-builders.md#qbusesoftdeletes)
method before using this one.

```typescript
await new QueryBuilder('users').where('id', 12).softDelete();
// This will soft delete the user with id = 12
```

#### qb.restore()
This method will be used to restore soft deleted records. This is done by setting the soft delete field to `null`. 
Before using this method, you should enable soft deleting on your table, and on your query builder. The default soft 
delete column name is `deleted_at` which can be changed by [extend()](query-builders.md#qbextend). You also need to call
[useSoftDeletes()](query-builders.md#qbusesoftdeletes) before using this one.

```typescript
await new QueryBuilder('users').where('id', 12).restore();
// This will restore the soft deleted user with id = 12
```

### Insert
#### qb.insert()
This method will insert a dataset into the database table. The `ignore` parameter indicates weather to ignore duplicate
keys or not. Otherwise, it will throw a database error if you are inserting a duplicate key.
- **data** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **ignore?** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
new QueryBuilder('users').insert([
    {
        name: 'Hossein',
        family: 'Maktoobian',
        age: 23,    
    },
    {
    
        name: 'John',
        family: 'Doe',
        age: 45,
    },
]);
```

### Locks
#### qb.sharedLock()
#### qb.lockForUpdate()
#### qb.clearLock()

### Alias Table
#### qb.fromAliasTable()

### Other Methods
#### qb.clone()
This method will create a fresh independent copy of the query builder instance.

```typescript
const qbc = qb.clone();
```

#### qb.extend()
This method can be used to set options on the query builder instance. Use this method if you are familiar with the 
options structure and their valid values. Otherwise, just use the provided helper methods of the query builder.
 
```typescript
qb.extend({
    softDeleteTimestamp: 'removed_at', // Change default soft delete column name
    useTimestamps: false, // Disable using create and update timestamps
    processData: (data) => {  // Register a data processor
        console.log(data);
        return data;
    }
});
```

The full query builder options explanation will be added to documentation later.

## Condition Builders
### Having Condition Builder
### Where Condition Builder
### Join Condition Builder

## Types
### TOperator
Values of this type are strings matching the following list:
- =
- !=
- \>
- \>=
- <
- <=