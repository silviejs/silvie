(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{52:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return s}));var a=n(2),r=(n(0),n(92));const i={id:"schemas",title:"Schemas"},o={unversionedId:"schemas",id:"schemas",isDocsHomePage:!1,title:"Schemas",description:"The first essential thing to a GraphQL server is the schemas to define the type system of your application. You define",source:"@site/docs/schemas.md",slug:"/schemas",permalink:"/docs/schemas",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/schemas.md",version:"current",sidebar:"docsSidebar",previous:{title:"Routing",permalink:"/docs/routing"},next:{title:"Resolvers",permalink:"/docs/resolvers"}},l=[{value:"Loading Schemas",id:"loading-schemas",children:[]},{value:"Creating Schemas",id:"creating-schemas",children:[]},{value:"Defining Type",id:"defining-type",children:[{value:"Default Types",id:"default-types",children:[]},{value:"Built-in Types",id:"built-in-types",children:[]}]},{value:"Creating a Query",id:"creating-a-query",children:[]},{value:"Creating a Mutation",id:"creating-a-mutation",children:[]}],c={rightToc:l};function s({components:e,...t}){return Object(r.b)("wrapper",Object(a.a)({},c,t,{components:e,mdxType:"MDXLayout"}),Object(r.b)("p",null,"The first essential thing to a GraphQL server is the schemas to define the type system of your application. You define\nTypes, Queries, Mutations, etc in a schema. Schema files must be stored in the ",Object(r.b)("inlineCode",{parentName:"p"},"src/graphql/schemas")," directory of your\nproject. "),Object(r.b)("h2",{id:"loading-schemas"},"Loading Schemas"),Object(r.b)("p",null,"You need to load them at runtime, so they will be transpiled to their JS object notation and pass them to the\nmain Silvie bootstrap function. It must be assigned to an object property named ",Object(r.b)("inlineCode",{parentName:"p"},"schemas")," like this: "),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),"import bootstrap from 'silvie/bootstrap';\n\nimport schemas from 'graphql/schemas';\nimport resolvers from 'graphql/resolvers';\nimport dataLoaders from 'graphql/dataloaders';\n\nbootstrap({ schemas, resolvers, dataLoaders });\n")),Object(r.b)("p",null,"A schema file is file with ",Object(r.b)("inlineCode",{parentName:"p"},".gql")," or ",Object(r.b)("inlineCode",{parentName:"p"},".graphql")," extension. Entities in schema files need to be defined with the\n",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://graphql.org/learn/schema/#type-language"}),"GraphQL Type Language"),". "),Object(r.b)("p",null,"Since this is not a tutorial about the GraphQL type language, we do not focus on what it is capable of. You can learn\nmore about it in ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://graphql.org/learn/schema/"}),"GraphQL Schemas and Types")," on its\n",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://graphql.org"}),"official website"),"."),Object(r.b)("h2",{id:"creating-schemas"},"Creating Schemas"),Object(r.b)("p",null,"You can either create a ",Object(r.b)("inlineCode",{parentName:"p"},".gql")," file by your self and start writing everything from scratch, or\n",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/cli#make"}),"create a schema using the Silvie CLI"),"."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"silvie make schema Book\n")),Object(r.b)("p",null,"This will result into a file named ",Object(r.b)("inlineCode",{parentName:"p"},"book.gql")," in the ",Object(r.b)("inlineCode",{parentName:"p"},"src/graphql/schemas")," directory with a ",Object(r.b)("inlineCode",{parentName:"p"},"Book")," type and two queries\nto fetch a single book and all books."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"type Book {\n        id: Int!\n}\n\nextend type Query {\n        book(id: Int!): Book\n        books: [Book]\n}\n")),Object(r.b)("p",null,"Note that if you are building your system on GraphQL, You can create schemas and resolvers when you are creating\nentities. For example, the following command will create a ",Object(r.b)("strong",{parentName:"p"},"Book model"),", a ",Object(r.b)("strong",{parentName:"p"},"books migration"),", a\n",Object(r.b)("strong",{parentName:"p"},"book schema")," and a ",Object(r.b)("strong",{parentName:"p"},"book resolver"),"."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"silvie make model Book --migration --schema --resolver\n\n# Short form\nsilvie make model Book -msr\n")),Object(r.b)("h2",{id:"defining-type"},"Defining Type"),Object(r.b)("p",null,"A GraphQL type will be identified with the ",Object(r.b)("inlineCode",{parentName:"p"},"type")," keyword followed by the type name. The properties will be specified in\na pair of curly braces."),Object(r.b)("h3",{id:"default-types"},"Default Types"),Object(r.b)("p",null,"GraphQL comes with a few basic data types (",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://graphql.org/learn/schema/#scalar-types"}),"according to official docs"),")\nwhich you can use without any configuration:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Int"),": Signed 32-bit integer"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Float"),": Signed double-precision floating-point value"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"String"),": Signed UTF-8 Character sequence"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Boolean"),": ",Object(r.b)("inlineCode",{parentName:"li"},"true")," or ",Object(r.b)("inlineCode",{parentName:"li"},"false")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"ID"),": An scalar type representing a unique identifier. It")),Object(r.b)("h3",{id:"built-in-types"},"Built-in Types"),Object(r.b)("p",null,"Also, Silvie has a couple of useful built-in types in case you need to use them in your application. Keep in mind that\nyou need to enable ",Object(r.b)("inlineCode",{parentName:"p"},"Upload")," and ",Object(r.b)("inlineCode",{parentName:"p"},"JSON")," types if you want to use them. ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/configuration#graphql"}),"GraphQL Configuration"),"\ntells your more about enabling these types."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Query"),": A wrapper to contain all your queries"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Mutation"),": A wrapper to contain all your mutations"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"Upload"),": Represents a ",Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/graphql#upload"}),"Upload")," value"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"File"),": Represents a ",Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/graphql#file"}),"File")," value"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"JSON"),": Represents any valid ",Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/graphql#json"}),"JSON")," value"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"JSONObject"),": Represents a ",Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/graphql#jsonobject"}),"JSON Object")," value")),Object(r.b)("p",null,"An example type would be like this:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"type Book {\n    id: ID!\n\n    title: String!\n    author: String!\n    ISBN: String!\n\n    rating: Float!\n}\n")),Object(r.b)("h2",{id:"creating-a-query"},"Creating a Query"),Object(r.b)("p",null,"A GraphQL query should be defined in the ",Object(r.b)("inlineCode",{parentName:"p"},"Query")," type. GraphQL allows you to add methods and properties to your types by\nextending them. This will help you split your GraphQL schemas into separate files. Silvie implemented an empty Query\ntype behind the scenes. So you just need to extend the query type and add your query definitions. "),Object(r.b)("p",null,"The following query will take no parameters and returns an array of ",Object(r.b)("inlineCode",{parentName:"p"},"User"),"s as the result:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"extend type Query {\n    users: [Users]\n}\n")),Object(r.b)("p",null,"The following query will take a ",Object(r.b)("inlineCode",{parentName:"p"},"key")," to search for and returns an array of ",Object(r.b)("inlineCode",{parentName:"p"},"SearchResult")," as the result, which is a\nunion of ",Object(r.b)("inlineCode",{parentName:"p"},"Books")," and ",Object(r.b)("inlineCode",{parentName:"p"},"Movies"),":"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"union SearchResult = Book | Movie\n\nextend type Query {\n    search(key: String!): [SearchResult]\n}\n")),Object(r.b)("h2",{id:"creating-a-mutation"},"Creating a Mutation"),Object(r.b)("p",null,"Mutations are another kind of queries that are meant to be used for manipulating the data on the server. They should be\ndefined in the ",Object(r.b)("inlineCode",{parentName:"p"},"Mutation")," type. Silvie also creates an empty ",Object(r.b)("inlineCode",{parentName:"p"},"Mutation")," type when it is initializing the GraphQL server\nto let you add your mutations by extending the type."),Object(r.b)("p",null,"This is an example of a mutation that takes user credentials and returns the login results as a ",Object(r.b)("inlineCode",{parentName:"p"},"JSONObject")," in the\nresponse:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"extend type Mutation {\n    login(username: String!, pasword: String!): JSONObject!\n}\n")))}s.isMDXComponent=!0},92:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),p=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},b=function(e){var t=p(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),b=p(n),m=a,d=b["".concat(o,".").concat(m)]||b[m]||u[m]||i;return n?r.a.createElement(d,l(l({ref:t},s),{},{components:n})):r.a.createElement(d,l({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);