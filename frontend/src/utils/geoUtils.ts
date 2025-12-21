export const cityCoords: Record<string, [number, number]> = {
  '成都': [30.6586, 104.0648],
  '重庆': [29.5630, 106.5516],
  '西安': [34.3416, 108.9398],
  '昆明': [25.0406, 102.7123],
  '贵阳': [26.5783, 106.7139],
};

export const getRandomOffset = () => (Math.random() - 0.5) * 0.1;
