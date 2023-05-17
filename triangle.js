function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}


function solveTriangle(input) {
  const sides = ['a', 'b', 'c'];
  const angles = ['A', 'B', 'C'];

  let givenSides = sides.filter(side => input[side] !== undefined);
  let givenAngles = angles.filter(angle => input[angle] !== undefined);

  // Convert all given angles to radians
  givenAngles.forEach(angle => input[angle] = toRadians(input[angle]));

  if (givenSides.length === 3) {
    // SSS
    for (let i = 0; i < 3; i++) {
      let angle = angles[i];
      let side1 = sides[i];
      let side2 = sides[(i + 1) % 3];
      let side3 = sides[(i + 2) % 3];
      input[angle] = Math.acos((input[side2]**2 + input[side3]**2 - input[side1]**2) / (2 * input[side2] * input[side3]));
    }
  } else if (givenSides.length === 2 && givenAngles.length === 1) {
    let knownAngleIndex = angles.indexOf(givenAngles[0]);
    let knownSide1Index = sides.indexOf(givenSides[0]);
    let knownSide2Index = sides.indexOf(givenSides[1]);
    if ((knownAngleIndex + 1) % 3 === knownSide1Index && (knownAngleIndex + 2) % 3 === knownSide2Index || (knownAngleIndex + 1) % 3 === knownSide2Index && (knownAngleIndex + 2) % 3 === knownSide1Index) {
      // SAS
      let unknownSide = sides[(knownAngleIndex + 1) % 3];
      input[unknownSide] = Math.sqrt(input[givenSides[0]]**2 + input[givenSides[1]]**2 - 2 * input[givenSides[0]] * input[givenSides[1]] * Math.cos(input[givenAngles[0]]));
    } else {
      // Adjusted SAS
      let knownSide = sides[3 - knownSide1Index - knownSide2Index];
      let unknownSide = sides[knownAngleIndex];
      input[unknownSide] = Math.sqrt(input[givenSides[0]]**2 + input[givenSides[1]]**2 + 2 * input[givenSides[0]] * input[givenSides[1]] * Math.cos(input[givenAngles[0]]));
      input[angles[(knownAngleIndex + 2) % 3]] = Math.acos((input[unknownSide]**2 + input[knownSide]**2 - input[givenSides[0]]**2) / (2 * input[unknownSide] * input[knownSide]));
    }
  } else if (givenSides.length === 1 && givenAngles.length === 2) {
    // ASA
    let unknownAngle = angles.find(angle => !givenAngles.includes(angle));
    input[unknownAngle] = Math.PI - input[givenAngles[0]] - input[givenAngles[1]];
    let knownSideIndex = sides.indexOf(givenSides[0]);
    if ((angles.indexOf(givenAngles[0]) + 1) % 3 !== knownSideIndex && (angles.indexOf(givenAngles[1]) + 1) % 3 !== knownSideIndex) {
    [givenAngles[0], givenAngles[1]] = [givenAngles[1], givenAngles[0]];
    }
    for (let side of sides) {
    if (!givenSides.includes(side)) {
    let oppositeAngle = angles[sides.indexOf(side)];
    input[side] = input[givenSides[0]] * Math.sin(input[oppositeAngle]) / Math.sin(input[givenAngles[0]]);
    }
    }
    } else {
    return "Invalid input. Please provide either ASA, SSA, SAS, SSS.";
    }

// Convert all angles back to degrees
angles.forEach(angle => input[angle] = toDegrees(input[angle]));

return input;
}
