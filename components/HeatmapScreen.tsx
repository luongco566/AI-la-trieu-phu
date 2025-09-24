
import React, { useState, useEffect } from 'react';
import { getAnswerEvents } from '../services/analyticsService';
import { AnswerEvent } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface HeatmapData {
    domain: string;
    correct: number;
    total: number;
    accuracy: number;
}

const HeatmapScreen: React.FC = () => {
    const [data, setData] = useState<HeatmapData[]>([]);

    useEffect(() => {
        const events = getAnswerEvents();
        const statsByDomain: { [key: string]: { correct: number, total: number } } = {};

        events.forEach(event => {
            const domain = event.domain || 'Không xác định';
            if (!statsByDomain[domain]) {
                statsByDomain[domain] = { correct: 0, total: 0 };
            }
            statsByDomain[domain].total++;
            if (event.correct) {
                statsByDomain[domain].correct++;
            }
        });

        const formattedData = Object.entries(statsByDomain).map(([domain, stats]) => ({
            domain,
            ...stats,
            accuracy: stats.total > 0 ? parseFloat(((stats.correct / stats.total) * 100).toFixed(1)) : 0,
        }));

        setData(formattedData);
    }, []);

    if (data.length === 0) {
        return <div className="text-center p-8 text-gray-400">Chưa có dữ liệu phân tích. Hãy chơi vài ván để xem thống kê của bạn!</div>
    }

    return (
        <div className="w-full h-96 bg-gray-800/50 p-4 rounded-lg">
             <h3 className="text-xl font-semibold mb-4 text-center">Tỷ lệ trả lời đúng theo Chủ đề</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis type="number" domain={[0, 100]} stroke="#a0aec0" unit="%" />
                    <YAxis type="category" dataKey="domain" width={120} stroke="#a0aec0" />
                    <Tooltip
                        cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5', color: '#e2e8f0' }}
                        formatter={(value, name, props) => [`${props.payload.correct}/${props.payload.total} (${value}%)`, "Tỷ lệ đúng"]}
                    />
                    <Legend formatter={() => "Tỷ lệ đúng (%)"} />
                    <Bar dataKey="accuracy" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HeatmapScreen;
