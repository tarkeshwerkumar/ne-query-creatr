import { NeServiceService } from "./../shared/ne-service.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as XLSX from "xlsx";
import { NetworkElement } from "../shared/NE";

type AOA = any[][];

@Component({
  selector: "app-query-creater",
  templateUrl: "./query-creater.component.html",
  styleUrls: ["./query-creater.component.css"],
})
export class QueryCreaterComponent implements OnInit {
  // data: AOA = [
  //   [1, 2],
  //   [3, 4],
  // ];
   data: AOA = [];

   @ViewChild('fileInput') fileInput: ElementRef;

  fileName: string = '';
  isInvalidFile: boolean = false;
  constructor(private neService: NeServiceService) {}

  queryData: NetworkElement[];

  ngOnInit(): void {}
  uploadFile(e: any) {
    const target: DataTransfer = <DataTransfer>e.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const file: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(file, { type: "binary" });

      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];

      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      var jsonData = XLSX.utils.sheet_to_json(ws);
      this.queryData = JSON.parse(JSON.stringify(jsonData));
    };
    if(this.neService.checkFileExtension(target.files[0].name)){
      reader.readAsBinaryString(target.files[0]);
      this.fileName = target.files[0].name;
      this.fileInput.nativeElement.value='';
      this.isInvalidFile = false;
    }else{
      this.fileName = '';
      this.isInvalidFile = true;
    }
  }

  generateQuery() {
    var query = this.neService.generateQuery(this.queryData);

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(query)
    );
    element.setAttribute("download", 'ne.sql');
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.fileName = '';
  }

  downloadQuery() {
    console.log("Download Query !");
  }
}
