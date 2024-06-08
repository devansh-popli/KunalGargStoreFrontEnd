import React from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { getVehicleImageByNameURl } from "../services/VehicleEntryService";

// Helper function to convert camel case to title case
const camelCaseToTitleCase = (camelCase) => {
  return camelCase
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
const splitDataIntoChunks = (data, chunkSize) => {
  const entries = Object.entries(data);
  const chunks = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  return chunks;
};

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 32,
    textAlign: "left",
    marginBottom: 20,
    textTransform: "title",
    fontWeight: "200px",
    color: "#0269a1",
  },
  section: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e4",
    borderBottomStyle: "solid",
  },
  field: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  fieldName: {
    fontSize: 12,
    fontWeight: "bold",
    width: "30%",
  },
  fieldValue: {
    fontSize: 12,
    width: "70%",
  },
  table: {
    display: "table",
    marginVertical: 20,
    width: "75%",
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#e4e4e4",
    textAlign: "center",
    padding: 5,
  },
  tableCol1: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
  tableCol2: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
  tableCell: {
    fontSize: 12,
    maxWidth: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  image: {
    marginVertical: 4,
    width: 220,
    height: 150,
    alignSelf: "center",
  },
  imageHeader: {
    textAlign: "center",
    fontSize: 12,
  },
  imageRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
});

const PDFDocument = ({ data, title }) => {
  const chunks = splitDataIntoChunks(data, 7);
  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            borderBottomWidth: 1,
            borderBottomColor: "#e4e4e4",
            borderBottomStyle: "solid",
          }}
        >
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.tableCell}>Entry Number: {data.id}</Text>
          </View>
          <View>
            {["vehicleImages"].map(
              (key) =>
                data[key] &&
                Array.isArray(data[key]) &&
                data[key].length > 0 && (
                  <View key={key} style={styles.section}>
                    <Image
                      style={{ height: 100, width: 100 }}
                      src={getVehicleImageByNameURl(data[key][0])}
                      onError={(error) =>
                        console.error(
                          "Error loading image:",
                          error,
                          "Image URL:",
                          imageUrl
                        )
                      }
                    />
                  </View>
                )
            )}
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={styles.container}>
            {chunks.map((chunk, index) => (
              <View key={index} style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>
                      Part {alphabets[index]}
                    </Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                </View>
                {chunk
                  .filter(
                    ([key, value]) =>
                      ![
                        "vehicleDocument",
                        "vehicleImages",
                        "driverDocument",
                        "id",
                      ].includes(key) && value?.length !== 0
                  )
                  .map(([key, value], index1) => (
                    <View key={key} style={styles.tableRow}>
                      <View style={styles.tableCol1}>
                        <Text style={styles.tableCell}>
                          {alphabets[index]}
                          {index1 + 1}
                        </Text>
                      </View>
                      <View style={styles.tableCol2}>
                        <Text style={styles.tableCell}>
                          {camelCaseToTitleCase(key)}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value != null
                            ? value.toString()
                            : ""}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            ))}
          </View>
          <View>
            {["vehicleDocument", "vehicleImages", "driverDocument"].map(
              (key) =>
                data[key] &&
                Array.isArray(data[key]) &&
                data[key].length > 0 && (
                  <View key={key} style={styles.section}>
                    <Text style={styles.imageHeader}>
                      {camelCaseToTitleCase(key)}
                    </Text>
                    {data[key].map((imageUrl, index) => (
                      <Image
                        key={index}
                        style={styles.image}
                        src={getVehicleImageByNameURl(imageUrl)}
                        onError={(error) =>
                          console.error(
                            "Error loading image:",
                            error,
                            "Image URL:",
                            imageUrl
                          )
                        }
                      />
                    ))}
                  </View>
                )
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFGenerator = ({ data, title }) => (
  <div>
    <PDFDownloadLink
      document={<PDFDocument data={data} title={title} />}
      fileName="data.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download PDF"
      }
    </PDFDownloadLink>
  </div>
);

export default PDFGenerator;
