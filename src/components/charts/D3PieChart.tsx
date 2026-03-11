import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  name: string;
  value: number;
}

interface D3PieChartProps {
  data: DataPoint[];
  colors?: string[];
  height?: number;
}

const D3PieChart: React.FC<D3PieChartProps> = ({ 
  data, 
  colors = ["#00f2fe", "#4facfe", "#38bdf8", "#0ea5e9", "#0284c7"], 
  height = 300 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: height
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(dimensions.width, dimensions.height) / 2 - 20;
    const g = svg
      .append("g")
      .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(colors);

    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.04);

    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8)
      .cornerRadius(10);

    const outerArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.85)
      .outerRadius(radius);

    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(10, 10, 15, 0.98)")
      .style("backdrop-filter", "blur(12px)")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)")
      .style("border-radius", "12px")
      .style("padding", "8px 12px")
      .style("color", "#fff")
      .style("font-size", "11px")
      .style("font-weight", "800")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("box-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.5)");

    const slices = g.selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
      .attr("stroke", "none")
      .style("cursor", "pointer")
      .style("opacity", 0.9);

    g.selectAll(".slice")
      .on("mouseover", function(event, d: any) {
        d3.select(this)
          .attr("d", outerArc)
          .style("opacity", 1);

        tooltip
          .style("visibility", "visible")
          .style("left", (event.pageX - containerRef.current!.getBoundingClientRect().left + 15) + "px")
          .style("top", (event.pageY - containerRef.current!.getBoundingClientRect().top - 40) + "px")
          .html(`<div class="uppercase text-[9px] opacity-60 mb-1">${d.data.name}</div><div>${d.data.value.toLocaleString()}</div>`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX - containerRef.current!.getBoundingClientRect().left + 15) + "px")
          .style("top", (event.pageY - containerRef.current!.getBoundingClientRect().top - 40) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("d", arc)
          .style("opacity", 0.9);

        tooltip.style("visibility", "hidden");
      });

  }, [data, dimensions, colors]);

  return (
    <div ref={containerRef} className="w-full relative" style={{ height }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ overflow: "visible" }} />
    </div>
  );
};

export default D3PieChart;
