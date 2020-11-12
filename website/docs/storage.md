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

Storage.disks.default.put('./sample.txt', 'Hello Storage', 'utf8');
// Writes a file in default disk named 'sample.txt' 
// with 'Hello Storage' utf8 content 
```


## Disk
The Disk class wraps around the Node.js `fs` library to offer some helper methods with a boundary access protection and
promisified methods to be easier and safer to use.  

### disk.stat()
This method takes a path string and returns a `Stats` object, giving you some extra information about that file. For 
more information, read the docs about [Stats](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_class_fs_stats).

```typescript
import Storage from 'silvie/lib/storage';

Storage.disks.default.stat('./file.txt').then((stats) => {
    console.log(stats.isDirectory() ? 'Directory' : 'File')

    // Do with the file stats
});
```

### disk.get()
Use this method to read a file. This method reads a file if it exists, and returns either a `string` or a `Buffer`.

#### path
This parameter takes a string indicating the path to file.

#### options
This parameter can be an [encoding string](#tencoding) or file [read options](#treadoptions).

### disks.put()
### disks.exists()
### disks.missing()
### disks.rename()
### disks.move()
### disks.copy()
### disks.copyFile()
### disks.copyDirectory()
### disks.delete()
### disks.deleteFile()
### disks.deleteDirectory()
### disks.makeDirectory()
### disks.readStreamFrom()
### disks.writeStreamTo()

## File
### filename
### constructor
### name
### path
### ext
### randomName

## Types
### TEncoding
### TReadOptions
### TWriteOptions