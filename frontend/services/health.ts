import { apiRequest } from "@/services/api";
import type { HealthStatus } from "@/types";

export function fetchHealth(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>("/health");
}
