(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function squarePerimeterState(side) {
    const cleanSide = Number.isFinite(Number(side)) && Number(side) > 0 ? Number(side) : 5;
    return {
      side: cleanSide,
      before: cleanSide * 8,
      after: cleanSide * 6,
      reduced: cleanSide * 2,
      length: cleanSide * 2,
      width: cleanSide
    };
  }

  function canCloseLengths(lengths) {
    return lengths.length >= 3 && Math.max(...lengths) < lengths.reduce((sum, length) => sum + length, 0) - Math.max(...lengths);
  }

  function solveClosedCanvas(points, lengths, pinned = [], iterations = 160) {
    const next = points.map(({ x, y }) => ({ x, y }));
    const fixed = new Set(pinned);
    for (let pass = 0; pass < iterations; pass += 1) {
      for (let index = 0; index < lengths.length; index += 1) {
        const other = (index + 1) % lengths.length;
        const dx = next[other].x - next[index].x;
        const dy = next[other].y - next[index].y;
        const distance = Math.hypot(dx, dy);
        if (distance < 1e-8 || (fixed.has(index) && fixed.has(other))) continue;
        const fraction = (distance - lengths[index]) / distance;
        const firstShare = fixed.has(index) ? 0 : fixed.has(other) ? 1 : 0.5;
        const secondShare = fixed.has(other) ? 0 : fixed.has(index) ? 1 : 0.5;
        next[index].x += dx * fraction * firstShare;
        next[index].y += dy * fraction * firstShare;
        next[other].x -= dx * fraction * secondShare;
        next[other].y -= dy * fraction * secondShare;
      }
    }
    return next;
  }

  function solveOpenCanvas(points, lengths, pinned = [], iterations = 80) {
    const next = points.map(({ x, y }) => ({ x, y }));
    const fixed = new Set(pinned);
    for (let pass = 0; pass < iterations; pass += 1) {
      for (let index = 0; index < lengths.length; index += 1) {
        const other = index + 1;
        const dx = next[other].x - next[index].x;
        const dy = next[other].y - next[index].y;
        const distance = Math.hypot(dx, dy);
        if (distance < 1e-8 || (fixed.has(index) && fixed.has(other))) continue;
        const fraction = (distance - lengths[index]) / distance;
        const firstShare = fixed.has(index) ? 0 : fixed.has(other) ? 1 : 0.5;
        const secondShare = fixed.has(other) ? 0 : fixed.has(index) ? 1 : 0.5;
        next[index].x += dx * fraction * firstShare;
        next[index].y += dy * fraction * firstShare;
        next[other].x -= dx * fraction * secondShare;
        next[other].y -= dy * fraction * secondShare;
      }
    }
    return next;
  }

  function canvasPerimeterState(lengths, points, closed, pixelsPerCm = 32, lengthToleranceCm = 0.025) {
    const count = lengths.length;
    const expectedPoints = closed ? count : count + 1;
    if (points.length !== expectedPoints || !lengths.every((length) => Number.isFinite(length) && length > 0) ||
        !points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))) {
      return { valid: false, reason: "invalid-chain" };
    }
    const actualLengths = lengths.map((_, index) => {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      return Math.hypot(end.x - start.x, end.y - start.y) / pixelsPerCm;
    });
    const maxError = Math.max(0, ...actualLengths.map((length, index) => Math.abs(length - lengths[index])));
    const perimeter = lengths.reduce((total, length) => total + length, 0);
    if (!closed) return { valid: true, closed: false, perimeter: null, totalLength: perimeter, actualLengths, maxError, shape: null };
    const area2 = points.reduce((area, point, index) => {
      const next = points[(index + 1) % count];
      return area + point.x * next.y - next.x * point.y;
    }, 0);
    const vectors = points.map((point, index) => {
      const next = points[(index + 1) % count];
      return { x: next.x - point.x, y: next.y - point.y };
    });
    const cross = (a, b) => a.x * b.y - a.y * b.x;
    const orientation = (a, b, c) => cross({ x: b.x - a.x, y: b.y - a.y }, { x: c.x - a.x, y: c.y - a.y });
    let crosses = false;
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 2; j < count; j += 1) {
        if (i === 0 && j === count - 1) continue;
        const a = points[i], b = points[(i + 1) % count], c = points[j], d = points[(j + 1) % count];
        if (orientation(a, b, c) * orientation(a, b, d) < 0 && orientation(c, d, a) * orientation(c, d, b) < 0) crosses = true;
      }
    }
    if (maxError > lengthToleranceCm || Math.abs(area2) < 30 || crosses) {
      return { valid: false, reason: crosses ? "crossed-shape" : "distorted-shape", maxError };
    }
    let shape = `${count}-gon`;
    if (count === 3) shape = lengths.every((length) => Math.abs(length - lengths[0]) < 1e-9) ? "equilateral-triangle" : "triangle";
    if (count === 4) {
      const allEqual = lengths.every((length) => Math.abs(length - lengths[0]) < 1e-9);
      const oppositeEqual = Math.abs(lengths[0] - lengths[2]) < 1e-9 && Math.abs(lengths[1] - lengths[3]) < 1e-9;
      const right = vectors.every((vector, index) => {
        const next = vectors[(index + 1) % 4];
        return Math.abs(vector.x * next.x + vector.y * next.y) / (Math.hypot(vector.x, vector.y) * Math.hypot(next.x, next.y)) < 0.035;
      });
      const parallel = (first, second) => Math.abs(cross(first, second)) /
        (Math.hypot(first.x, first.y) * Math.hypot(second.x, second.y)) < 0.035;
      const onePairParallel = parallel(vectors[0], vectors[2]) || parallel(vectors[1], vectors[3]);
      shape = right && allEqual ? "square" : right && oppositeEqual ? "rectangle" : allEqual ? "rhombus" : oppositeEqual ? "parallelogram" : onePairParallel ? "trapezoid" : "quadrilateral";
    }
    return { valid: true, closed: true, perimeter, totalLength: perimeter, actualLengths, maxError, shape };
  }

  function looseSegmentPerimeterState(segments, pixelsPerCm = 32, snapDistance = 12) {
    if (!Array.isArray(segments) || !segments.every(({ length, a, b }) =>
      Number.isFinite(length) && length > 0 && a && b &&
      Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(b.x) && Number.isFinite(b.y) &&
      Math.abs(Math.hypot(b.x - a.x, b.y - a.y) / pixelsPerCm - length) < 0.025)) {
      return { valid: false, reason: "invalid-segment" };
    }
    const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
    const open = { valid: true, closed: false, totalLength, perimeter: null, shape: null, vertices: [] };
    if (segments.length < 3) return open;
    const ends = segments.flatMap(({ a, b }) => [a, b]);
    const mates = ends.map((point, index) => ends.map((other, candidate) =>
      Math.floor(index / 2) !== Math.floor(candidate / 2) &&
      Math.hypot(point.x - other.x, point.y - other.y) <= snapDistance ? candidate : -1
    ).filter((candidate) => candidate >= 0));
    if (mates.some((neighbors) => neighbors.length !== 1)) return open;
    const ordered = [];
    const visited = new Set();
    let segmentIndex = 0;
    let entrance = 0;
    for (let step = 0; step < segments.length; step += 1) {
      if (visited.has(segmentIndex)) return open;
      visited.add(segmentIndex);
      const start = ends[segmentIndex * 2 + entrance];
      const previous = ends[mates[segmentIndex * 2 + entrance][0]];
      ordered.push({ x: (start.x + previous.x) / 2, y: (start.y + previous.y) / 2 });
      const exitIndex = segmentIndex * 2 + (1 - entrance);
      const nextIndex = mates[exitIndex][0];
      segmentIndex = Math.floor(nextIndex / 2);
      entrance = nextIndex % 2;
    }
    if (segmentIndex !== 0 || entrance !== 0 || visited.size !== segments.length) return open;
    const lengths = [...visited].map((index) => segments[index].length);
    const polygon = canvasPerimeterState(lengths, ordered, true, pixelsPerCm, snapDistance / pixelsPerCm);
    if (!polygon.valid) return open;
    const corners = ordered.filter((point, index) => {
      const previous = ordered[(index + ordered.length - 1) % ordered.length];
      const next = ordered[(index + 1) % ordered.length];
      const first = { x: point.x - previous.x, y: point.y - previous.y };
      const second = { x: next.x - point.x, y: next.y - point.y };
      const scale = Math.hypot(first.x, first.y) * Math.hypot(second.x, second.y);
      return !scale || Math.abs(first.x * second.y - first.y * second.x) / scale > 0.01 ||
        first.x * second.x + first.y * second.y < 0;
    });
    let shape = polygon.shape;
    if (corners.length >= 3 && corners.length < ordered.length) {
      const cornerLengths = corners.map((point, index) => {
        const next = corners[(index + 1) % corners.length];
        return Math.hypot(next.x - point.x, next.y - point.y) / pixelsPerCm;
      });
      const simplified = canvasPerimeterState(cornerLengths, corners, true, pixelsPerCm, snapDistance / pixelsPerCm);
      if (simplified.valid) shape = simplified.shape;
    }
    return { ...open, closed: true, perimeter: totalLength, shape, vertices: ordered };
  }

  function splitSegmentByLengths(segment, lengths, pixelsPerCm = 32) {
    if (!segment || !Array.isArray(lengths) || lengths.length < 2 ||
      !lengths.every((length) => Number.isFinite(length) && length > 0) ||
      !Number.isFinite(segment.length) || segment.length <= 0 ||
      Math.abs(lengths.reduce((sum, length) => sum + length, 0) - segment.length) > 1e-8 * Math.max(1, segment.length)) return null;
    const dx = segment.b.x - segment.a.x, dy = segment.b.y - segment.a.y;
    if (!Number.isFinite(dx) || !Number.isFinite(dy) ||
      Math.abs(Math.hypot(dx, dy) / pixelsPerCm - segment.length) > 0.025) return null;
    let covered = 0;
    return lengths.map((length, index) => {
      const start = covered / segment.length;
      covered += length;
      const end = index === lengths.length - 1 ? 1 : covered / segment.length;
      return { ...segment, length,
        a: { x: segment.a.x + dx * start, y: segment.a.y + dy * start },
        b: { x: segment.a.x + dx * end, y: segment.a.y + dy * end } };
    });
  }

  function mergeCollinearSegments(selected, allSegments, pixelsPerCm = 32) {
    if (!Array.isArray(selected) || selected.length < 2) return null;
    const first = selected[0];
    if (!selected.every((segment) => segment && Number.isFinite(segment.length) && segment.length > 0 &&
      (segment.color || "#087f75") === (first.color || "#087f75") &&
      (segment.fill || null) === (first.fill || null) &&
      (segment.width || 5) === (first.width || 5) && (segment.dash || "solid") === (first.dash || "solid"))) return null;
    const nodes = [], edges = [];
    const nodeFor = (point) => {
      let index = nodes.findIndex((node) => Math.hypot(node.x - point.x, node.y - point.y) <= 1);
      if (index === -1) { index = nodes.length; nodes.push({ x: point.x, y: point.y, edges: [] }); }
      return index;
    };
    selected.forEach((segment, index) => {
      const a = nodeFor(segment.a), b = nodeFor(segment.b);
      edges.push([a, b]); nodes[a].edges.push(index); nodes[b].edges.push(index);
    });
    const ends = nodes.map((node, index) => node.edges.length === 1 ? index : -1).filter((index) => index >= 0);
    if (ends.length !== 2 || nodes.length !== selected.length + 1 ||
      nodes.some((node) => node.edges.length < 1 || node.edges.length > 2)) return null;
    const visited = new Set();
    let current = ends[0];
    while (current !== ends[1]) {
      const edge = nodes[current].edges.find((index) => !visited.has(index));
      if (edge === undefined) return null;
      visited.add(edge);
      current = edges[edge][0] === current ? edges[edge][1] : edges[edge][0];
    }
    if (visited.size !== selected.length) return null;
    const a = nodes[ends[0]], b = nodes[ends[1]];
    const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
    const length = selected.reduce((sum, segment) => sum + segment.length, 0);
    if (!distance || Math.abs(distance / pixelsPerCm - length) > 0.025 ||
      nodes.some((node) => Math.abs((node.x - a.x) * dy - (node.y - a.y) * dx) / distance > 1)) return null;
    const selectedSet = new Set(selected);
    const interior = nodes.filter((_, index) => !ends.includes(index));
    if ((allSegments || []).some((segment) => !selectedSet.has(segment) &&
      [segment.a, segment.b].some((point) => interior.some((node) =>
        Math.hypot(point.x - node.x, point.y - node.y) <= 12)))) return null;
    return { ...first, length, a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } };
  }

  function moveLooseJoint(segments, segmentIndex, endpoint, target, pixelsPerCm = 32) {
    const count = segments.length * 2;
    const parent = Array.from({ length: count }, (_, index) => index);
    const find = (index) => parent[index] === index ? index : (parent[index] = find(parent[index]));
    const ends = segments.flatMap(({ a, b }) => [a, b]);
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        if (Math.floor(i / 2) !== Math.floor(j / 2) && Math.hypot(ends[i].x - ends[j].x, ends[i].y - ends[j].y) <= 12) {
          parent[find(j)] = find(i);
        }
      }
    }
    const nodes = new Map();
    ends.forEach((point, index) => {
      const root = find(index);
      if (!nodes.has(root)) nodes.set(root, { x: 0, y: 0, count: 0 });
      const node = nodes.get(root);
      node.x += point.x;
      node.y += point.y;
      node.count += 1;
    });
    nodes.forEach((node) => { node.x /= node.count; node.y /= node.count; });
    const moved = find(segmentIndex * 2 + (endpoint === "a" ? 0 : 1));
    const anchor = find(segmentIndex * 2 + (endpoint === "a" ? 1 : 0));
    const anchorPoint = nodes.get(anchor);
    const length = segments[segmentIndex].length * pixelsPerCm;
    let angle = Math.atan2(target.y - anchorPoint.y, target.x - anchorPoint.x);
    const axis = Math.round(angle / (Math.PI / 2)) * Math.PI / 2;
    if (Math.abs(angle - axis) < 8 * Math.PI / 180) angle = axis;
    const point = nodes.get(moved);
    const snapAxis = Math.abs(angle - axis) < 8 * Math.PI / 180;
    const rotateAboutAnchor = point.count === 1 || snapAxis;
    if (rotateAboutAnchor) {
      point.x = anchorPoint.x + Math.cos(angle) * length;
      point.y = anchorPoint.y + Math.sin(angle) * length;
    } else {
      point.x = target.x;
      point.y = target.y;
    }
    const fixed = new Set(rotateAboutAnchor ? [moved, anchor] : [moved]);
    for (let pass = 0; pass < 250; pass += 1) {
      segments.forEach((segment, index) => {
        const aId = find(index * 2), bId = find(index * 2 + 1);
        const a = nodes.get(aId), b = nodes.get(bId);
        const dx = b.x - a.x, dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 1e-8 || (fixed.has(aId) && fixed.has(bId))) return;
        const error = (distance - segment.length * pixelsPerCm) / distance;
        const aShare = fixed.has(aId) ? 0 : fixed.has(bId) ? 1 : 0.5;
        const bShare = fixed.has(bId) ? 0 : fixed.has(aId) ? 1 : 0.5;
        a.x += dx * error * aShare;
        a.y += dy * error * aShare;
        b.x -= dx * error * bShare;
        b.y -= dy * error * bShare;
      });
    }
    return segments.map((segment, index) => {
      const a = nodes.get(find(index * 2)), b = nodes.get(find(index * 2 + 1));
      return { ...segment, a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } };
    });
  }

  function connectedSegmentComponents(segments, snapDistance = 12) {
    const parent = segments.map((_, index) => index);
    const find = (index) => parent[index] === index ? index : (parent[index] = find(parent[index]));
    const buckets = new Map();
    const cell = (value) => Math.floor(value / snapDistance);
    segments.forEach((segment, index) => {
      [segment.a, segment.b].forEach((point) => {
        const x = cell(point.x), y = cell(point.y);
        for (let dx = -1; dx <= 1; dx += 1) {
          for (let dy = -1; dy <= 1; dy += 1) {
            for (const other of buckets.get(`${x + dx},${y + dy}`) || []) {
              if (other.index !== index && Math.hypot(point.x - other.point.x, point.y - other.point.y) <= snapDistance) {
                parent[find(index)] = find(other.index);
              }
            }
          }
        }
        const key = `${x},${y}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push({ index, point });
      });
    });
    const groups = new Map();
    segments.forEach((segment, index) => {
      const root = find(index);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(segment);
    });
    return [...groups.values()];
  }

  function boundedSegmentFaces(segments, snapDistance = 12) {
    const points = segments.flatMap(({ a, b }) => [a, b]);
    const parent = points.map((_, index) => index);
    const find = (index) => parent[index] === index ? index : (parent[index] = find(parent[index]));
    const buckets = new Map();
    const cell = (value) => Math.floor(value / snapDistance);
    points.forEach((point, index) => {
      const x = cell(point.x), y = cell(point.y);
      for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) {
        for (const other of buckets.get(`${x + dx},${y + dy}`) || []) {
          if (Math.floor(index / 2) !== Math.floor(other / 2) &&
            Math.hypot(point.x - points[other].x, point.y - points[other].y) <= snapDistance) parent[find(other)] = find(index);
        }
      }
      const key = `${x},${y}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(index);
    });
    const nodes = new Map();
    points.forEach((point, index) => {
      const root = find(index);
      if (!nodes.has(root)) nodes.set(root, { x: 0, y: 0, count: 0, edges: [] });
      const node = nodes.get(root);
      node.x += point.x; node.y += point.y; node.count += 1;
    });
    nodes.forEach((node) => { node.x /= node.count; node.y /= node.count; });
    const halves = [];
    segments.forEach((_, index) => {
      const a = find(index * 2), b = find(index * 2 + 1);
      if (a === b) return;
      const forward = halves.length;
      halves.push({ from: a, to: b, segmentIndex: index, reverse: forward + 1 });
      halves.push({ from: b, to: a, segmentIndex: index, reverse: forward });
      nodes.get(a).edges.push(forward);
      nodes.get(b).edges.push(forward + 1);
    });
    nodes.forEach((node) => node.edges.sort((first, second) => {
      const angle = (edge) => {
        const other = nodes.get(halves[edge].to);
        return Math.atan2(other.y - node.y, other.x - node.x);
      };
      return angle(first) - angle(second);
    }));
    const visited = new Set(), faces = [];
    halves.forEach((_, start) => {
      if (visited.has(start)) return;
      const cycle = [];
      let current = start;
      while (!visited.has(current) && cycle.length <= halves.length) {
        visited.add(current);
        cycle.push(current);
        const edge = halves[current], around = nodes.get(edge.to).edges;
        const reverse = around.indexOf(edge.reverse);
        current = around[(reverse - 1 + around.length) % around.length];
      }
      if (current !== start || cycle.length < 3) return;
      const roots = cycle.map((index) => halves[index].from);
      if (new Set(roots).size !== roots.length) return;
      const vertices = roots.map((root) => ({ x: nodes.get(root).x, y: nodes.get(root).y }));
      const area2 = vertices.reduce((sum, point, index) => {
        const next = vertices[(index + 1) % vertices.length];
        return sum + point.x * next.y - next.x * point.y;
      }, 0);
      if (area2 <= 30) return;
      faces.push({ vertices, segmentIndexes: cycle.map((index) => halves[index].segmentIndex), area: area2 / 2 });
    });
    return faces;
  }

  function curvedPerimeter(kind, radiusX, radiusY = radiusX) {
    if (!Number.isFinite(radiusX) || !Number.isFinite(radiusY) || radiusX <= 0 || radiusY <= 0) return null;
    if (kind === "circle") return 2 * Math.PI * radiusX;
    if (kind !== "ellipse") return null;
    const h = ((radiusX - radiusY) / (radiusX + radiusY)) ** 2;
    return Math.PI * (radiusX + radiusY) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  }

  function rectangleToSquareState(area, factor) {
    const cleanArea = parsePositiveInteger(area);
    const cleanFactor = parsePositiveInteger(factor);

    if (cleanArea === null) return { valid: false, reason: "invalid-area" };
    if (cleanFactor === null || cleanFactor < 2 || cleanFactor > 10) {
      return { valid: false, reason: "invalid-factor" };
    }

    const squareSide = Math.sqrt(cleanArea);
    if (!Number.isSafeInteger(squareSide)) {
      return { valid: false, reason: "not-square", area: cleanArea, factor: cleanFactor };
    }
    if (squareSide % cleanFactor !== 0) {
      return {
        valid: false,
        reason: "non-whole-width",
        area: cleanArea,
        factor: cleanFactor,
        squareSide
      };
    }

    const originalLength = squareSide * cleanFactor;
    const originalWidth = squareSide / cleanFactor;
    const transformedLength = originalLength / cleanFactor;
    const transformedWidth = originalWidth * cleanFactor;
    const squareTable = Array.from({ length: 20 }, (_, index) => {
      const value = index + 1;
      return { value, square: value * value };
    });
    const resultOnes = cleanArea % 10;
    const onesMap = {
      0: [0],
      1: [1, 9],
      4: [2, 8],
      5: [5],
      6: [4, 6],
      9: [3, 7]
    };
    const possibleOnes = onesMap[resultOnes] || [];
    let rangeStart = Math.floor(squareSide / 10) * 10;
    let rangeEnd = rangeStart + 10;
    if (squareSide % 10 === 0) {
      rangeStart = Math.max(0, squareSide - 10);
      rangeEnd = squareSide;
    }
    const rangeCandidates = [];
    for (let candidate = Math.max(1, rangeStart); candidate <= rangeEnd; candidate += 1) {
      if (possibleOnes.includes(candidate % 10)) rangeCandidates.push(candidate);
    }

    return {
      valid: true,
      area: cleanArea,
      factor: cleanFactor,
      squareSide,
      originalLength,
      originalWidth,
      originalArea: originalLength * originalWidth,
      transformedLength,
      transformedWidth,
      transformedArea: transformedLength * transformedWidth,
      squareTable,
      resultOnes,
      possibleOnes,
      rangeStart,
      rangeEnd,
      rangeCandidates,
      sideDigits: String(squareSide).length
    };
  }

  function lineRelationState(mode, angleDeg, distance) {
    const cleanMode = mode === "intersect" ? "intersect" : "parallel";
    const cleanAngle = cleanMode === "parallel" ? 0 : clamp(Number(angleDeg) || 24, 5, 75);
    const cleanDistance = clamp(Number(distance) || 140, 60, 220);
    return {
      mode: cleanMode,
      angleDeg: cleanAngle,
      distance: cleanDistance,
      intersects: cleanMode === "intersect",
      hasFixedDistance: cleanMode === "parallel"
    };
  }

  function equalSharingState(total, groups) {
    const numericTotal = Number(total);
    const numericGroups = Number(groups);
    const cleanTotal = Math.max(1, Math.round(Number.isFinite(numericTotal) ? numericTotal : 12));
    const cleanGroups = Math.max(1, Math.round(Number.isFinite(numericGroups) ? numericGroups : 3));
    return {
      total: cleanTotal,
      groups: cleanGroups,
      each: Math.floor(cleanTotal / cleanGroups),
      remainder: cleanTotal % cleanGroups,
      dividesEvenly: cleanTotal % cleanGroups === 0
    };
  }

  function fractionState(numerator, denominator) {
    const numericNumerator = Number(numerator);
    const numericDenominator = Number(denominator);
    const cleanDenominator = Math.max(1, Math.round(Number.isFinite(numericDenominator) ? numericDenominator : 4));
    const cleanNumerator = clamp(Math.round(Number.isFinite(numericNumerator) ? numericNumerator : 1), 0, cleanDenominator);
    return {
      numerator: cleanNumerator,
      denominator: cleanDenominator,
      value: round(cleanNumerator / cleanDenominator, 3)
    };
  }

  function notebookPromotionState(studentCount, unitPrice, buyCount = 5) {
    const cleanStudentCount = parsePositiveInteger(studentCount);
    const cleanUnitPrice = parsePositiveInteger(unitPrice);
    const cleanBuyCount = parsePositiveInteger(buyCount);

    if (cleanStudentCount === null) return { valid: false, reason: "invalid-student-count" };
    if (cleanUnitPrice === null) return { valid: false, reason: "invalid-unit-price" };
    if (cleanBuyCount === null || cleanBuyCount < 2) return { valid: false, reason: "invalid-buy-count" };

    const giftPerGroup = 1;
    const groupSize = cleanBuyCount + giftPerGroup;
    const fullGroups = Math.floor(cleanStudentCount / groupSize);
    const remainder = cleanStudentCount % groupSize;
    const completeGroupPaid = fullGroups * cleanBuyCount;
    const paidCount = completeGroupPaid + remainder;
    const giftCount = Math.floor(paidCount / cleanBuyCount);
    const receivedCount = paidCount + giftCount;
    const extraCount = receivedCount - cleanStudentCount;
    const totalCost = paidCount * cleanUnitPrice;
    const previousPaidCount = Math.max(0, paidCount - 1);
    const previousGiftCount = Math.floor(previousPaidCount / cleanBuyCount);
    const previousReceivedCount = previousPaidCount + previousGiftCount;

    return {
      valid: true,
      studentCount: cleanStudentCount,
      unitPrice: cleanUnitPrice,
      buyCount: cleanBuyCount,
      giftPerGroup,
      groupSize,
      fullGroups,
      remainder,
      completeGroupPaid,
      paidCount,
      giftCount,
      receivedCount,
      extraCount,
      totalCost,
      previousPaidCount,
      previousGiftCount,
      previousReceivedCount
    };
  }

  function parsePositiveBigInt(value) {
    if (typeof value === "bigint") return value > 0n ? value : null;
    if (typeof value === "number") {
      return Number.isSafeInteger(value) && value > 0 ? BigInt(value) : null;
    }
    if (typeof value !== "string") return null;
    const cleanValue = value.trim();
    return /^\d+$/.test(cleanValue) && BigInt(cleanValue) > 0n ? BigInt(cleanValue) : null;
  }

  function parseNonNegativeBigInt(value) {
    if (typeof value === "bigint") return value >= 0n ? value : null;
    if (typeof value === "number") {
      return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
    }
    if (typeof value !== "string") return null;
    const cleanValue = value.trim();
    return /^\d+$/.test(cleanValue) ? BigInt(cleanValue) : null;
  }

  function chickenRabbitState(heads, legs) {
    const cleanHeads = parsePositiveBigInt(heads);
    const cleanLegs = parsePositiveBigInt(legs);

    if (cleanHeads === null) return { valid: false, reason: "invalid-heads" };
    if (cleanLegs === null) return { valid: false, reason: "invalid-legs" };
    if (cleanLegs % 2n !== 0n) return { valid: false, reason: "odd-legs", heads: cleanHeads, legs: cleanLegs };

    const allChickenLegs = cleanHeads * 2n;
    const allRabbitLegs = cleanHeads * 4n;
    if (cleanLegs < allChickenLegs) {
      return {
        valid: false,
        reason: "too-few-legs",
        heads: cleanHeads,
        legs: cleanLegs,
        minimumLegs: allChickenLegs
      };
    }
    if (cleanLegs > allRabbitLegs) {
      return {
        valid: false,
        reason: "too-many-legs",
        heads: cleanHeads,
        legs: cleanLegs,
        maximumLegs: allRabbitLegs
      };
    }

    const extraLegs = cleanLegs - allChickenLegs;
    const rabbits = extraLegs / 2n;
    const chickens = cleanHeads - rabbits;
    return {
      valid: true,
      heads: cleanHeads,
      legs: cleanLegs,
      allChickenLegs,
      allRabbitLegs,
      extraLegs,
      extraLegsPerRabbit: 2n,
      rabbits,
      chickens,
      checkedHeads: chickens + rabbits,
      checkedLegs: chickens * 2n + rabbits * 4n
    };
  }

  function penTransferState(ningPens, qingPens, multiple) {
    const cleanNingPens = parsePositiveBigInt(ningPens);
    const cleanQingPens = parsePositiveBigInt(qingPens);
    const cleanMultiple = parsePositiveBigInt(multiple);

    if (cleanNingPens === null) return { valid: false, reason: "invalid-ning" };
    if (cleanQingPens === null) return { valid: false, reason: "invalid-qing" };
    if (cleanMultiple === null || cleanMultiple < 2n) return { valid: false, reason: "invalid-multiple" };

    const total = cleanNingPens + cleanQingPens;
    const totalParts = cleanMultiple + 1n;
    const remainder = total % totalParts;
    if (remainder !== 0n) {
      return {
        valid: false,
        reason: "non-whole-part",
        ningPens: cleanNingPens,
        qingPens: cleanQingPens,
        multiple: cleanMultiple,
        total,
        totalParts,
        remainder
      };
    }

    const onePart = total / totalParts;
    if (cleanQingPens === onePart) {
      return {
        valid: false,
        reason: "no-transfer",
        ningPens: cleanNingPens,
        qingPens: cleanQingPens,
        multiple: cleanMultiple,
        onePart
      };
    }
    if (cleanQingPens < onePart) {
      return {
        valid: false,
        reason: "wrong-direction",
        ningPens: cleanNingPens,
        qingPens: cleanQingPens,
        multiple: cleanMultiple,
        onePart,
        neededFromNing: onePart - cleanQingPens
      };
    }

    const transfer = cleanQingPens - onePart;
    const finalNing = cleanNingPens + transfer;
    const finalQing = cleanQingPens - transfer;
    return {
      valid: true,
      ningPens: cleanNingPens,
      qingPens: cleanQingPens,
      multiple: cleanMultiple,
      total,
      totalParts,
      onePart,
      transfer,
      finalNing,
      finalQing,
      checkedTotal: finalNing + finalQing,
      checkedMultiple: finalNing / finalQing
    };
  }

  function bookshelfMultipleState(removedFromFirst, addedToSecond, multiple) {
    const cleanRemoved = parsePositiveBigInt(removedFromFirst);
    const cleanAdded = parsePositiveBigInt(addedToSecond);
    const cleanMultiple = parsePositiveBigInt(multiple);

    if (cleanRemoved === null) return { valid: false, reason: "invalid-removed" };
    if (cleanAdded === null) return { valid: false, reason: "invalid-added" };
    if (cleanMultiple === null || cleanMultiple < 2n) return { valid: false, reason: "invalid-multiple" };

    const gap = cleanRemoved + cleanAdded;
    const differenceParts = cleanMultiple - 1n;
    const remainder = gap % differenceParts;
    if (remainder !== 0n) {
      return {
        valid: false,
        reason: "non-whole-part",
        removedFromFirst: cleanRemoved,
        addedToSecond: cleanAdded,
        multiple: cleanMultiple,
        gap,
        differenceParts,
        remainder
      };
    }

    const firstAfter = gap / differenceParts;
    const originalEach = firstAfter + cleanRemoved;
    const secondAfter = originalEach + cleanAdded;
    return {
      valid: true,
      removedFromFirst: cleanRemoved,
      addedToSecond: cleanAdded,
      multiple: cleanMultiple,
      gap,
      differenceParts,
      firstAfter,
      secondAfter,
      originalEach,
      checkedFirstAfter: originalEach - cleanRemoved,
      checkedSecondAfter: originalEach + cleanAdded,
      checkedGap: secondAfter - firstAfter,
      checkedMultiple: secondAfter / firstAfter
    };
  }

  function boxTransferDifferenceState(totalBags, movedToSecond, firstStillMore) {
    const cleanTotal = parsePositiveBigInt(totalBags);
    const cleanMoved = parsePositiveBigInt(movedToSecond);
    const cleanDifference = parsePositiveBigInt(firstStillMore);

    if (cleanTotal === null) return { valid: false, reason: "invalid-total" };
    if (cleanMoved === null) return { valid: false, reason: "invalid-transfer" };
    if (cleanDifference === null) return { valid: false, reason: "invalid-difference" };
    if (cleanDifference >= cleanTotal) {
      return {
        valid: false,
        reason: "difference-too-large",
        totalBags: cleanTotal,
        movedToSecond: cleanMoved,
        firstStillMore: cleanDifference
      };
    }

    const remainingAfterExcess = cleanTotal - cleanDifference;
    if (remainingAfterExcess % 2n !== 0n) {
      return {
        valid: false,
        reason: "non-whole-half",
        totalBags: cleanTotal,
        movedToSecond: cleanMoved,
        firstStillMore: cleanDifference,
        remainingAfterExcess
      };
    }

    const equalShare = remainingAfterExcess / 2n;
    const firstAfter = equalShare + cleanDifference;
    const secondAfter = equalShare;
    if (cleanMoved >= secondAfter) {
      return {
        valid: false,
        reason: "transfer-too-large",
        totalBags: cleanTotal,
        movedToSecond: cleanMoved,
        firstStillMore: cleanDifference,
        equalShare,
        firstAfter,
        secondAfter
      };
    }

    const firstOriginal = firstAfter + cleanMoved;
    const secondOriginal = secondAfter - cleanMoved;
    return {
      valid: true,
      totalBags: cleanTotal,
      movedToSecond: cleanMoved,
      firstStillMore: cleanDifference,
      remainingAfterExcess,
      equalShare,
      firstAfter,
      secondAfter,
      firstOriginal,
      secondOriginal,
      checkedTotal: firstOriginal + secondOriginal,
      checkedFirstAfter: firstOriginal - cleanMoved,
      checkedSecondAfter: secondOriginal + cleanMoved,
      checkedDifference: firstAfter - secondAfter
    };
  }

  function quotientRemainderSumState(quotient, remainder, totalSum) {
    const cleanQuotient = parsePositiveBigInt(quotient);
    const cleanRemainder = parseNonNegativeBigInt(remainder);
    const cleanTotalSum = parsePositiveBigInt(totalSum);

    if (cleanQuotient === null) return { valid: false, reason: "invalid-quotient" };
    if (cleanRemainder === null) return { valid: false, reason: "invalid-remainder" };
    if (cleanTotalSum === null) return { valid: false, reason: "invalid-total-sum" };

    const equalParts = cleanQuotient + 1n;
    const knownNumbersTotal = cleanQuotient + cleanRemainder * 2n;
    if (cleanTotalSum <= knownNumbersTotal) {
      return {
        valid: false,
        reason: "total-too-small",
        quotient: cleanQuotient,
        remainder: cleanRemainder,
        totalSum: cleanTotalSum,
        knownNumbersTotal
      };
    }

    const equalPartsTotal = cleanTotalSum - knownNumbersTotal;
    const divisionRemainder = equalPartsTotal % equalParts;
    if (divisionRemainder !== 0n) {
      return {
        valid: false,
        reason: "non-whole-divisor",
        quotient: cleanQuotient,
        remainder: cleanRemainder,
        totalSum: cleanTotalSum,
        equalParts,
        knownNumbersTotal,
        equalPartsTotal,
        divisionRemainder
      };
    }

    const divisor = equalPartsTotal / equalParts;
    if (cleanRemainder >= divisor) {
      return {
        valid: false,
        reason: "remainder-not-less",
        quotient: cleanQuotient,
        remainder: cleanRemainder,
        totalSum: cleanTotalSum,
        equalParts,
        knownNumbersTotal,
        equalPartsTotal,
        divisor
      };
    }

    const dividend = divisor * cleanQuotient + cleanRemainder;
    return {
      valid: true,
      quotient: cleanQuotient,
      remainder: cleanRemainder,
      totalSum: cleanTotalSum,
      equalParts,
      knownNumbersTotal,
      equalPartsTotal,
      divisor,
      dividend,
      checkedQuotient: dividend / divisor,
      checkedRemainder: dividend % divisor,
      checkedSum: dividend + divisor + cleanQuotient + cleanRemainder
    };
  }

  function cupBottleWeightState(firstCups, firstTotalWeight, secondCups, secondTotalWeight) {
    const cleanFirstCups = parsePositiveBigInt(firstCups);
    const cleanFirstTotal = parsePositiveBigInt(firstTotalWeight);
    const cleanSecondCups = parsePositiveBigInt(secondCups);
    const cleanSecondTotal = parsePositiveBigInt(secondTotalWeight);

    if (cleanFirstCups === null) return { valid: false, reason: "invalid-first-cups" };
    if (cleanFirstTotal === null) return { valid: false, reason: "invalid-first-total" };
    if (cleanSecondCups === null) return { valid: false, reason: "invalid-second-cups" };
    if (cleanSecondTotal === null) return { valid: false, reason: "invalid-second-total" };
    if (cleanFirstCups === cleanSecondCups) {
      return {
        valid: false,
        reason: "same-cup-count",
        firstCups: cleanFirstCups,
        firstTotalWeight: cleanFirstTotal,
        secondCups: cleanSecondCups,
        secondTotalWeight: cleanSecondTotal
      };
    }

    const fewerSource = cleanFirstCups < cleanSecondCups ? "first" : "second";
    const moreSource = fewerSource === "first" ? "second" : "first";
    const fewerCups = fewerSource === "first" ? cleanFirstCups : cleanSecondCups;
    const fewerTotalWeight = fewerSource === "first" ? cleanFirstTotal : cleanSecondTotal;
    const moreCups = moreSource === "first" ? cleanFirstCups : cleanSecondCups;
    const moreTotalWeight = moreSource === "first" ? cleanFirstTotal : cleanSecondTotal;

    if (moreTotalWeight <= fewerTotalWeight) {
      return {
        valid: false,
        reason: "weight-direction-mismatch",
        firstCups: cleanFirstCups,
        firstTotalWeight: cleanFirstTotal,
        secondCups: cleanSecondCups,
        secondTotalWeight: cleanSecondTotal,
        fewerSource,
        moreSource,
        fewerCups,
        fewerTotalWeight,
        moreCups,
        moreTotalWeight
      };
    }

    const cupDifference = moreCups - fewerCups;
    const weightDifference = moreTotalWeight - fewerTotalWeight;
    const divisionRemainder = weightDifference % cupDifference;
    if (divisionRemainder !== 0n) {
      return {
        valid: false,
        reason: "non-whole-cup-weight",
        firstCups: cleanFirstCups,
        firstTotalWeight: cleanFirstTotal,
        secondCups: cleanSecondCups,
        secondTotalWeight: cleanSecondTotal,
        fewerSource,
        moreSource,
        fewerCups,
        fewerTotalWeight,
        moreCups,
        moreTotalWeight,
        cupDifference,
        weightDifference,
        divisionRemainder
      };
    }

    const cupWaterWeight = weightDifference / cupDifference;
    const fewerWaterWeight = fewerCups * cupWaterWeight;
    const moreWaterWeight = moreCups * cupWaterWeight;
    const bottleWeight = fewerTotalWeight - fewerWaterWeight;
    if (bottleWeight <= 0n) {
      return {
        valid: false,
        reason: "non-positive-bottle-weight",
        firstCups: cleanFirstCups,
        firstTotalWeight: cleanFirstTotal,
        secondCups: cleanSecondCups,
        secondTotalWeight: cleanSecondTotal,
        fewerSource,
        moreSource,
        fewerCups,
        fewerTotalWeight,
        moreCups,
        moreTotalWeight,
        cupDifference,
        weightDifference,
        cupWaterWeight,
        bottleWeight
      };
    }

    return {
      valid: true,
      firstCups: cleanFirstCups,
      firstTotalWeight: cleanFirstTotal,
      secondCups: cleanSecondCups,
      secondTotalWeight: cleanSecondTotal,
      fewerSource,
      moreSource,
      fewerCups,
      fewerTotalWeight,
      moreCups,
      moreTotalWeight,
      cupDifference,
      weightDifference,
      cupWaterWeight,
      fewerWaterWeight,
      moreWaterWeight,
      bottleWeight,
      checkedFirstTotal: bottleWeight + cleanFirstCups * cupWaterWeight,
      checkedSecondTotal: bottleWeight + cleanSecondCups * cupWaterWeight
    };
  }

  function waterMeasureState(bottleACapacity, bottleBCapacity, targetAmount) {
    const cleanBottleA = parsePositiveBigInt(bottleACapacity);
    const cleanBottleB = parsePositiveBigInt(bottleBCapacity);
    const cleanTarget = parsePositiveBigInt(targetAmount);

    if (cleanBottleA === null) return { valid: false, reason: "invalid-bottle-a" };
    if (cleanBottleB === null) return { valid: false, reason: "invalid-bottle-b" };
    if (cleanTarget === null) return { valid: false, reason: "invalid-target" };
    if (cleanBottleA === cleanBottleB) {
      return {
        valid: false,
        reason: "equal-capacities",
        bottleACapacity: cleanBottleA,
        bottleBCapacity: cleanBottleB,
        targetAmount: cleanTarget
      };
    }

    const largeBottle = cleanBottleA > cleanBottleB ? "a" : "b";
    const smallBottle = largeBottle === "a" ? "b" : "a";
    const largeCapacity = largeBottle === "a" ? cleanBottleA : cleanBottleB;
    const smallCapacity = smallBottle === "a" ? cleanBottleA : cleanBottleB;
    const residual = largeCapacity - smallCapacity;
    const supportedTarget = residual + largeCapacity;

    if (cleanTarget !== supportedTarget) {
      return {
        valid: false,
        reason: "unsupported-target",
        bottleACapacity: cleanBottleA,
        bottleBCapacity: cleanBottleB,
        targetAmount: cleanTarget,
        largeBottle,
        smallBottle,
        largeCapacity,
        smallCapacity,
        residual,
        supportedTarget
      };
    }

    return {
      valid: true,
      bottleACapacity: cleanBottleA,
      bottleBCapacity: cleanBottleB,
      targetAmount: cleanTarget,
      largeBottle,
      smallBottle,
      largeCapacity,
      smallCapacity,
      residual,
      remainingAfterResidual: cleanTarget - residual,
      checkedDifference: largeCapacity - smallCapacity,
      checkedTotal: residual + largeCapacity,
      states: {
        initial: { smallBottle: 0n, largeBottle: 0n, targetBasin: 0n },
        filledLarge: { smallBottle: 0n, largeBottle: largeCapacity, targetBasin: 0n },
        afterTransfer: { smallBottle: smallCapacity, largeBottle: residual, targetBasin: 0n },
        savedResidual: { smallBottle: smallCapacity, largeBottle: 0n, targetBasin: residual },
        refilledLarge: { smallBottle: smallCapacity, largeBottle: largeCapacity, targetBasin: residual },
        final: { smallBottle: smallCapacity, largeBottle: 0n, targetBasin: cleanTarget }
      }
    };
  }

  function greatestCommonDivisor(left, right) {
    let larger = left > right ? left : right;
    let smaller = left > right ? right : left;
    while (smaller !== 0n) {
      const remainder = larger % smaller;
      larger = smaller;
      smaller = remainder;
    }
    return larger;
  }

  function waterMeasureExploreState(bottleACapacity, bottleBCapacity, targetAmount) {
    const cleanBottleA = parsePositiveBigInt(bottleACapacity);
    const cleanBottleB = parsePositiveBigInt(bottleBCapacity);
    const cleanTarget = parsePositiveBigInt(targetAmount);

    if (cleanBottleA === null) return { valid: false, reason: "invalid-bottle-a" };
    if (cleanBottleB === null) return { valid: false, reason: "invalid-bottle-b" };
    if (cleanTarget === null) return { valid: false, reason: "invalid-target" };

    const fundamentalUnit = greatestCommonDivisor(cleanBottleA, cleanBottleB);
    const common = {
      bottleACapacity: cleanBottleA,
      bottleBCapacity: cleanBottleB,
      targetAmount: cleanTarget,
      fundamentalUnit,
      measurable: cleanTarget % fundamentalUnit === 0n
    };

    if (!common.measurable) return { valid: false, reason: "not-measurable", ...common };

    const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);
    const bottleAUnitsBigInt = cleanBottleA / fundamentalUnit;
    const bottleBUnitsBigInt = cleanBottleB / fundamentalUnit;
    const targetUnitsBigInt = cleanTarget / fundamentalUnit;
    if (
      bottleAUnitsBigInt > maxSafeBigInt ||
      bottleBUnitsBigInt > maxSafeBigInt ||
      targetUnitsBigInt > maxSafeBigInt
    ) {
      return { valid: false, reason: "search-too-large", ...common };
    }

    const bottleAUnits = Number(bottleAUnitsBigInt);
    const bottleBUnits = Number(bottleBUnitsBigInt);
    const targetUnits = Number(targetUnitsBigInt);
    const estimatedStateCount = (bottleAUnits + 1) * (bottleBUnits + 1) * (targetUnits + 1);
    if (!Number.isSafeInteger(estimatedStateCount) || estimatedStateCount > 500000) {
      return { valid: false, reason: "search-too-large", estimatedStateCount, ...common };
    }

    const stateKey = (state) => `${state.bottleA},${state.bottleB},${state.targetBasin}`;
    const initial = { bottleA: 0, bottleB: 0, targetBasin: 0 };
    const initialKey = stateKey(initial);
    const queue = [initialKey];
    const visited = new Map([
      [initialKey, { state: initial, previousKey: null, action: null, distance: 0 }]
    ]);
    const layerCounts = [1];
    let queueIndex = 0;
    let goalKey = targetUnits === 0 ? initialKey : null;

    function candidates(state) {
      const moves = [];
      const add = (type, from, to, amount, nextState) => {
        if (amount > 0) moves.push({ type, from, to, amount, state: nextState });
      };

      add("fill-a", "source", "a", bottleAUnits - state.bottleA, {
        ...state,
        bottleA: bottleAUnits
      });
      add("fill-b", "source", "b", bottleBUnits - state.bottleB, {
        ...state,
        bottleB: bottleBUnits
      });
      add("empty-a", "a", "source", state.bottleA, { ...state, bottleA: 0 });
      add("empty-b", "b", "source", state.bottleB, { ...state, bottleB: 0 });

      const aToB = Math.min(state.bottleA, bottleBUnits - state.bottleB);
      add("pour-a-to-b", "a", "b", aToB, {
        ...state,
        bottleA: state.bottleA - aToB,
        bottleB: state.bottleB + aToB
      });
      const bToA = Math.min(state.bottleB, bottleAUnits - state.bottleA);
      add("pour-b-to-a", "b", "a", bToA, {
        ...state,
        bottleA: state.bottleA + bToA,
        bottleB: state.bottleB - bToA
      });

      if (state.targetBasin + state.bottleA <= targetUnits) {
        add("pour-a-to-target", "a", "target", state.bottleA, {
          ...state,
          bottleA: 0,
          targetBasin: state.targetBasin + state.bottleA
        });
      }
      if (state.targetBasin + state.bottleB <= targetUnits) {
        add("pour-b-to-target", "b", "target", state.bottleB, {
          ...state,
          bottleB: 0,
          targetBasin: state.targetBasin + state.bottleB
        });
      }
      return moves;
    }

    while (queueIndex < queue.length && goalKey === null) {
      const currentKey = queue[queueIndex];
      queueIndex += 1;
      const currentNode = visited.get(currentKey);
      for (const move of candidates(currentNode.state)) {
        const nextKey = stateKey(move.state);
        if (visited.has(nextKey)) continue;
        const distance = currentNode.distance + 1;
        visited.set(nextKey, {
          state: move.state,
          previousKey: currentKey,
          action: {
            type: move.type,
            from: move.from,
            to: move.to,
            amount: move.amount
          },
          distance
        });
        layerCounts[distance] = (layerCounts[distance] || 0) + 1;
        queue.push(nextKey);
        if (move.state.targetBasin === targetUnits) {
          goalKey = nextKey;
          break;
        }
      }
    }

    if (goalKey === null) return { valid: false, reason: "no-route", ...common };

    const toAmounts = (state) => ({
      bottleA: BigInt(state.bottleA) * fundamentalUnit,
      bottleB: BigInt(state.bottleB) * fundamentalUnit,
      targetBasin: BigInt(state.targetBasin) * fundamentalUnit
    });
    const reversedPath = [];
    let cursorKey = goalKey;
    while (cursorKey !== initialKey) {
      const node = visited.get(cursorKey);
      const previousNode = visited.get(node.previousKey);
      reversedPath.push({
        type: node.action.type,
        from: node.action.from,
        to: node.action.to,
        amount: BigInt(node.action.amount) * fundamentalUnit,
        before: toAmounts(previousNode.state),
        after: toAmounts(node.state)
      });
      cursorKey = node.previousKey;
    }
    const path = reversedPath.reverse().map((operation, index) => ({ number: index + 1, ...operation }));

    return {
      valid: true,
      ...common,
      minimumOperations: path.length,
      checkedThrough: Math.max(0, path.length - 1),
      layerCounts: layerCounts.slice(0, path.length + 1),
      initial: toAmounts(initial),
      final: path.length ? path[path.length - 1].after : toAmounts(initial),
      path
    };
  }

  function parsePositiveInteger(value) {
    const numericValue = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isSafeInteger(numericValue) && numericValue > 0 ? numericValue : null;
  }

  function trainBridgeState(trainLength, bridgeLength, speed) {
    const cleanTrainLength = parsePositiveInteger(trainLength);
    const cleanBridgeLength = parsePositiveInteger(bridgeLength);
    const cleanSpeed = parsePositiveInteger(speed);

    if (cleanTrainLength === null) return { valid: false, reason: "invalid-train-length" };
    if (cleanBridgeLength === null) return { valid: false, reason: "invalid-bridge-length" };
    if (cleanSpeed === null) return { valid: false, reason: "invalid-speed" };

    function travelPart(distance) {
      const fullSeconds = Math.floor(distance / cleanSpeed);
      const remainderDistance = distance % cleanSpeed;
      const exactAtHundredth = (BigInt(distance) * 100n) % BigInt(cleanSpeed) === 0n;
      return {
        distance,
        fullSeconds,
        remainderDistance,
        dividesEvenly: remainderDistance === 0,
        exactAtHundredth,
        time: round(distance / cleanSpeed, 2)
      };
    }

    const personCrossing = travelPart(cleanBridgeLength);
    const trainClearing = travelPart(cleanTrainLength);
    const totalDistance = cleanBridgeLength + cleanTrainLength;
    const fullCrossing = travelPart(totalDistance);

    return {
      valid: true,
      trainLength: cleanTrainLength,
      bridgeLength: cleanBridgeLength,
      speed: cleanSpeed,
      totalDistance,
      personCrossing,
      trainClearing,
      fullCrossing
    };
  }

  function trailingZerosState(multiplicand, targetZeros) {
    const cleanMultiplicand = parsePositiveBigInt(multiplicand);
    const cleanTargetZeros = parsePositiveInteger(targetZeros);

    if (cleanMultiplicand === null || cleanMultiplicand > 1000n) {
      return { valid: false, reason: "invalid-multiplicand" };
    }
    if (cleanTargetZeros === null) return { valid: false, reason: "invalid-target-zeros" };
    if (cleanTargetZeros > 1000) return { valid: false, reason: "too-many-target-zeros" };

    let activeNumber = cleanMultiplicand;
    let minimumMultiplier = 1n;
    const rounds = [];

    for (let index = 0; index < cleanTargetZeros; index += 1) {
      const before = activeNumber;
      const lastDigit = Number(before % 10n);
      let action = "existing-zero";
      let roundMultiplier = 1n;

      if (lastDigit === 5) {
        action = "times-two";
        roundMultiplier = 2n;
      } else if (lastDigit !== 0 && lastDigit % 2 === 0) {
        action = "times-five";
        roundMultiplier = 5n;
      } else if (lastDigit !== 0) {
        action = "times-ten";
        roundMultiplier = 10n;
      }

      const beforeLock = before * roundMultiplier;
      const trials = [];
      for (let candidate = 1n; candidate <= roundMultiplier; candidate += 1n) {
        const result = before * candidate;
        trials.push({ candidate, result, succeeds: result % 10n === 0n });
      }

      minimumMultiplier *= roundMultiplier;
      activeNumber = beforeLock / 10n;
      rounds.push({
        number: index + 1,
        before,
        lastDigit,
        action,
        roundMultiplier,
        beforeLock,
        afterLock: activeNumber,
        accumulatedMultiplier: minimumMultiplier,
        trials
      });
    }

    const product = cleanMultiplicand * minimumMultiplier;
    let actualTrailingZeros = 0;
    let checkNumber = product;
    while (checkNumber % 10n === 0n) {
      actualTrailingZeros += 1;
      checkNumber /= 10n;
    }

    return {
      valid: true,
      multiplicand: cleanMultiplicand,
      targetZeros: cleanTargetZeros,
      minimumMultiplier,
      product,
      actualTrailingZeros,
      rounds
    };
  }

  function vehicleRentalState(teachers, students, bigCapacity, bigPrice, smallCapacity, smallPrice) {
    const cleanTeachers = Math.max(0, Math.round(Number.isFinite(Number(teachers)) ? Number(teachers) : 15));
    const cleanStudents = Math.max(0, Math.round(Number.isFinite(Number(students)) ? Number(students) : 355));
    const cleanBigCapacity = Math.max(1, Math.round(Number.isFinite(Number(bigCapacity)) ? Number(bigCapacity) : 40));
    const cleanSmallCapacity = Math.max(
      1,
      Math.round(Number.isFinite(Number(smallCapacity)) ? Number(smallCapacity) : 25)
    );
    const cleanBigPrice = Math.max(1, Math.round(Number.isFinite(Number(bigPrice)) ? Number(bigPrice) : 720));
    const cleanSmallPrice = Math.max(1, Math.round(Number.isFinite(Number(smallPrice)) ? Number(smallPrice) : 500));
    const totalPeople = cleanTeachers + cleanStudents;
    const allBigCount = totalPeople === 0 ? 0 : Math.ceil(totalPeople / cleanBigCapacity);
    const allSmallCount = totalPeople === 0 ? 0 : Math.ceil(totalPeople / cleanSmallCapacity);

    function makePlan(big, small) {
      const bigSeats = big * cleanBigCapacity;
      const smallSeats = small * cleanSmallCapacity;
      const seats = bigSeats + smallSeats;
      return {
        big,
        small,
        vehicles: big + small,
        bigSeats,
        smallSeats,
        remainingPeople: Math.max(0, totalPeople - bigSeats),
        seats,
        emptySeats: seats - totalPeople,
        cost: big * cleanBigPrice + small * cleanSmallPrice
      };
    }

    const bigTeachingPlans = [];

    for (let big = allBigCount; big >= 0; big -= 1) {
      const bigSeats = big * cleanBigCapacity;
      const remainingPeople = Math.max(0, totalPeople - bigSeats);
      const small = remainingPeople === 0 ? 0 : Math.ceil(remainingPeople / cleanSmallCapacity);
      bigTeachingPlans.push(makePlan(big, small));
    }

    const smallTeachingPlans = [];

    for (let small = allSmallCount; small >= 0; small -= 1) {
      const smallSeats = small * cleanSmallCapacity;
      const remainingPeople = Math.max(0, totalPeople - smallSeats);
      const big = remainingPeople === 0 ? 0 : Math.ceil(remainingPeople / cleanBigCapacity);
      smallTeachingPlans.push(makePlan(big, small));
    }

    const allBigPlan = bigTeachingPlans[0];
    const allSmallPlan = smallTeachingPlans[0];
    const startType = allBigPlan.cost <= allSmallPlan.cost ? "big" : "small";
    const teachingPlans = startType === "big" ? bigTeachingPlans : smallTeachingPlans;

    const plans = [...teachingPlans].sort((left, right) => {
      if (left.cost !== right.cost) return left.cost - right.cost;
      if (left.emptySeats !== right.emptySeats) return left.emptySeats - right.emptySeats;
      if (left.vehicles !== right.vehicles) return left.vehicles - right.vehicles;
      return right.big - left.big;
    });
    const minimumCost = plans[0].cost;
    const bestPlans = teachingPlans.filter((plan) => plan.cost === minimumCost);

    return {
      teachers: cleanTeachers,
      students: cleanStudents,
      totalPeople,
      bigCapacity: cleanBigCapacity,
      bigPrice: cleanBigPrice,
      smallCapacity: cleanSmallCapacity,
      smallPrice: cleanSmallPrice,
      allBigCount,
      allSmallCount,
      allBigPlan,
      allSmallPlan,
      startType,
      bigSeatCost: round(cleanBigPrice / cleanBigCapacity, 2),
      smallSeatCost: round(cleanSmallPrice / cleanSmallCapacity, 2),
      best: plans[0],
      bestPlans,
      bigTeachingPlans,
      smallTeachingPlans,
      teachingPlans,
      plans
    };
  }

  function canFormTriangle(a, b, c) {
    const sides = [Number(a), Number(b), Number(c)].sort((x, y) => x - y);
    if (sides.some((side) => !Number.isFinite(side) || side <= 0)) {
      return { valid: false, reason: "invalid-side" };
    }
    const valid = sides[0] + sides[1] > sides[2];
    return {
      valid,
      reason: valid ? "ok" : "sum-not-greater",
      sortedSides: sides
    };
  }

  function magicSquareState(order) {
    const cleanOrder = Number(order);
    if (!Number.isInteger(cleanOrder) || cleanOrder < 3 || cleanOrder % 2 === 0) {
      return { valid: false, reason: "invalid-odd-order" };
    }

    const cells = Array.from({ length: cleanOrder }, () => Array(cleanOrder).fill(0));
    const moves = [];
    let row = 0;
    let column = Math.floor(cleanOrder / 2);

    for (let value = 1; value <= cleanOrder * cleanOrder; value += 1) {
      cells[row][column] = value;
      moves.push({ value, row, column, rule: value === 1 ? "start" : "stair" });
      if (value === cleanOrder * cleanOrder) break;

      const nextRow = (row - 1 + cleanOrder) % cleanOrder;
      const nextColumn = (column + 1) % cleanOrder;
      if (cells[nextRow][nextColumn] !== 0) {
        row = (row + 1) % cleanOrder;
        moves[moves.length - 1].nextRule = "down";
      } else {
        moves[moves.length - 1].nextRule = row === 0 || column === cleanOrder - 1 ? "wrap" : "stair";
        row = nextRow;
        column = nextColumn;
      }
    }

    const magicSum = (cleanOrder * (cleanOrder * cleanOrder + 1)) / 2;
    const makeLine = (type, index, coordinates) => {
      const values = coordinates.map(([lineRow, lineColumn]) => cells[lineRow][lineColumn]);
      const layers = values.map((value) => Math.floor((value - 1) / cleanOrder));
      const positions = values.map((value) => (value - 1) % cleanOrder);
      return {
        type,
        index,
        coordinates,
        values,
        sum: values.reduce((total, value) => total + value, 0),
        layerSum: layers.reduce((total, value) => total + value, 0),
        positionSum: positions.reduce((total, value) => total + value, 0)
      };
    };

    const rows = Array.from({ length: cleanOrder }, (_, lineRow) =>
      makeLine("row", lineRow, Array.from({ length: cleanOrder }, (_, lineColumn) => [lineRow, lineColumn]))
    );
    const columns = Array.from({ length: cleanOrder }, (_, lineColumn) =>
      makeLine("column", lineColumn, Array.from({ length: cleanOrder }, (_, lineRow) => [lineRow, lineColumn]))
    );
    const diagonals = [
      makeLine("diagonal", 0, Array.from({ length: cleanOrder }, (_, index) => [index, index])),
      makeLine("diagonal", 1, Array.from({ length: cleanOrder }, (_, index) => [index, cleanOrder - 1 - index]))
    ];
    const targetPartSum = (cleanOrder * (cleanOrder - 1)) / 2;
    const lines = [...rows, ...columns, ...diagonals];

    return {
      valid: true,
      order: cleanOrder,
      cells,
      moves,
      magicSum,
      totalSum: (cleanOrder * cleanOrder * (cleanOrder * cleanOrder + 1)) / 2,
      targetPartSum,
      rows,
      columns,
      diagonals,
      lines,
      verified: lines.every(
        (line) => line.sum === magicSum && line.layerSum === targetPartSum && line.positionSum === targetPartSum
      )
    };
  }

  function magicSquareLines(cells) {
    const order = cells.length;
    const makeLine = (type, index, coordinates) => {
      const values = coordinates.map(([row, column]) => cells[row][column]);
      return { type, index, coordinates, values, sum: values.reduce((total, value) => total + value, 0) };
    };
    return [
      ...Array.from({ length: order }, (_, row) => makeLine("row", row, Array.from({ length: order }, (_, column) => [row, column]))),
      ...Array.from({ length: order }, (_, column) => makeLine("column", column, Array.from({ length: order }, (_, row) => [row, column]))),
      makeLine("diagonal", 0, Array.from({ length: order }, (_, index) => [index, index])),
      makeLine("diagonal", 1, Array.from({ length: order }, (_, index) => [index, order - 1 - index]))
    ];
  }

  function magicSquareDoublyEvenState(order, variant = "inside") {
    const cleanOrder = Number(order);
    if (!Number.isInteger(cleanOrder) || cleanOrder < 4 || cleanOrder % 4 !== 0) {
      return { valid: false, reason: "invalid-doubly-even-order" };
    }
    if (variant !== "inside" && variant !== "outside") {
      return { valid: false, reason: "invalid-variant" };
    }

    const initialCells = Array.from({ length: cleanOrder }, (_, row) =>
      Array.from({ length: cleanOrder }, (_, column) => row * cleanOrder + column + 1)
    );
    const cells = initialCells.map((row) => [...row]);
    const isInsideX = (row, column) => {
      const localRow = row % 4;
      const localColumn = column % 4;
      return localRow === localColumn || localRow + localColumn === 3;
    };
    const pairs = [];
    for (let row = 0; row < cleanOrder; row += 1) {
      for (let column = 0; column < cleanOrder; column += 1) {
        const pairRow = cleanOrder - 1 - row;
        const pairColumn = cleanOrder - 1 - column;
        const first = row * cleanOrder + column;
        const second = pairRow * cleanOrder + pairColumn;
        const selected = variant === "inside" ? isInsideX(row, column) : !isInsideX(row, column);
        if (selected && first < second) {
          pairs.push({
            from: [row, column],
            to: [pairRow, pairColumn],
            values: [cells[row][column], cells[pairRow][pairColumn]]
          });
          [cells[row][column], cells[pairRow][pairColumn]] = [cells[pairRow][pairColumn], cells[row][column]];
        }
      }
    }
    const lines = magicSquareLines(cells);
    const magicSum = (cleanOrder * (cleanOrder * cleanOrder + 1)) / 2;
    return {
      valid: true,
      order: cleanOrder,
      variant,
      magicSum,
      totalSum: (cleanOrder * cleanOrder * (cleanOrder * cleanOrder + 1)) / 2,
      initialCells,
      cells,
      pairs,
      lines,
      verified: lines.every((line) => line.sum === magicSum)
    };
  }

  function magicSquareSinglyEvenState(order) {
    const cleanOrder = Number(order);
    if (!Number.isInteger(cleanOrder) || cleanOrder < 6 || cleanOrder % 4 !== 2) {
      return { valid: false, reason: "invalid-singly-even-order" };
    }

    const half = cleanOrder / 2;
    const base = magicSquareState(half);
    const offsets = [[0, 2 * half * half], [3 * half * half, half * half]];
    const initialCells = Array.from({ length: cleanOrder }, () => Array(cleanOrder).fill(0));
    for (let blockRow = 0; blockRow < 2; blockRow += 1) {
      for (let blockColumn = 0; blockColumn < 2; blockColumn += 1) {
        for (let row = 0; row < half; row += 1) {
          for (let column = 0; column < half; column += 1) {
            initialCells[blockRow * half + row][blockColumn * half + column] = base.cells[row][column] + offsets[blockRow][blockColumn];
          }
        }
      }
    }

    const cells = initialCells.map((row) => [...row]);
    const groups = [];
    const swapGroup = (name, swaps) => {
      swaps.forEach(({ from, to }) => {
        [cells[from[0]][from[1]], cells[to[0]][to[1]]] = [cells[to[0]][to[1]], cells[from[0]][from[1]]];
      });
      groups.push({ name, swaps, cells: cells.map((row) => [...row]) });
    };
    const band = (half - 1) / 2;
    const rightBand = Math.max(0, band - 1);
    const makeSwap = (row, column) => ({
      from: [row, column],
      to: [row + half, column],
      values: [initialCells[row][column], initialCells[row + half][column]]
    });
    const ordinarySwapRows = [];
    for (let row = 0; row < half; row += 1) {
      if (row === band) continue;
      const swaps = [];
      for (let column = 0; column < band; column += 1) swaps.push(makeSwap(row, column));
      for (let column = half - band + 1; column < half; column += 1) swaps.push(makeSwap(row, column + half));
      ordinarySwapRows.push({ row, swaps });
    }
    const specialSwaps = [];
    for (let column = 1; column <= band; column += 1) specialSwaps.push(makeSwap(band, column));
    for (let column = half - band + 1; column < half; column += 1) specialSwaps.push(makeSwap(band, column + half));
    const specialSwapRow = { row: band, swaps: specialSwaps };
    const swapRows = [...ordinarySwapRows, specialSwapRow];

    const leftSwaps = [];
    for (let row = 0; row < half; row += 1) {
      for (let column = 0; column < band; column += 1) {
        leftSwaps.push({ from: [row, column], to: [row + half, column] });
      }
    }
    swapGroup("left", leftSwaps);

    const rightSwaps = [];
    for (let row = 0; row < half; row += 1) {
      for (let column = half - band + 1; column < half; column += 1) {
        rightSwaps.push({ from: [row, column + half], to: [row + half, column + half] });
      }
    }
    if (rightSwaps.length) swapGroup("right", rightSwaps);

    swapGroup("restore", [{ from: [band, 0], to: [band + half, 0] }]);
    swapGroup("center", [{ from: [band, band], to: [band + half, band] }]);

    const lines = magicSquareLines(cells);
    const magicSum = (cleanOrder * (cleanOrder * cleanOrder + 1)) / 2;
    return {
      valid: true,
      order: cleanOrder,
      half,
      band,
      rightBand,
      baseCells: base.cells,
      baseMoves: base.moves,
      initialCells,
      cells,
      groups,
      ordinarySwapRows,
      specialSwapRow,
      swapRows,
      swapPairs: swapRows.flatMap((item) => item.swaps),
      rowBalance: {
        initialUpperSum: initialCells[0].reduce((total, value) => total + value, 0),
        initialLowerSum: initialCells[half].reduce((total, value) => total + value, 0),
        leftChange: 3 * half * half,
        rightChange: half * half,
        leftCount: band,
        rightCount: rightBand
      },
      magicSum,
      totalSum: (cleanOrder * cleanOrder * (cleanOrder * cleanOrder + 1)) / 2,
      lines,
      verified: lines.every((line) => line.sum === magicSum)
    };
  }

  window.MathLabModels = {
    clamp,
    round,
    geometry: {
      squarePerimeterState,
      canCloseLengths,
      solveClosedCanvas,
      solveOpenCanvas,
      canvasPerimeterState,
      looseSegmentPerimeterState,
      splitSegmentByLengths,
      mergeCollinearSegments,
      moveLooseJoint,
      connectedSegmentComponents,
      boundedSegmentFaces,
      curvedPerimeter,
      rectangleToSquareState,
      lineRelationState,
      canFormTriangle
    },
    quantity: {
      equalSharingState,
      fractionState,
      notebookPromotionState,
      chickenRabbitState,
      penTransferState,
      bookshelfMultipleState,
      boxTransferDifferenceState,
      quotientRemainderSumState,
      cupBottleWeightState,
      waterMeasureState,
      waterMeasureExploreState,
      trainBridgeState,
      trailingZerosState,
      vehicleRentalState
    },
    patterns: {
      magicSquareState,
      magicSquareDoublyEvenState,
      magicSquareSinglyEvenState
    }
  };
})();
