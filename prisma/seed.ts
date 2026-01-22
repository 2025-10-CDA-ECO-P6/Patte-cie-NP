import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
    console.log(" Seeding database");

    const adminRole = await prisma.role.create({
        data: { roleName: "ADMIN" },
    });

    const userRole = await prisma.role.create({
        data: { roleName: "USER" },
    });

    const dogSpecies = await prisma.species.create({
        data: { name: "Chien", description: "Canidé domestique" },
    });

    const catSpecies = await prisma.species.create({
        data: { name: "Chat", description: "Félin domestique" },
    });

    const vet = await prisma.veterinarian.create({
        data: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "vet@pattecie.fr",
            phone: 612345678,
            licenseNumber: "VET-123456",
        },
    });

    const owner = await prisma.owner.create({
        data: {
            firstName: "Alice",
            lastName: "Martin",
            email: "alice@pattecie.fr",
            adresse: "1 rue des Animaux, Paris",
            phoneNumber: 698765432,
        },
    });

    const rex = await prisma.animal.create({
        data: {
            name: "Rex",
            birthDate: new Date("2020-05-10"),
            identification: 123456,
            speciesId: dogSpecies.id,
        },
    });

    const mimi = await prisma.animal.create({
        data: {
            name: "Mimi",
            birthDate: new Date("2021-03-12"),
            identification: 654321,
            speciesId: catSpecies.id,
        },
    });

    await prisma.animalOwner.create({
        data: {
            animalId: rex.id,
            ownerId: owner.id,
            startDate: new Date("2020-06-01"),
        },
    });

    await prisma.animalOwner.create({
        data: {
            animalId: mimi.id,
            ownerId: owner.id,
            startDate: new Date("2021-04-01"),
        },
    });

    const rexRecord = await prisma.healthRecord.create({
        data: {
            description: "Dossier médical de Rex",
            recordDate: new Date(),
            animalId: rex.id,
        },
    });

    const urgentTag = await prisma.tag.create({
        data: { name: "Urgent" },
    });

    const controlTag = await prisma.tag.create({
        data: { name: "Contrôle" },
    });

    const rabiesType = await prisma.vaccineType.create({
        data: {
            name: "Rage",
            defaultValidityDays: 365,
            notes: "Vaccin contre la rage",
        },
    });

    const vaccine = await prisma.vaccine.create({
        data: {
            batchNumber: "BATCH-001",
            doseNumber: 1,
            administrationDate: new Date("2024-01-10"),
            expirationDate: new Date("2025-01-10"),
            vaccineTypeId: rabiesType.id,
        },
    });

    const care = await prisma.medicalCare.create({
        data: {
            description: "Vaccination annuelle",
            careDate: new Date(),
            healthRecordId: rexRecord.id,
            veterinarianId: vet.id,
        },
    });

    await prisma.medicalCareTag.create({
        data: {
            medicalCareId: care.id,
            tagId: controlTag.id,
        },
    });

    await prisma.medicalCareVaccine.create({
        data: {
            medicalCareId: care.id,
            vaccineId: vaccine.id,
        },
    });

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const adminUser = await prisma.user.create({
        data: {
            email: "admin@pattecie.fr",
            password: adminPassword,
            roleId: adminRole.id,
        },
    });

    const normalUser = await prisma.user.create({
        data: {
            email: "user@pattecie.fr",
            password: userPassword,
            roleId: userRole.id,
        },
    });

    await prisma.userProfile.create({
        data: {
            userId: adminUser.id,
            veterinarianId: vet.id,
        },
    });

    await prisma.userProfile.create({
        data: {
            userId: normalUser.id,
            ownerId: owner.id,
        },
    });

    console.log("seed successful");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
