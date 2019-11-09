import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatPaginator, MatTableDataSource} from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 12, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 15, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);
  
    @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static:true}) sort: MatSort;
  
    ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    // /** Whether the number of selected elements matches the total number of rows. */
    // isAllSelected() {
    //   const numSelected = this.selection.selected.length;
    //   const numRows = this.dataSource.data.length;
    //   return numSelected === numRows;
    // }
  
    // /** Selects all rows if they are not all selected; otherwise clear selection. */
    // masterToggle() {
    //   this.isAllSelected() ?
    //       this.selection.clear() :
    //       this.dataSource.data.forEach(row => this.selection.select(row));
    // }
  
    private findStartEndIndices(): {startIndex: number, endIndex: number} {
      const pageIndex = this.dataSource.paginator.pageIndex;
      const pageSize = this.dataSource.paginator.pageSize;
      const total = this.dataSource.paginator.length;
      const startIndex = pageIndex * pageSize;
      const endIndex = (startIndex + pageSize) > total ? total : startIndex + pageSize;
      return {startIndex: startIndex, endIndex: endIndex};
    }
  
    isAllSelected() {
      const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();
      //const sortedData = this.dataSource._orderData(this.dataSource.data);
      const sortedData = this.dataSource._orderData(this.dataSource.filteredData);
      const numSelected = sortedData.slice(page.startIndex, page.endIndex)
        .filter( row => this.selection.isSelected(row)).length;

        const numDisableSelected = sortedData.slice(page.startIndex, page.endIndex)
        .filter( row => this.isDisable(row)).length;
  
      return numSelected === (page.endIndex - page.startIndex) -numDisableSelected;
    }
  
    isAtLeaseOneSelected() {
      const page: {startIndex: number, endIndex: number} =
        this.findStartEndIndices();
      //const sortedData = this.dataSource._orderData(this.dataSource.data);
      const sortedData = this.dataSource._orderData(this.dataSource.filteredData);
      const numSelected = sortedData.slice(page.startIndex, page.endIndex)
        .filter( row => this.selection.isSelected(row)).length;
      return numSelected > 0;
    }
  
    masterToggle() {
      const page: {startIndex: number, endIndex: number} = this.findStartEndIndices();
  
      //const sortedData = this.dataSource._orderData(this.dataSource.data);
      const sortedData = this.dataSource._orderData(this.dataSource.filteredData);


      if (this.isAllSelected()) {
        sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
          this.selection.deselect(row);
        });
      } else {
        sortedData.slice(page.startIndex, page.endIndex).forEach( row => {
           if(!this.isDisable(row))
            this.selection.select(row);
        });
      }
    }
  
    rowToggle(row) {
      this.selection.toggle(row);
      row.selected = !row.selected;
  
      // if (this.sort.active === 'selected' && this.sort.direction !== '') {
      //   const original = this.dataSource.data;
      //   this.dataSource.data = this.dataSource._orderData(this.dataSource.data);
      //   this.dataSource.data = original;
      // }
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isDisable(row:PeriodicElement)
    {
      return row.position > 4;
    }





  }
  