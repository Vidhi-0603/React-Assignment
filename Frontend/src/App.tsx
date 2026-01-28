import { useEffect, useState } from "react";
import "./App.css";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchRows } from "./fetchRows";
import type { ArtWorks } from "./types";

function App() {
  const [currentPageRows, setCurrentPageRows] = useState<ArtWorks[]>([]); //the data from API
  const [rowsPerPage, setRowsPerPage] = useState<number>(0); //no of rows in a page
  const [first, setFirst] = useState<number>(0); // paginator position
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const onPageChangeEvent = async (e: DataTablePageEvent) => {
    setFirst(e.first);
    const page = Math.floor(e.first / rowsPerPage) + 1;
    const result = await fetchRows(page);
    setCurrentPageRows(result.data);
  };

  useEffect(() => {
    const fetchData = async (currentPage: number) => {
      const result = await fetchRows(currentPage);
      setCurrentPageRows(result.data);
      setRowsPerPage(result.pagination.limit);
      setTotalRecords(result.pagination.total);
    };
    fetchData(1);
  }, []);

  return (
    <>
      <DataTable
        value={currentPageRows}
        paginator
        lazy
        rows={rowsPerPage}
        first={first}
        totalRecords={totalRecords}
        onPage={onPageChangeEvent}
      >
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
    </>
  );
}

export default App;
