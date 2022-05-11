import ForerunnerDB from "forerunnerdb";
import { saveCollection, loadCollection } from "../lib/saveLoadCollections";

export default class DBController {
   db;
   productsCollection: any;
   providersCollection: any;
   salesCollection: any;
   dailyBalanceCollection: any;

   constructor() {
      console.log("Start DB");
      const fdb = new ForerunnerDB();
      this.db = fdb.db("store-manager");
      //set the db folder
      this.db.persist.dataDir("./dbData");
      this.db.persist.auto(true);
      //set collections
      this.productsCollection = this.db.collection("products");
      this.providersCollection = this.db.collection("providers");
      this.salesCollection = this.db.collection("sales");
      this.dailyBalanceCollection = this.db.collection("dailyBalance");
   }
   public async createProduct(product: any) {
      delete product._id;
      await loadCollection(this.productsCollection);
      this.productsCollection.insert(product);
      await saveCollection(this.productsCollection);
      return product;
   }

   public async getProducts() {
      await loadCollection(this.productsCollection);
      return this.productsCollection.find();
   }

   public async getProduct(productId: string) {
      await loadCollection(this.productsCollection);
      return this.productsCollection.findOne({ _id: productId });
   }

   public async deleteProduct(productId: string) {
      await loadCollection(this.productsCollection);
      const product = this.productsCollection.remove({ _id: productId });
      await saveCollection(this.productsCollection);
      return product;
   }

   public async updateProduct(productId: string, product: any) {
      await loadCollection(this.productsCollection);
      const updatedProduct = this.productsCollection.update(
         { _id: productId },
         product
      );
      await saveCollection(this.productsCollection);
      return updatedProduct[0];
   }

   public async createProvider(provider: any) {
      delete provider._id;
      await loadCollection(this.providersCollection);
      this.providersCollection.insert(provider);
      await saveCollection(this.providersCollection);
      return provider;
   }

   public async getProviders() {
      await loadCollection(this.providersCollection);
      return this.providersCollection.find();
   }

   public async getProvider(providerId: string) {
      await loadCollection(this.providersCollection);
      return this.providersCollection.findOne({ _id: providerId });
   }

   public async deleteProvider(providerId: string) {
      await loadCollection(this.providersCollection);
      const provider = this.providersCollection.remove({ _id: providerId });
      await saveCollection(this.providersCollection);
      return provider;
   }

   public async updateProvider(providerId: string, provider: any) {
      await loadCollection(this.providersCollection);
      const updatedProvider = this.providersCollection.update(
         { _id: providerId },
         provider
      );
      await saveCollection(this.providersCollection);
      return updatedProvider[0];
   }

   public async createSale(sale: any) {
      delete sale._id;
      await loadCollection(this.salesCollection);
      this.salesCollection.insert(sale);
      await saveCollection(this.salesCollection);
      return sale;

   }

   public async getSales() {
      await loadCollection(this.salesCollection);
      return this.salesCollection.find();
   }

   public async getSale(saleId: string) {
      await loadCollection(this.salesCollection);
      return this.salesCollection.findOne({ _id: saleId });
   }

   public async deleteSale(saleId: string) {
      await loadCollection(this.salesCollection);
      const sale = this.salesCollection.remove({ _id: saleId });
      await saveCollection(this.salesCollection);
      return sale;
   }

   public async updateSale(saleId: string, sale: any) {
      await loadCollection(this.salesCollection);
      const updatedSale = this.salesCollection.update(
         { _id: saleId },
         sale
      );
      await saveCollection(this.salesCollection);
      return updatedSale[0];
   }


}
