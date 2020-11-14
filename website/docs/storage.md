---
id: storage
title: Storage Helper
sidebar_label: Storage
---

There is a built-in storage system in Silvie to help you manage file system in the server. It creates a directory to be
used for storage later. The storage must have one or more disks to store files in them. The disks will be isolated to 
prevent accessing the files out of that disk directory.

Storage directory structure will be like this:

```text
project root
└─ .silvie
   └─ storage
      ├─ disk1
      │  ├─ readme.txt
      │  ├─ image.jpg
      │  └─ ...
      ├─ disk2
      │  ├─ profiles
      │  │  ├─ user1.png
      │  │  └─ ...
      │  ├─ contract.pdf
      │  └─ ...
      └─ ...
```

As you can see, Silvie creates a single directory for storage itself, and a directory for each disk that you have
defined in the [disk part of Storage Configuration](configuration.md#disks) file. 

## Storage
You are able to use the storage from the `Storage` class located at `silvie/lib/storage`. This class does nothing 
special by itself. It just initializes your disks and keeps them all together. The storage class will be initialized 
when your application starts and creates a static `disks` property on the Storage class, which contains the disk class 
instances by their keys. 

### disks
This is a static property on the storage class, it is an object which its key names are the disk names you've earlier 
defined in your configuration file, and their value will be a Disk instance which handles file system operations in its 
own directory path.

By default, there is a `default` disk in the storage configuration, here is how you can access a disk named *'default'*:

```typescript
import Storage from 'silvie/lib/storage';

const disk = Storage.disks.default;
// Assigns the default disk to disk constant, to be used later  
```


## Disk
The Disk class wraps around the Node.js `fs` library to offer some helper methods with a boundary access protection and
promisified methods to be easier and safer to use.  

### disk.stat()
This method takes a path string and returns a `Stats` object, giving you some extra information about that file. For 
more information, read the docs about [Stats](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_class_fs_stats).
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.stat('./file.txt').then((stats) => {
    console.log(stats.isDirectory() ? 'Directory' : 'File')
});
```

### disk.get()
Use this method to read a file. This method reads a file if it exists, and returns either a `string` or a `Buffer`.
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **options** [<TEncoding\>](#tencoding) | [<TReadOptions\>](#treadoptions)

```typescript
disk.get('./file.txt', 'utf8').then((contents) => {
    console.log('Contents:', contents);
});
```

### disks.put()
This method will write a `string` or a `buffer` content to a file. It takes 3 parameters:
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **contents** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
[<Buffer\>](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_class_buffer)
[<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- **options** [<TEncoding\>](#tencoding) | [<TWriteOptions\>](#twriteoptions)

```typescript
disk.put('./file.txt', 'Test how it can be written to a file', 'utf8').then((state) => {
    console.log(`Writing to file was ${!state && 'not '}successful`);
});
```

### disks.exists()
This method checks to see weather a path exists or not, and returns a `Boolean` as the result.
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.exists('./images').then((state) => {
    console.log(state ? 'exists' : `doesn't exist`);
});
```

### disks.missing()
This method does the opposite of the `exists()` method. It returns `true` if the path does not exist.
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.missing('./images').then((state) => {
    console.log(state ? `it's missing` : `it's there`);
});
```

### disks.rename()
This method will get a file and rename it to the given name. Note that this method does not move the file/directory, it 
only changes the name of that file/directory, and it takes two parameters:
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **newFilename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

This method returns `true` if it could rename successfully, and will fail if a file or directory already exists with 
that name.

```typescript
disk.rename('./images/user2.png', 'user-2.png').then((state) => {
    console.log(state ? `file has been renamed` : `couldn't rename the file`);
});
```

### disks.move()
This method can be used to move a directory or a file, and returns with a `Boolean` state to indicate weather it was
successful or not. It takes two parameters:
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **newFilename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.move('./images/user2.png', './images/users/user-2.png').then((state) => {
    console.log(state ? `file has been moved` : `couldn't move the file`);
});
```

### disks.copy()
This method will copy a file or a directory, depending on which one it is, it uses different method to copy it. This 
method is a shorthand for the next two methods, in case you don't want to care about what you are copying. 
- **source** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **destination** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.copy('./images/users', './backups/images/users').then((state) => {
    console.log(state ? `copied successfully` : `copy failed`);
});
``` 

:::note
Because directories might have a nested structure, their children should also be copied into the new directory. That's 
why there are different methods for copying directories and files.
:::

### disks.copyFile()
This method will copy a file to a new location.
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **destination** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.copyFile('./documents/contract.pdf', './documents/user-2-contract.pdf').then((state) => {
    console.log(state ? `copied successfully` : `copy failed`);
});
``` 

### disks.copyDirectory()
This method will copy a directory to a new location. Since copying a directory needs a different approach. Silvie 
utilizes [ncp](https://www.npmjs.com/package/ncp) package to copy the whole directory.
- **source** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **destination** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.copyDirectory('./tmp/uploads', './documents/uploads').then((state) => {
    console.log(state ? `copied successfully` : `copy failed`);
});
``` 

