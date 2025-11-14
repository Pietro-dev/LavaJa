// app/services/dashboardService.ts
import { httpClient } from "app/http"
import { DashboardData } from "app/models/dashboard"
import { AxiosResponse } from "axios"

const resourceURL: string = '/api/dashboard'

export const useDashboardService = () => {
    return {
        get: async (lavaRapidoId: number): Promise<DashboardData> => {
            console.log('🚀 DashboardService - Iniciando requisição...')
            console.log('🏪 lavaRapidoId:', lavaRapidoId)
            console.log('🌐 URL:', `${resourceURL}/${lavaRapidoId}`)
            
            try {
                const response: AxiosResponse<DashboardData> = await httpClient.get(
                    `${resourceURL}/${lavaRapidoId}`
                )
                console.log('✅ DashboardService - Dados recebidos com sucesso!')
                return response.data    
            } catch (error) {
                console.error('❌ DashboardService - Erro na requisição:', error)
                throw error
            }
        }
    }
}