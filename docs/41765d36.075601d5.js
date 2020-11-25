(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{65:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return l})),a.d(t,"metadata",(function(){return c})),a.d(t,"rightToc",(function(){return o})),a.d(t,"default",(function(){return b}));var r=a(2),n=a(6),i=(a(0),a(91)),l={id:"storage",title:"Storage Helper",sidebar_label:"Storage"},c={unversionedId:"storage",id:"storage",isDocsHomePage:!1,title:"Storage Helper",description:"There is a built-in storage system in Silvie to help you manage file system in the server. It creates a directory to be",source:"@site/docs/storage.md",slug:"/storage",permalink:"/docs/storage",editUrl:"https://github.com/silviejs/silviejs.github.io/tree/main/website/docs/storage.md",version:"current",sidebar_label:"Storage",sidebar:"docsSidebar",previous:{title:"Database Helper",permalink:"/docs/database"},next:{title:"Mail",permalink:"/docs/mail"}},o=[{value:"Storage",id:"storage",children:[]},{value:"Disk",id:"disk",children:[{value:"File Info",id:"file-info",children:[]},{value:"Check Existence",id:"check-existence",children:[]},{value:"Read / Write",id:"read--write",children:[]},{value:"Copy / Move",id:"copy--move",children:[]},{value:"Rename",id:"rename",children:[]},{value:"Stream",id:"stream",children:[]}]},{value:"File",id:"file",children:[{value:"Properties",id:"properties",children:[]},{value:"Methods",id:"methods",children:[]}]},{value:"Types",id:"types",children:[{value:"TEncoding",id:"tencoding",children:[]},{value:"TReadOptions",id:"treadoptions",children:[]},{value:"TWriteOptions",id:"twriteoptions",children:[]},{value:"TReadStreamOptions",id:"treadstreamoptions",children:[]},{value:"TWriteStreamOptions",id:"twritestreamoptions",children:[]}]}],s={rightToc:o};function b(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},s,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"There is a built-in storage system in Silvie to help you manage file system in the server. It creates a directory to be\nused for storage later. The storage must have one or more disks to store files in them. The disks will be isolated to\nprevent accessing the files out of that disk directory."),Object(i.b)("p",null,"Storage directory structure will be like this:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-text"}),"project root\n\u2514\u2500 .silvie\n   \u2514\u2500 storage\n      \u251c\u2500 disk1\n      \u2502  \u251c\u2500 readme.txt\n      \u2502  \u251c\u2500 image.jpg\n      \u2502  \u2514\u2500 ...\n      \u251c\u2500 disk2\n      \u2502  \u251c\u2500 profiles\n      \u2502  \u2502  \u251c\u2500 user1.png\n      \u2502  \u2502  \u2514\u2500 ...\n      \u2502  \u251c\u2500 contract.pdf\n      \u2502  \u2514\u2500 ...\n      \u2514\u2500 ...\n")),Object(i.b)("p",null,"As you can see, Silvie creates a single directory for storage itself, and a directory for each disk that you have\ndefined in the ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/configuration#disks"}),"disk part of Storage Configuration")," file. "),Object(i.b)("h2",{id:"storage"},"Storage"),Object(i.b)("p",null,"You are able to use the storage from the ",Object(i.b)("inlineCode",{parentName:"p"},"Storage")," class located at ",Object(i.b)("inlineCode",{parentName:"p"},"silvie/storage"),". This class does nothing\nspecial by itself. It just initializes your disks and keeps them all together. The storage class will be initialized\nwhen your application starts and creates a static ",Object(i.b)("inlineCode",{parentName:"p"},"disks")," property on the Storage class, which contains the disk class\ninstances by their keys. "),Object(i.b)("h4",{id:"disks"},"disks"),Object(i.b)("p",null,"This is a static property on the storage class, it is an object which its key names are the disk names you've earlier\ndefined in your configuration file, and their value will be a Disk instance which handles file system operations in its\nown directory path."),Object(i.b)("p",null,"By default, there is a ",Object(i.b)("inlineCode",{parentName:"p"},"default")," disk in the storage configuration, here is how you can access a disk named ",Object(i.b)("em",{parentName:"p"},"'default'"),":"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import Storage from 'silvie/storage';\n\nconst disk = Storage.disks.default;\n// Assigns the default disk to disk constant, to be used later  \n")),Object(i.b)("h2",{id:"disk"},"Disk"),Object(i.b)("p",null,"The Disk class wraps around the Node.js ",Object(i.b)("inlineCode",{parentName:"p"},"fs")," library to offer some helper methods with a boundary access protection and\npromisified methods to be easier and safer to use.  "),Object(i.b)("h3",{id:"file-info"},"File Info"),Object(i.b)("h4",{id:"diskstat"},"disk.stat()"),Object(i.b)("p",null,"This method takes a path string and returns a ",Object(i.b)("inlineCode",{parentName:"p"},"Stats")," object, giving you some extra information about that file. For\nmore information, read the docs about ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_class_fs_stats"}),"Stats"),"."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.stat('./file.txt').then((stats) => {\n    console.log(stats.isDirectory() ? 'Directory' : 'File')\n});\n")),Object(i.b)("h3",{id:"check-existence"},"Check Existence"),Object(i.b)("h4",{id:"diskexists"},"disk.exists()"),Object(i.b)("p",null,"This method checks to see weather a path exists or not, and returns a ",Object(i.b)("inlineCode",{parentName:"p"},"Boolean")," as the result."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.exists('./images').then((state) => {\n    console.log(state ? 'exists' : `doesn't exist`);\n});\n")),Object(i.b)("h4",{id:"diskmissing"},"disk.missing()"),Object(i.b)("p",null,"This method does the opposite of the ",Object(i.b)("inlineCode",{parentName:"p"},"exists()")," method. It returns ",Object(i.b)("inlineCode",{parentName:"p"},"true")," if the path does not exist."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.missing('./images').then((state) => {\n    console.log(state ? `it's missing` : `it's there`);\n});\n")),Object(i.b)("h3",{id:"read--write"},"Read / Write"),Object(i.b)("h4",{id:"diskget"},"disk.get()"),Object(i.b)("p",null,"Use this method to read a file. This method reads a file if it exists, and returns either a ",Object(i.b)("inlineCode",{parentName:"p"},"string")," or a ",Object(i.b)("inlineCode",{parentName:"p"},"Buffer"),"."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"options")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#tencoding"}),"<TEncoding",">")," | ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#treadoptions"}),"<TReadOptions",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.get('./file.txt', 'utf8').then((contents) => {\n    console.log('Contents:', contents);\n});\n")),Object(i.b)("h4",{id:"diskput"},"disk.put()"),Object(i.b)("p",null,"This method will write a ",Object(i.b)("inlineCode",{parentName:"p"},"string")," or a ",Object(i.b)("inlineCode",{parentName:"p"},"buffer")," content to a file. It takes 3 parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"contents")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," |\n",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer"}),"<Buffer",">"),Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array"}),"<Uint8Array",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"options")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#tencoding"}),"<TEncoding",">")," | ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#twriteoptions"}),"<TWriteOptions",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.put('./file.txt', 'Test how it can be written to a file', 'utf8').then((state) => {\n    console.log(`Writing to file was ${!state && 'not '}successful`);\n});\n")),Object(i.b)("h4",{id:"diskmakedirectory"},"disk.makeDirectory()"),Object(i.b)("p",null,"This method will create a directory with the given path. There are some times that you want to create a nested\ndirectory, and the parent directories does not exist. You may specify the recursive flag to make sure the parents will\nalso be created."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"recursive?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"false")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"mode?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<string",">")," |\n",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0o777"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.makeDirectory('./uploads/gallery/2020').then((state) => {\n    console.log(state ? `directory created` : `create directory failed`);\n});\n")),Object(i.b)("h3",{id:"copy--move"},"Copy / Move"),Object(i.b)("h4",{id:"diskmove"},"disk.move()"),Object(i.b)("p",null,"This method can be used to move a directory or a file, and returns with a ",Object(i.b)("inlineCode",{parentName:"p"},"Boolean")," state to indicate weather it was\nsuccessful or not. It takes two parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"newFilename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.move('./images/user2.png', './images/users/user-2.png').then((state) => {\n    console.log(state ? `file has been moved` : `couldn't move the file`);\n});\n")),Object(i.b)("h4",{id:"diskcopy"},"disk.copy()"),Object(i.b)("p",null,"This method will copy a file or a directory, depending on which one it is, it uses different method to copy it. This\nmethod is a shorthand for the next two methods, in case you don't want to care about what you are copying. "),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"source")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"destination")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.copy('./images/users', './backups/images/users').then((state) => {\n    console.log(state ? `copied successfully` : `copy failed`);\n});\n")),Object(i.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(i.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(i.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(i.b)("p",{parentName:"div"},"Because directories might have a nested structure, their children should also be copied into the new directory. That's\nwhy there are different methods for copying directories and files."))),Object(i.b)("h4",{id:"diskcopyfile"},"disk.copyFile()"),Object(i.b)("p",null,"This method will copy a file to a new location."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"destination")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.copyFile('./documents/contract.pdf', './documents/user-2-contract.pdf').then((state) => {\n    console.log(state ? `copied successfully` : `copy failed`);\n});\n")),Object(i.b)("h4",{id:"diskcopydirectory"},"disk.copyDirectory()"),Object(i.b)("p",null,"This method will copy a directory to a new location. Since copying a directory needs a different approach. Silvie\nutilizes ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.npmjs.com/package/ncp"}),"ncp")," package to copy the whole directory."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"source")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"destination")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.copyDirectory('./tmp/uploads', './documents/uploads').then((state) => {\n    console.log(state ? `copied successfully` : `copy failed`);\n});\n")),Object(i.b)("h4",{id:"diskdelete"},"disk.delete()"),Object(i.b)("p",null,"This method will delete a file or a directory, depending on which one it is, it uses different method to copy it. This\nmethod is a shorthand for the next two methods, in case you just want to delete something anyway. "),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"recursive?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"false"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.delete('./backups/images/users').then((state) => {\n    console.log(state ? `directory deleted` : `delete failed`);\n});\n")),Object(i.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(i.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(i.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(i.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(i.b)("p",{parentName:"div"},"Because directories might have a nested structure, their children should also be deleted. You need to use a different\nmethod for deleting files and directories, or use the shorthand one."))),Object(i.b)("h4",{id:"diskdeletefile"},"disk.deleteFile()"),Object(i.b)("p",null,"This method will delete a file with the given filename."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.deleteFile('./images/user2.png').then((state) => {\n    console.log(state ? `copied successfully` : `delete failed`);\n});\n")),Object(i.b)("h4",{id:"diskdeletedirectory"},"disk.deleteDirectory()"),Object(i.b)("p",null,"This method will delete a directory with the given path. If you pass ",Object(i.b)("inlineCode",{parentName:"p"},"true")," for recursive, the children of\nthat directory will be deleted too.  "),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"recursive?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"false"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.deleteDirectory('./images/users').then((state) => {\n    console.log(state ? `deleted` : `delete failed`);\n});\n")),Object(i.b)("h3",{id:"rename"},"Rename"),Object(i.b)("h4",{id:"diskrename"},"disk.rename()"),Object(i.b)("p",null,"This method will get a file and rename it to the given name. Note that this method does not move the file/directory, it\nonly changes the name of that file/directory, and it takes two parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"newFilename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("p",null,"This method returns ",Object(i.b)("inlineCode",{parentName:"p"},"true")," if it could rename successfully, and will fail if a file or directory already exists with\nthat name."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.rename('./images/user2.png', 'user-2.png').then((state) => {\n    console.log(state ? `file has been renamed` : `couldn't rename the file`);\n});\n")),Object(i.b)("h3",{id:"stream"},"Stream"),Object(i.b)("h4",{id:"diskreadstreamfrom"},"disk.readStreamFrom()"),Object(i.b)("p",null,"This method will create a ",Object(i.b)("inlineCode",{parentName:"p"},"ReadStream")," instance from the give file path. This method will take the following parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"options?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#treadstreamoptions"}),"<TReadStreamOptions",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.readStreamFrom('./videos/trailer.mp4').then((stream) => {\n    // Read data from the stream\n});\n")),Object(i.b)("h4",{id:"diskwritestreamto"},"disk.writeStreamTo()"),Object(i.b)("p",null,"This method will create a ",Object(i.b)("inlineCode",{parentName:"p"},"WriteStream")," instance to the give file path. This method will take the following parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"options?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"#twritestreamoptions"}),"<TWriteStreamOptions",">"))),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"disk.writeStreamTo('./data/backup.dat').then((stream) => {\n    // Write data to the stream\n});\n")),Object(i.b)("h2",{id:"file"},"File"),Object(i.b)("p",null,"File class is a helper class to represent a file. It has some helper methods to create a file name. All of its methods\ncan be chained together."),Object(i.b)("h3",{id:"properties"},"Properties"),Object(i.b)("h4",{id:"filefilename"},"file.filename"),Object(i.b)("p",null,"This property is a read only getter, which returns a string containing the full file path: ",Object(i.b)("inlineCode",{parentName:"p"},"FILE_PATH/FILE_NAME[.FILE_EXT]")),Object(i.b)("p",null,"If there was no extension it will omit the whole extension part."),Object(i.b)("h3",{id:"methods"},"Methods"),Object(i.b)("h4",{id:"file-1"},"File()"),Object(i.b)("p",null,"The file constructor will take two optional parameters:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"extension?")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("p",null,"If you don't specify the extension, it will try to take the last dot-separated part of the file name as the extension."),Object(i.b)("p",null,"If file name wasn't specified, like passing ",Object(i.b)("inlineCode",{parentName:"p"},"null")," or ",Object(i.b)("inlineCode",{parentName:"p"},"undefined"),", It will generate a random file name and takes the\nextension from the second parameter if it is present. "),Object(i.b)("p",null,"If you pass no parameters to the constructor, It will only generate a random file name without extension."),Object(i.b)("h4",{id:"filename"},"file.name()"),Object(i.b)("p",null,"This method will set a filename for the file instance. "),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"filename")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("h4",{id:"filepath"},"file.path()"),Object(i.b)("p",null,"This method will set a path for the file instance."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"path")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("h4",{id:"fileext"},"file.ext()"),Object(i.b)("p",null,"This method will set an extension for the file instance."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"extension")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">"))),Object(i.b)("h4",{id:"filerandomname"},"file.randomName()"),Object(i.b)("p",null,"This method has no parameters and uses the configuration in the\n",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/configuration#filename-hash-configuration"}),"file name hash part of Storage configuration")," file, to generate a random hash\nfor the filename."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import File from 'silvie/storage/file';\n\nnew File('hello_world', 'txt');\n// Creates a 'hello_world.txt' instance\n\nnew File(null, '.pdf');\n// Creates an instance like \n// '2bdfd7b9b53741adc5350abece5908bf5a77d6d73e0b838bd41ce67a6a27c9a8.pdf'\n\nnew File().path('/home/hmak/silvie').name('readme').ext('.md');\n// Creates '/home/hmak/silvie/readme.md' instance\n")),Object(i.b)("h2",{id:"types"},"Types"),Object(i.b)("h3",{id:"tencoding"},"TEncoding"),Object(i.b)("p",null,"TEncoding is a string that needs to be one of the following encoding names:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"'ascii'"),Object(i.b)("li",{parentName:"ul"},"'base64'"),Object(i.b)("li",{parentName:"ul"},"'binary'"),Object(i.b)("li",{parentName:"ul"},"'hex'"),Object(i.b)("li",{parentName:"ul"},"'latin1'"),Object(i.b)("li",{parentName:"ul"},"'ucs2'"),Object(i.b)("li",{parentName:"ul"},"'ucs-2'"),Object(i.b)("li",{parentName:"ul"},"'utf8'"),Object(i.b)("li",{parentName:"ul"},"'utf-8'"),Object(i.b)("li",{parentName:"ul"},"'utf16le'")),Object(i.b)("h3",{id:"treadoptions"},"TReadOptions"),Object(i.b)("p",null,"This option can be a ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"#tencoding"}),"TEncoding")," or an object containing two properties:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"encoding")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"flag")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"'r'"))),Object(i.b)("h3",{id:"twriteoptions"},"TWriteOptions"),Object(i.b)("p",null,"Parameters of this type can either be a ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"#tencoding"}),"TEncoding")," or an object containing two properties:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"encoding")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"'utf8'")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"flag")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"'w'")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"mode")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0o666"))),Object(i.b)("h3",{id:"treadstreamoptions"},"TReadStreamOptions"),Object(i.b)("p",null,"The options of this kind can either be a ",Object(i.b)("inlineCode",{parentName:"p"},"string")," indicating the encoding or an ",Object(i.b)("inlineCode",{parentName:"p"},"object")," with the following properties:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"flag")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"'r'")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"encoding")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"fd")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"mode")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0o666")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"autoClose")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"true")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"emitClose")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"false")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"start")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"end")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"Infinity")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"highWaterMark")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"64 * 1024")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"fs")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null"))),Object(i.b)("h3",{id:"twritestreamoptions"},"TWriteStreamOptions"),Object(i.b)("p",null,"The options of this kind can either be a ",Object(i.b)("inlineCode",{parentName:"p"},"string")," indicating the encoding or an ",Object(i.b)("inlineCode",{parentName:"p"},"object")," with the following properties:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"flag")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"'w'")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"encoding")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"utf8")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"fd")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"mode")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0o666")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"autoClose")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"true")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"emitClose")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type"}),"<boolean",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"false")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"start")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type"}),"<number",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"0")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"fs")," ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type"}),"<string",">")," default: ",Object(i.b)("inlineCode",{parentName:"li"},"null"))))}b.isMDXComponent=!0},91:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return u}));var r=a(0),n=a.n(r);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=n.a.createContext({}),b=function(e){var t=n.a.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},p=function(e){var t=b(e.components);return n.a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},m=n.a.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),p=b(a),m=r,u=p["".concat(l,".").concat(m)]||p[m]||d[m]||i;return a?n.a.createElement(u,c(c({ref:t},s),{},{components:a})):n.a.createElement(u,c({ref:t},s))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=m;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c.mdxType="string"==typeof e?e:r,l[1]=c;for(var s=2;s<i;s++)l[s]=a[s];return n.a.createElement.apply(null,l)}return n.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);