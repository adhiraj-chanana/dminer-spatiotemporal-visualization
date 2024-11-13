let jsonData = {};

let model = null;
let variable = null;
let statistics = null;

let timeSeriesData = {};
let chosen = null;

async function fetchGCM() {
    jsonData = {}; // Clear jsonData to avoid stale data
    if (chosen === "GCM") return;
    chosen = "GCM";
    try {
        const response = await fetch("gcm_data_rc.json");
        jsonData = await response.json();
    } catch (error) {
        console.error("Error loading GCM data:", error);
    }
}

async function fetchDL() {
    jsonData = {}; // Clear jsonData to avoid stale data
    if (chosen === "DL") return;
    chosen = "DL";
    try {
        const response = await fetch("dl_ta_data_rc.json");
        jsonData = await response.json();
    } catch (error) {
        console.error("Error loading DL data:", error);
    }
}
async function gcm_fetchStatisticData(statistic) {
    jsonData = {}; // Clear jsonData to avoid stale data
    chosen = "GCM";
    let fileUrl = "";

    switch (statistic) {
        case "Mean":
            fileUrl = "gcm_data_mean.json";
            break;
        case "Scale":
            fileUrl = "gcm_data_scale.json";
            break;
        case "Shape":
            fileUrl = "gcm_data_shape.json";
            break;
        case "Trend":
        default:
            fileUrl = "gcm_data_rc.json";
            break;
    }

    try {
        const response = await fetch(fileUrl);
        jsonData = await response.json();
    } catch (error) {
        console.error(`Error loading ${statistic} data:`, error);
    }
}
async function dl_fetchStatisticData(statistic) {
    jsonData = {}; // Clear jsonData to avoid stale data
    chosen = "DL";
    let fileUrl = "";

    switch (statistic) {
        case "Mean":
            fileUrl = "dl_data_mean.json";
            break;
        case "Scale":
            fileUrl = "dl_data_scale.json";
            break;
        case "Shape":
            fileUrl = "dl_data_shape.json";
            break;
        case "Trend":
        default:
            fileUrl = "dl_ta_data_rc.json";
            break;
    }

    try {
        const response = await fetch(fileUrl);
        jsonData = await response.json();
    } catch (error) {
        console.error(`Error loading ${statistic} data:`, error);
    }
}
async function fetchFileForLatgcm(lat) {
    // Determine which file to load based on the lat value.
    let fileIndex;

    if (lat <= -85.28795811518324) {
        fileIndex = 1;
    } else if (lat > -85.28795811518324 && lat <= -79.63350785340315) {
        fileIndex = 2;
    } else if (lat > -79.63350785340315 && lat <= -73.97905759162303) {
        fileIndex = 3;
    } else if (lat > -73.97905759162303 && lat <= -68.32460732984293) {
        fileIndex = 4;
    } else if (lat > -68.32460732984293 && lat <= -62.67015706806283) {
        fileIndex = 5;
    } else if (lat > -62.67015706806283 && lat <= -57.01570680628272) {
        fileIndex = 6;
    } else if (lat > -57.01570680628272 && lat <= -51.361256544502616) {
        fileIndex = 7;
    } else if (lat > -51.361256544502616 && lat <= -45.70680628272251) {
        fileIndex = 8;
    } else if (lat > -45.70680628272251 && lat <= -40.05235602094241) {
        fileIndex = 9;
    } else if (lat > -40.05235602094241 && lat <= -34.397905759162306) {
        fileIndex = 10;
    } else if (lat > -34.397905759162306 && lat <= -28.7434554973822) {
        fileIndex = 11;
    } else if (lat > -28.7434554973822 && lat <= -23.0890052356021) {
        fileIndex = 12;
    } else if (lat > -23.0890052356021 && lat <= -17.43455497382199) {
        fileIndex = 13;
    } else if (lat > -17.43455497382199 && lat <= -11.78010471204189) {
        fileIndex = 14;
    } else if (lat > -11.78010471204189 && lat <= -6.125654450261777) {
        fileIndex = 15;
    } else if (lat > -6.125654450261777 && lat <= -0.4712041884816784) {
        fileIndex = 16;
    } else if (lat > -0.4712041884816784 && lat <= 5.1832460732984345) {
        fileIndex = 17;
    } else if (lat > 5.1832460732984345 && lat <= 10.837696335078531) {
        fileIndex = 18;
    } else if (lat > 10.837696335078531 && lat <= 16.492146596858632) {
        fileIndex = 19;
    } else if (lat > 16.492146596858632 && lat <= 22.146596858638745) {
        fileIndex = 20;
    } else if (lat > 22.146596858638745 && lat <= 27.801047120418843) {
        fileIndex = 21;
    } else if (lat > 27.801047120418843 && lat <= 33.455497382198956) {
        fileIndex = 22;
    } else if (lat > 33.455497382198956 && lat <= 39.10994764397907) {
        fileIndex = 23;
    } else if (lat > 39.10994764397907 && lat <= 44.764397905759154) {
        fileIndex = 24;
    } else if (lat > 44.764397905759154 && lat <= 50.41884816753927) {
        fileIndex = 25;
    } else if (lat > 50.41884816753927 && lat <= 56.07329842931938) {
        fileIndex = 26;
    } else if (lat > 56.07329842931938 && lat <= 61.727748691099464) {
        fileIndex = 27;
    } else if (lat > 61.727748691099464 && lat <= 67.38219895287958) {
        fileIndex = 28;
    } else if (lat > 67.38219895287958 && lat <= 73.03664921465969) {
        fileIndex = 29;
    } else if (lat > 73.03664921465969 && lat <= 78.6910994764398) {
        fileIndex = 30;
    } else if (lat > 78.6910994764398 && lat <= 84.34554973821989) {
        fileIndex = 31;
    } else if (lat > 84.34554973821989 && lat <= 90.0) {
        fileIndex = 32;
    }

    // Fetch the corresponding file
    const fileName = `gcm/split_${fileIndex}.csv`;
    console.log("array index is ", fileName);
    return fetch(fileName)
        .then((response) => response.text())
        .then((csvData) => {
            parseCSVData(csvData); // Re-parse and store the new data in `timeSeriesData`
        })
        .catch((error) => console.error("Error loading CSV file:", error));
}

