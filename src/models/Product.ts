import DBController from "../controllers/DBController";
export default class Product {
   _id: string = "";
   name: string;
   category: string;
   provider: string;
   price: number;
   costPrice: number = 0;
   stock: number = 0;
   barCode: string = "";

   constructor(
      name: string,
      category: string,
      provider: string,
      price: number,
      costPrice: number = 0,
      stock: number = 0,
      barCode: string = "",
      id: string = ""
   ) {
      this.name = name;
      this.category = category;
      this.provider = provider;
      this.price = price;
      this.costPrice = costPrice;
      this.stock = stock;
      this.barCode = barCode;
      this._id = id;
   }

   public async save() {
      const db = new DBController();
      console.log("Saving product ", this.name, this._id);
      let product;
      if (this._id.length === 0) {
         console.log("creating");
         product = await db.createProduct(this);
      } else {
         console.log("updating");
         product = await db.updateProduct(this._id, this);
         if (!product) {
            return false;
         }
         this.name = product.name;
         this.category = product.category;
         this.provider = product.provider;
         this.price = product.price;
         this.costPrice = product.costPrice;
         this.stock = product.stock;
         this.barCode = product.barCode;
      }
      this._id = product._id;
      console.log("product is", product);
      return true;
   }

   public async delete() {
      const db = new DBController();
      await db.deleteProduct(this._id);
   }

   public static async findOne(id: string) {
      const db = new DBController();
      const product = await db.getProduct(id);
      if (product) {
         const newProduct = new Product(
            product.name,
            product.category,
            product.provider,
            product.price,
            product.costPrice,
            product.stock,
            product.barCode,
            product._id
         );
         return newProduct;
      }
      return null;
   }

   public static async find() {
      const db = new DBController();
      const products = await db.getProducts();
      return products;
   }
}
