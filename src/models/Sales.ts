import DBController from "../controllers/DBController";

export default class Sales {
   _id: string = "";
   frozenProduct: any;
   quantity: number;
   totalPrice: number;
   date: string;

   constructor(
      frozenProduct: any,
      quantity: number,
      totalPrice: number,
      date: string,
      id: string = ""
   ) {
      this.frozenProduct = frozenProduct;
      this.quantity = quantity;
      this.totalPrice = totalPrice;
      this.date = date,
      this._id = id;
   }
   public async save() {
      const db = new DBController();
      console.log("Saving sale ", this, this._id);
      let sale;
      if (this._id.length === 0) {
         console.log("creating");
         sale = await db.createSale(this);
      } else {
         console.log("updating");
         sale = await db.updateSale(this._id, this);
      }
      console.log(sale);
      this._id = sale._id;
      console.log("sale is", sale);
   }

   public async delete() {
      const db = new DBController();
      await db.deleteSale(this._id);
   }

   public static async find() {
      const db = new DBController();
      const sales = await db.getSales();
      return sales;
   }

   public static async findOne(id: string) {
      const db = new DBController();
      const sale = await db.getSale(id);
      if (sale) {
         const newSale = new Sales(
            sale.frozenProduct,
            sale.quantity,
            sale.totalPrice,
            sale.date,
            sale._id
         );
         return newSale;
      }
   }
}
