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
- **params?** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

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
#### qb.orderByRaw()
#### qb.reorder()
#### qb.shuffle()

### Group
#### qb.groupBy()
#### qb.groupByRaw()

### Offset
#### qb.offset()
#### qb.skip()

### Limit
#### qb.limit()
#### qb.take()

### Joins
#### qb.join()
#### qb.leftJoin()
#### qb.rightJoin()
#### qb.crossJoin()
#### qb.outerJoin()

### Unions
#### qb.union()
#### qb.unionRaw()

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

```typescript
const userExists = qb.where('phone', '+18005551234').exists();
```

#### qb.doesntExist()
This method will return `true` if there were no records in the query criteria.

```typescript
const isNewUser = await qb.where('phone', '+18005551234').doesntExist();
``` 

### Aggregates
#### qb.count()
#### qb.average()
#### qb.sum()
#### qb.min()
#### qb.max()

### Update
#### qb.update()
#### qb.bulkUpdate()

### Delete
#### qb.delete()
#### qb.useSoftDeletes()
#### qb.softDelete()
#### qb.restore()

### Insert
#### qb.insert()

### Locks
#### qb.sharedLock()
#### qb.lockForUpdate()
#### qb.clearLock()

### Alias Table
#### qb.fromAliasTable()

### Other Methods
#### qb.extend()
#### qb.clone()
