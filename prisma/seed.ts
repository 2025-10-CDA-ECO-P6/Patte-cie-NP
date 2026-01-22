import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  await seedReferenceData();
  await seedPeople();
  await seedAnimals();
  await seedAnimalOwners();
  await seedHealthRecordsAndMedicalCares();
  await seedUsers();
}
import { randomItem } from "../src/core/utils/randomItem";

const MEDICAL_CARE_TYPES = [
  {
    description: "Consultation annuelle",
    mandatoryTags: [],
  },
  {
    description: "Vaccination",
    mandatoryTags: ["Vaccin"],
  },
  {
    description: "Contrôle post-opératoire",
    mandatoryTags: ["Contrôle"],
  },
  {
    description: "Bilan de santé",
    mandatoryTags: [],
  },
] as const;

async function seedReferenceData() {
  const roles = ["ADMIN", "CLIENT", "VETERINARIAN"];

  await prisma.role.createMany({
    data: roles.map((roleName) => ({ roleName })),
    skipDuplicates: true,
  });

  await prisma.species.createMany({
    data: [
      { name: "Chien", description: "Canidé domestique" },
      { name: "Chat", description: "Félin domestique" },
      { name: "Lapin", description: "Lagomorphe domestique" },
    ],
    skipDuplicates: true,
  });

  await prisma.tag.createMany({
    data: [{ name: "Urgent" }, { name: "Contrôle" }, { name: "Vaccin" }, { name: "Chirurgie" }],
    skipDuplicates: true,
  });

  await prisma.vaccineType.createMany({
    data: [
      { name: "Rage", defaultValidityDays: 365 },
      { name: "Parvovirose", defaultValidityDays: 365 },
      { name: "Leucose", defaultValidityDays: 365 },
    ],
    skipDuplicates: true,
  });
}

