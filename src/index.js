import React from 'react';
import ReactDOM from 'react-dom';
import RadialChart from './components/RadialChart.js'

const dataset = [
  { index: 0, name: 'move', icon: "\uF105", percentage: Math.random() * 60 + 30 },
  { index: 1, name: 'exercise', icon: "\uF101", percentage: Math.random() * 60 + 30 },
  { index: 2, name: 'stand', icon: "\uF106", percentage: Math.random() * 60 + 30 }
];

const colors = ["#e90b3a", "#a0ff03", "#1ad5de"];

ReactDOM.render(
  <RadialChart dataset={dataset} colors={colors} useElasticAnimation={false} />,
  document.getElementById('root')
);
