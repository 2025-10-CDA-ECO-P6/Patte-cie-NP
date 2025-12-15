import { TestRepository } from "../repositories/test.repository";

export const testService = {
  helloWorld: (): string => {
    const userName = TestRepository.getOneTest("ef45").userName;

    return "Hello World from service, username is : " + userName;
  },

  testString: (): string => {
    return "test string";
  },

  //
  //
  //
  //
};
