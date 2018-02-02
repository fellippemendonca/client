'use strict';

const earth = { horizontalRadius: 6371, verticalRadius: 6356.8 }
const pi = 3.14159265358979;


module.exports = {
  absoluteDistance: absoluteDistance,
  verticalDistance: verticalDistance,
  horizontalDistance: horizontalDistance
};

function absoluteDistance(coord1, coord2) {
  let vDist = verticalDistance(coord1.latitude, coord2.latitude);
  let hDist = horizontalDistance(coord1.longitude, coord2.longitude);

  // Diagonal of Rectangle ==> A² + B² = C²
  let fDist = Math.sqrt((vDist*vDist) + (hDist*hDist));
  return Number((fDist*1000).toFixed(1)) ; // Km to Mts
}


function verticalDistance(lat1, lat2) {
  let diff = Math.abs(lat1-lat2);
  // Earth Perimeter = 2*Pi*R
  let ePeriMtr = 2*pi*earth.verticalRadius;
  // Diff Perimeter
  return (diff*ePeriMtr)/360;
}

function horizontalDistance(lon1, lon2) {
  let diff = Math.abs(lon1-lon2);
  // Earth Perimeter = 2*Pi*R
  let ePeriMtr = 2*pi*earth.horizontalRadius;
  // Diff Perimeter
  return (diff*ePeriMtr)/360;
}