import { Request, Response } from "express";
import { testService } from "../services/Test.service";

export const test = (req: Request, res: Response) => {


  const response = testService.helloWorld();

  res.json(response);
};
