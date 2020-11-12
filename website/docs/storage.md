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
- **filename**: This parameter takes a string indicating the path to file

```typescript
disk.stat('./file.txt').then((stats) => {
    console.log(stats.isDirectory() ? 'Directory' : 'File')
});
```

### disk.get()
Use this method to read a file. This method reads a file if it exists, and returns either a `string` or a `Buffer`.
- **filename**: This parameter takes a string indicating the path to file
- **options**: This parameter can be an [encoding string](#tencoding) or file [read options](#treadoptions)

```typescript
disk.get('./file.txt', 'utf8').then((contents) => {
    console.log('Contents:', contents);
});
```

### disks.put()
This method will write a `string` or a `buffer` content to a file. It takes 3 parameters:
- **filename**: A string indicating the destination file name
- **contents**: A string or a buffer to be written into the file
- **options**: This parameter can be an [encoding string](#tencoding) or file [write options](#twriteoptions)

```typescript
disk.put('./file.txt', 'Test how it can be written to a file', 'utf8').then((state) => {
    console.log(`Writing to file was ${!state && 'not '}successful`);
});
```

### disks.exists()
This method checks to see weather a path exists or not, and returns a `Boolean` as the result.
- **filename**: A string indicating a directory or a file path

```typescript
disk.exists('./images').then((state) => {
    console.log(state ? 'exists' : `doesn't exist`);
});
```

### disks.missing()
This method does the opposite of the `exists()` method. It returns `true` if the path does not exist.
- **filename**: A string indicating a directory or a file path

```typescript
disk.missing('./images').then((state) => {
    console.log(state ? `it's missing` : `it's there`);
});
```

### disks.rename()
This method will get a file and rename it to the given name. Note that this method does not move the file/directory, it 
only changes the name of that file/directory, and it takes two parameters:
- **filename**: A string indicating a directory or a file path
- **newFilename**: A string to rename the file or directory to that new name

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
- **filename**: This is a string indicating the path to the file you want to move around
- **newFilename**: This parameter is a string to specify the new filename

```typescript
disk.move('./images/user2.png', './images/users/user-2.png').then((state) => {
    console.log(state ? `file has been moved` : `couldn't move the file`);
});
```

### disks.copy()
This method will copy a file or a directory, depending on which one it is, it uses different method to copy it. This 
method is a shorthand for the next two methods, in case you don't want to care about what you are copying. 
- **source**: A string to indicate the source path
- **destination**: A string to indicate the destination path

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
- **filename**: A string to indicate the source filename
- **destination**: A string to indicate the destination file path

```typescript
disk.copyFile('./documents/contract.pdf', './documents/user-2-contract.pdf').then((state) => {
    console.log(state ? `copied successfully` : `copy failed`);
});
``` 

### disks.copyDirectory()
This method will copy a directory to a new location. Since copying a directory needs a different approach. Silvie 
utilizes [ncp](https://www.npmjs.com/package/ncp) package to copy the whole directory.
- **filename**: A string to indicate the source filename
- **destination**: A string to indicate the destination file path

```typescript
disk.copyDirectory('./tmp/uploads', './documents/uploads').then((state) => {
    console.log(state ? `copied successfully` : `copy failed`);
});
``` 

### disks.delete()
This method will delete a file or a directory, depending on which one it is, it uses different method to copy it. This 
method is a shorthand for the next two methods, in case you just want to delete something anyway. 
- **path**: A string to indicate the path to a file or a directory
- **recursive?**: A boolean to indicate if the children should also be deleted or not, it is `false` by default

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
- **filename**: A string to indicate the filename

```typescript
disk.deleteFile('./images/user2.png').then((state) => {
    console.log(state ? `copied successfully` : `delete failed`);
});
``` 

### disks.deleteDirectory()
This method will delete a directory with the given path. If you pass `true` for recursive, the children of 
that directory will be deleted too.  
- **path**: A string to specify the path to that directory
- **recursive?**: A boolean to indicate if the children should also be deleted or not, it is `false` by default

```typescript
disk.deleteDirectory('./images/users').then((state) => {
    console.log(state ? `deleted` : `delete failed`);
});
``` 

### disks.makeDirectory()
This method will create a directory with the given path. There are some times that you want to create a nested 
directory, and the parent directories does not exist. You may specify the recursive flag to make sure the parents will 
also be created.
- **path**: A string to specify the path to the directory
- **recursive?**: A boolean to indicate if the missing parent directories should also be deleted or not, it is `false` by default
- **mode?**: The permission of that directory. It is `0o777` by default

```typescript
disk.makeDirectory('./uploads/gallery/2020').then((state) => {
    console.log(state ? `directory created` : `create directory failed`);
});
``` 

### disks.readStreamFrom()
This method will create a `ReadStream` instance from the give file path. This method will take the following parameters:
- **path**: A string indicating the path to the file
- **options?**: This optional parameter will indicate the read stream options which is a [TReadStreamOptions](#treadstreamoptions) type

```typescript
disk.readStreamFrom('./videos/trailer.mp4').then((stream) => {
    // Read data from the stream
});
``` 

### disks.writeStreamTo()
This method will create a `WriteStream` instance to the give file path. This method will take the following parameters:
- **path**: A string indicating the path to the file
- **options?**: This optional parameter will indicate the write stream options which is a [TWriteStreamOptions](#twritestreamoptions) type

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
- **filename?**: The filename to be assigned to the file instance
- **extension?**: This indicates the extension of the file instance

If you don't specify the extension, it will try to take the last dot-separated part of the file name as the extension.

If file name wasn't specified, like passing `null` or `undefined`, It will generate a random file name and takes the
extension from the second parameter if it is present. 
   
If you pass no parameters to the constructor, It will only generate a random file name without extension.

### file.name()
This method will set a filename for the file instance. 
- **filename**: This is a string indicating the actual file name

### file.path()
This method will set a path for the file instance.
- **path**: This is a string indicating the path to the file

### file.ext()
This method will set an extension for the file instance.
- **extension**: This is a string indicating the extension


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
- **encoding**: This needs to be a string of [TEncoding](#tencoding) type 
- **flag**: This needs to be a file system flag like `'a'`, `'rw'`, `'r'`, etc. 

### TWriteOptions
Parameters of this type can either be a [TEncoding](#tencoding) or an object containing two properties:
- **encoding**: This needs to be a string of [TEncoding](#tencoding) type 
- **flag**: This needs to be a file system flag like `'a'`, `'w'`, `'r'`, etc. 

### TReadStreamOptions
The options of this kind can either be a `string` indicating the encoding or an `object` with the following properties:
- **flag**: This needs to be a file system flag like `'a'`, `'w'`, `'r'`, etc. This will be `r` by default
- **encoding**: An string to indicate the encoding to read the file, defaults to `null`
- **fd**: This is a number indicating a blocking file descriptor, defaults to `null`
- **mode**: The permission to be set on the file, defaults to `0o666`
- **autoClose**: A boolean indicating weather to close the file descriptor or not, defaults to `true`
- **emitClose**: A boolean indicating weather to emit a `close` event after stream has been destroyed or not. Defaults to `false`
- **start**: An integer to specify the start of reading range, defaults to `0`
- **end**: An integer to specify the end of the reading range, defaults to `Infinity`
- **highWaterMark**: An integer indicating the buffer size, defaults to `64 kb` = `64 * 1024` 
- **fs**: This option will override the fs implementations, defaults to `null`

### TWriteStreamOptions
The options of this kind can either be a `string` indicating the encoding or an `object` with the following properties:
- **flag**: This needs to be a file system flag like `'a'`, `'w'`, `'r'`, etc. This will be `w` by default
- **encoding**: An string to indicate the encoding to read the file, defaults to `utf8`
- **fd**: This is a number indicating a blocking file descriptor, defaults to `null`
- **mode**: The permission to be set on the file, defaults to `0o666`
- **autoClose**: A boolean indicating weather to close the file descriptor or not, defaults to `true`
- **emitClose**: A boolean indicating weather to emit a `close` event after stream has been destroyed or not. Defaults to `false`
- **start**: An integer to specify the start of reading range, defaults to `0`
- **fs**: This option will override the fs implementations, defaults to `null`