async function fetchFileForLatdl(lat) {
    // Determine which file to load based on the lat value.
    let fileIndex;

    if (lat >= 83.75) {
        fileIndex = 1;
    } else if (lat < 83.75 && lat >= 76.25) {
        fileIndex = 2;
    } else if (lat < 76.25 && lat >= 68.75) {
        fileIndex = 3;
    } else if (lat < 68.75 && lat >= 61.25) {
        fileIndex = 4;
    } else if (lat < 61.25 && lat >= 53.75) {
        fileIndex = 5;
    } else if (lat < 53.75 && lat >= 46.25) {
        fileIndex = 6;
    } else if (lat < 46.25 && lat >= 38.75) {
        fileIndex = 7;
    } else if (lat < 38.75 && lat >= 31.25) {
        fileIndex = 8;
    } else if (lat < 31.25 && lat >= 23.75) {
        fileIndex = 9;
    } else if (lat < 23.75 && lat >= 16.25) {
        fileIndex = 10;
    } else if (lat < 16.25 && lat >= 8.75) {
        fileIndex = 11;
    } else if (lat < 8.75 && lat >= 1.25) {
        fileIndex = 12;
    } else if (lat < 1.25 && lat >= -6.25) {
        fileIndex = 13;
    } else if (lat < -6.25 && lat >= -13.75) {
        fileIndex = 14;
    } else if (lat < -13.75 && lat >= -21.25) {
        fileIndex = 15;
    } else if (lat < -21.25 && lat >= -28.75) {
        fileIndex = 16;
    } else if (lat < -28.75 && lat >= -36.25) {
        fileIndex = 17;
    } else if (lat < -36.25 && lat >= -43.75) {
        fileIndex = 18;
    } else if (lat < -43.75 && lat >= -51.25) {
        fileIndex = 19;
    } else if (lat < -51.25 && lat >= -58.75) {
        fileIndex = 20;
    } else if (lat < -58.75 && lat >= -66.25) {
        fileIndex = 21;
    } else if (lat < -66.25 && lat >= -73.75) {
        fileIndex = 22;
    } else if (lat < -73.75 && lat >= -81.25) {
        fileIndex = 23;
    } else if (lat < -81.25 && lat >= -88.75) {
        fileIndex = 24;
    } else if (lat < -88.75 && lat >= -90.0) {
        fileIndex = 25;
    }

    // Fetch the corresponding file
    const fileName = `dl/split_${fileIndex}.csv`;
    console.log("array index is ", fileName);
    return fetch(fileName)
        .then((response) => response.text())
        .then((csvData) => {
            parseCSVData(csvData); // Re-parse and store the new data in `timeSeriesData`
        })
        .catch((error) => console.error("Error loading CSV file:", error));
}