async function seedPeople() {
  const veterinarians = await prisma.veterinarian.createMany({
    data: [
      {
        firstName: "Jean",
        lastName: "Dupont",
        email: "vet1@pattecie.fr",
        phone: 612345678,
        licenseNumber: "VET-001",
      },
      {
        firstName: "Claire",
        lastName: "Bernard",
        email: "vet2@pattecie.fr",
        phone: 612345679,
        licenseNumber: "VET-002",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.owner.createMany({
    data: [
      {
        firstName: "Alice",
        lastName: "Martin",
        email: "alice@pattecie.fr",
        adresse: "1 rue des Animaux, Paris",
        phoneNumber: 698765432,
      },
      {
        firstName: "Paul",
        lastName: "Durand",
        email: "paul@pattecie.fr",
        adresse: "10 avenue des Vétos, Lyon",
        phoneNumber: 698765433,
      },
    ],
    skipDuplicates: true,
  });
}

async function seedAnimals() {
  const dog = await prisma.species.findUnique({ where: { name: "Chien" } });
  const cat = await prisma.species.findUnique({ where: { name: "Chat" } });

  if (!dog || !cat) return;

  const animalsData = [
    {
      name: "Rex",
      weight: 15.5,
      birthDate: new Date("2020-05-10"),
      identification: 100001,
      speciesId: dog.id,
    },
    {
      name: "Bella",
      weight: 18.2,
      birthDate: new Date("2019-02-20"),
      identification: 100002,
      speciesId: dog.id,
    },
    {
      name: "Mimi",
      weight: 5.3,
      birthDate: new Date("2021-03-12"),
      identification: 200001,
      speciesId: cat.id,
    },
    {
      name: "Luna",
      weight: 4.9,
      birthDate: new Date("2022-07-01"),
      identification: 200002,
      speciesId: cat.id,
    },
  ];

  const animalsWithPhoto = animalsData.map((animal) => {
    const speciesName = animal.speciesId === dog.id ? "Chien" : "Chat";
    return {
      ...animal,
      photoUrl: speciesName === "Chien" ? "images/animals/chien.png" : "images/animals/chat.png",
    };
  });

  await prisma.animal.createMany({
    data: animalsWithPhoto,
    skipDuplicates: true,
  });
}

async function seedAnimalOwners() {
  const animals = await prisma.animal.findMany();
  const owners = await prisma.owner.findMany();

  for (const animal of animals) {
    const owner = randomItem(owners);

    await prisma.animalOwner.create({
      data: {
        animalId: animal.id,
        ownerId: owner.id,
        startDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365), // date aléatoire dans l'année passée
      },
    });
  }
}

async function seedHealthRecordsAndMedicalCares() {
  const animals = await prisma.animal.findMany();
  const veterinarians = await prisma.veterinarian.findMany();
  const tags = await prisma.tag.findMany();
  const vaccineTypes = await prisma.vaccineType.findMany();

  const resolveTagsForCare = (careDescription: string, allTags: { id: string; name: string }[]) => {
    const careType = MEDICAL_CARE_TYPES.find((c) => c.description === careDescription);

    const mandatoryTags = careType?.mandatoryTags.map((tagName) => allTags.find((t) => t.name === tagName)!) ?? [];

    const optionalTags = allTags.filter((tag) => !mandatoryTags.some((m) => m.id === tag.id));

    const randomOptional = optionalTags.sort(() => 0.5 - Math.random()).slice(0, 1);

    return [...mandatoryTags, ...randomOptional];
  };

  for (const animal of animals) {
    const healthRecord = await prisma.healthRecord.create({
      data: {
        description: `Dossier médical de ${animal.name}`,
        recordDate: new Date(),
        animalId: animal.id,
      },
    });

    const numberOfCares = Math.floor(Math.random() * 4) + 3;

    for (let i = 0; i < numberOfCares; i++) {
      const careType = MEDICAL_CARE_TYPES[i % MEDICAL_CARE_TYPES.length];

      const care = await prisma.medicalCare.create({
        data: {
          description: careType.description,
          careDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365),
          healthRecordId: healthRecord.id,
          veterinarianId: randomItem(veterinarians).id,
        },
      });

      const resolvedTags = resolveTagsForCare(care.description, tags);

      await prisma.medicalCareTag.createMany({
        data: resolvedTags.map((tag) => ({
          medicalCareId: care.id,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      });

      if (care.description === "Vaccination") {
        await createVaccineForMedicalCare(care.id, vaccineTypes);
      }
    }
  }
}

async function createVaccineForMedicalCare(medicalCareId: string, vaccineTypes: { id: string }[]) {
  const vaccineType = randomItem(vaccineTypes);

  const administrationDate = new Date();
  const expirationDate = new Date(administrationDate);
  expirationDate.setDate(expirationDate.getDate() + 365);

  const vaccine = await prisma.vaccine.create({
    data: {
      batchNumber: `BATCH-${Math.floor(Math.random() * 10_000)}`,
      doseNumber: 1,
      administrationDate,
      expirationDate,
      vaccineTypeId: vaccineType.id,
    },
  });

  await prisma.medicalCareVaccine.create({
    data: {
      medicalCareId,
      vaccineId: vaccine.id,
    },
  });
}

async function seedUsers() {
  const password = await bcrypt.hash("password123", 10);

  const roles = await prisma.role.findMany();
  const owners = await prisma.owner.findMany();
  const vets = await prisma.veterinarian.findMany();

  const adminRole = roles.find((r) => r.roleName === "ADMIN")!;
  const clientRole = roles.find((r) => r.roleName === "CLIENT")!;
  const vetRole = roles.find((r) => r.roleName === "VETERINARIAN")!;

  const admin = await prisma.user.create({
    data: {
      email: "admin@pattecie.fr",
      password,
      roleId: adminRole.id,
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: admin.id,
      veterinarianId: vets[0].id,
    },
  });

  for (const owner of owners) {
    const user = await prisma.user.create({
      data: {
        email: owner.email,
        password,
        roleId: clientRole.id,
      },
    });

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        ownerId: owner.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
