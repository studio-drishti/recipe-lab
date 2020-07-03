# Migration `20200703234559-init`

This migration has been generated at 7/3/2020, 11:45:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "UserRole" AS ENUM ('EXECUTIVE_CHEF', 'SOUS_CHEF', 'COMMIS_CHEF', 'KITCHEN_PORTER');

CREATE TYPE "RecipeTime" AS ENUM ('QUICK', 'MODERATE', 'INVOLVED');

DROP INDEX "public"."modification"

DROP INDEX "public"."step"

ALTER TABLE "public"."Alteration" DROP COLUMN "modification",
ADD COLUMN "modificationId" text  NOT NULL ;

ALTER TABLE "public"."Ingredient" DROP COLUMN "step",
ADD COLUMN "stepId" text  NOT NULL ;

ALTER TABLE "public"."IngredientAddition" DROP COLUMN "modification",
ADD COLUMN "modificationId" text  NOT NULL ;

ALTER TABLE "public"."Item" DROP COLUMN "recipe",
ADD COLUMN "recipeId" text  NOT NULL ;

ALTER TABLE "public"."ItemAddition" DROP COLUMN "modification",
ADD COLUMN "modificationId" text  NOT NULL ;

ALTER TABLE "public"."Modification" DROP COLUMN "recipe",
DROP COLUMN "user",
ADD COLUMN "recipeId" text  NOT NULL ,
ADD COLUMN "removals" text []  ,
ADD COLUMN "userId" text  NOT NULL ;

ALTER TABLE "public"."Recipe" DROP COLUMN "author",
ADD COLUMN "authorId" text  NOT NULL ,
DROP COLUMN "time",
ADD COLUMN "time" "RecipeTime" NOT NULL DEFAULT E'MODERATE';

ALTER TABLE "public"."Sorting" DROP COLUMN "modification",
ADD COLUMN "modificationId" text  NOT NULL ,
ADD COLUMN "order" text []  ;

ALTER TABLE "public"."Step" DROP COLUMN "item",
ADD COLUMN "itemId" text  NOT NULL ;

ALTER TABLE "public"."StepAddition" DROP COLUMN "modification",
ADD COLUMN "modificationId" text  NOT NULL ;

ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT E'KITCHEN_PORTER';

CREATE UNIQUE INDEX "Item.uid" ON "public"."Item"("uid")

CREATE UNIQUE INDEX "ItemAddition.uid" ON "public"."ItemAddition"("uid")

CREATE UNIQUE INDEX "Recipe.uid" ON "public"."Recipe"("uid")

CREATE UNIQUE INDEX "Recipe.slug" ON "public"."Recipe"("slug")

CREATE UNIQUE INDEX "Sorting.uid" ON "public"."Sorting"("uid")

CREATE UNIQUE INDEX "Step.uid" ON "public"."Step"("uid")

CREATE UNIQUE INDEX "StepAddition.uid" ON "public"."StepAddition"("uid")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "User.slug" ON "public"."User"("slug")

ALTER TABLE "public"."Alteration" ADD FOREIGN KEY ("modificationId")REFERENCES "public"."Modification"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Ingredient" ADD FOREIGN KEY ("stepId")REFERENCES "public"."Step"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."IngredientAddition" ADD FOREIGN KEY ("modificationId")REFERENCES "public"."Modification"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("recipeId")REFERENCES "public"."Recipe"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ItemAddition" ADD FOREIGN KEY ("modificationId")REFERENCES "public"."Modification"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Modification" ADD FOREIGN KEY ("recipeId")REFERENCES "public"."Recipe"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Modification" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Recipe" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Sorting" ADD FOREIGN KEY ("modificationId")REFERENCES "public"."Modification"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Step" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."StepAddition" ADD FOREIGN KEY ("modificationId")REFERENCES "public"."Modification"("id") ON DELETE CASCADE  ON UPDATE CASCADE

DROP TABLE "public"."Modification_removals";

DROP TABLE "public"."Sorting_order";

DROP TYPE "Recipe_time"

