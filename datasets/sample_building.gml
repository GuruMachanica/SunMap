<?xml version="1.0" encoding="UTF-8"?>
<CityModel xmlns="http://www.opengis.net/citygml/2.0" 
           xmlns:gml="http://www.opengis.net/gml" 
           xmlns:bldg="http://www.opengis.net/citygml/building/2.0"
           xmlns:xAL="urn:oasis:names:tc:ciq:xsdschema:xAL:2.0"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://www.opengis.net/citygml/2.0 http://schemas.opengis.net/citygml/2.0/cityGMLBase.xsd
                               http://www.opengis.net/citygml/building/2.0 http://schemas.opengis.net/citygml/2.0/building.xsd
                               http://www.opengis.net/gml http://schemas.opengis.net/gml/3.2.1/gml.xsd">

  <cityObjectMember>
    <bldg:Building gml:id="building_001">
      <bldg:function>residential</bldg:function>
      <bldg:measuredHeight uom="m">15.0</bldg:measuredHeight>
      
      <bldg:boundedBy>
        <bldg:RoofSurface gml:id="roof_001">
          <bldg:lod2MultiSurface>
            <gml:MultiSurface>
              <gml:surfaceMember>
                <gml:Polygon gml:id="roof_polygon_001">
                  <gml:exterior>
                    <gml:LinearRing>
                      <gml:posList>0.0 0.0 15.0 20.0 0.0 15.0 20.0 20.0 15.0 0.0 20.0 15.0 0.0 0.0 15.0</gml:posList>
                    </gml:LinearRing>
                  </gml:exterior>
                </gml:Polygon>
              </gml:surfaceMember>
            </gml:MultiSurface>
          </bldg:lod2MultiSurface>
        </bldg:RoofSurface>
      </bldg:boundedBy>
      
      <bldg:boundedBy>
        <bldg:RoofSurface gml:id="roof_002">
          <bldg:lod2MultiSurface>
            <gml:MultiSurface>
              <gml:surfaceMember>
                <gml:Polygon gml:id="roof_polygon_002">
                  <gml:exterior>
                    <gml:LinearRing>
                      <gml:posList>0.0 0.0 15.0 10.0 0.0 20.0 10.0 20.0 20.0 0.0 20.0 15.0 0.0 0.0 15.0</gml:posList>
                    </gml:LinearRing>
                  </gml:exterior>
                </gml:Polygon>
              </gml:surfaceMember>
            </gml:MultiSurface>
          </bldg:lod2MultiSurface>
        </bldg:RoofSurface>
      </bldg:boundedBy>
      
    </bldg:Building>
  </cityObjectMember>

  <cityObjectMember>
    <bldg:Building gml:id="building_002">
      <bldg:function>commercial</bldg:function>
      <bldg:measuredHeight uom="m">20.0</bldg:measuredHeight>
      
      <bldg:boundedBy>
        <bldg:RoofSurface gml:id="roof_003">
          <bldg:lod2MultiSurface>
            <gml:MultiSurface>
              <gml:surfaceMember>
                <gml:Polygon gml:id="roof_polygon_003">
                  <gml:exterior>
                    <gml:LinearRing>
                      <gml:posList>50.0 30.0 20.0 75.0 30.0 20.0 75.0 55.0 20.0 50.0 55.0 20.0 50.0 30.0 20.0</gml:posList>
                    </gml:LinearRing>
                  </gml:exterior>
                </gml:Polygon>
              </gml:surfaceMember>
            </gml:MultiSurface>
          </bldg:lod2MultiSurface>
        </bldg:RoofSurface>
      </bldg:boundedBy>
      
    </bldg:Building>
  </cityObjectMember>

</CityModel>
