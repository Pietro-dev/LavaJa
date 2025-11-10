"use client"

import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { AgendamentosPorDia } from 'app/models/dashboard'

interface GraficoBarrasProps {
  agendamentosPorDia?: AgendamentosPorDia[];
}

export const GraficoBarras: React.FC<GraficoBarrasProps> = ({ 
  agendamentosPorDia = []
}) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const carregaDadosDoGrafico = () => {
      if (!agendamentosPorDia || agendamentosPorDia.length === 0) {
        setChartData({
          labels: ['Sem dados'],
          datasets: [
            {
              label: "Agendamentos por dia", 
              backgroundColor: "#e0e0e0",
              data: [0]
            }
          ]
        });
        return;
      }

      const labels = agendamentosPorDia.map(item => `Dia ${item.dia}`);
      const valores = agendamentosPorDia.map(item => item.totalAgendamentos || 0);

      const dadosGrafico = {
        labels: labels,
        datasets: [
          {
            label: "Agendamentos por dia", 
            backgroundColor: "#42A5F5",
            borderColor: "#1976D2",
            borderWidth: 1,
            data: valores
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false, // ✅ IMPORTANTE: Permite controlar a proporção
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      };

      setChartData(dadosGrafico);
      setChartOptions(options);
    };

    carregaDadosDoGrafico();
  }, [agendamentosPorDia]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative'
    }}>
      <Chart 
        type="bar" 
        data={chartData}
        options={chartOptions}
        style={{ 
          width: '100%', 
          height: '100%' 
        }}
      />
    </div>
  );
};