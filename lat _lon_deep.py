import numpy as np
import pandas as pd

# Define the latitude and longitude ranges
latitudes = np.linspace(-90, 90, 145)  # 145 points from -90 to 90 degrees
longitudes = np.linspace(0, 360, 288)  # 288 points from 0 to 360 degrees

# Create a grid of latitude and longitude
lat_grid, lon_grid = np.meshgrid(latitudes, longitudes, indexing='ij')

# Flatten the grids and combine into a DataFrame
latlongrid = pd.DataFrame({
    'Latitude': lat_grid.flatten(),
    'Longitude': lon_grid.flatten()
})

# Round longitude values to 2 decimal places
latlongrid['Longitude'] = latlongrid['Longitude'].round(2)

# Save the DataFrame to a CSV file
latlongrid.to_csv('latlongrid_deeplearning.csv', index=False)
