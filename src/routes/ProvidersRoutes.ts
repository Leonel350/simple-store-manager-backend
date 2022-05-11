import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product";
import Sales from "../models/Sales";
import Provider from "../models/Provider";

class ProvidersRoutes {
   router: Router;
   constructor() {
      this.router = Router();
      this.routes();
   }

   async createUpdateProvider(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { providerId } = req.params;
      const { name, phone, address, email, website, notes } = req.body;
      const provider = new Provider(
         name,
         phone,
         address,
         email,
         website,
         notes,
         providerId
      );
      if (await provider.save()) {
         return res.json(provider);
      }
      return res.status(400).json({ errors: [{ msg: "Nothing to update" }] });
   }

   async deleteProvider(req: Request, res: Response) {
      const { providerId } = req.params;
      const provider = await Provider.findOne(providerId);
      if (!provider) {
         return res
            .status(404)
            .json({ errors: [{ msg: "Provider not found" }] });
      }
      await provider.delete();
      res.json({ msg: "Provider deleted" });
   }

   async getProvider(req: Request, res: Response) {
      const { providerId } = req.params;
      const provider = await Provider.findOne(providerId);
      if (!provider) {
         return res
            .status(404)
            .json({ errors: [{ msg: "Provider not found" }] });
      }
      res.json(provider);
   }

   async getProviders(req: Request, res: Response) {
      const providers = await Provider.find();
      res.json(providers);
   }

   // async getProvidersByName(req: Request, res: Response) {
   //     const { name } = req.params;
   //     const providers = await Provider.find({ name: { $regex: name, $options: "i" } });
   //     res.json(providers);
   // }

   routes() {
      this.router.get("/", this.getProviders);
      this.router.get("/:providerId", this.getProvider);
      this.router.post(
         "/",
         [body("name").not().isEmpty()],
         this.createUpdateProvider
      );
      this.router.put("/:providerId", this.createUpdateProvider);
      this.router.delete("/:providerId", this.deleteProvider);
   }
}

export default new ProvidersRoutes().router;
