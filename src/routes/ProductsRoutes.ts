import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product";

class ProductsRoutes {
   router: Router;
   constructor() {
      this.router = Router();
      this.routes();
   }

   async createUpdateProduct(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { productId } = req.params;
      const { name, category, provider, price, costPrice, stock, barCode } = req.body;
      const product = new Product(
         name,
         category,
         provider,
         price,
         costPrice,
         stock,
         barCode,
         productId
      );
      console.log(product);
      if(await product.save()){
         return res.json(product);
      }
      return res.status(400).json({ errors: [{ msg: "Nothing to update" }] });
   }

   async getProducts(req: Request, res: Response) {
      const products = await Product.find();
      res.json(products);
   }

   async getProduct(req: Request, res: Response) {
      const { productId } = req.params;
      const product = await Product.findOne(productId);
      if (product) {
         res.json(product);
      } else {
         res.status(404).json({ errors: [{ msg: "Product not found" }] });
      }
   }

   async deleteProduct(req: Request, res: Response) {
      const { productId } = req.params;
      const product = await Product.findOne(productId);
      if (product) {
         await product.delete();
         res.json(product);
      } else {
         res.status(404).json({ errors: [{ msg: "Product not found" }] });
      }
   }

   routes() {
      this.router.get("/", this.getProducts);
      this.router.post(
         "/",
         [
            body("name").not().isEmpty(),
            body("category").not().isEmpty(),
            body("price").not().isEmpty(),
            body("provider").not().isEmpty(),
         ],
         this.createUpdateProduct
      );
      this.router.put(
         "/:productId",
         this.createUpdateProduct
      );
      this.router.get("/:productId", this.getProduct);
      this.router.delete("/:productId", this.deleteProduct);
   }
}
export default new ProductsRoutes().router;