// Parse the CSV time series data into an object
function parseCSVData(csvData) {
    timeSeriesData = {};
    const rows = csvData.split("\n");
    const headers = rows[0].split(","); // First row contains the dates (Jan 2025, Feb 2025, ...)

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(",");
        const latLonKey = `${row[0]},${row[1]}`; // lat and lon are the first two columns
        const timeSeriesValues = row.slice(2).map(Number); // The rest are temperature values
        timeSeriesData[latLonKey] = timeSeriesValues;
    }
}

// Function to update model and variable selections
function updateParameters() {
    // Both the select menus
    model = document.getElementById("modelSelect").value;
    variable = document.getElementById("variableSelect").value;
    statistics = document.getElementById("statisticsSelect").value;
    updateMap();
    closeModal();
}

// Function to clear the map when conditions are not met
function clearMap() {
    Plotly.purge("map");
}

// Function to update the map based on the selected parameters
async function updateMap() {
    if (model === "gcm") {
        await gcm_fetchStatisticData(statistics);
    } else if (model === "dl") {
        await dl_fetchStatisticData(statistics);
    }
    if (!jsonData || Object.keys(jsonData).length === 0) {
        alert("Data not loaded yet.");
        return;
    }

    const tempData = jsonData.locations.map((location) => {
        return {
            lat: location.lat,
            lon: location.lon,
            regression_coefficient: location.regression_coefficient,
        };
    });

    const filteredData = tempData.filter(
        (d) => d.regression_coefficient !== null
    );

    const mapTrace = {
        type: "scattergeo",
        mode: "markers",
        lat: filteredData.map((d) => d.lat),
        lon: filteredData.map((d) => d.lon),
        marker: {
            size: 10,
            color: filteredData.map((d) => d.regression_coefficient),
            opacity: 0.2,
            colorscale: [
                [0, "blue"],
                [0.5, "lime"],
                [0.75, "yellow"],
                [1, "red"],
            ],
            cmin: Math.min(
                ...filteredData.map((d) => d.regression_coefficient)
            ),
            cmax: Math.max(
                ...filteredData.map((d) => d.regression_coefficient)
            ),
            colorbar: {
                title: statistics,
                tickvals: [
                    Math.min(
                        ...filteredData.map((d) => d.regression_coefficient)
                    ),
                    Math.max(
                        ...filteredData.map((d) => d.regression_coefficient)
                    ),
                ],
                ticktext: [
                    `${Math.min(
                        ...filteredData.map((d) => d.regression_coefficient)
                    ).toFixed(2)}`,
                    `${Math.max(
                        ...filteredData.map((d) => d.regression_coefficient)
                    ).toFixed(2)}`,
                ],
            },
        },
        text: filteredData.map(
            (d) =>
                `(${d.lat.toFixed(2)}°,${d.lon.toFixed(
                    2
                )}°): ${d.regression_coefficient.toFixed(2)}`
        ),
        hoverinfo: "text",
    };

    const mapLayout = {
        title: `Block Maxima ${statistics}`,
        geo: {
            projection: {
                type: "natural earth",
            },
            showland: true,
            landcolor: "#e0e0e0", // Color for the land
            coastlinecolor: "black", // Black color for coastline
            coastlinewidth: 3, // Thickness of the coastline
            subunitcolor: "black", // Black borders between countries/states
            subunitwidth: 3, // Thickness of country borders
            lakes: {
                color: "#ffffff", // Same as background color for lakes
            },
            bgcolor: "#ffffff", // Background color for the map
        },
        paper_bgcolor: "#1e1e1e", // Dark background for paper
        plot_bgcolor: "#1e1e1e", // Dark background for plot
        font: {
            color: "#e0e0e0", // Font color for the text
        },
    };

    Plotly.newPlot("map", [mapTrace], mapLayout);

    document.getElementById("map").on("plotly_click", function (data) {
        const point = data.points[0];
        const lat = point.lat;
        const lon = point.lon;
        plotTimeseriesGraph(lat, lon);
        plotHistogram(lat, lon); // Call to display the histogram next to the time series graph
    });
}

