# Migration `20200703234859-rename-ingredient`

This migration has been generated at 7/3/2020, 11:48:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200703234559-init..20200703234859-rename-ingredient
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 enum UserRole {
   EXECUTIVE_CHEF
@@ -74,9 +74,9 @@
   index      Int
   directions String       @default("")
   item       Item        @relation(fields: [itemId], references: [id])
   itemId       String
-  Ingredient Ingredient[]
+  ingredients Ingredient[]
 }
 model Ingredient {
   id         String   @default(cuid()) @id
```


