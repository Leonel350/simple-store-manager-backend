import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product";
import Sales from "../models/Sales";

class SalesRoutes {
   router: Router;
   constructor() {
      this.router = Router();
      this.routes();
   }

   async createUpdateSales(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { salesId } = req.params;
      const { product, quantity } = req.body;

      const sale = await Sales.findOne(salesId);
      let dateString;
      let productData: any;
      if (sale) {
         dateString = sale.date;
         productData = sale.frozenProduct;
      } else {
         const date = new Date();
         dateString = date.toISOString();
         productData = await Product.findOne(product);
         if (!productData) {
            return res
               .status(404)
               .json({ errors: [{ msg: "Product not found" }] });
         }
         if (productData.stock < quantity) {
            return res
               .status(400)
               .json({ errors: [{ msg: "Not enough stock" }] });
         }
         productData.stock = productData.stock - quantity;
         await productData.save();
      }

      const totalPrice = productData.price * quantity;
      const sales = new Sales(
         productData,
         quantity,
         totalPrice,
         dateString,
         salesId
      );
      await sales.save();
      console.log(sales);
      res.json(sales);
   }

   async getSales(req: Request, res: Response) {
      const sales = await Sales.find();
      res.json(sales);
   }
   async getSale(req: Request, res: Response) {
      const { salesId } = req.params;
      const sale = await Sales.findOne(salesId);
      if (sale) {
         const product = await Product.findOne(sale.frozenProduct._id);
         res.json({ ...sale, product });
      } else {
         res.status(404).json({ errors: [{ msg: "Sale not found" }] });
      }
   }
   async deleteSale(req: Request, res: Response) {
      const { salesId } = req.params;
      const sale = await Sales.findOne(salesId);
      if (sale) {
         await sale.delete();
         res.json(sale);
      } else {
         res.status(404).json({ errors: [{ msg: "Sale not found" }] });
      }
   }

   async getLastSales(req: Request, res: Response) {
      const sales = await Sales.find();
      const lastSales = sales.sort(function (a: any, b: any) {
         if (a.date > b.date) {
            return -1;
         }
         if (a.date < b.date) {
            return 1;
         }
         return 0;
      });
      res.json(lastSales.slice(0,3));
   }

   routes() {
      this.router.get("/last", this.getLastSales);
      this.router.post(
         "/",
         [body("product").not().isEmpty(), body("quantity").not().isEmpty()],
         this.createUpdateSales
      );
      this.router.put("/:salesId", this.createUpdateSales);
      this.router.get("/", this.getSales);
      this.router.get("/:salesId", this.getSale);
      this.router.delete("/:salesId", this.deleteSale);
   }
}

export default new SalesRoutes().router;
