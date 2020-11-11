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
      └─ disk2
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

### stat
### get
### put
### exists
### missing
### rename
### move
### copy
### copyFile
### copyDirectory
### delete
### deleteFile
### deleteDirectory
### makeDirectory
### readStreamFrom
### writeStreamTo

## File
### filename
### constructor
### name
### path
### ext
### randomName