// Function to plot the time series graph based on latitude and longitude
// FIXME: NEEDS FIXING. LATLONKEY NOT FOUND IN TIMESERIESDATA EVEN THOUGH LOADING CORRECTLY
async function plotTimeseriesGraph(lat, lon) {
    if (model === "gcm") {
        await fetchFileForLatgcm(lat);
    } else {
        await fetchFileForLatdl(lat);
    }
    const latLonKey = `${lat},${lon}`;
    console.log(latLonKey);
    console.log(timeSeriesData);
    const timeSeries = timeSeriesData[latLonKey];

    if (!timeSeries) {
        alert("No time series data found for this location.");
        return;
    }

    const dates = generateDateRange("2025-01", "2100-12");

    const trace = {
        x: dates,
        y: timeSeries,
        mode: "lines",
        type: "scatter",
        name: `Lat: ${lat}, Lon: ${lon}`,
        line: { color: "#17BECF" },
    };

    const layout = {
        title: `Time Series Data for Latitude:${lat.toFixed(
            2
        )}, Longitude: ${lon.toFixed(2)}`,
        xaxis: { title: "Date" },
        yaxis: { title: "Temperature (K)" },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
    };

    Plotly.newPlot("timeseries", [trace], layout);
    createDownloadLink(dates, timeSeries, lat, lon);
}

// Function to plot the histogram of time series data
// FIXME: NEEDS FIXING. LATLONKEY NOT FOUND IN TIMESERIESDATA EVEN THOUGH LOADING CORRECTLY
async function plotHistogram(lat, lon) {
    if (model === "gcm") {
        await fetchFileForLatgcm(lat);
    } else {
        await fetchFileForLatdl(lat);
    }
    const latLonKey = `${lat},${lon}`;
    const timeSeries = timeSeriesData[latLonKey];

    if (!timeSeries) {
        alert("No time series data found for this location.");
        return;
    }

    const trace = {
        x: timeSeries,
        type: "histogram",
        marker: {
            color: "#FF4136",
        },
    };

    const layout = {
        title: `Temperature Histogram for Latitude: ${lat.toFixed(
            2
        )}, Longitude: ${lon.toFixed(2)}`,
        xaxis: { title: "Temperature (K)" },
        yaxis: { title: "Frequency" },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
    };

    Plotly.newPlot("histogram", [trace], layout);
}

// Generate date range from Jan 2025 to Dec 2100
function generateDateRange(start, end) {
    const startDate = new Date(start + "-01");
    const endDate = new Date(end + "-01");
    const dateArray = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const formattedDate = `${year}-${month.toString().padStart(2, "0")}`;
        dateArray.push(formattedDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
}

// Get modal elements
const modal = document.getElementById("settingsModal");
const openModalBtn = document.getElementById("openSettings");
const closeModalBtn = document.getElementsByClassName("close")[0];

// Function to open the modal
openModalBtn.onclick = function () {
    modal.style.display = "block";
};

// Function to close the modal when clicking the close button
function closeModal() {
    modal.style.display = "none";
}
closeModalBtn.onclick = closeModal;

// Function to close the modal when clicking outside the modal content
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
function createDownloadLink(dates, timeSeries, lat, lon) {
    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,Date,Temperature\n";
    dates.forEach((date, index) => {
        csvContent += `${date},${timeSeries[index]}\n`;
    });

    // Encode CSV content as a URI
    const encodedUri = encodeURI(csvContent);

    // Create a download link element
    const downloadLink = document.createElement("a");
    downloadLink.href = encodedUri;
    downloadLink.download = `timeseries_lat${lat}_lon${lon}.csv`;
    downloadLink.textContent = "Download Time Series Data";
    downloadLink.style.display = "block";
    downloadLink.style.marginTop = "10px";
    downloadLink.style.color = "#17BECF";

    // Append the download link to the timeseries div
    const timeseriesDiv = document.getElementById("timeseries");
    timeseriesDiv.appendChild(downloadLink);
}
