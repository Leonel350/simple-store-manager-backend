import DBController from "../controllers/DBController";

export default class Provider {
   _id: string = "";
   name: string;
   phone: string;
   address: string;
   email: string;
   website: string;
   notes: string;

   constructor(
      name: string,
      phone: string,
      address: string,
      email: string,
      website: string,
      notes: string,
      id: string = ""
   ) {
      this.name = name;
      this.phone = phone;
      this.address = address;
      this.email = email;
      this.website = website;
      this.notes = notes;
      this._id = id;
   }
   public async save() {
      const db = new DBController();
      console.log("Saving provider ", this.name, this._id);
      let provider;
      if (this._id.length === 0) {
         console.log("creating");
         provider = await db.createProvider(this);
      } else {
         console.log("updating");
         provider = await db.updateProvider(this._id, this);
         console.log("test1", provider);
         if (!provider) {
            return false;
         }
         this.name = provider.name;
         this.phone = provider.phone;
         this.address = provider.address;
         this.email = provider.email;
         this.website = provider.website;
         this.notes = provider.notes;
      }
      console.log(this);
      this._id = provider._id;
      return true;
   }
   public async delete() {
      const db = new DBController();
      await db.deleteProvider(this._id);
   }
   public static async findOne(id: string) {
      const db = new DBController();
      const provider = await db.getProvider(id);
      if (provider) {
         const newProvider = new Provider(
            provider.name,
            provider.phone,
            provider.address,
            provider.email,
            provider.website,
            provider.notes,
            provider._id
         );
         return newProvider;
      }
      return null;
   }

   public static async find() {
      const db = new DBController();
      const providers = await db.getProviders();
      return providers;
   }
}
