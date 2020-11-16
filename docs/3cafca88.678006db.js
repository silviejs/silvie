(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{65:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return l})),a.d(t,"metadata",(function(){return o})),a.d(t,"rightToc",(function(){return d})),a.d(t,"default",(function(){return s}));var r=a(2),n=a(6),i=(a(0),a(93)),l={id:"middlewares",title:"Middlewares"},o={unversionedId:"middlewares",id:"middlewares",isDocsHomePage:!1,title:"Middlewares",description:"Middlewares are useful when you want to handle some specific or all routes before they get to the route handler. Things",source:"@site/docs/middlewares.md",slug:"/middlewares",permalink:"/docs/middlewares",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/middlewares.md",version:"current",sidebar:"docsSidebar",previous:{title:"Controllers",permalink:"/docs/controllers"},next:{title:"Routing",permalink:"/docs/routing"}},d=[{value:"Creating a Middleware",id:"creating-a-middleware",children:[]},{value:"Loading Middlewares",id:"loading-middlewares",children:[]},{value:"Middleware Decorator",id:"middleware-decorator",children:[]},{value:"Middleware Handler",id:"middleware-handler",children:[]},{value:"Route Middlewares",id:"route-middlewares",children:[]}],c={rightToc:d};function s(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},c,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Middlewares are useful when you want to handle some specific or all routes before they get to the route handler. Things\nlike authenticating the user, cleaning the request body, CSRF protection, etc, could be done by using middlewares."),Object(i.b)("h2",{id:"creating-a-middleware"},"Creating a Middleware"),Object(i.b)("p",null,"A middleware is a class with a ",Object(i.b)("inlineCode",{parentName:"p"},"handler")," method which will be attached either to the HTTP server globally or to a single\nroute. You can ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/cli#make"}),"create a new middleware with Silvie CLI"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"silvie make middleware auth\n")),Object(i.b)("p",null,"This command will create a ",Object(i.b)("inlineCode",{parentName:"p"},"auth.ts")," file in ",Object(i.b)("inlineCode",{parentName:"p"},"src/middleware")," of your project. The class name will be ",Object(i.b)("inlineCode",{parentName:"p"},"AuthMiddleware"),"\nand adds the decorator to register it as the ",Object(i.b)("inlineCode",{parentName:"p"},"auth")," middleware. The result will be:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import IMiddleware, { middleware } from 'silvie/http/middleware';\n\n@middleware('auth')\nexport default class AuthMiddleware implements IMiddleware {\n    handler(request: any, response: any, next: () => void): void {\n        // Handle request here\n\n        next();\n    }\n}\n")),Object(i.b)("h2",{id:"loading-middlewares"},"Loading Middlewares"),Object(i.b)("p",null,"Since middlewares are being registered by decorators, You need to import them all before you call the core bootstrap\nfunction of Silvie.  "),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import 'controllers';\n")),Object(i.b)("p",null,"This type of import utilizes ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.npmjs.com/package/babel-plugin-wildcard-import"}),"babel-plugin-wildcard-import"),"\nto import all files in a directory. Just importing the controllers will cause the method decorators to execute and\nregister the route handlers in the application."),Object(i.b)("h2",{id:"middleware-decorator"},"Middleware Decorator"),Object(i.b)("p",null,"There are some cases that you want a middleware to handle all requests that comes to your application. For example, a\nmiddleware to trim all request parameters that are being sent to the server. The ",Object(i.b)("inlineCode",{parentName:"p"},"@middleware")," decorator will register\na class implementing ",Object(i.b)("inlineCode",{parentName:"p"},"IMiddleware")," as a middleware in your application. The registered middlewares do nothing by default\nin your application, until you assign them to a route or register them as global middlewares."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"name")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"global")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">"))),Object(i.b)("p",null,"This code will register a middleware with ",Object(i.b)("inlineCode",{parentName:"p"},"csrf")," name to be used later on the route handlers."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import IMiddleware, { middleware } from 'silvie/http/middleware';\n\n@middleware('csrf')\nexport default class CSRFMiddleware implements IMiddleware {\n    handler(request: any, response: any, next: () => void): void {\n        // Check for CSRF token in the request\n\n        next();\n    }\n}\n")),Object(i.b)("p",null,"The following code will register the ",Object(i.b)("inlineCode",{parentName:"p"},"trimmer")," middleware as a global middleware, which will be fired on every request."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import IMiddleware, { middleware } from 'silvie/http/middleware';\n\n@middleware('trimmer', true)\nexport default class TrimmerMiddleware implements IMiddleware {\n    handler(request: any, response: any, next: () => void): void {\n        // Trim the strings in the request body\n\n        next();\n    }\n}\n")),Object(i.b)("h2",{id:"middleware-handler"},"Middleware Handler"),Object(i.b)("p",null,"A middleware needs to implement a ",Object(i.b)("inlineCode",{parentName:"p"},"handler")," method which will be registered as the middleware handler later. The handler\ntakes three parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"req"),": ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://expressjs.com/en/5x/api.html#req"}),"<Request",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"res"),": ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://expressjs.com/en/5x/api.html#res"}),"<Response",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"next"),": ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function"}),"<Function",">"))),Object(i.b)("p",null,"In the handler method you need to process the incoming request and either send a response to the user or call the next\nhandler in the queue."),Object(i.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(i.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(i.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"Handler Queue")),Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(i.b)("p",{parentName:"div"},"Middlewares and route handlers will be queued in as an array of handlers and will be called one by one when the route\nhas triggered with a request."))),Object(i.b)("h2",{id:"route-middlewares"},"Route Middlewares"),Object(i.b)("p",null,"Unless global middlewares that are being attached to all requests, You can specify one or more middlewares to execute on\na specific route handler. This is done by using the ",Object(i.b)("inlineCode",{parentName:"p"},"@withMiddleware")," decorator located at ",Object(i.b)("inlineCode",{parentName:"p"},"silvie/http/controller"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import Controller, { route, withMiddleware } from 'silvie/http/controller';\n\nexport default class BooksController implements Controller {\n    @route('PUT', '/register')\n    @withMiddleware('csrf', 'no-auth')\n    async getBook(req: any, res: any): void {\n        // Handle the registration process\n\n        res.send('Register Response');\n    }\n}\n")),Object(i.b)("p",null,"In this example we are adding ",Object(i.b)("inlineCode",{parentName:"p"},"csrf")," and ",Object(i.b)("inlineCode",{parentName:"p"},"no-auth")," middlewares to the ",Object(i.b)("inlineCode",{parentName:"p"},"/register")," route. When the client sends a request\nto this route, the ",Object(i.b)("inlineCode",{parentName:"p"},"csrf")," middleware executes first and passes the request to the ",Object(i.b)("inlineCode",{parentName:"p"},"no-auth")," middleware and then the\nrequest will be passed to the route handler method. "),Object(i.b)("div",{className:"admonition admonition-caution alert alert--warning"},Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(i.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"}),Object(i.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})))),"caution")),Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(i.b)("p",{parentName:"div"},"Note that this decorator can only be used once on a route handler. If you use it more, it will overwrite the middlewares\nthat was set in the previous calls to this decorator. "))))}s.isMDXComponent=!0},93:function(e,t,a){"use strict";a.d(t,"a",(function(){return b})),a.d(t,"b",(function(){return u}));var r=a(0),n=a.n(r);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var c=n.a.createContext({}),s=function(e){var t=n.a.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},b=function(e){var t=s(e.components);return n.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},m=n.a.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=d(e,["components","mdxType","originalType","parentName"]),b=s(a),m=r,u=b["".concat(l,".").concat(m)]||b[m]||p[m]||i;return a?n.a.createElement(u,o(o({ref:t},c),{},{components:a})):n.a.createElement(u,o({ref:t},c))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=m;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var c=2;c<i;c++)l[c]=a[c];return n.a.createElement.apply(null,l)}return n.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);