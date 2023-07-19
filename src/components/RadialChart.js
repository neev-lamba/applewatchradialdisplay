import React from 'react';
import * as d3 from 'd3';

class RadialChart extends React.Component {
  componentDidMount() {
    this.buildChart();
  }

  buildChart() {
    const { dataset, colors, useElasticAnimation } = this.props;
    const gap = 2;
    const width = 500;
    const height = 500;
    const τ = 2 * Math.PI;

    const arc = d3
      .arc()
      .startAngle(0)
      .endAngle((d) => (d.percentage / 100) * τ)
      .innerRadius((d) => 140 - d.index * (40 + gap))
      .outerRadius((d) => 180 - d.index * (40 + gap))
      .cornerRadius(20);

    const background = d3
      .arc()
      .startAngle(0)
      .endAngle(τ)
      .innerRadius((d, i) => 140 - d.index * (40 + gap))
      .outerRadius((d, i) => 180 - d.index * (40 + gap));

    const svg = d3
      .select("#radial-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const field = svg.selectAll("g").data(dataset).enter().append("g");

    field
      .append("path")
      .attr("class", "progress")
      .attr("filter", "url(#dropshadow)")
      .style("fill", (d) => colors[d.index])
      .attr("d", arc);

    field
      .append("path")
      .attr("class", "bg")
      .style("fill", (d) => colors[d.index])
      .style("opacity", 0.2)
      .attr("d", background);

    const singleArcView = true; // Set this to true to display current value on only one radial bar

    if (singleArcView) {
      const completedText = field
        .filter((d) => d.index === 0)
        .append("text")
        .attr("class", "completed")
        .attr("x", 0)
        .attr("y", -5) // Adjusted y-axis position
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "28px")
        .style("fill", "black");

      const goalText = field
        .filter((d) => d.index === 0)
        .append("text")
        .attr("class", "goal")
        .text("OF 600 CALS")
        .attr("x", 0)
        .attr("y", 30) // Adjusted y-axis position
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("fill", "black");

      completedText.text((d) => Math.round((d.percentage / 100) * 600));
    } else {
      field
        .append("text")
        .attr("class", "completed")
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

      field
        .select("path.progress")
        .transition()
        .duration((d) => (useElasticAnimation ? 1750 : 0)) // Set duration based on useElasticAnimation prop
        .ease((d) => (useElasticAnimation ? d3.easeBounceOut : d3.easeLinear)) // Set ease based on useElasticAnimation prop
        .attrTween("d", arcTween);

      field.select("text.completed").text((d, i) => {
        if (i === 0) {
          return Math.round((d.percentage / 100) * 600);
        }
      });

      setTimeout(update, 2000);
    }

    function arcTween(d) {
      const i = d3.interpolateNumber(d.previousValue || 0, d.percentage);

      return function (t) {
        const percentage = Math.min(d.percentage, d.percentage * t);
        d.percentage = i(t);
        const newArc = { ...d, percentage };
        return arc(newArc);
      };
    }
  }

  render() {
    return <div id="radial-chart"></div>;
  }
}

export default RadialChart;
