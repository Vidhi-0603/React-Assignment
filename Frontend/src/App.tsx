import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  DataTable,
  type DataTablePageEvent,
  type DataTableSelectionMultipleChangeEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchRows } from "./fetchRows";
import type { ArtWorks } from "./types";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  InputNumber,
  type InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import type { Nullable } from "primereact/ts-helpers";

function App() {
  const [currentPageRows, setCurrentPageRows] = useState<ArtWorks[]>([]); //the data from API
  const [rowsPerPage, setRowsPerPage] = useState<number>(1); //no of rows in a page
  const [first, setFirst] = useState<number>(0); // paginator position
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedArtworksIDs, setselectedArtworksIDs] = useState<Set<number>>(
    new Set(),
  );
  const [selectedNoOfRows, setSelectedNoOfRows] =
    useState<Nullable<number | null>>(0);
  const op = useRef<OverlayPanel>(null);

  const currentSelectedArtworks = currentPageRows.filter((artwork) =>
    selectedArtworksIDs.has(artwork.id),
  );

  const onPageChangeEvent = async (e: DataTablePageEvent) => {
    setFirst(e.first);
    setRowsPerPage(e.rows);

    const page = Math.floor(e.first / e.rows) + 1;
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

  const onSelectionChangeEvent = (
    e: DataTableSelectionMultipleChangeEvent<ArtWorks[]>,
  ) => {
    const selectedRows: ArtWorks[] = e.value ?? [];

    setselectedArtworksIDs((previousRows) => {
      const newRows = new Set(previousRows);
      currentPageRows.forEach((row) => newRows.delete(row.id));
      selectedRows.forEach((row) => {
        newRows.add(row.id);
      });
      return newRows;
    });
  };

  const customSelection = (
    <div>
      <Button
        icon="pi pi-chevron-down"
        text
        rounded
        size="small"
        onClick={(e) => op.current?.toggle(e)}
      />
    </div>
  );

  const onCustomSelection = () => {
    if (!selectedNoOfRows || selectedNoOfRows < 0) return;

    setselectedArtworksIDs((prevSelectedIDs) => {
      const newSelectedIDs = new Set(prevSelectedIDs);

      // Deselect rows
      if (newSelectedIDs.size > selectedNoOfRows) {
        let rowsToDelete = newSelectedIDs.size - selectedNoOfRows;

        for (const row of currentPageRows) {
          if (rowsToDelete === 0) break;
          if (newSelectedIDs.has(row.id)) {
            newSelectedIDs.delete(row.id);
            rowsToDelete--;
          }
        }
        return newSelectedIDs;
      }

      // Select remaining rows
      let remainingRowsToSelect = selectedNoOfRows - newSelectedIDs.size;

      for (const row of currentPageRows) {
        if (remainingRowsToSelect === 0) break;
        if (!newSelectedIDs.has(row.id)) {
          newSelectedIDs.add(row.id);
          remainingRowsToSelect--;
        }
      }

      return newSelectedIDs;
    });

    op.current?.hide();
  };


  useEffect(() => {
    if (!selectedNoOfRows) return;

    setselectedArtworksIDs((prev) => {
      if (prev.size >= selectedNoOfRows) return prev;

      const newSelectedIDs = new Set(prev);
      let remainingRowsToSelect = selectedNoOfRows - newSelectedIDs.size;

      for (const row of currentPageRows) {
        if (remainingRowsToSelect === 0) break;
        if (!newSelectedIDs.has(row.id)) {
          newSelectedIDs.add(row.id);
          remainingRowsToSelect--;
        }
      }

      return newSelectedIDs;
    });
  }, [currentPageRows, selectedNoOfRows]);

  return (
    <>
      <DataTable
        value={currentPageRows}
        dataKey="id"
        paginator
        lazy
        rows={rowsPerPage}
        first={first}
        totalRecords={totalRecords}
        onPage={onPageChangeEvent}
        selection={currentSelectedArtworks}
        selectionMode="multiple"
        selectionPageOnly
        onSelectionChange={onSelectionChangeEvent}
      >
        <Column
          selectionMode="multiple"
          header={customSelection}
          sortable={false}
          headerStyle={{ width: "4rem" }}
        ></Column>

        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
      <OverlayPanel ref={op}>
        <InputNumber
          value={selectedNoOfRows}
          onValueChange={(e: InputNumberValueChangeEvent) =>
            setSelectedNoOfRows(e.value)
          }
          placeholder="Select N rows"
        />
        <Button
          label="Apply"
          text
          rounded
          size="small"
          onClick={onCustomSelection}
        ></Button>
      </OverlayPanel>
    </>
  );
}

export default App;
