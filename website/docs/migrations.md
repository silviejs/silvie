---
id: migrations
title: Migrations
---

Your application may work with different types of databases, and creating your database schemas in each kind of them, 
will require a different syntax and considerations. Silvie have prepared the database migrations for this case. Database
migrations will help you create your database schemas with a unified syntax and migrate them later to any supported kind 
of database. They also let you commit your schema changes to your VCS and roll back to any state of your database schema.

## Migration
Migrations are located at `src/database/migrations`. A migration is a Typescript file containing a class which is 
implementing `IMigration` interface, therefore, it has to implement an `up()` and a `down()` method. The `up()` method 
will be used when you are migrating a schema into the database. The `down()` method will be used when you are rolling a 
migration back.

### Create New Migration
To create a new migration you can create a class matching what we have described above, or 
[use the Silvie Cli to create a new migration](cli.md#make). The following command will create a new migration with the
given name in the migrations' directory.

```bash
silvie make migration cars
```

This will create a file named `cars.ts` in the `src/database/migrations` directory with the following content:

```typescript
import IMigration from 'silvie/database/migration/migration';
import Schema from 'silvie/database/migration/schema';

export default class CarsTableMigration implements IMigration {
	static order = 1;

	async up() {
		await Schema.create('cars', (table) => {
			table.id();
			table.timestamps();
		});
	}

	async down() {
		await Schema.dropIfExists('cars');
	}
};
```

Since this command is an entity maker command you can use it along with the other entity makers. For example, the 
following command will make a `model`, a `migration`, a `schema` and a `resolver` for the Car entity. Check the 
[make command](cli.md#make) to learn more.

```bash
silvie make model Car -m -s -r
```

### Execution Order
The migration class should also have a static property called `order` which is a number to indicate the order of 
migration execution if they are being migrated all at once. If this property is not defined or not a numeric value, 
Silvie takes `0` as their default order. Those migrations without an order property, which have some foreign key 
constraints, might cause some unexpected results when you are executing them. 

## Schema
Schema is a helper class to migrate your entities into the database. A schema can either be created or be deleted. It 
has 3 static methods as follows:

#### Schema.create()
This method will create a schema in your database. It accepts a table name, and a callback function. The callback 
function will receive a [Table](#table) instance to let you define your table.  
- **tableName** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **tableCallback** [<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

```typescript
Schema.create('users', (table: Table) => {
    table.id();
    table.string('name');
    table.string('username').unique();
    table.string('email').unique();
    table.string('password');
    table.timestamps();
});
```

The code above will return a promise that will resolve when the table is created in your database.

#### Schema.drop()
This method will delete a table from your database. It only accepts a table name. Drop method will cause an error if the
table does not exist. You may want to use [Schema.dropIfExists()](#schemadropifexists) to prevent existence errors.

```typescript
Schema.drop('users');
```

This method will return a promise which resolves whenever your table is deleted from the database, and rejects if an 
error occur.

#### Schema.dropIfExists()
This method will delete a table from the database, just like `Schema.drop()`, but It won't cause an error if the table 
does not exist.
 
```typescript
Schema.dropIfExists('users');
```

This method will return a promise which resolves whenever your table is deleted, and it rejects if a database error 
occur.

## Table
Table is a Builder class to make it easy to create table schemas using its methods. The methods will return a 
[Column](#column) instance, so you can configure the column properties.

### Numeric Columns
#### table.id()
This method will create an `auto incrementing` `unsigned` `big integer` `primary key` column with the name `id`.

#### table.tinyIncrements()
This method will create an `auto incrementing` `unsigned` `tiny integer` `primary key` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.smallIncrements()
This method will create an `auto incrementing` `unsigned` `small integer` `primary key` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.mediumIncrements()
This method will create an `auto incrementing` `unsigned` `medium integer` `primary key` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.increments()
This method will create an `auto incrementing` `unsigned` `integer` `primary key` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.bigIncrements()
This method will create an `auto incrementing` `unsigned` `big integer` `primary key` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.tinyInteger()
This method will create a `tiny integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.smallInteger()
This method will create a `small integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.mediumInteger()
This method will create a `medium integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.integer()
This method will create an `integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.bigInteger()
This method will create a `big integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


#### table.unsignedTinyInteger()
This method will create an `unsigned` `tiny integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.unsignedSmallInteger()
This method will create an `unsigned` `small integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.unsignedMediumInteger()
This method will create an `unsigned` `medium integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.unsignedInteger()
This method will create an `unsigned` `integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.unsignedBigInteger()
This method will create an `unsigned` `big integer` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.bit()
This method will create a `bit` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.boolean()
This method will create a `boolean` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.decimal()
This method will create a `decimal` column with the given name. You may also define a `precision` and a `scale` for the 
decimal value.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **precision** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- **scale** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### table.unsignedDecimal()
This method will create an `unsigned` `decimal` column with the given name. You may also define a `precision` and a 
`scale` for the decimal value.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **precision** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- **scale** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### table.float()
This method will create a `float` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.double()
This method will create a `double` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


### Text Columns
#### table.character()
This method will create a `character` column with the given name. You can define a length for that column. In some 
databases this is equivalent of `CHAR` data type. 
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **length** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `255`

#### table.string()
This method will create a `string` column with the given name. You can also define a length for the column. In some 
databases this is equivalent of `VARCHAR` data type. 
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **length** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `255`

#### table.tinyText()
This method will create a `tiny text` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.mediumText()
This method will create a `medium text` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.text()
This method will create a `text` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.longText()
This method will create a `long text` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Date Columns
#### table.year()
This method will create a `year` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.date()
This method will create a `date` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.time()
This method will create a `time` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.datetime()
This method will create a `datetime` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.timestamp()
This method will create a `timestamp` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.timestamps()
This method will create two `timestamp` columns with `created_at` and `updated_at` which their default value is the current 
timestamp.

#### table.softDelete()
This method will create a `nullable` `timestamp` column named `deleted_at`, with a `null` default value. 

### Binary Columns
#### table.binary()
This method will create a `binary` column with the given name. You can also specify a length for that column.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **length** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `255`

#### table.tinyBlob()
This method will create a `tiny blob` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.mediumBlob()
This method will create a `medium blob` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.blob()
This method will create a `blob` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.longBlob()
This method will create a `long blob` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Spatial Columns
#### table.geometry()
#### table.point()
#### table.lineString()
#### table.polygon()
#### table.geometryCollection()
#### table.multiPoint()
#### table.multiLineString()
#### table.multiPolygon()

### Collection Columns
#### table.enum()
This method will create a `enum` column with the given name. You need to specify an array of string values for the 
accepted values of `enum` column. 
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **values** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.set()
This method will create a `set` column with the given name. You may also need to specify an array of string values for 
the accepted values of `set` column.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **values** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.json()
This method will create a `json` column with the given name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Other Columns
#### table.ipAddress()
This method will create a `string` column with the given name, and `45` length.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.macAddress()
This method will create a `string` column with the given name, and `17` length.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.uuid()
This method will create a `string` column with the given name, and `36` length.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Indices
#### table.primary()
This method will mark the given columns as `primary` columns. Primary indexed columns should be unique and not null.
If you specify more than one primary key, your primary key will be a compound key, which also needs to be defined in its
corresponding model. The default model primary key name is `id` when try to fetch records by their keys. This can be 
configured by setting the `primaryKey` static property on the model class.
- **columnNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.unique()
This method will mark the given columns as `unique` columns.
- **columnNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.index()
This method will index the given columns. It is recommended to index foreign key columns to achieve a better performance.
- **columnNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.fullTextIndex()
This method will create a `full text index` on the given columns. Full text indexed columns can be used in a full text 
search query.
- **columnNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### table.spatialIndex()
This method will create a spatial index on the given columns.
- **columnNames** [<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


## Column
Column is a builder class which can be used to define a column. The methods return `this` when they are done, so they 
can be chained together to reach a simpler syntax.

#### Column()
The column constructor will get a column properties and returns the configured instance. However, the third parameter is
optional.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **type** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **size** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- **options** [<object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Attributes
#### column.autoIncrement()
This method will make a numeric column increment its value when a record will be created.

#### column.nullable()
This method will make the column nullable.

#### column.unsigned()
This method will mark a numeric column as unsigned.

### Default
#### column.default()
This method will set a default value for the column if no value provided to that column when a record is being created.
- **value** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
[<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) |
[<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)

#### column.useCurrent()
This method will set a default value of current time stamp for a date type column.

### Encoding
#### column.charset()
This method will set the character set of the column.
- **charset** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### column.collate()
This method will set the collation of the column.
- **collation** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### Indices
#### column.primary()
This method will mark the column as a `primary key` column.

#### column.unique()
This method will mark the column as a `unique` column.

#### column.index()
This method will index the column with the given index name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### column.fullTextIndex()
This method will create a full text index on the column with the given index name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

#### column.spatialIndex()
This method will create a spatial index on the column with the given index name.
- **name** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
