let jsonData = null;
let timeSeriesData = {};
let jsonDataDE = null; // For Deep Extrema model
let timeSeriesDataDE = {}; // For Deep Extrema model

// Global variables for the parameters
let model = null;
let variable = null;

// Both the select menus
const modelSelect = document.getElementById("model"); // Values: gcm or de
const variableSelect = document.getElementById("variable"); // Values: ta or pa

// Fetch GCM regression coefficient data
fetch("gcm_data_rc1.json")
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        updateParameters(); // Call updateParameters once the data is loaded
    })
    .catch(error => console.error("Error loading GCM data:", error));

// Fetch and extract time series data from the GCM ZIP file
fetch("gcm_data_tempvalues.csv.zip")
    .then(response => response.arrayBuffer())
    .then(buffer => JSZip.loadAsync(buffer))
    .then(zip => zip.file("gcm_data_tempvalues.csv").async("text")) // Read the CSV file from the ZIP
    .then(csvData => {
        parseCSVData(csvData, timeSeriesData);
    })
    .catch(error => console.error("Error loading GCM time series data from ZIP:", error));

// Fetch Deep Extrema (DE) regression coefficient data
fetch("dl_data_rc.json")
    .then(response => response.json())
    .then(data => {
        jsonDataDE = data;
        updateParameters(); // Call updateParameters once the data is loaded
    })
    .catch(error => console.error("Error loading DE data:", error));

// Fetch and extract time series data from the DE ZIP file
fetch("dl_data_tempvalues.csv.zip")
    .then(response => response.arrayBuffer())
    .then(buffer => JSZip.loadAsync(buffer))
    .then(zip => zip.file("dl_data_tempvalues.csv").async("text")) // Read the CSV file from the ZIP
    .then(csvData => {
        parseCSVData(csvData, timeSeriesDataDE);
    })
    .catch(error => console.error("Error loading DE time series data from ZIP:", error));

// Parse the CSV time series data into an object
function parseCSVData(csvData, targetData) {
    const rows = csvData.split("\n");
    const headers = rows[0].split(","); // First row contains the dates (Jan 2025, Feb 2025, ...)

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(",");
        const latLonKey = `${row[0]},${row[1]}`; // lat and lon are the first two columns
        const timeSeriesValues = row.slice(2).map(Number); // The rest are temperature values
        targetData[latLonKey] = timeSeriesValues;
    }
}

// Function to update model and variable selections
function updateParameters() {
    model = modelSelect.value;
    variable = variableSelect.value;

    // Check if conditions are met to update the map
    if ((model === "gcm" && variable === "ta") || (model === "de" && variable === "ta")) {
        updateMap();
    } else {
        clearMap(); // Clear the map if conditions are not met
    }
}

// Function to clear the map when conditions are not met
function clearMap() {
    Plotly.purge("map");
}

// Function to update the map based on the selected parameters
function updateMap() {
    let selectedJsonData;

    if (model === "gcm") {
        selectedJsonData = jsonData;
    } else if (model === "de") {
        selectedJsonData = jsonDataDE;
    }

    if (!selectedJsonData) {
        alert("Data not loaded yet.");
        return;
    }

    const tempData = selectedJsonData.locations.map(location => {
        return {
            lat: location.lat,
            lon: location.lon,
            regression_coefficient: location.regression_coefficient,
        };
    });

    const filteredData = tempData.filter(d => d.regression_coefficient !== null);

    const mapTrace = {
        type: "scattergeo",
        mode: "markers",
        lat: filteredData.map(d => d.lat),
        lon: filteredData.map(d => d.lon),
        marker: {
            size: 10,
            color: filteredData.map(d => d.regression_coefficient),
            opacity: 0.2,
            colorscale: [
                [0, "blue"],
                [0.5, "lime"],
                [0.75, "yellow"],
                [1, "red"]
            ],
            cmin: Math.min(...filteredData.map(d => d.regression_coefficient)),
            cmax: Math.max(...filteredData.map(d => d.regression_coefficient)),
            colorbar: {
                title: `Trend Coefficient`,
                tickvals: [
                    Math.min(...filteredData.map(d => d.regression_coefficient)),
                    Math.max(...filteredData.map(d => d.regression_coefficient)),
                ],
                ticktext: [
                    `${Math.min(...filteredData.map(d => d.regression_coefficient)).toFixed(2)}`,
                    `${Math.max(...filteredData.map(d => d.regression_coefficient)).toFixed(2)}`,
                ],
            },
        },
        text: filteredData.map(d => `(${d.lat.toFixed(2)}, ${d.lon.toFixed(2)}): ${d.regression_coefficient.toFixed(2)}`),
        hoverinfo: "text+lat+lon"
    };

    const mapLayout = {
        title: `Block Maxima Trend`,
        geo: {
            projection: {
                type: "natural earth"
            },
            showland: true,
            landcolor: "#e0e0e0", // Color for the land
            coastlinecolor: "black", // Black color for coastline
            coastlinewidth: 3, // Thickness of the coastline
            subunitcolor: "black", // Black borders between countries/states
            subunitwidth: 3, // Thickness of country borders
            lakes: {
                color: "#ffffff" // Same as background color for lakes
            },
            bgcolor: "#ffffff" // Background color for the map
        },
        paper_bgcolor: "#1e1e1e", // Dark background for paper
        plot_bgcolor: "#1e1e1e", // Dark background for plot
        font: {
            color: "#e0e0e0" // Font color for the text
        }
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
function plotTimeseriesGraph(lat, lon) {
    const latLonKey = `${lat},${lon}`;
    let timeSeries;

    if (model === "gcm") {
        timeSeries = timeSeriesData[latLonKey];
    } else if (model === "de") {
        timeSeries = timeSeriesDataDE[latLonKey];
    }

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
        line: { color: "#17BECF" }
    };

    const layout = {
        title: `Time Series Data for Latitude: ${lat}, Longitude: ${lon}`,
        xaxis: { title: "Date" },
        yaxis: { title: "Temperature (K)" },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" }
    };

    Plotly.newPlot("timeseries", [trace], layout);
}

// Function to plot the histogram of time series data
function plotHistogram(lat, lon) {
    const latLonKey = `${lat},${lon}`;
    let timeSeries;

    if (model === "gcm") {
        timeSeries = timeSeriesData[latLonKey];
    } else if (model === "de") {
        timeSeries = timeSeriesDataDE[latLonKey];
    }

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
        title: `Temperature Histogram for Latitude: ${lat}, Longitude: ${lon}`,
        xaxis: { title: "Temperature (K)" },
        yaxis: { title: "Frequency" },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" }
    };

    Plotly.newPlot("histogram", [trace], layout);
}

// Generate date range from start date to end date
function generateDateRange(start, end) {
    const dateArray = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().slice(0, 7)); // Format: YYYY-MM
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray;
}
