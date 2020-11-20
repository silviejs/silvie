---
id: seeders
title: Seeders
---

Database seeders will be used to seed the database with some initial data. Database seeders need to be run when you are
initializing your database, just after you run your migrations.

## Seeder 
A seeder is just a class which implements `ISeeder` interface. ISeeder makes the class implement a method called 
`seed()` which will be run when you [run your seeder through the CLI](cli.md#seed).

There is also an `order` static property which indicates the order of seeder execution. This will be used when you are
running all your migrations all at once. If you don't define this property, Silvie takes `0` as its default value and 
may result in an unexpected behavior when you run all your migrations. So it is recommended to define this static 
property with a proper value. 

## Create new Seeder
You can create a seeder manually or by [using the make command of Silvie CLI](cli.md#make). The following command will
create a `roles.ts` file in `src/database/seeders`:

```bash
silvie make seeder roles
```

Note that you can use this command along with other entity makers. The following command will create a `Role` model, a 
`roles` migration and a `roles` seeder.

```bash
silvie make model Role -mS
```


## Writing Seeders
After you created a seeder class and organized its order, You need to do the seeding job in the `seed()` method. You can 
either create your data with your models or insert them manually with raw database commands. An empty database seeder 
will look like this:

```typescript
import ISeeder from 'silvie/database/migration/seeder';

export default class RolesTableSeeder implements ISeeder {
	static order = 1;

	async seed() {
		// Seed the table here
	}
};
```

### Using Models 
Your models can be imported into the seeders to ease the seeding process. Here is an example of the `roles` which uses 
the `Role` model.

```typescript
import ISeeder from 'silvie/database/migration/seeder';
import Role from 'models/role';

export default class RolesTableSeeder implements ISeeder {
	static order = 1;

	async seed() {
		await Role.insert([
            { name: 'Admin' },
            { name: 'Maintainer' },
            { name: 'Editor' },
            { name: 'Author' }
        ]);
	}
};
```

This example will create 4 roles in the database.
  
### Using Database 
You can also use the [database helper](database.md#databaseraw). The above example with raw MySQL queries will be like 
this:

```typescript
import ISeeder from 'silvie/database/migration/seeder';
import Database from 'silvie/database';

export default class RolesTableSeeder implements ISeeder {
	static order = 1;

	async seed() {
		await Database.raw(
            'INSERT INTO `roles`(`name`) VALUES (?), (?), (?), (?)', 
            [
                'Admin',
                'Maintainer',
                'Editor',
                'Author'
            ]
        );
	}
};
```

The result will be same as the previous example.
