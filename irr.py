import pvlib
import pandas as pd
import numpy as np
import datetime

def yearly_total_irr(place, az, tr): #, interval=30, ccd=None
    """Function which estimates the total irradiation.
    Input: location (lat, lon),
    az (azimuth in degrees, south is at 180 degrees),
    tr (tilt of the roof in degrees, flat roof is 0),
    #interval (what is the precision of the integration in minutes),
    #cloud cover data (dictionary with floats from 0 to 1, for each day of the year in mmdd format (e.g. '1231');
        get it from your local weather station).
    Returns total yearly irradiation for the tilted and oriented surface in kWh/m^2.
    """

    # Use pvlib for solar irradiation calculation
    latitude, longitude = place
    
    # Create a year of hourly timestamps
    times = pd.date_range(start='2023-01-01', end='2023-12-31 23:00:00', freq='h', tz='UTC')
    
    # Get solar position
    solar_position = pvlib.solarposition.get_solarposition(times, latitude, longitude)
    
    # Calculate extraterrestrial irradiance
    eti = pvlib.irradiance.get_extra_radiation(times)
    
    # Simple clear sky model for each hour
    total_irradiation_wh = 0
    
    for i, (time, zenith, azimuth, dni_extra) in enumerate(zip(times, solar_position['apparent_zenith'], solar_position['azimuth'], eti)):
        # Simple clear sky calculation
        if zenith < 90:
            airmass = pvlib.atmosphere.get_relative_airmass(zenith)
            dni = dni_extra * 0.7 ** (airmass ** 0.678)
            ghi = dni * np.cos(np.radians(zenith))
            dhi = ghi * 0.1  # Simple diffuse fraction
        else:
            dni = 0
            ghi = 0
            dhi = 0
        
        # Calculate irradiance on tilted surface
        tilted_irradiance = pvlib.irradiance.get_total_irradiance(
            surface_tilt=tr,
            surface_azimuth=az,
            solar_zenith=zenith,
            solar_azimuth=azimuth,
            dni=dni,
            ghi=ghi,
            dhi=dhi
        )
        
        total_irradiation_wh += tilted_irradiance['poa_global']
    
    # Convert to kWh/m^2
    yearly_sum = total_irradiation_wh / 1000.0
    
    # Yearly irradiation in kWh/m^2/year
    return yearly_sum
