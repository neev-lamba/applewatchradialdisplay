import React from 'react';
import * as d3 from 'd3';

class RadialChart extends React.Component {
  componentDidMount() {
    this.buildChart();
  }
  
  buildChart() {
    const gap = 2;
    const dataset = [
      { index: 0, name: 'move', icon: "\uF105", percentage: Math.random() * 60 + 30 },
      { index: 1, name: 'exercise', icon: "\uF101", percentage: Math.random() * 60 + 30 },
      { index: 2, name: 'stand', icon: "\uF106", percentage: Math.random() * 60 + 30 }
    ];
    const colors = ["#e90b3a", "#a0ff03", "#1ad5de"];
    const width = 500;
    const height = 500;
    const τ = 2 * Math.PI;

    const arc = d3.arc()
      .startAngle(0)
      .endAngle((d) => (d.percentage / 100) * τ)
      .innerRadius((d) => 140 - d.index * (40 + gap))
      .outerRadius((d) => 180 - d.index * (40 + gap))
      .cornerRadius(20);

    const background = d3.arc()
      .startAngle(0)
      .endAngle(τ)
      .innerRadius((d, i) => 140 - d.index * (40 + gap))
      .outerRadius((d, i) => 180 - d.index * (40 + gap));

    const svg = d3.select("#radial-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "50%")
      .attr("y2", "0%")
      .attr("spreadMethod", "pad");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fe08b5")
      .attr("stop-opacity", 1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ff1410")
      .attr("stop-opacity", 1);

    const defs = svg.append("defs");

    const filter = defs.append("filter")
      .attr("id", "dropshadow");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 4)
      .attr("result", "blur");

    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("result", "offsetBlur");

    const feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    const field = svg.selectAll("g")
      .data(dataset)
      .enter()
      .append("g");

    field.append("path")
      .attr("class", "progress")
      .attr("filter", "url(#dropshadow)")
      .style("fill", (d) => (d.index === 0 ? "url(#gradient)" : colors[d.index]))
      .attr("d", arc);

    field.append("path")
      .attr("class", "bg")
      .style("fill", (d) => colors[d.index])
      .style("opacity", 0.2)
      .attr("d", background);

    const singleArcView = true; // Set this to true to display current value on only one radial bar

    if (singleArcView) {
      const completedText = field.append("text")
        .attr('class', 'completed')
        .attr("x", 0)
        .attr("y", -5) // Adjusted y-axis position
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "28px")
        .style("fill", "black");

      const goalText = field.append("text")
        .attr('class', 'goal')
        .text("OF 600 CALS")
        .attr("x", 0)
        .attr("y", 30) // Adjusted y-axis position
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", "black");

      field.each(function (d, i) {
        if (i === 0) {
          const percentageValue = Math.round((d.percentage / 100) * 600);
          completedText.text(percentageValue);
        } else {
          d3.select(this).select(".completed").remove();
          d3.select(this).select(".goal").remove();
        }
      });
    } else {
      field.append("text")
        .attr('class', 'completed')
        .attr("x", 0)
        .attr("y", (d) => -(60 - d.index * (40 + gap)))
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .text((d) => Math.round((d.percentage / 100) * 600))
        .style("font-size", "20px")
        .style("fill", "black");
    }

    update();

    function update() {
      field.each(function (d) {
        this._value = d.percentage;
      });

      field.select("path.progress")
        .transition()
        .duration(1750)
        .delay((d, i) => i * 200)
        .ease(d3.easeElastic)
        .attrTween("d", arcTween);

      field.select("text.completed")
        .text((d, i) => {
          if (i === 0) {
            return Math.round((d.percentage / 100) * 600);
          }
        });

      setTimeout(update, 2000);
    }

    function arcTween(d) {
      const i = d3.interpolateNumber(d.previousValue || 0, d.percentage);
      return function (t) {
        d.percentage = i(t);
        return arc({ ...d, percentage: Math.min(d.percentage, d.percentage * t) });
      };
    }
  }

  render() {
    return <div id="radial-chart"></div>;
  }
}

export default RadialChart;
