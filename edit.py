import pandas as pd
tempdata=pd.read_csv('dl_data_tempvalues.csv')
lat_lon=pd.read_csv('latlongrid_deeplearning.csv')

combined=pd.concat([lat_lon, tempdata], axis=1)
print(combined.head())

combined.to_csv('dl_data_tempvalues.csv', index=False)