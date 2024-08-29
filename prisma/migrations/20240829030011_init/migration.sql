-- CreateTable
CREATE TABLE "measure_types" (
    "id" SERIAL NOT NULL,
    "measure_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measure_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "measure_value" INTEGER NOT NULL,
    "measure_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "measure_types_measure_type_key" ON "measure_types"("measure_type");

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_measure_type_id_fkey" FOREIGN KEY ("measure_type_id") REFERENCES "measure_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
