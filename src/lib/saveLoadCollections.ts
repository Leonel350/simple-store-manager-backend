export async function loadCollection(table: any): Promise<any> {
   return new Promise((resolve, reject) => {
      table.load(function (err: any) {
         if (!err) {
            resolve("loaded");
         } else {
            reject(err);
         }
      });
   });
}

export async function saveCollection(table: any): Promise<any> {
   return new Promise((resolve, reject) => {
      table.save(function (err: any) {
         if (!err) {
            console.log("saved");
            resolve("saved");
         } else {
            reject(err);
         }
      });
   });
}
