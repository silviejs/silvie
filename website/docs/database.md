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
instance is accessible all over the application. You just need to import it from `silvie/lib/database`.

## Driver
Database class is just a proxy class which delegates its responsibilities to its driver, since it is designed to support
various database systems. A driver is another class which needs to do the following:

- Initiate a connection to the database
- Interpret [QueryBuilder](query-builders.md)s into actual queries
- Execute queries on the database and return the results
- Close the connection to the database

By using this system, you tell a query builder what needs to be done. Then the query builder, tells the database helper
what you need, and the database asks its driver to do the job. We will discuss query builders later.

## Database
 