DROP TYPE "User_role"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200703234559-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,170 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+enum UserRole {
+  EXECUTIVE_CHEF
+  SOUS_CHEF
+  COMMIS_CHEF
+  KITCHEN_PORTER
+}
+
+enum RecipeTime {
+  QUICK
+  MODERATE
+  INVOLVED
+}
+
+model User {
+  id            String         @default(cuid()) @id
+  createdAt     DateTime       @default(now())
+  updatedAt     DateTime       @updatedAt
+  email         String         @unique
+  slug          String         @unique
+  password      String
+  avatar        String?
+  bio           String         @default("")
+  emailVerified Boolean        @default(false)
+  name          String
+  role          UserRole      @default(KITCHEN_PORTER)
+  modifications  Modification[]
+  recipes        Recipe[]
+}
+
+model Recipe {
+  id            String         @default(cuid()) @id
+  uid           String         @default(cuid()) @unique
+  createdAt     DateTime       @default(now())
+  updatedAt     DateTime       @updatedAt
+  description   String         @default("")
+  photo         String?
+  servingAmount String         @default("")
+  servingType   String         @default("")
+  slug          String         @unique
+  time          RecipeTime     @default(MODERATE)
+  title         String         @default("")
+  author        User           @relation(fields: [authorId], references: [id])
+  authorId      String
+  items          Item[]
+  modifications  Modification[]
+}
+
+model Item {
+  id        String   @default(cuid()) @id
+  uid       String   @default(cuid()) @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  index     Int
+  name      String   @default("")
+  recipe    Recipe  @relation(fields: [recipeId], references: [id])
+  recipeId  String
+  steps      Step[]
+}
+
+model Step {
+  id         String       @default(cuid()) @id
+  uid        String       @default(cuid()) @unique
+  createdAt  DateTime     @default(now())
+  updatedAt  DateTime     @updatedAt
+  index      Int
+  directions String       @default("")
+  item       Item        @relation(fields: [itemId], references: [id])
+  itemId       String
+  Ingredient Ingredient[]
+}
+
+model Ingredient {
+  id         String   @default(cuid()) @id
+  uid        String   @default(cuid()) @unique
+  createdAt  DateTime @default(now())
+  updatedAt  DateTime @updatedAt
+  index      Int
+  name       String   @default("")
+  processing String   @default("")
+  quantity   String   @default("")
+  unit       String   @default("")
+  step       Step    @relation(fields: [stepId], references: [id])
+  stepId       String
+}
+
+model Modification {
+  id                    String                  @default(cuid()) @id
+  createdAt             DateTime                @default(now())
+  updatedAt             DateTime                @updatedAt
+  recipe                Recipe                 @relation(fields: [recipeId], references: [id])
+  recipeId                String
+  user                  User                   @relation(fields: [userId], references: [id])
+  userId                  String
+  alterations            Alteration[]
+  ingredientAdditions    IngredientAddition[]
+  itemAdditions          ItemAddition[]
+  removals               String[]
+  sortings               Sorting[]
+  stepAdditions          StepAddition[]
+}
+
+model Alteration {
+  id           String        @default(cuid()) @id
+  uid          String        @default(cuid()) @unique
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @updatedAt
+  field        String
+  value        String
+  sourceId     String
+  modification Modification @relation(fields: [modificationId], references: [id])
+  modificationId String
+}
+
+model IngredientAddition {
+  id           String        @default(cuid()) @id
+  uid          String        @default(cuid()) @unique
+  parentId     String
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @updatedAt
+  name         String
+  processing   String
+  quantity     String
+  unit         String
+  modification Modification @relation(fields: [modificationId], references: [id])
+  modificationId String
+}
+
+model ItemAddition {
+  id           String        @default(cuid()) @id
+  uid          String        @default(cuid()) @unique
+  parentId     String
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @updatedAt
+  name         String
+  modification Modification @relation(fields: [modificationId], references: [id])
+  modificationId String
+}
+
+model Sorting {
+  id            String          @default(cuid()) @id
+  uid           String          @default(cuid()) @unique
+  parentId      String
+  createdAt     DateTime        @default(now())
+  updatedAt     DateTime        @updatedAt
+  order String[]
+  modification  Modification   @relation(fields: [modificationId], references: [id])
+  modificationId  String
+}
+
+model StepAddition {
+  id           String        @default(cuid()) @id
+  uid          String        @default(cuid()) @unique
+  parentId     String
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @updatedAt
+  directions   String
+  modification Modification @relation(fields: [modificationId], references: [id])
+  modificationId String
+}
+
+
```


