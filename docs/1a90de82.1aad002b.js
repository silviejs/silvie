(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{64:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return i})),a.d(t,"rightToc",(function(){return s})),a.d(t,"default",(function(){return c}));var l=a(3),n=a(7),r=(a(0),a(99)),o={id:"models",title:"Models"},i={unversionedId:"models",id:"models",isDocsHomePage:!1,title:"Models",description:"Silvie brings models to action, to make it easier to work with your database entities. A model is some kind of",source:"@site/docs\\models.md",slug:"/models",permalink:"/docs/models",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/models.md",version:"current",sidebar:"docsSidebar",previous:{title:"Query Builders",permalink:"/docs/query-builders"},next:{title:"Validator",permalink:"/docs/validator"}},s=[{value:"Model Class",id:"model-class",children:[{value:"Table Name",id:"table-name",children:[]},{value:"Query Builder",id:"query-builder",children:[]},{value:"Constructor",id:"constructor",children:[]},{value:"Properties",id:"properties",children:[]},{value:"Fetch",id:"fetch",children:[]},{value:"Create",id:"create",children:[]},{value:"Delete",id:"delete",children:[]},{value:"Relations",id:"relations",children:[]}]},{value:"Model Instance",id:"model-instance",children:[{value:"Delete",id:"delete-1",children:[]},{value:"Update",id:"update",children:[]},{value:"Data",id:"data",children:[]}]}],b={rightToc:s};function c(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(r.b)("wrapper",Object(l.a)({},b,a,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"Silvie brings models to action, to make it easier to work with your database entities. A model is some kind of\n",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"/docs/query-builders"}),"query builder")," which is configured to work with its own table and reduces the effort of creating a\nquery builder instance from scratch. "),Object(r.b)("h2",{id:"model-class"},"Model Class"),Object(r.b)("p",null,"The 'Model' class can be imported from ",Object(r.b)("inlineCode",{parentName:"p"},"silvie/database/model"),". However, you don't need to do this your self. You can\nalways create a new model with ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"/docs/cli#make"}),"Silvie CLI"),"."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-bash"}),"silvie make model User\n")),Object(r.b)("p",null,"Since the model is the main entity that you can define in a Silvie application, you can create other related entities in\na single command."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-bash"}),"silvie make model User -msr\n")),Object(r.b)("p",null,"The above command will create a Model, a Migration, a Schema and a Resolver for your ",Object(r.b)("inlineCode",{parentName:"p"},"User")," entity. By running this\ncommand, a file named ",Object(r.b)("inlineCode",{parentName:"p"},"user.ts")," will be created in ",Object(r.b)("inlineCode",{parentName:"p"},"src/models")," directory of your project with the following content:"),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\n\nexport default class User extends Model {\n    declare id: number;\n}\n")),Object(r.b)("h3",{id:"table-name"},"Table Name"),Object(r.b)("p",null,"The name of a table will be the ",Object(r.b)("inlineCode",{parentName:"p"},"plural name")," of the model class name in ",Object(r.b)("inlineCode",{parentName:"p"},"snake case"),". When you create a model with\nSilvie CLI, it will be automatically created with the singular form of your provided name. For example, the table name\nfor the ",Object(r.b)("inlineCode",{parentName:"p"},"User")," model will be ",Object(r.b)("inlineCode",{parentName:"p"},"users"),". "),Object(r.b)("p",null,"You can always set a custom table name for your models by using the static ",Object(r.b)("inlineCode",{parentName:"p"},"tableName")," property of that specific class."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\n\nexport default class User extends Model {\n    static tableName = 'employees';\n\n    declare id: number;\n}\n")),Object(r.b)("h3",{id:"query-builder"},"Query Builder"),Object(r.b)("p",null,"The models came to help you with your query builders. The model class will create a base query builder that is\nconfigured to work with the table belonging to that model. It also registers a data processor callback on the query\nbuilder to cast the fetched results into instances of that model, and sets the other query related model properties on\nits query builder."),Object(r.b)("h4",{id:"methods"},"Methods"),Object(r.b)("p",null,"You are able to use all available methods of a query builder instance, directly from a model by their equivalent static\nmethods. All of these methods will pass their properties to the ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"#modelbasequerybuilder"}),"baseQueryBuilder"),", acting as a\nproxy between the model and query builder."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.where('name', 'John').get();\n// Fetches all users with the name 'John'\n\nPost.leftJoin('users', 'users.id', 'posts.user_id').get();\n// Fetches all posts joined with their user\n")),Object(r.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(r.b)("div",Object(l.a)({parentName:"div"},{className:"admonition-heading"}),Object(r.b)("h5",{parentName:"div"},Object(r.b)("span",Object(l.a)({parentName:"h5"},{className:"admonition-icon"}),Object(r.b)("svg",Object(l.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(r.b)("path",Object(l.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(r.b)("div",Object(l.a)({parentName:"div"},{className:"admonition-content"}),Object(r.b)("p",{parentName:"div"},"We are not going to go through all these methods since they are exactly the same as their query builder equivalents.\nRead more about query builder methods on ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"/docs/query-builders#query-builder"}),"Query Builder")," section."))),Object(r.b)("h4",{id:"modelbasequerybuilder"},"Model.baseQueryBuilder"),Object(r.b)("p",null,"If you want to access the configured query builder of you model you can use this property."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.baseQueryBuilder.where('id', '<', 5).get();\n")),Object(r.b)("h4",{id:"modelextendbasequerybuilder"},"Model.extendBaseQueryBuilder()"),Object(r.b)("p",null,"There are some times that you need to modify the base query builder of your model. You can override this static method\nto add your custom features to the base query builder."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\n\nexport default class User extends Model {\n    static extendBaseQueryBuilder(queryBuilder) {\n        queryBuilder.where('active', true);\n    }\n    // The basic query builder will \n    // restrict to active users only\n}\n")),Object(r.b)("h3",{id:"constructor"},"Constructor"),Object(r.b)("p",null,"The model constructor accepts an ",Object(r.b)("inlineCode",{parentName:"p"},"object")," as its only parameter to initialize a new instance with that initial data. It\nacts like casting that object into an instance of the model. This behavior will also be used to cast database results."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"initialData?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"}),"<object",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = new User({\n    name: 'John',\n    family: 'Doe',\n    age: 22,\n});\n")),Object(r.b)("h3",{id:"properties"},"Properties"),Object(r.b)("h4",{id:"modeltablename"},"Model.tableName"),Object(r.b)("p",null,"This property specifies the table name of the model, which is ",Object(r.b)("inlineCode",{parentName:"p"},"''")," by default. If you don't set a value for this\nproperty, it will be set by ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"#modeltable"}),"table")," property based on the model class name. "),Object(r.b)("h4",{id:"modeltable"},"Model.table"),Object(r.b)("p",null,"This read only property will contain the table name of the model. If you haven't specify the ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"#modeltablename"}),"tableName"),"\nproperty on your model, it tries to pluralize the class name and turn it into snake case to be considered as table name."),Object(r.b)("h4",{id:"modelprimarykey"},"Model.primaryKey"),Object(r.b)("p",null,"This property will specify the primary key column name for the current model. It is set to ",Object(r.b)("inlineCode",{parentName:"p"},"'id'")," by default. This can\nbe a ",Object(r.b)("inlineCode",{parentName:"p"},"string")," or ",Object(r.b)("inlineCode",{parentName:"p"},"an array of strings")," for those models with multiple primary keys. "),Object(r.b)("h4",{id:"modelusetimestamps"},"Model.useTimestamps"),Object(r.b)("p",null,"This property is a boolean value indicating weather to use ",Object(r.b)("inlineCode",{parentName:"p"},"create")," and ",Object(r.b)("inlineCode",{parentName:"p"},"update")," timestamps or not. This is ",Object(r.b)("inlineCode",{parentName:"p"},"true")," by\ndefault."),Object(r.b)("h4",{id:"modelcreatetimestamp"},"Model.createTimestamp"),Object(r.b)("p",null,"This property will specify the create timestamp column name which is set to ",Object(r.b)("inlineCode",{parentName:"p"},"'created_at'")," by default. "),Object(r.b)("h4",{id:"modelupdatetimestamp"},"Model.updateTimestamp"),Object(r.b)("p",null,"This property will specify the update timestamp column name which its default value is ",Object(r.b)("inlineCode",{parentName:"p"},"'updated_at'"),"."),Object(r.b)("h4",{id:"modelsoftdeletetimestamp"},"Model.softDeleteTimestamp"),Object(r.b)("p",null,"This property will specify the soft delete timestamp column name which is ",Object(r.b)("inlineCode",{parentName:"p"},"'deleted_at'")," by default."),Object(r.b)("h4",{id:"modelusesoftdeletes"},"Model.useSoftDeletes"),Object(r.b)("p",null,"Setting this property to ",Object(r.b)("inlineCode",{parentName:"p"},"true"),", will enable soft deletes on the model and its query builder. The default value for\nthis property is ",Object(r.b)("inlineCode",{parentName:"p"},"false"),"; "),Object(r.b)("h4",{id:"modelrelations"},"Model.relations"),Object(r.b)("p",null,"This property is an object of relations between its class and other models. The keys of this object will be relation\nnames, and their value must be a model relation. This will be discussed in detail in ",Object(r.b)("a",Object(l.a)({parentName:"p"},{href:"#relations"}),"Relations")," section. "),Object(r.b)("h3",{id:"fetch"},"Fetch"),Object(r.b)("h4",{id:"modelall"},"Model.all()"),Object(r.b)("p",null,"This method will fetch all records from the table, and returns an array of your model type."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.all();\n// returns all users in an array\n")),Object(r.b)("h4",{id:"modelfind"},"Model.find()"),Object(r.b)("p",null,"This method will search for a value on primary key column and returns that record. If the record was not found in the\ndatabase, it will return ",Object(r.b)("inlineCode",{parentName:"p"},"null"),"; "),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"id")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">"))),Object(r.b)("p",null,"If you only have a single column for your primary key, you will only need to pass a single value to the ",Object(r.b)("inlineCode",{parentName:"p"},"id")," parameter.\nBut, if you have multiple columns for your primary key, you need to pass an array of values in the same order of your\nprimary keys to the ",Object(r.b)("inlineCode",{parentName:"p"},"id")," parameter."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.find(41);\n// Returns the user with id 41\n")),Object(r.b)("p",null,"Saying we have a ",Object(r.b)("inlineCode",{parentName:"p"},"PostRating")," model which contains a foreign key for the user id and another foreign key for the\npost id which they are also primary keys. ",Object(r.b)("inlineCode",{parentName:"p"},"primaryKey = ['user_id', 'post_id']"),". The following code example will\nreturn a post rating which belongs to user ",Object(r.b)("inlineCode",{parentName:"p"},"12")," and post ",Object(r.b)("inlineCode",{parentName:"p"},"7"),"."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"PostRating.find([12, 7]);\n")),Object(r.b)("h4",{id:"modelfindall"},"Model.findAll()"),Object(r.b)("p",null,"This method will take one or more keys to look for. Then it will return the records that was found with those given ids."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"...ids")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[][]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.find(1, 5, 10);\n// Returns the users with ids 1, 5, 10\n")),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"PostRating.find([12, 7], [13, 2], [1, 5]);\n// Returns the post ratings with those key combinations\n")),Object(r.b)("p",null,"In addition to these methods you can always use the query builder methods on the model class to fetch your records from\nthe database. However, it will be a little painful to handle complex primary keys to find what you are looking for. Take\na look at the following code examples:"),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.whereIn(id, [1, 5, 10]).get();\n// Returns the users with ids 1, 5, 10\n\nPost.whereLike('title', '%New York%').first();\n// Fetches the first post with a title\n// containing 'New York'\n")),Object(r.b)("h3",{id:"create"},"Create"),Object(r.b)("h4",{id:"modelcreate"},"Model.create()"),Object(r.b)("p",null,"This method will create a record in the database with the given object keys and values.    "),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"data")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"}),"<object",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"shouldReturn?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(r.b)("inlineCode",{parentName:"li"},"true"))),Object(r.b)("p",null,"Indicating weather to return the created record after it was created or not. This will make an extra query on the\ndatabase. So set it to ",Object(r.b)("inlineCode",{parentName:"p"},"false")," if you don't want to use it after the creation. If the value of this parameter is ",Object(r.b)("inlineCode",{parentName:"p"},"false"),"\nthen it will return the id of the inserted record."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.create({\n    name: 'Sonya',\n    family: 'Grats',\n    age: 19\n});\n")),Object(r.b)("h3",{id:"delete"},"Delete"),Object(r.b)("h4",{id:"modeldelete"},"Model.delete()"),Object(r.b)("p",null,"This method will delete a record of that model using the given id. If you have enabled soft deletes in your model, it\nwill use that to delete the record. Otherwise, the record will be deleted physically from the database."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"id")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.delete(5);\n")),Object(r.b)("h4",{id:"modeldeleteall"},"Model.deleteAll()"),Object(r.b)("p",null,"This method will take an array ids as its parameters, and deletes all records found with those ids. If you have\nenabled soft deletes, the records will be soft deleted. Otherwise, they will be deleted physically."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"...ids")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[][]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.deleteAll(5, 6, 7);\n")),Object(r.b)("h4",{id:"modelrestore"},"Model.restore()"),Object(r.b)("p",null,"This method will restore a soft deleted record with a given id. It only works if you have enabled soft deletes on your\nmodel. "),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"id")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.restore(6);\n")),Object(r.b)("h4",{id:"modelrestoreall"},"Model.restoreAll()"),Object(r.b)("p",null,"This method will restore soft deleted records found with the give ids in its parameters. This only works if your have\nenabled soft deletes on your model. "),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"...ids")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[][]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.restoreAll(4, 5, 7);\n")),Object(r.b)("h4",{id:"modelforcedelete"},"Model.forceDelete()"),Object(r.b)("p",null,"This method will get an id and deletes the underlying record found with that id."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"id")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.forceDelete(10);\n")),Object(r.b)("h4",{id:"modelforcedeleteall"},"Model.forceDeleteAll()"),Object(r.b)("p",null,"This method will delete records found with the given ids from the database."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"...ids")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[]",">")," | ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/query-builders#tbasevalue"}),"<TBaseValue[][]",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"User.forceDeleteAll(7, 8, 9);\n")),Object(r.b)("h3",{id:"relations"},"Relations"),Object(r.b)("p",null,"Model relations are a way to bind your models together. They are useful to fetch different entities within a single\ndatabase query. The fetched relation data will be bundled into your reference model and will be accessible by the name\nthat you provided for the relation name. Here are the relation methods that a model can have:"),Object(r.b)("h4",{id:"modelhasone"},"Model.hasOne()"),Object(r.b)("p",null,"This method will create a ",Object(r.b)("inlineCode",{parentName:"p"},"one-to-one")," relation between two models."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"model")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/models#model-class"}),"<Model",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"foreignKey")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"primaryKey?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(r.b)("p",null,"If you don't specify the primary key column, It will use the model primary key be default."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\nimport NationalFlag from 'models/national_flag';\n\nexport default class Country extends Model {\n    static relations = {\n        flag: Model.hasOne(NationalFlag, 'country_id')\n    };\n}\n")),Object(r.b)("h4",{id:"modelhasmany"},"Model.hasMany()"),Object(r.b)("p",null,"This method will create a ",Object(r.b)("inlineCode",{parentName:"p"},"one-to-many")," relation between two models."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"model")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/models#model-class"}),"<Model",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"foreignKey")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"primaryKey?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(r.b)("p",null,"If you don't specify the primary key column, It will use the model primary key be default."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\nimport State from 'models/state';\n\nexport default class Country extends Model {\n    static relations = {\n        states: Model.hasMany(State, 'country_id')\n    };\n}\n")),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\nimport City from 'models/city';\n\nexport default class State extends Model {\n    static relations = {\n        cities: Model.hasMany(City, 'state_id')\n    };\n}\n")),Object(r.b)("h4",{id:"modelbelongsto"},"Model.belongsTo()"),Object(r.b)("p",null,"This method will create a reversed ",Object(r.b)("inlineCode",{parentName:"p"},"one-to-many")," relation between two models."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"model")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"/docs/models#model-class"}),"<Model",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"foreignKey")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"primaryKey?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(r.b)("p",null,"If you don't specify the primary key column, It will use the model primary key be default."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"import Model from 'silvie/database/model';\nimport State from 'models/state';\n\nexport default class City extends Model {\n    static relations = {\n        state: Model.belongsTo(State, 'state_id')\n    };\n}\n")),Object(r.b)("h4",{id:"modelwith"},"Model.with()"),Object(r.b)("p",null,"This method specifies which relations should be fetched along with the current model. The specified relation names\nshould be defined in the ",Object(r.b)("inlineCode",{parentName:"p"},"relations")," static property of your model class.   "),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"...relationNames")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string[]",">"))),Object(r.b)("p",null,"Note that if you want to fetch nested relations on a model, you are able to write nested relation names in this method\nby joining their name with a dot sign ",Object(r.b)("inlineCode",{parentName:"p"},"'.'"),". Take a look at the following example:"),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const us = await Country.with('flag', 'states', 'states.cities')\n                       .where('code', 'US')\n                       .first();\n\nconsole.log(us.states); // -> [{ name: 'Alabama', ... }, { name: 'Alaska', ... }, ...]\n\nconst [alabama] = us.states;\nconsole.log(alabama.cities); // -> [{ name: 'Abbeville', ... }, { name: 'Adamsville', ... }, ...]\n\nconsole.log(us.flag); // -> { filename: '/uploads/flags/us.png', ... }\n")),Object(r.b)("h2",{id:"model-instance"},"Model Instance"),Object(r.b)("p",null,"An instance of a model have some methods to let you do some essential operations on that specific instance. "),Object(r.b)("h3",{id:"delete-1"},"Delete"),Object(r.b)("h4",{id:"modeldelete-1"},"model.delete()"),Object(r.b)("p",null,"This method will delete the underlying database record. If you have enabled soft deletes on your model, it will soft\ndelete the record. Otherwise, it will remove the record from the database for good."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.delete();\n")),Object(r.b)("h4",{id:"modelforcedelete-1"},"model.forceDelete()"),Object(r.b)("p",null,"This method will delete the record from the database without using the soft deletes even if it is enabled on the model."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.forceDelete();\n")),Object(r.b)("h3",{id:"update"},"Update"),Object(r.b)("h4",{id:"modelupdate"},"model.update()"),Object(r.b)("p",null,"This method will get an object and updates the database record using the object keys and values."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"data")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"}),"<object",">")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"silent?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(r.b)("inlineCode",{parentName:"li"},"false"))),Object(r.b)("p",null,"If you don't want to touch the ",Object(r.b)("inlineCode",{parentName:"p"},"updated_at")," column when updating the record, you should pass a ",Object(r.b)("inlineCode",{parentName:"p"},"true")," value to the\n",Object(r.b)("inlineCode",{parentName:"p"},"silent")," parameter."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.update({\n    name: 'Sam',\n    age: 39\n});\n")),Object(r.b)("h4",{id:"modelsave"},"model.save()"),Object(r.b)("p",null,"When you are working with a model, you have access to its properties that are record fields. Use this method if you have changed the\nmodel, and you want to save your changes in the database."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"silent?")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(r.b)("inlineCode",{parentName:"li"},"false"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.name = 'Sam';\nuser.age = 39;\n\nuser.save();\n")),Object(r.b)("h3",{id:"data"},"Data"),Object(r.b)("h4",{id:"modelfill"},"model.fill()"),Object(r.b)("p",null,"This method will assign an object entries to the model instance. This can be used to fill a model with a data object."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"data")," ",Object(r.b)("a",Object(l.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"}),"<object",">"))),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.fill({\n    name: 'Jim',\n    family: 'Valentine'\n});\n\nuser.save();\n")),Object(r.b)("h4",{id:"modelfresh"},"model.fresh()"),Object(r.b)("p",null,"This method will fetch and return a new fresh copy of the current instance from the database and returns."),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.name = 'Kanan';\n\nconst userCopy = user.fresh();\n// This will contain the original \n// name form the database. since\n// it is a new copy\n")),Object(r.b)("h4",{id:"modelrefresh"},"model.refresh()"),Object(r.b)("p",null,"This method will reset all changes to the current instance by fetching its data from the database again. This will not\naffect the new custom properties that you may have set on that instance. It only overrides the properties matching the\ndatabase fields. "),Object(r.b)("pre",null,Object(r.b)("code",Object(l.a)({parentName:"pre"},{className:"language-typescript"}),"const user = await User.find(4);\n\nuser.name = 'George';\nuser.family = 'Walter';\n\nuser.refresh();\n// The changes you've made to the user\n// will be reverted to its original.\n")))}c.isMDXComponent=!0},99:function(e,t,a){"use strict";a.d(t,"a",(function(){return d})),a.d(t,"b",(function(){return m}));var l=a(0),n=a.n(l);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,l)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,l,n=function(e,t){if(null==e)return{};var a,l,n={},r=Object.keys(e);for(l=0;l<r.length;l++)a=r[l],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)a=r[l],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var b=n.a.createContext({}),c=function(e){var t=n.a.useContext(b),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},d=function(e){var t=c(e.components);return n.a.createElement(b.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},u=n.a.forwardRef((function(e,t){var a=e.components,l=e.mdxType,r=e.originalType,o=e.parentName,b=s(e,["components","mdxType","originalType","parentName"]),d=c(a),u=l,m=d["".concat(o,".").concat(u)]||d[u]||p[u]||r;return a?n.a.createElement(m,i(i({ref:t},b),{},{components:a})):n.a.createElement(m,i({ref:t},b))}));function m(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=a.length,o=new Array(r);o[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:l,o[1]=i;for(var b=2;b<r;b++)o[b]=a[b];return n.a.createElement.apply(null,o)}return n.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);