> [!summary]
> A filesystem turns persistent blocks into named objects while mediating caching, metadata, allocation, sharing, and crash consistency.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]
Connections: [[Upskill/CS Topics/Operating Systems/Production Debugging|Production Debugging]], [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]]

> [!tip] Plain-English version
> When you call `write()`, you probably assume your data is now safely on disk. It usually isn't — yet. Your bytes typically land in a buffer in memory first (both in your program and inside the OS), and only get physically written to the disk platter/flash chip later, either when the OS decides to flush it or when you explicitly ask for that guarantee (`fsync`). This note is mostly about that gap between "I called write and it returned" and "this data will actually survive a power outage."

## From Application to Storage

```text
language buffer
    ↓ write
file descriptor and filesystem cache
    ↓ filesystem and block layer
device cache / controller
    ↓ durable media
```

Returning from a high-level `write` often means the bytes reached a user-space or kernel buffer, not durable storage. Durability depends on the API, filesystem, mount options, hardware, and whether data plus required metadata were synchronized.

## VFS Mental Model

Linux's Virtual Filesystem (VFS) gives many filesystem implementations one interface, so the rest of the OS doesn't need to know or care whether you're on ext4, XFS, NFS, etc. Useful concepts are:

- **superblock:** a mounted filesystem instance — think "the filesystem's own metadata about itself" (total size, block size, etc.);
- **inode:** metadata and identity of a filesystem object (permissions, size, timestamps, block locations), *not* its pathname — a file's "true identity" is its inode, and a path is just one way to find it;
- **dentry:** a cached name-to-inode relationship — the mapping from a human-readable path component to the inode it points to;
- **file object:** one open instance with flags and current position — if two processes open the same file separately, they each get their own file object with their own position;
- **file descriptor:** a process-local handle (small integer) to an open file object.

Hard links can give one inode multiple names (multiple paths pointing at the exact same underlying data — deleting one name doesn't delete the data until every link is gone). Renaming a path changes namespace metadata rather than rewriting the file's contents (this is why renames are typically nearly instant even for huge files).

## Allocation and Free Space

Classical allocation strategies explain trade-offs:

- **Contiguous allocation:** fast sequential and random access (data sits in one unbroken run of blocks, like a bookshelf with no gaps), but growth and fragmentation are difficult — if the file needs to grow but the space right after it is taken, you're stuck.
- **Linked allocation:** easy growth (just add another block and link it), but poor random access (to find block 500 you may have to walk through 499 links first) and pointer overhead.
- **Indexed allocation:** blocks are found through index structures (like a table of contents pointing directly at each block); scalable variants use direct and indirect levels or trees, avoiding the linked-list walk problem.

Free space can be tracked with bitmaps (one bit per block: free or used), linked structures, grouping, or extent-based metadata (tracking runs of contiguous free blocks instead of individual ones). Modern filesystems combine trees, extents, journals, checksums, copy-on-write, and background maintenance rather than using one classroom method in isolation.

## Correctness Versus Durability

- **Atomicity:** readers see either the old or new namespace/state, not a partial transition — nobody should ever see a "half-written" file appear under its final name.
- **Durability:** acknowledged data survives the failure model you care about (e.g. process crash, OS crash, power loss — each is a stricter bar).
- **Ordering:** dependent writes reach stable storage in the required sequence (e.g. don't let a "commit" record land on disk before the data it refers to).

A common file-update pattern is: write a temporary file, flush it, atomically rename it over the destination, and synchronize the containing directory when the platform requires it. Each step needs error handling. Atomic rename alone does not guarantee that newly written bytes survive power loss — the rename being atomic just means readers never see a half-written file; it says nothing about whether the bytes themselves are durably on disk yet.

## Java: Replace a File Without Partial Readers

```java
Path temp = Files.createTempFile(target.getParent(), ".config-", ".tmp");

try (FileChannel channel = FileChannel.open(temp, StandardOpenOption.WRITE)) {
    ByteBuffer data = StandardCharsets.UTF_8.encode(contents);
    while (data.hasRemaining()) {
        channel.write(data);
    }
    channel.force(true);
}

Files.move(temp, target,
    StandardCopyOption.ATOMIC_MOVE,
    StandardCopyOption.REPLACE_EXISTING);
```

**Reading this line by line:** first, create a temporary file *next to* the real target (same directory — important, since atomic rename usually only works within the same filesystem). Write the full contents into it, looping because a single `write` call is allowed to write fewer bytes than requested ("short write") — the `while (data.hasRemaining())` loop keeps going until everything's actually written. `channel.force(true)` is the Java equivalent of `fsync` — it forces the OS to actually flush this file's data (and, with `true`, its metadata) to durable storage before continuing. Finally, `Files.move` with `ATOMIC_MOVE` swaps the temp file into the target's name atomically — any reader either sees the old file or the fully-written new one, never something in between.

This protects readers from a partially written destination when atomic move is supported. Full crash durability can also require syncing the parent directory and depends on filesystem guarantees.

## Performance Reasoning

- Sequential access usually benefits read-ahead and fewer seeks or metadata lookups.
- Random access can defeat locality and amplify I/O operations (each scattered read may cost close to a full seek/lookup).
- Small synchronous writes can force expensive durability barriers (every tiny `fsync` has real latency cost — batching helps).
- Memory-mapped I/O moves some I/O latency into page faults; it does not eliminate I/O — it just changes *when* and *how* you pay for it.
- The page cache can make repeated reads fast, but a cold-cache benchmark (first access, nothing cached yet) tells a different story than a warm one.
- Network filesystems and object stores have different consistency and atomicity contracts from local POSIX filesystems — don't assume S3 or NFS behaves exactly like a local ext4 disk.

## Engineering Questions

- Is the API buffered, cached, synchronous, direct, or memory-mapped?
- What exactly is acknowledged after a successful call?
- Can a retry duplicate an append or overwrite a newer value?
- What happens on disk-full, quota, short-write, permission, or rename failure?
- Does the design need local filesystem semantics, or is an object/database abstraction more honest?

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **inode** | A file's real identity/metadata record — not its name, its actual "who/what/where" record. |
| **Dentry** | A cached mapping from a path name to the inode it points at. |
| **File descriptor** | A small integer your program uses to refer to an open file/socket/pipe. |
| **`fsync`** | A system call that forces buffered data to actually be written to durable storage before returning. |
| **Atomic rename** | Swapping a file's name in a way that's instantaneous and never shows a half-written intermediate state to readers. |
| **Short write** | When a single write call writes fewer bytes than you asked for — perfectly legal, must be handled in a loop. |
| **Extent** | A run of contiguous blocks tracked as one unit, instead of tracking each block individually. |
| **Journal (filesystem)** | A log of pending changes the filesystem writes before applying them, so it can recover cleanly after a crash. |

---

## References

- [Linux Virtual Filesystem](https://docs.kernel.org/filesystems/vfs.html) - Primary documentation for superblocks, inodes, dentries, and file objects.
- [Linux `fsync(2)`](https://man7.org/linux/man-pages/man2/fsync.2.html) - Data and metadata synchronization guarantees.
- [Linux `rename(2)`](https://man7.org/linux/man-pages/man2/rename.2.html) - Namespace replacement and atomicity semantics.
