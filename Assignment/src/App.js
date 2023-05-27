import react from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const App = () => {
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    { headerName: "Id", field: "id", filter: "agTextColumnFilter" },
    { headerName: "Name", field: "name", filter: "agTextColumnFilter" },
    { headerName: "Branch", field: "branch", filter: "agTextColumnFilter" },
    { headerName: "Year", field: "year", filter: "agTextColumnFilter" },
    { headerName: "Phone", field: "phone", filter: "agTextColumnFilter" },
    { headerName: "Total_Marks", field: 'total_marks', filter: "agTextColumnFilter" },
  ]
  const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params.request, null, 1));
      const { startRow, endRow, filterModel} = params.request
      let url = `http://localhost:4000/olympic?`
      //Filtering
      const filterKeys = Object.keys(filterModel)
      filterKeys.forEach(filter => {
        url += `${filter}=${filterModel[filter].filter}&`
      })
      //Pagination
      url += `_start=${startRow}&_end=${endRow}`
      fetch(url)
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.successCallback(response, 499);
        })
        .catch(error => {
          console.error(error);
          params.failCallback();
        })
    }
  };
  
  const onGridReady = (params) => {
    setGridApi(params);
    // register datasource with the grid
    params.api.setServerSideDatasource(datasource);
  }

  return (
    <div>
      <h1 align="center">Student Details</h1>
      <h4 align='center'>Implementing Pagination, Filtering functionality</h4>
      <div className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columns}
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
          rowModelType="serverSide"
          onGridReady={onGridReady}
          defaultColDef={{ filter: true, floatingFilter: true}}
        />
      </div>
    </div>
  );
};
export default App