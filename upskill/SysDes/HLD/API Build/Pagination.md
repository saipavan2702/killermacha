Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]], [[Upskill/SysDes/HLD/API Build/gRPC vs REST vs GraphQL vs SOAP|gRPC vs REST vs GraphQL vs SOAP]]

Pagination means dividing large data into small, loadable chunks so apps do not freeze and servers stay stable.

The two common approaches are **offset pagination** and **cursor pagination**.

## Offset Pagination

Tell the database how many rows to skip, then return the next batch.

```sql
SELECT * FROM items LIMIT 10 OFFSET 20;
-- skip first 20 rows, return rows 21-30
```

```ts
async function getItems(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return db.query(
    "SELECT * FROM items LIMIT $1 OFFSET $2",
    [limit, offset]
  );
}
```

### Problems

- **Slow at scale**: the database still scans skipped rows before returning results.
- **Unstable on live data**: new inserts can shift rows, causing duplicates or missing records.

Use offset pagination when data is small, mostly static, or you need direct page numbers.

## Cursor Pagination

Use the last seen value as a bookmark. The database jumps directly through an index instead of scanning skipped rows.

Common cursor types:

- **Key-based cursor**: `id`, `created_at`, or another indexed sortable field.
- **Time-based cursor**: timestamp cursor for feeds and logs.

```ts
async function getItems(limit: number, cursor?: number) {
  const where = cursor ? "WHERE id > $2" : "";
  const params = cursor ? [limit, cursor] : [limit];

  const rows = await db.query(
    `SELECT * FROM items ${where} ORDER BY id ASC LIMIT $1`,
    params
  );

  const nextCursor = rows.at(-1)?.id ?? null;
  return { rows, nextCursor };
}

const p1 = await getItems(10);
const p2 = await getItems(10, p1.nextCursor);
```

### Benefits

- **Always fast**: no skipped-row scanning.
- **Stable**: live inserts are less likely to create duplicates or gaps.
- **Great for infinite scroll**: feeds, timelines, notifications, and activity logs.

## Rule of Thumb

Offset says: "skip N rows." The database still has to walk past them.

Cursor says: "start after this item." The database can jump through an index.


#sysdes #api
