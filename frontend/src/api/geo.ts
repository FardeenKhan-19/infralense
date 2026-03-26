export const queryOverpass = async (bounds: { south: number, west: number, north: number, east: number }) => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"school|college|university"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"~"school|college|university"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"~"hospital|clinic|doctors"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"~"hospital|clinic|doctors"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"~"bank|atm"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"~"bank|atm"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out body;
    >;
    out skel qt;
  `;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`
  });

  const data = await res.json();
  
  const results = {
    schools: 0,
    hospitals: 0,
    banks: 0,
    elements: data.elements
  };

  data.elements.forEach((el: any) => {
    const amenity = el.tags?.amenity;
    if (['school', 'college', 'university'].includes(amenity)) results.schools++;
    if (['hospital', 'clinic', 'doctors'].includes(amenity)) results.hospitals++;
    if (['bank', 'atm'].includes(amenity)) results.banks++;
  });

  return results;
};

export const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
  const data = await res.json();
  return {
    name: data.display_name,
    city: data.address.city || data.address.town || data.address.village,
    country: data.address.country,
    countryCode: data.address.country_code
  };
};

export const geocode = async (query: string) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
  const data = await res.json();
  return data.map((item: any) => ({
    display_name: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    type: item.type,
    category: item.category,
    boundingbox: item.boundingbox ? [
      [parseFloat(item.boundingbox[0]), parseFloat(item.boundingbox[2])], // [south, west]
      [parseFloat(item.boundingbox[1]), parseFloat(item.boundingbox[3])]  // [north, east]
    ] : null
  }));
};
