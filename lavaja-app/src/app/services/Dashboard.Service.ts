// app/services/dashboardService.ts
import { httpClient } from "app/http"
import { DashboardData } from "app/models/dashboard"
import { AxiosResponse } from "axios"

const resourceURL: string = '/api/dashboard'

export const useDashboardService = () => {
    return {
        get: async (lavaRapidoId: string): Promise<DashboardData> => {
            const response: AxiosResponse<DashboardData> = await httpClient.get(
                `${resourceURL}?lavaRapidoId=${lavaRapidoId}`
            )
            return response.data
        }
    }
}