### disks.delete()
This method will delete a file or a directory, depending on which one it is, it uses different method to copy it. This 
method is a shorthand for the next two methods, in case you just want to delete something anyway. 
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **recursive?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
disk.delete('./backups/images/users').then((state) => {
    console.log(state ? `directory deleted` : `delete failed`);
});
``` 

:::note
Because directories might have a nested structure, their children should also be deleted. You need to use a different 
method for deleting files and directories, or use the shorthand one.
:::

### disks.deleteFile()
This method will delete a file with the given filename.
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```typescript
disk.deleteFile('./images/user2.png').then((state) => {
    console.log(state ? `copied successfully` : `delete failed`);
});
``` 

### disks.deleteDirectory()
This method will delete a directory with the given path. If you pass `true` for recursive, the children of 
that directory will be deleted too.  
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **recursive?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`

```typescript
disk.deleteDirectory('./images/users').then((state) => {
    console.log(state ? `deleted` : `delete failed`);
});
``` 

### disks.makeDirectory()
This method will create a directory with the given path. There are some times that you want to create a nested 
directory, and the parent directories does not exist. You may specify the recursive flag to make sure the parents will 
also be created.
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **recursive?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`
- **mode?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) |
   [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0o777`

```typescript
disk.makeDirectory('./uploads/gallery/2020').then((state) => {
    console.log(state ? `directory created` : `create directory failed`);
});
``` 

### disks.readStreamFrom()
This method will create a `ReadStream` instance from the give file path. This method will take the following parameters:
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **options?** [<TReadStreamOptions\>](#treadstreamoptions)

```typescript
disk.readStreamFrom('./videos/trailer.mp4').then((stream) => {
    // Read data from the stream
});
``` 

### disks.writeStreamTo()
This method will create a `WriteStream` instance to the give file path. This method will take the following parameters:
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **options?** [<TWriteStreamOptions\>](#twritestreamoptions)

```typescript
disk.writeStreamTo('./data/backup.dat').then((stream) => {
    // Write data to the stream
});
``` 

## File
File class is a helper class to represent a file. It has some helper methods to create a file name. All of its methods
can be chained together.

### file.filename
This property is a read only getter, which returns a string containing the full file path: `FILE_PATH/FILE_NAME[.FILE_EXT]`

If there was no extension it will omit the whole extension part.

### File()
The file constructor will take two optional parameters:
- **filename?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- **extension?** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

If you don't specify the extension, it will try to take the last dot-separated part of the file name as the extension.

If file name wasn't specified, like passing `null` or `undefined`, It will generate a random file name and takes the
extension from the second parameter if it is present. 
   
If you pass no parameters to the constructor, It will only generate a random file name without extension.

### file.name()
This method will set a filename for the file instance. 
- **filename** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### file.path()
This method will set a path for the file instance.
- **path** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### file.ext()
This method will set an extension for the file instance.
- **extension** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


### file.randomName()
This method has no parameters and uses the configuration in the 
[file name hash part of Storage configuration](configuration.md#filename-hash-configuration) file, to generate a random hash
for the filename.


```typescript
import File from 'silvie/lib/storage/file';

new File('hello_world', 'txt');
// Creates a 'hello_world.txt' instance

new File(null, '.pdf');
// Creates an instance like 
// '2bdfd7b9b53741adc5350abece5908bf5a77d6d73e0b838bd41ce67a6a27c9a8.pdf'

new File().path('/home/hmak/silvie').name('readme').ext('.md');
// Creates '/home/hmak/silvie/readme.md' instance
```

## Types
Some typescript custom types will be described here:  

### TEncoding
TEncoding is a that needs to be one of the following encoding names:
- ascii
- base64
- binary
- hex
- latin1
- ucs2
- ucs-2
- utf8
- utf-8
- utf16le

### TReadOptions
This option can be a [TEncoding](#tencoding) or an object containing two properties:
- **encoding** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`
- **flag** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'r'`

### TWriteOptions
Parameters of this type can either be a [TEncoding](#tencoding) or an object containing two properties:
- **encoding** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'utf8'`
- **flag** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'w'`
- **mode** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0o666`

### TReadStreamOptions
The options of this kind can either be a `string` indicating the encoding or an `object` with the following properties:
- **flag** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'r'`
- **encoding** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`
- **fd** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`
- **mode** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0o666`
- **autoClose** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `true`
- **emitClose** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`
- **start** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0`
- **end** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `Infinity`
- **highWaterMark** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `64 * 1024`
- **fs** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`

### TWriteStreamOptions
The options of this kind can either be a `string` indicating the encoding or an `object` with the following properties:
- **flag** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `'w'`
- **encoding** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `utf8`
- **fd** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`
- **mode** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0o666`
- **autoClose** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `true`
- **emitClose** [<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) default: `false`
- **start** [<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) default: `0`
- **fs** [<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) default: `null`

