export function mapServerData(serverData) {
  return {
    type: "FeatureCollection",
    features: serverData.map((obj, index) => ({
      id: index,
      type: "Feature",
      isActive: obj.isActive,
      geometry:
      {
        type: "Point",
        // очевидно что перепутаны местами, тк все точки оказались в пустынях
        // далеко далеко
        coordinates: [obj.lat, obj.long]
      },
      properties: {
        iconCaption: obj.serialNumber
      },
      options: {
        preset: getObjectPreset(obj)
      }
    }))
  };
}

function getObjectPreset(obj) {
  return obj.isActive
    ? 'islands#blueCircleDotIconWithCaption'
    : 'islands#redCircleDotIconWithCaption';
}
