
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Question } from '../types';

interface AudiencePollModalProps {
    question: Question;
    onClose: () => void;
}

const AudiencePollModal: React.FC<AudiencePollModalProps> = ({ question, onClose }) => {
    const [chartData, setChartData] = useState<{ name: string, percent: number }[]>([]);

    useEffect(() => {
        const generatePollData = () => {
            const { correctIndex, choices } = question;
            let percentages = [0, 0, 0, 0];
            let remaining = 100;

            // Give the correct answer a large chunk
            const correctPercent = Math.floor(Math.random() * 40) + 45; // 45% to 84%
            percentages[correctIndex] = correctPercent;
            remaining -= correctPercent;

            // Distribute the rest among wrong answers
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
            
            let p1 = Math.floor(Math.random() * remaining);
            percentages[wrongIndices[0]] = p1;
            remaining -= p1;

            let p2 = Math.floor(Math.random() * remaining);
            percentages[wrongIndices[1]] = p2;
            remaining -= p2;

            percentages[wrongIndices[2]] = remaining;

            // Shuffle percentages for wrong answers for more randomness
            let temp1 = percentages[wrongIndices[0]];
            let temp2 = percentages[wrongIndices[1]];
            percentages[wrongIndices[0]] = percentages[wrongIndices[2]];
            percentages[wrongIndices[1]] = temp1;
            percentages[wrongIndices[2]] = temp2;

            setChartData(choices.map((_, i) => ({
                name: String.fromCharCode(65 + i),
                percent: percentages[i],
            })));
        };

        generatePollData();
    }, [question]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg mx-4">
                <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">Khán giả trường quay bình chọn</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#a5b4fc" />
                            <YAxis stroke="#a5b4fc" unit="%" />
                            <Tooltip cursor={{fill: 'rgba(107, 114, 128, 0.3)'}} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }} />
                            <Bar dataKey="percent">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === question.correctIndex ? '#22c55e' : '#8b5cf6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudiencePollModal;
