<ns0:CityModel xmlns:ns0="http://www.opengis.net/citygml/2.0" xmlns:ns2="http://www.opengis.net/citygml/building/2.0" xmlns:ns3="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/citygml/2.0 http://schemas.opengis.net/citygml/2.0/cityGMLBase.xsd                                http://www.opengis.net/citygml/building/2.0 http://schemas.opengis.net/citygml/2.0/building.xsd                                http://www.opengis.net/gml http://schemas.opengis.net/gml/3.2.1/gml.xsd">

  <ns0:cityObjectMember>
    <ns2:Building ns3:id="building_001">
      <ns2:function>residential</ns2:function>
      <ns2:measuredHeight uom="m">15.0</ns2:measuredHeight>
      
      <ns2:boundedBy>
        <ns2:RoofSurface ns3:id="roof_001">
          <ns2:lod2MultiSurface>
            <ns3:MultiSurface>
              <ns3:surfaceMember>
                <ns3:Polygon ns3:id="roof_polygon_001">
                  <ns3:exterior>
                    <ns3:LinearRing>
                      <ns3:posList>0.0 0.0 15.0 20.0 0.0 15.0 20.0 20.0 15.0 0.0 20.0 15.0 0.0 0.0 15.0</ns3:posList>
                    </ns3:LinearRing>
                  </ns3:exterior>
                <area unit="m^2">400.0</area><totalIrradiation unit="kWh">595821.3449358353</totalIrradiation><azimuth unit="degree">0.0</azimuth><tilt unit="degree">0.0</tilt><irradiation unit="kWh/m^2">1489.5533623395884</irradiation></ns3:Polygon>
              </ns3:surfaceMember>
            </ns3:MultiSurface>
          </ns2:lod2MultiSurface>
        </ns2:RoofSurface>
      </ns2:boundedBy>
      
      <ns2:boundedBy>
        <ns2:RoofSurface ns3:id="roof_002">
          <ns2:lod2MultiSurface>
            <ns3:MultiSurface>
              <ns3:surfaceMember>
                <ns3:Polygon ns3:id="roof_polygon_002">
                  <ns3:exterior>
                    <ns3:LinearRing>
                      <ns3:posList>0.0 0.0 15.0 10.0 0.0 20.0 10.0 20.0 20.0 0.0 20.0 15.0 0.0 0.0 15.0</ns3:posList>
                    </ns3:LinearRing>
                  </ns3:exterior>
                <area unit="m^2">223.60679774997897</area><totalIrradiation unit="kWh">317531.9813471228</totalIrradiation><azimuth unit="degree">270.0</azimuth><tilt unit="degree">26.565</tilt><irradiation unit="kWh/m^2">1420.0461906447238</irradiation></ns3:Polygon>
              </ns3:surfaceMember>
            </ns3:MultiSurface>
          </ns2:lod2MultiSurface>
        </ns2:RoofSurface>
      </ns2:boundedBy>
      
    <roofArea unit="m^2">623.606797749979</roofArea><yearlyIrradiation unit="kWh">913353.3262829582</yearlyIrradiation></ns2:Building>
  </ns0:cityObjectMember>

  <ns0:cityObjectMember>
    <ns2:Building ns3:id="building_002">
      <ns2:function>commercial</ns2:function>
      <ns2:measuredHeight uom="m">20.0</ns2:measuredHeight>
      
      <ns2:boundedBy>
        <ns2:RoofSurface ns3:id="roof_003">
          <ns2:lod2MultiSurface>
            <ns3:MultiSurface>
              <ns3:surfaceMember>
                <ns3:Polygon ns3:id="roof_polygon_003">
                  <ns3:exterior>
                    <ns3:LinearRing>
                      <ns3:posList>50.0 30.0 20.0 75.0 30.0 20.0 75.0 55.0 20.0 50.0 55.0 20.0 50.0 30.0 20.0</ns3:posList>
                    </ns3:LinearRing>
                  </ns3:exterior>
                <area unit="m^2">625.0</area><totalIrradiation unit="kWh">930970.8514622428</totalIrradiation><azimuth unit="degree">0.0</azimuth><tilt unit="degree">0.0</tilt><irradiation unit="kWh/m^2">1489.5533623395884</irradiation></ns3:Polygon>
              </ns3:surfaceMember>
            </ns3:MultiSurface>
          </ns2:lod2MultiSurface>
        </ns2:RoofSurface>
      </ns2:boundedBy>
      
    <roofArea unit="m^2">625.0</roofArea><yearlyIrradiation unit="kWh">930970.8514622428</yearlyIrradiation></ns2:Building>
  </ns0:cityObjectMember>

</ns0:CityModel>