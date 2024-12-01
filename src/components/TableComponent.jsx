/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Table } from "ka-table";
import {
  DataType,
  EditingMode,
  SortingMode,
  FilteringMode,
} from "ka-table/enums";
import "../styles/CustomThemeDemo.scss";
import "ka-table/style.scss";

const TableComponent = ({ fileData }) => {
  const [columns, setColumns] = useState([]);
  const [groups, setGroups] = useState([]);

  const addSerialNumber = (data) =>
    data.map((row, index) => ({ ...row, serialNumber: index + 1 }));

  useEffect(() => {
    if (fileData && fileData.length > 0) {
      const columnKeys = Object.keys(fileData[0]);

      const dynamicColumns = columnKeys.map((key) => ({
        key,
        title: key.toUpperCase(),
        dataType: key === "age" ? DataType.Number : DataType.String,
        style: {
          minWidth: 120,
          maxWidth: 250,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }));

      setColumns(dynamicColumns);

      const defaultGroups = columnKeys
        .slice(0, 1)
        .map((key) => ({ columnKey: key }));
      setGroups(defaultGroups);
    }
  }, [fileData]);

  if (!columns.length || !groups.length) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading data, please wait...</p>
      </div>
    );
  }
  return (
    <div className="ka-table-container">
      <Table
        columns={[
          {
            key: "serialNumber",
            title: "S.No",
            dataType: DataType.Number,
            style: { minWidth: 90, maxWidth: 120 },
          },
          ...columns,
        ]}
        data={addSerialNumber(fileData)}
        rowKeyField={"id"}
        editingMode={EditingMode.Cell}
        sortingMode={SortingMode.Single}
        filteringMode={FilteringMode.FilterRow}
        paging={{
          enabled: true,
          pageSize: 7,
          pageIndex: 0,
        }}
        groups={groups}
        groupPanel={{
          enabled: true,
          text: "For grouping, drag a column here...",
        }}
      />
    </div>
  );
};

export default TableComponent;
