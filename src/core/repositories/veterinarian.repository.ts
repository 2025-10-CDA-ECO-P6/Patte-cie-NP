import { Veterinarian } from '../models/veterinarian.model';


export const VeterinarianRepository = {
    getOneVeterinarian: (id: string): Veterinarian => {

        const res = new Veterinarian(id, "John", "Doe", "john.doe@mail.com", "0612345678", "VET-0001", new Date(), new Date(), false
        );
        return res;
    }
};

