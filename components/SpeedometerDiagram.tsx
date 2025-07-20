import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface Category {
  name: string;
  amount: number;
  color: string;
}

interface SpeedometerDiagramProps {
  categories: Category[];
  size?: number;
}

export const SpeedometerDiagram: React.FC<SpeedometerDiagramProps> = ({ categories, size = 260 }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = Colors[theme];
  
  // Ограничение на 20 категорий
  const cats = categories.slice(0, 20);
  const total = cats.reduce((sum, c) => sum + c.amount, 0);
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const startAngle = 135; // degrees
  const angleRange = 270; // degrees (спидометр)

  // Pie-on-arc logic
  let currentAngle = startAngle;
  const arcs = cats.map((cat) => {
    const value = total === 0 ? 0 : cat.amount / total;
    const sweep = value * angleRange;
    const arc = { ...cat, startAngle: currentAngle, endAngle: currentAngle + sweep };
    currentAngle += sweep;
    return arc;
  });

  // Arc path helper
  const deg2rad = (deg: number) => (deg * Math.PI) / 180;
  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startRad = deg2rad(start);
    const endRad = deg2rad(end);
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArcFlag = end - start > 180 ? '1' : '0';
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, startAngle + angleRange);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {/* Background arc */}
          <Path
            d={backgroundArc}
            stroke={theme === 'dark' ? '#374151' : '#eee'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Category arcs */}
          {arcs.map((arc, i) => (
            arc.endAngle > arc.startAngle ? (
              <Path
                key={arc.name + i}
                d={describeArc(center, center, radius, arc.startAngle, arc.endAngle)}
                stroke={arc.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
            ) : null
          ))}
        </G>
      </Svg>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
        pointerEvents="none"
      >
        <Text style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: colors.textPrimary 
        }}>
          {total} ₽
        </Text>
      </View>
    </View>
  );
}; 