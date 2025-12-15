import { Test } from "../models/Test.model";

export const TestRepository = {
  getOneTest: (id: string): Test => {
    // use prisma here

    const res = new Test(id, "Toto");

    return res;
  },
};
