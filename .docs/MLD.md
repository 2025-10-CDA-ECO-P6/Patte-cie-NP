## ANIMAL

**ANIMAL**

- **#id**
- name
- birthDate
- identification _(unique, facultatif)_
- createdAt
- updatedAt
- isDeleted

---

## OWNER

**OWNER**

- **#id**
- firstName
- lastName
- email _(unique)_
- adresse
- phoneNumber _(unique)_
- createdAt
- updatedAt
- isDeleted

---

## POSSEDER

**POSSEDER** _(association)_

- **#id**
- startDate
- endDate _(facultatif)_
- createdAt
- updatedAt
- isDeleted

**Cardinalités :**

- ANIMAL (0,n) — POSSEDER — (0,n) OWNER

**Clés étrangères :**

- animalId → ANIMAL.id
- ownerId → OWNER.id

---

## VETERINARIAN

**VETERINARIAN**

- **#id**
- firstName
- lastName
- email _(unique)_
- phone _(unique)_
- licenseNumber _(unique)_
- createdAt
- updatedAt
- isDeleted

---

## HEALTH_RECORD

**HEALTH_RECORD**

- **#id**
- description
- recordDate
- createdAt
- updatedAt
- isDeleted

---

## AVOIR_DOSSIER

**AVOIR_DOSSIER** _(association)_

**Cardinalités :**

- ANIMAL (1,1) — AVOIR_DOSSIER — (1,1) HEALTH_RECORD

**Contraintes :**

- Un animal possède un seul dossier médical
- Un dossier médical appartient à un seul animal

**Clé étrangère :**

- animalId _(unique)_ → ANIMAL.id

---

## MEDICAL_CARE

**MEDICAL_CARE**

- **#id**
- description
- careDate
- createdAt
- updatedAt
- isDeleted

---

## CONCERNER

**CONCERNER** _(association)_

**Cardinalités :**

- HEALTH_RECORD (1,n) — CONCERNER — (1,1) MEDICAL_CARE

**Clé étrangère :**

- healthRecordId → HEALTH_RECORD.id

---

## EFFECTUER

**EFFECTUER** _(association)_

**Cardinalités :**

- VETERINARIAN (0,n) — EFFECTUER — (1,1) MEDICAL_CARE

**Clé étrangère :**

- veterinarianId → VETERINARIAN.id

---

## TAG

**TAG**

- **#id**
- name _(unique)_
- createdAt
- updatedAt
- isDeleted

---

## CLASSER

**CLASSER** _(association)_

**Cardinalités :**

- MEDICAL_CARE (0,n) — CLASSER — (0,n) TAG

**Clé primaire composée :**

- medicalCareId
- tagId

---

## VACCINE

**VACCINE**

- **#id**
- name
- createdAt
- updatedAt
- isDeleted

---

## VACCINE_TYPE

**VACCINE_TYPE**

- **#id**
- name _(unique)_
- createdAt
- updatedAt
- isDeleted

---

## APPARTENIR

**APPARTENIR** _(association)_

**Cardinalités :**

- VACCINE_TYPE (1,n) — APPARTENIR — (1,1) VACCINE

**Clé étrangère :**

- vaccineTypeId → VACCINE_TYPE.id

---

## ADMINISTRER

**ADMINISTRER** _(association)_

**Cardinalités :**

- MEDICAL_CARE (0,n) — ADMINISTRER — (0,n) VACCINE

**Clé primaire composée :**

- medicalCareId
- vaccineId

---

## ROLE

**ROLE**

- **#id**
- roleName _(unique)_
- createdAt
- updatedAt
- isDeleted

---

## USER

**USER**

- **#id**
- email _(unique)_
- password
- createdAt
- updatedAt
- isDeleted

---

## AVOIR_ROLE

**AVOIR_ROLE** _(association)_

**Cardinalités :**

- ROLE (1,n) — AVOIR_ROLE — (1,1) USER

**Clé étrangère :**

- roleId → ROLE.id

---

## REFRESH_TOKEN

**REFRESH_TOKEN**

- **#id**
- token _(unique)_
- expiresAt
- createdAt

---

## POSSEDER_TOKEN

**POSSEDER_TOKEN** _(association)_

**Cardinalités :**

- USER (1,n) — POSSEDER_TOKEN — (1,1) REFRESH_TOKEN

**Clé étrangère :**

- userId → USER.id
