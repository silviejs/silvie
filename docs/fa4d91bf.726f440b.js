(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{101:function(e,t,a){"use strict";var n=a(0),r=a(102);t.a=function(){var e=Object(n.useContext)(r.a);if(null==e)throw new Error("`useUserPreferencesContext` is used outside of `Layout` Component.");return e}},102:function(e,t,a){"use strict";var n=a(0),r=Object(n.createContext)(void 0);t.a=r},92:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return O})),a.d(t,"metadata",(function(){return h})),a.d(t,"rightToc",(function(){return v})),a.d(t,"default",(function(){return f}));var n=a(2),r=a(6),o=a(0),c=a.n(o),i=a(93),l=a(101),s=a(94),b=a(89),p=a.n(b);const u=37,d=39;var m=function(e){const{block:t,children:a,defaultValue:n,values:r,groupId:i,className:b}=e,{tabGroupChoices:m,setTabGroupChoices:j}=Object(l.a)(),[O,h]=Object(o.useState)(n),[v,y]=Object(o.useState)(!1);if(null!=i){const e=m[i];null!=e&&e!==O&&r.some((t=>t.value===e))&&h(e)}const f=e=>{h(e),null!=i&&j(i,e)},g=[],N=e=>{e.metaKey||e.altKey||e.ctrlKey||y(!0)},w=()=>{y(!1)};return Object(o.useEffect)((()=>(window.addEventListener("keydown",N),window.addEventListener("mousedown",w),()=>{window.removeEventListener("keydown",N),window.removeEventListener("mousedown",w)})),[]),c.a.createElement("div",null,c.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(s.a)("tabs",{"tabs--block":t},b)},r.map((({value:e,label:t})=>c.a.createElement("li",{role:"tab",tabIndex:0,"aria-selected":O===e,className:Object(s.a)("tabs__item",p.a.tabItem,{"tabs__item--active":O===e}),style:v?{}:{outline:"none"},key:e,ref:e=>g.push(e),onKeyDown:e=>{((e,t,a)=>{switch(a.keyCode){case d:((e,t)=>{const a=e.indexOf(t)+1;e[a]?e[a].focus():e[0].focus()})(e,t);break;case u:((e,t)=>{const a=e.indexOf(t)-1;e[a]?e[a].focus():e[e.length-1].focus()})(e,t)}})(g,e.target,e),N(e)},onFocus:()=>f(e),onClick:()=>{f(e),y(!1)},onPointerDown:()=>y(!1)},t)))),c.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},o.Children.toArray(a).filter((e=>e.props.value===O))[0]))};var j=function(e){return c.a.createElement("div",null,e.children)},O={id:"installation",title:"Installation"},h={unversionedId:"installation",id:"installation",isDocsHomePage:!1,title:"Installation",description:"Requirements",source:"@site/docs/installation.mdx",slug:"/installation",permalink:"/docs/installation",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/installation.mdx",version:"current",sidebar:"docsSidebar",previous:{title:"Contribution",permalink:"/docs/contribution"},next:{title:"Directory Structure",permalink:"/docs/directory-structure"}},v=[{value:"Requirements",id:"requirements",children:[]},{value:"Installing Silvie",id:"installing-silvie",children:[{value:"Creator package <sup>(recommended)</sup>",id:"creator-package-recommended",children:[]},{value:"Manual Installation",id:"manual-installation",children:[]}]},{value:"Running Silvie",id:"running-silvie",children:[]}],y={rightToc:v};function f(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},y,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"requirements"},"Requirements"),Object(i.b)("p",null,"Before you install silvie, you need to make sure Node.js has been installed on your computer. It is always a good habit to have\nthe latest version."),Object(i.b)("p",null,"So verify your installation by running these two commands in ",Object(i.b)("strong",{parentName:"p"},"Terminal")," or ",Object(i.b)("strong",{parentName:"p"},"CMD"),". They will show you the installed\nversion of your ",Object(i.b)("inlineCode",{parentName:"p"},"node")," and ",Object(i.b)("inlineCode",{parentName:"p"},"npm"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"node -v\n# v15.1.0\n\nnpm -v\n# 7.0.8\n")),Object(i.b)("p",null,"You may see different results when you run these command, but it is okay. You can\ncheck the latest version on ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"https://nodejs.org"}),"official Node.js website"),"."),Object(i.b)("h2",{id:"installing-silvie"},"Installing Silvie"),Object(i.b)("p",null,"You've got two options to install Silvie on your machine: ",Object(i.b)("em",{parentName:"p"},"using a creator package"),", or ",Object(i.b)("em",{parentName:"p"},"installing it manually")," in your\nproject."),Object(i.b)("h3",{id:"creator-package-recommended"},"Creator package ",Object(i.b)("sup",null,"(recommended)")),Object(i.b)("p",null,"The creator package is a npm package called ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.npmjs.com/package/create-silvie-app"}),"create-silvie-app")," built\nfor this case. It will create a project for you from a boilerplate template.\nIt also creates some basic models, controllers and database migrations to get you going from there."),Object(i.b)("h4",{id:"npx"},"NPX"),Object(i.b)("p",null,"The shortcut for executing npm packages is the ",Object(i.b)("inlineCode",{parentName:"p"},"npx")," command. It will execute the binaries from npm packages, even if\nthey were not downloaded before. NPX is coming with the NPM package, so you don't need to install anything."),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npx create-silvie-app APP_NAME\n")),Object(i.b)("h4",{id:"global-install"},"Global Install"),Object(i.b)("p",null,"Otherwise, if you are going to use this package more often, you can install this package globally on your machine."),Object(i.b)(m,{groupId:"command-type",defaultValue:"npm",values:[{label:"NPM",value:"npm"},{label:"Yarn",value:"yarn"}],mdxType:"Tabs"},Object(i.b)(j,{value:"npm",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npm install --global create-silvie-app\n"))),Object(i.b)(j,{value:"yarn",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"yarn global add create-silvie-app\n")))),Object(i.b)("p",null,"This will add the package to your globally installed npm packages, and then you can just create a Silvie app by running\none of these commands."),Object(i.b)(m,{groupId:"command-type",defaultValue:"npm",values:[{label:"NPM",value:"npm"},{label:"Yarn",value:"yarn"},{label:"CLI",value:"cli"}],mdxType:"Tabs"},Object(i.b)(j,{value:"npm",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npm init silvie-app APP_NAME\n"))),Object(i.b)(j,{value:"yarn",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"yarn create silvie-app APP_NAME\n"))),Object(i.b)(j,{value:"cli",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"create-silvie-app APP_NAME\n")))),Object(i.b)("p",null,"Now you should see a directory with the name ",Object(i.b)("inlineCode",{parentName:"p"},"APP_NAME")," that you have written after the command. Now just ",Object(i.b)("inlineCode",{parentName:"p"},"cd")," to that\ndirectory and ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"#running-silvie"}),"start the application"),"."),Object(i.b)("h3",{id:"manual-installation"},"Manual Installation"),Object(i.b)("p",null,"I think this option is for those who know how Silvie actually works under the hood, and have a good understanding of the\nstandard ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/directory-structure"}),"directory structure")," and ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/configuration"}),"configuration"),"."),Object(i.b)("h4",{id:"step-zero"},"Step Zero"),Object(i.b)("p",null,"You need to have a node project first. If you have created your empty project, just go to ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"#step-1"}),"step 1"),"."),Object(i.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(i.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(i.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(i.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"Node Project")),Object(i.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(i.b)("p",{parentName:"div"},"A node project is a directory with a valid ",Object(i.b)("inlineCode",{parentName:"p"},"package.json")," file.\nIf you don't know how to create a node project, the next command should help."))),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"mkdir test-silvie-app\ncd test-silvie-app\nnpm init -y\n")),Object(i.b)("h4",{id:"step-one"},"Step One"),Object(i.b)("p",null,"As the first step you have to add ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.npmjs.com/package/silvie"}),"silvie")," package to your project dependencies.\nThis command will install the latest version of silvie in your projects ",Object(i.b)("inlineCode",{parentName:"p"},"node_modules")," directory."),Object(i.b)(m,{groupId:"command-type",defaultValue:"npm",values:[{label:"NPM",value:"npm"},{label:"Yarn",value:"yarn"}],mdxType:"Tabs"},Object(i.b)(j,{value:"npm",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npm install --save silvie\n"))),Object(i.b)(j,{value:"yarn",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"yarn add silvie\n")))),Object(i.b)("h4",{id:"step-two"},"Step Two"),Object(i.b)("p",null,"Now you should create the initial directories and files. Make sure your structure matches the one introduced in\n",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/directory-structure"}),"Directory Structure chapter"),"."),Object(i.b)("p",null,"Also, you can run this command to make silvie check everything for you and reports you the missing parts of project:"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"silvie check\n")),Object(i.b)("p",null,"Or easily create the missing parts by running this command:"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"silvie fix\n")),Object(i.b)("h4",{id:"step-three"},"Step Three"),Object(i.b)("p",null,"If you want to create the files your self, you need to create the initial files based on what we are going to discuss in\nthe ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/directory-structure"}),"Directory Structure")," and ",Object(i.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/configuration"}),"Configuration")," sections."),Object(i.b)("h2",{id:"running-silvie"},"Running Silvie"),Object(i.b)("p",null,"Now that you have installed silvie, start the app by running the following command:"),Object(i.b)(m,{groupId:"command-type",defaultValue:"npm",values:[{label:"NPM",value:"npm"},{label:"Yarn",value:"yarn"},{label:"CLI",value:"cli"}],mdxType:"Tabs"},Object(i.b)(j,{value:"npm",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npm run dev\n"))),Object(i.b)(j,{value:"yarn",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"yarn dev\n"))),Object(i.b)(j,{value:"cli",mdxType:"TabItem"},Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"silvie dev\n")))))}f.isMDXComponent=!0},93:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return m}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=r.a.createContext({}),b=function(e){var t=r.a.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=b(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=b(a),d=n,m=p["".concat(c,".").concat(d)]||p[d]||u[d]||o;return a?r.a.createElement(m,i(i({ref:t},s),{},{components:a})):r.a.createElement(m,i({ref:t},s))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,c=new Array(o);c[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var s=2;s<o;s++)c[s]=a[s];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"},94:function(e,t,a){"use strict";function n(e){var t,a,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(a=n(e[t]))&&(r&&(r+=" "),r+=a);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}t.a=function(){for(var e,t,a=0,r="";a<arguments.length;)(e=arguments[a++])&&(t=n(e))&&(r&&(r+=" "),r+=t);return r}}}]);