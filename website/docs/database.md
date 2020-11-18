---
id: database
title: Database Helper
sidebar_label: Database
---

Silvie has a database helper to make it easier to communicate with your database. When you are working with raw database
queries you might end up with a hardly readable, maintainable and debuggable code. Also, there are some differences in
different DBMS SQL syntax. There are some packages out there that help with this. For example, you explain what you need
to fetch from the database in Javascript and that library will execute a query and returns the results for you. 

Silvie has a built-in database helper to handle this kind of problem. Database class is a singleton class which its 
instance is accessible all over the application. You just need to import it from `silvie/database`.

## Database
Database class is just a proxy class which delegates its responsibilities to its driver, in order to support various
database systems. For example, we create a MySQL driver and configure the database helper to use the MySQL driver. When
the application starts, database will initialize a singleton instance and its driver. Then when you want to do something
with the database, it will forward your request to the driver and returns the results.

#### Database.getInstance()
This is a static method to return the pre built instance of the database class, for the sake of singleton pattern. 
However, you don't need to do this on your own, since the database module returns the database instance as its default
export, but you can access the `Database` class itself by importing it as a named export of database module. 

```typescript
import { Database } from 'silvie/database';

const db = Database.getInstance();
```

:::caution
In order to keep the code samples clean on this page, we are using sample variable name to demonstrate query builders.
You can learn more about writing query builders in [Query Builders](query-builders.md) section.
:::

#### database.init()
The init method is responsible to initialize the driver by passing the configurations to its constructor. This method 
will run automatically when Silvie starts. You don't usually need to run this on your own. This will update the database 
instance and its driver.

```typescript
database.init();
```

### Select
#### database.select()
This method will be used to select some records from the database. It accepts a query builder and returns a promise to 
handle the response. Response will be an `array of record objects`.
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 

```typescript
const users = await database.select(usersQueryBuilder);
```

#### database.exists()
This method will check weather any record with the conditions defined in a query builder exist or not. This method will 
accept a query builder and returns a `boolean` as the response. 
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const userHasLisence = await database.exists(userLisenceQueryBuilder);
```

### Aggregate
#### database.count()
This method will return the `number` of records that a query builder points to. 
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 

```typescript
const postsCount = await database.count(postsQueryBuilder);
```

#### database.average()
This method will get the average value of a column in all records that the query builder points to, and returns a 
`number` as the result.
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const postAverageRating = await database.average(postRatingsQueryBuilder, 'rating');
``` 

#### database.sum()
This method will return a `number` as the summation of a column in all records that the query builder points to.
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const totalDonations = await database.sum(donationsQueryBuilder, 'price_paid');
```  

#### database.min()
This method will return the minimum value of a column in the query builder's records. The return value may vary 
depending on the type of the column.
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 

```typescript
const minimumUsersAge = await database.min(usersQueryBuilder, 'age');
``` 

#### database.max()
This method will return the maximum value of a column in the query builder's records. The return value may vary 
depending on the type of the column.
- **queryBuilder** [<QueryBuilder\>](query-builders.md) 
- **column** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 

```typescript
const maximumDonation = await database.min(donationsQueryBuilder, 'amount');
``` 

### Insert
#### database.insert()
This method will insert data to a table. The table and the data will be defined in the query builder.
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const result = await database.insert(newCategoriesQueryBuilder);
```  

### Update
#### database.update()
This method will update the records of a table. The update table, conditions and data will be defined in the query 
builder.
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const result = await database.update(updateUserProfileQueryBuilder);
```   

#### database.bulkUpdate()
The bulk update will be used to update different records with different data. You need to build a query builder for that
purpose and pass it to this method. 
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const result = await database.bulkUpdate(updateEditorsBalanceQueryBuilder);
```  

### Delete
#### database.delete()
This method will delete records from the database. The condition to find the records will be defined in the query 
builder.
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const result = await database.delete(deleteUserAccountQueryBuilder);
```
 
 
 
#### database.softDelete()
This method will soft delete records in the database. Soft delete is a technique used to mark database records as 
deleted. This technique usually uses an additional column in that table. In silvie this record is `deleted_at` which is 
a timestamp. You can learn more about soft deletes in [Soft Deletes part of Migrations](migrations.md#soft-deletes) section.   
- **queryBuilder** [<QueryBuilder\>](query-builders.md)

```typescript
const result = await database.softDelete(deleteUserCommentQueryBuilder);
```

#### database.restore()
This method will restore soft deleted records, by nullifying their soft delete column.
- **queryBuilder** [<QueryBuilder\>](query-builders.md)
 
```typescript
const result = await database.restore(undeleteUserCommentQueryBuilder);
```

### Schema
#### database.createTable()
This method will create a table with the given table definition. A table definition contains all columns and constraints
of a table. To learn more about tables, read [Table part of Migrations](migrations.md#table) section.
- **table** [<Table\>](migrations.md#table) 

```typescript
const result = await database.createTable(employeesTable);
```

#### database.truncateTable()
This method will delete all records from a table, and resets the auto increment value to its default.
- **tableName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const result = await database.truncateTable('logs');
```
 
 
#### database.dropTable()
This method will delete a table from the database. It will throw an error if the table does not exist.
- **tableName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const result = await database.dropTable('visits');
```
 
 
#### database.dropTableIfExists()
This method will delete a table from the database if that table exists.
- **tableName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
const result = await database.dropTableIfExists('logs');
```
 

### Other
#### database.raw()
This method executes a raw query on the database. This method is only working for those databases working with 
structured query languages *(aka SQL)*. The raw method takes a query as its first parameter which is a string, and a
parameter array which will bind into the query parameter placeholders. By default, the parameters option is an empty 
array.
- **query** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
- **params** [<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

```typescript
const users = await database.raw('SELECT * FROM `users`');
// This will return all user records

const user = await database.raw('SELECT * FROM `post` WHERE id = ?', [ 22 ]);
// This will return the record for a post 
// where its id is 22

const result = await database.raw('ALTER TABLE `users` ADD COLUMN `username` AFTER `name`');
// This will add a 'username' column 
// after the 'name' column of 'users' table
```

#### database.checkForeignKeys()
This method will specify weather to care for foreign key constraints or not. Foreign keys might cause problems when we 
are trying to create a table, update records or insert data into a table. 
- **state** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
await database.checkForeignKeys(true);
// Enables the foreign key checks

await database.checkForeignKeys(false);
// Disables the foreign key checks
```

There are two alias methods for this method, with a more meaningful name to enable/disable foreign key checks in a 
database. These methods don't take any parameters.

```typescript
await database.enableForeignKeyChecks();
// and
await database.disableForeignKeyChecks();
```

#### database.closeConnection()
This method will close the underlying database connection.

```typescript
database.closeConnection();
``` 

## Driver
A database driver needs to handle the communication with its corresponding database system. Currently, Silvie only 
supports `mysql`.

A driver needs to handle these responsibilities.
- Initiate a connection to the database
- Interpret commands into actual queries
- Implement all methods required by the database class
- Execute queries on the database and return the results
- Close the connection to the database

The database driver needs to implement the core functionality for all methods mentioned above. Because the database 
class forwards everything to its driver.
