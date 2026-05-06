import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Props { data: { timestamp: number; resonance: number }[]; }

const ResonanceGraph: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;
        const svg = d3.select(svgRef.current);
        const [w, h] = [400, 150];
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };
        svg.selectAll('*').remove();
        const x = d3.scaleTime().domain(d3.extent(data, d => d.timestamp) as [number, number]).range([margin.left, w - margin.right]);
        const y = d3.scaleLinear().domain([0.5, 2.0]).range([h - margin.bottom, margin.top]);
        const line = d3.line<{ timestamp: number; resonance: number }>().x(d => x(d.timestamp)).y(d => y(d.resonance)).curve(d3.curveMonotoneX);
        svg.append('line').attr('x1', margin.left).attr('x2', w - margin.right).attr('y1', y(1.0)).attr('y2', y(1.0)).attr('stroke', '#164e63').attr('stroke-dasharray', '4');
        svg.append('path').datum(data).attr('fill', 'none').attr('stroke', '#00FFFF').attr('stroke-width', 2).attr('d', line);
    }, [data]);
    return (
        <div className="border border-cyan-900 bg-black/40 p-2">
            <svg ref={svgRef} width="100%" height="150" viewBox="0 0 400 150" />
        </div>
    );
};
export default ResonanceGraph;
