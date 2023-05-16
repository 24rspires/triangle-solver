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
    // Calculate angles from the sides
    for (let i = 0; i < 3; i++) {
      let angle = angles[i];
      let side1 = sides[i];
      let side2 = sides[(i + 1) % 3];
      let side3 = sides[(i + 2) % 3];
      input[angle] = Math.acos((input[side2]**2 + input[side3]**2 - input[side1]**2) / (2 * input[side2] * input[side3]));
    }
  } else if (givenSides.length === 2 && givenAngles.length === 1) {
    // SAS or SSA
    // Determine the case based on the order of sides and angles
    let knownAngleIndex = angles.indexOf(givenAngles[0]);
    let knownSide1Index = sides.indexOf(givenSides[0]);
    let knownSide2Index = sides.indexOf(givenSides[1]);

    if (knownAngleIndex === (knownSide1Index + 1) % 3 || knownAngleIndex === (knownSide2Index + 1) % 3) {
      // SAS
      let unknownSide = sides[(knownAngleIndex + 2) % 3];
      input[unknownSide] = Math.sqrt(input[givenSides[0]]**2 + input[givenSides[1]]**2 - 2 * input[givenSides[0]] * input[givenSides[1]] * Math.cos(input[givenAngles[0]]));
      givenSides.push(unknownSide);
    } else {
      // SSA
      // Handle ambiguous case
      let knownSide = givenSides.find(side => sides.indexOf(side) !== (knownAngleIndex + 2) % 3);
      let unknownSide = givenSides.find(side => side !== knownSide);
      let unknownAngle = angles[(sides.indexOf(unknownSide) + 1) % 3];
      let thirdAngle = angles.find(angle => !givenAngles.includes(angle) && angle !== unknownAngle);
      input[thirdAngle] = Math.PI - input[givenAngles[0]] - Math.asin(input[unknownSide] * Math.sin(input[givenAngles[0]]) / input[knownSide]);
      input[unknownSide] = input[knownSide] * Math.sin(input[thirdAngle]) / Math.sin(input[givenAngles[0]]);
    }
  } else if (givenSides.length === 1 && givenAngles.length === 2) {
    // ASA
    // Calculate the third angle and then the sides
    let unknownAngle = angles.find(angle => !givenAngles.includes(angle));
    input[unknownAngle] = Math.PI - input[givenAngles[0]] - input[givenAngles[1]];
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

