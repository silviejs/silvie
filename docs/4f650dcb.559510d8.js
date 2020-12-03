(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{75:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return s})),a.d(t,"metadata",(function(){return i})),a.d(t,"rightToc",(function(){return l})),a.d(t,"default",(function(){return d}));var n=a(3),r=a(7),o=(a(0),a(99)),s={id:"data-loaders",title:"Data Loaders"},i={unversionedId:"data-loaders",id:"data-loaders",isDocsHomePage:!1,title:"Data Loaders",description:"GraphQL helps us build APIs faster, responds to many queries in a single request, you define a type system, and GraphQL",source:"@site/docs\\data-loaders.md",slug:"/data-loaders",permalink:"/docs/data-loaders",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/data-loaders.md",version:"current",sidebar:"docsSidebar",previous:{title:"Resolvers",permalink:"/docs/resolvers"},next:{title:"Migrations",permalink:"/docs/migrations"}},l=[{value:"How It Works",id:"how-it-works",children:[]},{value:"Creating Data Loaders",id:"creating-data-loaders",children:[]},{value:"Loading Data Loaders",id:"loading-data-loaders",children:[]},{value:"Using Data Loaders",id:"using-data-loaders",children:[]},{value:"Fetching Data",id:"fetching-data",children:[]}],c={rightToc:l};function d(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},c,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"GraphQL helps us build APIs faster, responds to many queries in a single request, you define a type system, and GraphQL\nhandles the rest. I'm going to hold you there for a second. "),Object(o.b)("p",null,"What happens if there was a nested type structure? What happens if the client requests a complex nested query? Let's\nlook at an example here:"),Object(o.b)("p",null,"You have a ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," type, a ",Object(o.b)("inlineCode",{parentName:"p"},"Comment")," type and a ",Object(o.b)("inlineCode",{parentName:"p"},"User")," type."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"A Post has many Comments"),Object(o.b)("li",{parentName:"ul"},"A Comment belongs to a User")),Object(o.b)("p",null,"Take a look at this GraphQL query:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-graphql"}),"{\n    posts {\n        id\n        title\n        \n        comments {\n            id\n            text\n            \n            user {\n                id\n                name\n                picture\n            }\n        }\n    }\n}\n")),Object(o.b)("p",null,"Saying that we have 10 posts in our database, and each post has 20 comments. There will be ",Object(o.b)("strong",{parentName:"p"},"1")," database query to fetch\nall posts, then we go through each post and fetch comments for that specific post, which will require ",Object(o.b)("strong",{parentName:"p"},"10")," queries to\nfetch the comments for all those 10 posts. Then you need a query for each comment to fetch its user, and yes, that needs\n",Object(o.b)("strong",{parentName:"p"},"200")," database queries to get the job done. 211 queries for a single request is not a reasonable number. Data loaders\nwill address this very well. "),Object(o.b)("p",null,"Silvie integrated ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.npmjs.com/package/dataloader"}),"dataloader")," package and used it in its GraphQL server."),Object(o.b)("h2",{id:"how-it-works"},"How It Works"),Object(o.b)("p",null,"Data loaders handle nested queries by batching queries of the same type in each level. They have a ",Object(o.b)("inlineCode",{parentName:"p"},"load()")," method that\nwill accept a key, then it passes the collection of keys that need to be loaded to their callback function, and you need\nto map those keys to their corresponding data. "),Object(o.b)("h2",{id:"creating-data-loaders"},"Creating Data Loaders"),Object(o.b)("p",null,"A data loader can be created manually if you know the exact syntax. Otherwise, you can\n",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/cli#make"}),"create one by using Silvie CLI"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"silvie make dataloader user\n")),Object(o.b)("p",null,"This command will create a file named ",Object(o.b)("inlineCode",{parentName:"p"},"user.ts")," in ",Object(o.b)("inlineCode",{parentName:"p"},"src/graphql/dataloaders")," directory of your project with the\nfollowing content:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"import DataLoader from 'dataloader';\n\nexport default (): any => {\n    return new DataLoader(async (keys: number[]) => {\n        const results = keys.map((key: number) => {\n            // Map keys with corresponding data\n\n            return key;\n        });\n\n        return Promise.resolve(results);\n    });\n};\n")),Object(o.b)("p",null,"This command can be executed along with other entity maker commands like ",Object(o.b)("inlineCode",{parentName:"p"},"model maker")," or ",Object(o.b)("inlineCode",{parentName:"p"},"schema maker")," by passing an\nextra ",Object(o.b)("inlineCode",{parentName:"p"},"-d")," or ",Object(o.b)("inlineCode",{parentName:"p"},"--dataloader")," option to those makers."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"silvie make schema user -Mmsrd\n# Creates model, migration, schema, resolver and data loader\n# for the User entity\n")),Object(o.b)("h2",{id:"loading-data-loaders"},"Loading Data Loaders"),Object(o.b)("p",null,"You need to import all data loaders and pass them the main bootstrap function of Silvie. The data loaders collection\nshould be assigned to ",Object(o.b)("inlineCode",{parentName:"p"},"dataLoaders")," property of the bootstrap function parameter."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"import bootstrap from 'silvie/bootstrap';\n\nimport schemas from 'graphql/schemas';\nimport resolvers from 'graphql/resolvers';\nimport dataLoaders from 'graphql/dataloaders';\n\nbootstrap({ schemas, resolvers, dataLoaders });\n")),Object(o.b)("h2",{id:"using-data-loaders"},"Using Data Loaders"),Object(o.b)("p",null,"The data loaders are accessible from ",Object(o.b)("inlineCode",{parentName:"p"},"loaders")," property of ",Object(o.b)("inlineCode",{parentName:"p"},"context")," parameter of a resolver. ",Object(o.b)("inlineCode",{parentName:"p"},"context.loaders")," property\nis an object, which its keys are the filenames of your data loaders. For example if you have a ",Object(o.b)("inlineCode",{parentName:"p"},"user.ts")," in your data\nloaders directory, you can access it by ",Object(o.b)("inlineCode",{parentName:"p"},"context.loaders.user"),". "),Object(o.b)("p",null,"This example will show you an example to fetch post comments."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"export default {\n    // ...\n\n    Post: {\n        // ...\n\n        comments({ id }, params, context): Promise<Comment[]> {\n            return context.loaders.post_comments.load(id) as Promise<Comment[]>;\n        }\n        \n        // ...\n    }\n    \n    // ...\n};\n")),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"post_comments")," data loader accepts a post id, and it is responsible to fetch an array of comments for that post."),Object(o.b)("p",null,"As another example, You need to load the user who posted a comment for every single comment out there. This is done by\nthe ",Object(o.b)("inlineCode",{parentName:"p"},"user")," data loader:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"export default {\n    // ...\n\n    Comment: {\n        // ...\n\n        user({ user_id }, params, context): Promise<User> {\n            return context.loaders.user.load(user_id) as Promise<User>;\n        }\n        \n        // ...\n    }\n    \n    // ...\n};\n")),Object(o.b)("p",null,"You give the data loader the ",Object(o.b)("inlineCode",{parentName:"p"},"user_id")," of each comment, and the data loader should return a user for the id passed to\nit.  "),Object(o.b)("h2",{id:"fetching-data"},"Fetching Data"),Object(o.b)("p",null,"Data loader will give you an array of keys that you gave it earlier in your resolver, and expects you to fetch a value\nfor each on of those keys. "),Object(o.b)("p",null,"The following data loader will load all comments of a post by using a collection of their post ids."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"import DataLoader from 'dataloader';\nimport Comment from 'models/comment';\n\nexport default (): any => {\n    // Given a collection of keys which are post ids\n    return new DataLoader(async (keys: number[]) => {\n        // Load all comments related to the keys\n        const comments = await Comment.whereIn('post_id', keys).get();\n\n        // Map each post id to its corresponding comments\n        const results = keys.map((key: number) => {\n            return comments.filter(comment => comment.post_id === key);\n        });\n\n        return Promise.resolve(results);\n    });\n};\n")),Object(o.b)("p",null,"The following data loader will handle loading users by a collection of their ids:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"import DataLoader from 'dataloader';\nimport User from 'models/user';\n\nexport default (): any => {\n    // Given a collection of keys which are user ids\n    return new DataLoader(async (keys: number[]) => {\n        // Load all user with those ids\n        const users = await User.whereIn('id', keys).get();\n\n        // Map each id to its corresponding user\n        const results = keys.map((key: number) => {\n            return users.find(user => user.id === key);\n        });\n\n        return Promise.resolve(results);\n    });\n};\n")),Object(o.b)("p",null,"Data loaders will reduce a significant amount of data base requests. Try to use them in order to increase your\napplication performance."))}d.isMDXComponent=!0},99:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return b}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=r.a.createContext({}),d=function(e){var t=r.a.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=d(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=d(a),u=n,b=p["".concat(s,".").concat(u)]||p[u]||m[u]||o;return a?r.a.createElement(b,i(i({ref:t},c),{},{components:a})):r.a.createElement(b,i({ref:t},c))}));function b(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,s=new Array(o);s[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:n,s[1]=i;for(var c=2;c<o;c++)s[c]=a[c];return r.a.createElement.apply(null,s)}return r.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);