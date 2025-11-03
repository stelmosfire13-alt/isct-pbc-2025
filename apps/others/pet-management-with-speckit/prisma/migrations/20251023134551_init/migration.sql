-- CreateTable
CREATE TABLE "pets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "birthday" DATE NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "image_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_pets_user_id" ON "pets"("user_id");

-- CreateIndex
CREATE INDEX "idx_pets_created_at" ON "pets"("created_at");
