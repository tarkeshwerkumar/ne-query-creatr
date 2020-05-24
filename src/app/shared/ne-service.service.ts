import { NetworkElement } from "./NE";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NeServiceService {
  queryToRetun: string = "";
  constructor() {}

  checkFileExtension(fileName: string): boolean {
    var ext = fileName.split(".");
    var extName: string = ext[ext.length - 1];
    if (extName === "xlsx") {
      return true;
    }
    return false;
  }

  generateQuery(data: NetworkElement[]) {
    var query: string =
      "INSERT INTO NetworkElement(domain,neid,nename,fmemsid,netype,ipv6,ipv4,latitude,longitude,geographyl1id_fk,geographyl2id_fk,geographyl3id_fk,vendor, deleted) values\n";
    data.forEach((obj) => {
      if (this.validateData(obj)) {
        obj.domain = obj.domain.toUpperCase();
        obj.vendor = obj.vendor.toUpperCase();
        obj.netype = obj.netype.toUpperCase();
        var q = `('${obj.domain}', '${obj.neid}, ${obj.nename}', '${
          obj.fmemsid
        }', '${obj.netype}', '${obj.ipv6 ? obj.ipv6 : "NULL"}', '${
          obj.ipv4 ? obj.ipv4 : "NULL"
        }', '${obj.latitude ? obj.latitude : "NULL"}', '${
          obj.longitude ? obj.longitude : "NULL"
        }', ${obj.geographyl1id_fk ? obj.geographyl1id_fk : "NULL"}, ${
          obj.geographyl2id_fk ? obj.geographyl3id_fk : "NULL"
        }, ${obj.geographyl3id_fk ? obj.geographyl3id_fk : "NULL"}, '${
          obj.vendor
        }', 0),\n`;
        query = query + q;
      }
    });
    this.modifyQuery(query);
    return this.queryToRetun;
  }
  validateData(data: NetworkElement): boolean {
    if (
      !data.domain ||
      !data.vendor ||
      !data.fmemsid ||
      !data.neid ||
      !data.nename ||
      !data.netype
    ) {
      return false;
    }
    return true;
  }
  modifyQuery(q: string) {
    var qer = q.replace(`'NULL'`, "NULL");
    qer = qer.slice(0, -2) + ";";
    this.queryToRetun = qer;
  }
}
